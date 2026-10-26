import { NextResponse } from "next/server";
import { supabase, isSupabaseConfigured } from "../../lib/supabase";
import {
  checkSlidingWindowRateLimit,
  detectSuspiciousBot,
  RATE_LIMIT_CONFIGS,
} from "../../lib/edge-rate-limiter";

export async function POST(request: Request) {
  try {
    // 1. Sliding-Window Rate Limit Check (6 inquiries / 10 min window)
    const rateCheck = checkSlidingWindowRateLimit(request, RATE_LIMIT_CONFIGS.inquiries);
    if (!rateCheck.allowed) {
      return NextResponse.json(
        {
          success: false,
          error: "Rate limit exceeded. Please wait a few minutes or email abuhanifmain@gmail.com directly.",
        },
        { status: 429, headers: rateCheck.headers }
      );
    }

    const body = await request.json().catch(() => ({}));

    // 2. Automated Bot & Exploit Protection Shield
    const botCheck = detectSuspiciousBot(request, body);
    if (botCheck.isSuspicious) {
      // If honeypot triggered, silently succeed to mislead automated bots
      if (botCheck.reason?.includes("honeypot") || botCheck.reason?.includes("Honeypot")) {
        return NextResponse.json(
          {
            success: true,
            message: "Inquiry received! Abu Hanif will review your project details and respond within 24 hours.",
            inquiryId: `inq-${Date.now()}`,
          },
          { headers: rateCheck.headers }
        );
      }

      // If script injection or scanner detected, reject with 400
      return NextResponse.json(
        {
          success: false,
          error: "Security verification failed. Malicious input payload or automated scanner detected.",
        },
        { status: 400, headers: rateCheck.headers }
      );
    }

    const { name, email, phone, projectType, budgetRange, message } = body;

    // Validate required fields & enforce upper length bounds
    if (!name || typeof name !== "string" || name.trim().length < 2 || name.trim().length > 120) {
      return NextResponse.json(
        { success: false, error: "Please provide a valid name (2–120 characters)." },
        { status: 400, headers: rateCheck.headers }
      );
    }

    if (
      !email ||
      typeof email !== "string" ||
      email.length > 254 ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())
    ) {
      return NextResponse.json(
        { success: false, error: "Please provide a valid work email address." },
        { status: 400, headers: rateCheck.headers }
      );
    }

    if (!message || typeof message !== "string" || message.trim().length < 5 || message.trim().length > 5000) {
      return NextResponse.json(
        { success: false, error: "Please describe your project challenge or requirements (5–5,000 characters)." },
        { status: 400, headers: rateCheck.headers }
      );
    }

    const recordToInsert = {
      name: name.trim().slice(0, 120),
      email: email.trim().toLowerCase().slice(0, 254),
      phone: phone ? String(phone).trim().slice(0, 40) : null,
      project_type: String(projectType || "Engineering Project Consultation").slice(0, 120),
      budget_range: String(budgetRange || "Flexible / To Be Scoped").slice(0, 120),
      message: message.trim().slice(0, 5000),
      status: "new",
    };

    let generatedId = `inq-${Date.now()}`;

    // 1. Insert into Supabase if configured
    if (isSupabaseConfigured && supabase) {
      try {
        const { data: dbData, error: dbError } = await supabase
          .from("inquiries")
          .insert([recordToInsert])
          .select("id")
          .single();

        if (dbError) {
          console.error("Supabase insert inquiry error:", dbError);
        } else if (dbData?.id) {
          generatedId = dbData.id;
        }
      } catch (err) {
        console.error("Supabase client connection error:", err);
      }
    }

    // 2. Dispatch real-time alert webhook (Discord / Slack / Telegram) if configured
    const webhookUrl = process.env.INQUIRY_WEBHOOK_URL || process.env.DISCORD_WEBHOOK_URL;
    if (webhookUrl) {
      try {
        const payload = {
          content: `🚨 **New High-Value Technical Consultation Inquiry Received!**`,
          embeds: [
            {
              title: `💼 ${recordToInsert.project_type}`,
              color: 0x2563eb, // Brand Cobalt Accent
              fields: [
                { name: "Client / Lead Name", value: recordToInsert.name, inline: true },
                { name: "Email Address", value: `[${recordToInsert.email}](mailto:${recordToInsert.email})`, inline: true },
                { name: "Budget Tier", value: recordToInsert.budget_range, inline: true },
                { name: "Phone / WhatsApp", value: recordToInsert.phone || "Not specified", inline: true },
                { name: "Project Challenge", value: recordToInsert.message.substring(0, 1000) },
              ],
              footer: { text: "abuhanifmia.com • Lead Dispatch Engine" },
              timestamp: new Date().toISOString(),
            },
          ],
        };

        await fetch(webhookUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      } catch (webhookErr) {
        console.warn("Inquiry alert webhook dispatch error:", webhookErr);
      }
    }

    return NextResponse.json(
      {
        success: true,
        message: "Inquiry received! Abu Hanif will review your project details and respond within 24 hours.",
        inquiryId: generatedId,
      },
      { headers: rateCheck.headers }
    );
  } catch (err: unknown) {
    console.error("Inquiry handler unhandled error:", err);
    return NextResponse.json(
      { success: false, error: "Internal server error processing inquiry. Please email abuhanifmain@gmail.com directly." },
      { status: 500 }
    );
  }
}
