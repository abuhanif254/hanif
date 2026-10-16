import { NextResponse } from "next/server";
import { supabase, isSupabaseConfigured } from "../../lib/supabase";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, phone, projectType, budgetRange, message } = body;

    // Validate required fields
    if (!name || typeof name !== "string" || name.trim().length < 2) {
      return NextResponse.json(
        { success: false, error: "Please provide a valid name (at least 2 characters)." },
        { status: 400 }
      );
    }

    if (!email || typeof email !== "string" || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { success: false, error: "Please provide a valid work email address." },
        { status: 400 }
      );
    }

    if (!message || typeof message !== "string" || message.trim().length < 5) {
      return NextResponse.json(
        { success: false, error: "Please describe your project challenge or requirements." },
        { status: 400 }
      );
    }

    const recordToInsert = {
      name: name.trim(),
      email: email.trim().toLowerCase(),
      phone: phone ? String(phone).trim() : null,
      project_type: projectType || "Engineering Project Consultation",
      budget_range: budgetRange || "Flexible / To Be Scoped",
      message: message.trim(),
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
              color: 0x9cbe41, // Brand Accent Lime
              fields: [
                { name: "Client / Lead Name", value: recordToInsert.name, inline: true },
                { name: "Email Address", value: `[${recordToInsert.email}](mailto:${recordToInsert.email})`, inline: true },
                { name: "Budget Tier", value: recordToInsert.budget_range, inline: true },
                { name: "Phone / WhatsApp", value: recordToInsert.phone || "Not specified", inline: true },
                { name: "Project Challenge", value: recordToInsert.message.substring(0, 1000) },
              ],
              footer: { text: "abuhanif.dev • Lead Dispatch Engine" },
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

    return NextResponse.json({
      success: true,
      message: "Inquiry received! Abu Hanif will review your project details and respond within 24 hours.",
      inquiryId: generatedId,
    });
  } catch (err: unknown) {
    console.error("Inquiry handler unhandled error:", err);
    return NextResponse.json(
      { success: false, error: "Internal server error processing inquiry. Please email contact@abuhanif.dev directly." },
      { status: 500 }
    );
  }
}
