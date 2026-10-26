import { describe, it, expect, beforeEach } from "vitest";
import {
  formatDiscordEmbed,
  formatSlackBlocks,
  formatEmailHtml,
  dispatchNotification,
  getRecentNotificationEvents,
  _resetNotificationEventsForTesting,
  NotificationEvent,
} from "../app/lib/notification-service";
import { NextRequest } from "next/server";
import { GET as getNotificationsRoute } from "../app/api/admin/notifications/route";
import { POST as postTestNotificationRoute } from "../app/api/admin/notifications/test/route";
import { createSessionToken, COOKIE_NAME } from "../app/lib/admin-auth";

describe("Event Notification & Webhook Mesh Engine", () => {
  beforeEach(() => {
    _resetNotificationEventsForTesting();
  });

  describe("Discord Embed Payload Formatter", () => {
    it("should format rich embed with fields for INQUIRY_RECEIVED", () => {
      const event: Omit<NotificationEvent, "deliveryStatus"> = {
        id: "evt-test-1",
        type: "INQUIRY_RECEIVED",
        title: "Inbound Lead: Elena Rostova",
        description: "New inquiry submitted for High-Throughput API.",
        data: {
          clientName: "Elena Rostova",
          email: "elena@vanguardfin.ch",
          totalAmount: 15000,
          currency: "USD",
        },
        createdAt: "2026-10-26T12:00:00Z",
      };

      const discordPayload = formatDiscordEmbed(event);

      expect(discordPayload.content).toContain("Antigravity Systems Event");
      expect(discordPayload.embeds).toHaveLength(1);
      const embed = discordPayload.embeds[0];
      expect(embed.title).toBe(event.title);
      expect(embed.color).toBe(0x2563eb); // Cobalt Blue
      expect(embed.fields.some((f) => f.name === "Email")).toBe(true);
      expect(embed.fields.some((f) => f.name === "Contract Value")).toBe(true);
    });

    it("should format milestone approval embed with audit hash and signatory", () => {
      const event: Omit<NotificationEvent, "deliveryStatus"> = {
        id: "evt-test-2",
        type: "MILESTONE_APPROVED",
        title: "Milestone Phase 2 Signed Off",
        description: "Marcus Thorne approved Phase 2 deliverables.",
        data: {
          orderNumber: "ORD-2026-1002",
          milestoneIndex: 2,
          phaseTitle: "BRIN/B-Tree Indexing",
          approverName: "Marcus Thorne, Chief Architect",
          signatureHash: "sig_sha256_31a7bc819024fba9182371",
        },
        createdAt: "2026-10-26T14:30:00Z",
      };

      const discordPayload = formatDiscordEmbed(event);
      const embed = discordPayload.embeds[0];

      expect(embed.color).toBe(0x10b981); // Emerald Green
      expect(embed.fields.some((f) => f.name === "Authorized Signatory")).toBe(true);
      expect(embed.fields.some((f) => f.name === "Audit Hash")).toBe(true);
    });
  });

  describe("Slack Blocks Payload Formatter", () => {
    it("should format Slack blocks structure with header, section, and fields", () => {
      const event: Omit<NotificationEvent, "deliveryStatus"> = {
        id: "evt-test-3",
        type: "ORDER_CREATED",
        title: "New Contract: ORD-2026-1005",
        description: "CloudScale engaged for $15,000 sprint.",
        data: {
          orderNumber: "ORD-2026-1005",
          companyName: "CloudScale",
          totalAmount: 15000,
        },
        createdAt: "2026-10-26T15:00:00Z",
      };

      const slackPayload = formatSlackBlocks(event);

      expect(slackPayload.text).toContain(event.title);
      expect(slackPayload.blocks).toBeInstanceOf(Array);
      expect(slackPayload.blocks[0].type).toBe("header");
      expect(slackPayload.blocks[1].type).toBe("section");
      expect(slackPayload.blocks[2].type).toBe("section"); // Fields section
    });
  });

  describe("HTML Transactional Email Formatter", () => {
    it("should generate responsive HTML email with metadata box and branding", () => {
      const event: Omit<NotificationEvent, "deliveryStatus"> = {
        id: "evt-test-4",
        type: "PAYMENT_SETTLED",
        title: "Payment Settled: ORD-2026-1001",
        description: "Milestone payment of $11,250 recorded.",
        data: {
          orderNumber: "ORD-2026-1001",
          companyName: "Apex Ventures",
          totalAmount: 22500,
          trackerUrl: "https://abuhanifmia.com/orders/tracker?token=test_token",
        },
        createdAt: "2026-10-26T16:00:00Z",
      };

      const html = formatEmailHtml(event);

      expect(html).toContain("<!DOCTYPE html>");
      expect(html).toContain(event.title);
      expect(html).toContain("Apex Ventures");
      expect(html).toContain("Open Live Client Portal ↗");
      expect(html).toContain("Abu Hanif Mia");
    });
  });

  describe("Dispatcher Engine & In-Memory Store", () => {
    it("should dispatch notification, assign unique ID, and update recent events store", async () => {
      const dispatched = await dispatchNotification({
        type: "TEST_PING",
        title: "System Diagnostic Ping",
        description: "Testing notification mesh delivery.",
        data: { pingId: 101 },
      });

      expect(dispatched.id).toMatch(/^evt-\d+-[a-z0-9]+$/);
      expect(dispatched.createdAt).toBeDefined();
      expect(dispatched.deliveryStatus).toBeDefined();

      const events = await getRecentNotificationEvents(10);
      expect(events.length).toBeGreaterThanOrEqual(1);
      expect(events[0].id).toBe(dispatched.id);
      expect(events[0].title).toBe("System Diagnostic Ping");
    });

    it("should never throw uncaught exceptions even when external webhooks are unconfigured", async () => {
      await expect(
        dispatchNotification({
          type: "SECURITY_ALERT",
          title: "Brute Force Warning",
          description: "Multiple failed attempts from IP.",
          data: { ipAddress: "198.51.100.99" },
        })
      ).resolves.toBeDefined();
    });
  });

  describe("Admin Notifications API Endpoints", () => {
    it("should reject unauthenticated requests to GET /api/admin/notifications", async () => {
      const req = new NextRequest("https://abuhanifmia.com/api/admin/notifications");
      const res = await getNotificationsRoute(req);

      expect(res.status).toBe(401);
      const data = await res.json();
      expect(data.success).toBe(false);
    });

    it("should return events list for authenticated admin requests", async () => {
      const token = createSessionToken();
      const req = new NextRequest("https://abuhanifmia.com/api/admin/notifications", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const res = await getNotificationsRoute(req);
      expect(res.status).toBe(200);
      const data = await res.json();
      expect(data.success).toBe(true);
      expect(Array.isArray(data.events)).toBe(true);
    });

    it("should dispatch test event via POST /api/admin/notifications/test when authenticated", async () => {
      const token = createSessionToken();
      const req = new NextRequest("https://abuhanifmia.com/api/admin/notifications/test", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });

      const res = await postTestNotificationRoute(req);
      expect(res.status).toBe(200);
      const data = await res.json();
      expect(data.success).toBe(true);
      expect(data.event.type).toBe("TEST_PING");
    });
  });
});
