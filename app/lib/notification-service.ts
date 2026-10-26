import { supabase, isSupabaseConfigured } from "./supabase";

export type NotificationEventType =
  | "INQUIRY_RECEIVED"
  | "ORDER_CREATED"
  | "MILESTONE_SUBMITTED"
  | "MILESTONE_APPROVED"
  | "PAYMENT_SETTLED"
  | "SECURITY_ALERT"
  | "TEST_PING";

export interface NotificationDeliveryStatus {
  discord: "delivered" | "failed" | "skipped";
  slack: "delivered" | "failed" | "skipped";
  email: "delivered" | "failed" | "skipped";
}

export interface NotificationEvent<T = Record<string, any>> {
  id: string;
  type: NotificationEventType;
  title: string;
  description: string;
  data: T;
  createdAt: string;
  deliveryStatus: NotificationDeliveryStatus;
}

// In-memory ring buffer of recent events (keeps latest 50)
const MAX_IN_MEMORY_EVENTS = 50;
let recentEventsStore: NotificationEvent[] = [
  {
    id: "evt-seed-1",
    type: "ORDER_CREATED",
    title: "New Contract Order Issued: ORD-2026-1001",
    description: "Apex Ventures & Fintech engaged for Full-Stack Web Application ($22,500 USD).",
    data: {
      orderNumber: "ORD-2026-1001",
      clientName: "Sarah Jenkins",
      companyName: "Apex Ventures & Fintech",
      totalAmount: 22500,
      currency: "USD",
    },
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    deliveryStatus: { discord: "delivered", slack: "skipped", email: "delivered" },
  },
  {
    id: "evt-seed-2",
    type: "MILESTONE_APPROVED",
    title: "Phase 1 Deliverables Accepted & Signed Off",
    description: "Sarah Jenkins formally signed off Phase 1 for ORD-2026-1001 with cryptographic audit hash.",
    data: {
      orderNumber: "ORD-2026-1001",
      milestoneIndex: 1,
      phaseTitle: "Architecture Blueprint & Auth Engine",
      approverName: "Sarah Jenkins, VP of Engineering",
      signatureHash: "sig_sha256_8f93ab0192e8ca92bfa041",
    },
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    deliveryStatus: { discord: "delivered", slack: "skipped", email: "delivered" },
  },
];

// Color mapping for Discord embeds
const EVENT_COLORS: Record<NotificationEventType, number> = {
  INQUIRY_RECEIVED: 0x2563eb, // Cobalt Blue
  ORDER_CREATED: 0x8b5cf6,   // Purple
  MILESTONE_SUBMITTED: 0xf59e0b, // Amber
  MILESTONE_APPROVED: 0x10b981,  // Emerald
  PAYMENT_SETTLED: 0x059669,     // Mint Green
  SECURITY_ALERT: 0xef4444,      // Crimson
  TEST_PING: 0x06b6d4,           // Cyan
};

// -----------------------------------------------------------------------------
// PAYLOAD FORMATTERS
// -----------------------------------------------------------------------------

export function formatDiscordEmbed(event: Omit<NotificationEvent<any>, "deliveryStatus">) {
  const fields: Array<{ name: string; value: string; inline?: boolean }> = [];
  const d = event.data || {};

  if (d.orderNumber) {
    fields.push({ name: "Order Ref", value: `\`${d.orderNumber}\``, inline: true });
  }
  if (d.companyName || d.clientName) {
    fields.push({
      name: "Client",
      value: d.companyName ? `${d.companyName} (${d.clientName || "Contact"})` : d.clientName,
      inline: true,
    });
  }
  if (d.email) {
    fields.push({ name: "Email", value: `[${d.email}](mailto:${d.email})`, inline: true });
  }
  if (d.totalAmount !== undefined) {
    fields.push({
      name: "Contract Value",
      value: `**$${Number(d.totalAmount).toLocaleString()} ${d.currency || "USD"}**`,
      inline: true,
    });
  }
  if (d.amountPaid !== undefined) {
    fields.push({
      name: "Amount Settled",
      value: `**$${Number(d.amountPaid).toLocaleString()}**`,
      inline: true,
    });
  }
  if (d.milestoneIndex) {
    fields.push({
      name: "Phase",
      value: `Phase ${d.milestoneIndex}: ${d.phaseTitle || "Deliverables"}`,
      inline: false,
    });
  }
  if (d.approverName) {
    fields.push({ name: "Authorized Signatory", value: d.approverName, inline: true });
  }
  if (d.signatureHash) {
    fields.push({ name: "Audit Hash", value: `\`${d.signatureHash.substring(0, 24)}...\``, inline: true });
  }
  if (d.ipAddress) {
    fields.push({ name: "Client IP", value: `\`${d.ipAddress}\``, inline: true });
  }
  if (d.trackerUrl) {
    fields.push({ name: "Live Tracker Portal", value: `[Open Tracker ↗](${d.trackerUrl})`, inline: false });
  }

  return {
    content: `🔔 **Antigravity Systems Event: ${event.title}**`,
    embeds: [
      {
        title: event.title,
        description: event.description,
        color: EVENT_COLORS[event.type] || 0x2563eb,
        fields,
        footer: { text: "abuhanifmia.com • Event Notification Mesh" },
        timestamp: event.createdAt,
      },
    ],
  };
}

export function formatSlackBlocks(event: Omit<NotificationEvent<any>, "deliveryStatus">) {
  const d = event.data || {};
  const fields = [];

  if (d.orderNumber) fields.push(`*Order Ref:* \`${d.orderNumber}\``);
  if (d.companyName || d.clientName) fields.push(`*Client:* ${d.companyName || d.clientName}`);
  if (d.totalAmount !== undefined) fields.push(`*Value:* $${Number(d.totalAmount).toLocaleString()}`);
  if (d.approverName) fields.push(`*Signatory:* ${d.approverName}`);
  if (d.signatureHash) fields.push(`*Signature:* \`${d.signatureHash.substring(0, 18)}...\``);

  return {
    text: `${event.title} - ${event.description}`,
    blocks: [
      {
        type: "header",
        text: { type: "plain_text", text: event.title, emoji: true },
      },
      {
        type: "section",
        text: { type: "mrkdwn", text: event.description },
      },
      ...(fields.length > 0
        ? [
            {
              type: "section",
              fields: fields.map((f) => ({ type: "mrkdwn", text: f })),
            },
          ]
        : []),
      {
        type: "context",
        elements: [
          {
            type: "mrkdwn",
            text: `*Event ID:* \`${event.id}\` • ${new Date(event.createdAt).toLocaleString()}`,
          },
        ],
      },
    ],
  };
}

export function formatEmailHtml(event: Omit<NotificationEvent<any>, "deliveryStatus">): string {
  const d = event.data || {};

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #071324; color: #ffffff; padding: 24px; }
    .card { background-color: #0a192f; border: 1px solid #1e293b; border-radius: 8px; max-width: 600px; margin: 0 auto; padding: 28px; }
    .badge { display: inline-block; padding: 4px 10px; border-radius: 4px; font-size: 11px; font-weight: 700; text-transform: uppercase; background-color: #2563eb; color: #ffffff; }
    h1 { font-size: 20px; font-weight: 800; margin: 14px 0 6px 0; color: #ffffff; }
    p { font-size: 14px; color: #cbd5e1; line-height: 1.6; margin: 0 0 16px 0; }
    .meta-box { background-color: #071324; border: 1px solid #1e293b; border-radius: 6px; padding: 14px; margin-bottom: 20px; font-size: 13px; color: #94a3b8; }
    .meta-row { display: flex; justify-content: space-between; margin-bottom: 6px; }
    .meta-row:last-child { margin-bottom: 0; }
    .cta-btn { display: inline-block; padding: 10px 20px; background-color: #2563eb; color: #ffffff; border-radius: 6px; text-decoration: none; font-weight: 700; font-size: 13px; }
    .footer { font-size: 11px; color: #64748b; margin-top: 24px; border-top: 1px solid #1e293b; padding-top: 14px; }
  </style>
</head>
<body>
  <div class="card">
    <span class="badge">${event.type.replace(/_/g, " ")}</span>
    <h1>${event.title}</h1>
    <p>${event.description}</p>
    
    <div class="meta-box">
      ${d.orderNumber ? `<div class="meta-row"><span>Order Ref:</span> <strong style="color: #ffffff;">${d.orderNumber}</strong></div>` : ""}
      ${d.companyName ? `<div class="meta-row"><span>Client Organization:</span> <strong style="color: #ffffff;">${d.companyName}</strong></div>` : ""}
      ${d.totalAmount ? `<div class="meta-row"><span>Contract Value:</span> <strong style="color: #4ade80;">$${Number(d.totalAmount).toLocaleString()} USD</strong></div>` : ""}
      ${d.approverName ? `<div class="meta-row"><span>Authorized Signatory:</span> <strong style="color: #38bdf8;">${d.approverName}</strong></div>` : ""}
      ${d.signatureHash ? `<div class="meta-row"><span>Audit Hash:</span> <code style="color: #cbd5e1;">${d.signatureHash.substring(0, 20)}...</code></div>` : ""}
    </div>

    ${d.trackerUrl ? `<a href="${d.trackerUrl}" class="cta-btn">Open Live Client Portal ↗</a>` : ""}

    <div class="footer">
      Abu Hanif Mia • Principal Full-Stack & Cloud Systems Architect • Event Notification Mesh
    </div>
  </div>
</body>
</html>
  `;
}

// -----------------------------------------------------------------------------
// MAIN DISPATCHER
// -----------------------------------------------------------------------------

export async function dispatchNotification<T extends Record<string, any> = Record<string, any>>(
  params: {
    type: NotificationEventType;
    title: string;
    description: string;
    data?: T;
  }
): Promise<NotificationEvent<T>> {
  const id = `evt-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`;
  const createdAt = new Date().toISOString();
  const deliveryStatus: NotificationDeliveryStatus = {
    discord: "skipped",
    slack: "skipped",
    email: "skipped",
  };

  const eventPayload = {
    id,
    type: params.type,
    title: params.title,
    description: params.description,
    data: params.data || ({} as T),
    createdAt,
  };

  // 1. Dispatch to Discord Webhook
  const discordUrl =
    process.env.DISCORD_WEBHOOK_URL ||
    process.env.SECURITY_WEBHOOK_URL ||
    process.env.INQUIRY_WEBHOOK_URL;

  if (discordUrl && discordUrl.startsWith("https://")) {
    try {
      const body = formatDiscordEmbed(eventPayload);
      const res = await fetch(discordUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      deliveryStatus.discord = res.ok ? "delivered" : "failed";
    } catch {
      deliveryStatus.discord = "failed";
    }
  }

  // 2. Dispatch to Slack Webhook
  const slackUrl = process.env.SLACK_WEBHOOK_URL;
  if (slackUrl && slackUrl.startsWith("https://")) {
    try {
      const body = formatSlackBlocks(eventPayload);
      const res = await fetch(slackUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      deliveryStatus.slack = res.ok ? "delivered" : "failed";
    } catch {
      deliveryStatus.slack = "failed";
    }
  }

  // 3. Dispatch Transactional Email via Resend if API key is present
  const resendApiKey = process.env.RESEND_API_KEY;
  const toEmail = (params.data as any)?.email || "contact@abuhanifmia.com";

  if (resendApiKey) {
    try {
      const html = formatEmailHtml(eventPayload);
      const res = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${resendApiKey}`,
        },
        body: JSON.stringify({
          from: "Abu Hanif Architecture <notifications@abuhanifmia.com>",
          to: [toEmail],
          subject: `[Notification] ${params.title}`,
          html,
        }),
      });
      deliveryStatus.email = res.ok ? "delivered" : "failed";
    } catch {
      deliveryStatus.email = "failed";
    }
  }

  const completeEvent: NotificationEvent<T> = {
    ...eventPayload,
    deliveryStatus,
  };

  // Prepend to in-memory store
  recentEventsStore = [completeEvent as NotificationEvent, ...recentEventsStore.slice(0, MAX_IN_MEMORY_EVENTS - 1)];

  // Persist to Supabase if configured (fire-and-forget)
  if (isSupabaseConfigured && supabase) {
    try {
      supabase
        .from("notification_events")
        .insert([
          {
            id: completeEvent.id,
            event_type: completeEvent.type,
            title: completeEvent.title,
            description: completeEvent.description,
            payload: completeEvent.data,
            delivery_status: completeEvent.deliveryStatus,
            created_at: completeEvent.createdAt,
          },
        ])
        .then();
    } catch {
      // Non-blocking
    }
  }

  return completeEvent;
}

// -----------------------------------------------------------------------------
// EVENT GETTERS
// -----------------------------------------------------------------------------

export async function getRecentNotificationEvents(limit: number = 20): Promise<NotificationEvent[]> {
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from("notification_events")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(limit);

      if (!error && data && data.length > 0) {
        return data.map((d: any) => ({
          id: d.id,
          type: d.event_type as NotificationEventType,
          title: d.title,
          description: d.description,
          data: d.payload || {},
          createdAt: d.created_at,
          deliveryStatus: d.delivery_status || { discord: "skipped", slack: "skipped", email: "skipped" },
        }));
      }
    } catch {
      // Fallback to in-memory
    }
  }

  return recentEventsStore.slice(0, limit);
}

// Reset helper for testing
export function _resetNotificationEventsForTesting(): void {
  recentEventsStore = [];
}
