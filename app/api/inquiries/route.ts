import { NextResponse } from "next/server";
import { supabase, isSupabaseConfigured } from "../../lib/supabase";
import {
  checkSlidingWindowRateLimit,
  detectSuspiciousBot,
  RATE_LIMIT_CONFIGS,
} from "../../lib/edge-rate-limiter";
import { dispatchNotification } from "../../lib/notification-service";

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

    // 2. Dispatch real-time alert through Event Notification Mesh
    await dispatchNotification({
      type: "INQUIRY_RECEIVED",
      title: `Inbound Consultation Lead: ${recordToInsert.name}`,
      description: `New technical inquiry submitted for '${recordToInsert.project_type}' (${recordToInsert.budget_range}).`,
      data: {
        inquiryId: generatedId,
        clientName: recordToInsert.name,
        email: recordToInsert.email,
        phone: recordToInsert.phone,
        projectType: recordToInsert.project_type,
        budgetRange: recordToInsert.budget_range,
        message: recordToInsert.message,
      },
    }).catch((err) => console.warn("Inquiry notification error:", err));

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
