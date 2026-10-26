import { NextRequest, NextResponse } from "next/server";
import {
  validatePasscode,
  createSessionToken,
  COOKIE_NAME,
  isRequestAuthorized,
} from "../../../lib/admin-auth";
import {
  checkSlidingWindowRateLimit,
  detectSuspiciousBot,
  extractClientIp,
  RATE_LIMIT_CONFIGS,
} from "../../../lib/edge-rate-limiter";
import {
  verifyTotpCode,
  isTotpConfigured,
} from "../../../lib/totp-auth";

// Strike tracker for real-time brute-force security alerting
const ipStrikeRegistry = new Map<string, { strikes: number; lastStrike: number }>();

async function dispatchSecurityAlertWebhook(
  ip: string,
  strikes: number,
  reason: string,
  req: NextRequest
): Promise<void> {
  const webhookUrl =
    process.env.SECURITY_WEBHOOK_URL ||
    process.env.DISCORD_WEBHOOK_URL ||
    process.env.INQUIRY_WEBHOOK_URL;

  if (!webhookUrl) return;

  try {
    const region =
      req.headers.get("cf-ipcountry") ||
      req.headers.get("x-edge-region") ||
      "Direct Edge Ingress";
    const userAgent = req.headers.get("user-agent") || "Unknown User-Agent";

    const payload = {
      content: `🚨 **SECURITY ALERT: Unauthorized Admin Console Login Probe!**`,
      embeds: [
        {
          title: `🛡️ Multi-Strike Authentication Failure`,
          color: 0xef4444, // Signal Red
          fields: [
            { name: "Target Endpoint", value: "`/api/admin/auth` (POST)", inline: true },
            { name: "Offending IP", value: `\`${ip}\``, inline: true },
            { name: "Edge Origin / Country", value: `\`${region}\``, inline: true },
            { name: "Consecutive Strikes", value: `**${strikes}** failed attempts`, inline: true },
            { name: "Trigger Reason", value: reason, inline: true },
            { name: "Client User-Agent", value: `\`${userAgent.substring(0, 200)}\`` },
          ],
          footer: { text: "abuhanifmia.com • Zero-Trust Edge Security Shield" },
          timestamp: new Date().toISOString(),
        },
      ],
    };

    await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
  } catch (err) {
    console.warn("Security alert webhook dispatch error:", err);
  }
}

export async function GET(request: NextRequest) {
  const isAuth = await isRequestAuthorized(request);
  const totpRequired = isTotpConfigured();
  return NextResponse.json({
    authenticated: isAuth,
    totpConfigured: totpRequired,
  });
}

export async function POST(request: NextRequest) {
  try {
    const ip = extractClientIp(request);

    // 1. Sliding-Window Token Rate Limiter (6 attempts / 15 min window)
    const rateCheck = checkSlidingWindowRateLimit(request, RATE_LIMIT_CONFIGS.adminAuth);
    if (!rateCheck.allowed) {
      await dispatchSecurityAlertWebhook(ip, 6, "Exceeded sliding-window rate limit", request);
      return NextResponse.json(
        {
          success: false,
          error: "Too many failed authentication attempts. Access locked for 15 minutes.",
        },
        { status: 429, headers: rateCheck.headers }
      );
    }

    const body = await request.json().catch(() => ({}));

    // 2. Automated Scanner & Bot Payload Inspection
    const botCheck = detectSuspiciousBot(request, body);
    if (botCheck.isSuspicious) {
      await dispatchSecurityAlertWebhook(ip, 1, botCheck.reason || "Bot scanner payload detected", request);
      return NextResponse.json(
        { success: false, error: "Automated scanner or malicious payload detected." },
        { status: 400, headers: rateCheck.headers }
      );
    }

    const { passcode, totpCode } = body;

    // 3. Factor 1: Master Passcode Constant-Time Verification
    if (!validatePasscode(passcode)) {
      const current = ipStrikeRegistry.get(ip);
      const strikes = (current && Date.now() - current.lastStrike < 15 * 60 * 1000)
        ? current.strikes + 1
        : 1;
      ipStrikeRegistry.set(ip, { strikes, lastStrike: Date.now() });

      if (strikes >= 3) {
        await dispatchSecurityAlertWebhook(ip, strikes, "Invalid administrator passcode", request);
      }

      return NextResponse.json(
        {
          success: false,
          error: "Invalid administrator credentials.",
          strikesRemaining: Math.max(0, 6 - strikes),
        },
        { status: 401, headers: rateCheck.headers }
      );
    }

    // 4. Factor 2: TOTP (RFC 6238) Verification (if configured in environment)
    const totpRequired = isTotpConfigured();
    if (totpRequired) {
      const totpSecret = process.env.ADMIN_TOTP_SECRET!;
      if (!totpCode || !verifyTotpCode(totpCode, totpSecret)) {
        const current = ipStrikeRegistry.get(ip);
        const strikes = (current && Date.now() - current.lastStrike < 15 * 60 * 1000)
          ? current.strikes + 1
          : 1;
        ipStrikeRegistry.set(ip, { strikes, lastStrike: Date.now() });

        if (strikes >= 3) {
          await dispatchSecurityAlertWebhook(ip, strikes, "Invalid TOTP 2FA code", request);
        }

        return NextResponse.json(
          {
            success: false,
            error: "Invalid or expired 6-digit TOTP verification code.",
            totpRequired: true,
          },
          { status: 401, headers: rateCheck.headers }
        );
      }
    }

    // Reset strike registry on successful authentication
    ipStrikeRegistry.delete(ip);

    // 5. Issue cryptographic HMAC-SHA256 session token with session epoch versioning
    const signedToken = createSessionToken();
    const response = NextResponse.json({ success: true });
    response.cookies.set({
      name: COOKIE_NAME,
      value: signedToken,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return response;
  } catch (err: unknown) {
    const message =
      err instanceof Error ? err.message : "Authentication request malformed.";
    return NextResponse.json(
      { success: false, error: message },
      { status: 400 }
    );
  }
}

export async function DELETE() {
  const response = NextResponse.json({ success: true });
  response.cookies.delete(COOKIE_NAME);
  return response;
}
