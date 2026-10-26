import crypto from "crypto";
import {
  CustomerRecord,
  OrderRecord,
  OrderMilestoneRecord,
  OrderPipelineMetrics,
  OrderStatus,
  CreateOrderPayload,
  UpdateOrderPayload,
  InvoiceRecord,
  InvoiceLineItem,
} from "./oms-types";
import { supabase, isSupabaseConfigured } from "./supabase";

const OMS_SECRET = process.env.ADMIN_SECRET_KEY || "hanif2026";

// -----------------------------------------------------------------------------
// SEED CUSTOMERS & ORDERS (For offline mode and local development)
// -----------------------------------------------------------------------------
export const initialCustomers: CustomerRecord[] = [
  {
    id: "cust-apex-01",
    companyName: "Apex Ventures & Fintech",
    primaryContactName: "Sarah Jenkins",
    email: "sarah@apexventures.co",
    phone: "+1 (415) 555-0192",
    billingAddress: {
      street: "500 Howard Street, Suite 400",
      city: "San Francisco",
      state: "CA",
      country: "United States",
      postalCode: "94105",
    },
    vatTaxId: "US-CA-94105-APEX",
    clientTier: "active_client",
    ndaStatus: "mutual_nda_active",
    totalSpendUsd: 22500.0,
    internalNotes: "Edge-deployed customer portal with Supabase auth and Stripe billing.",
    createdAt: new Date(Date.now() - 86400000 * 14).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "cust-cloudscale-02",
    companyName: "CloudScale Infrastructure Systems",
    primaryContactName: "Marcus Thorne",
    email: "m.thorne@cloudscale.io",
    phone: "+44 20 7946 0912",
    billingAddress: {
      street: "1 Canada Square",
      city: "London",
      country: "United Kingdom",
      postalCode: "E14 5AA",
    },
    vatTaxId: "GB-928374192",
    clientTier: "vip_partner",
    ndaStatus: "signed",
    totalSpendUsd: 15000.0,
    internalNotes: "PostgreSQL query optimization, partitioning, and connection pooling.",
    createdAt: new Date(Date.now() - 86400000 * 30).toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export const initialOrders: OrderRecord[] = [
  {
    id: "ord-apex-1001",
    orderNumber: "ORD-2026-1001",
    customerId: "cust-apex-01",
    customer: initialCustomers[0],
    title: "Edge-Deployed Customer Portal & Stripe Engine",
    serviceTier: "Full-Stack Web Application (Next.js/React)",
    status: "in_progress",
    paymentStatus: "partially_paid",
    currency: "USD",
    subtotalAmount: 22500.0,
    taxAmount: 0.0,
    totalAmount: 22500.0,
    amountPaid: 11250.0,
    startDate: "2026-10-15",
    targetCompletionDate: "2026-11-26",
    clientAccessToken: "token_apex_portal_9f83ab293e8172cda89123fe",
    milestones: [
      {
        id: "ms-apex-1",
        orderId: "ord-apex-1001",
        milestoneIndex: 1,
        title: "Phase 1: Architecture Blueprint & Auth Engine",
        deliverablesSummary: "Supabase RLS schema, Next.js 16 SSR architecture, session hardening",
        amount: 11250.0,
        dueDate: "2026-10-22",
        status: "client_approved",
        approvedAt: "2026-10-23T14:00:00Z",
        approvedBy: "Sarah Jenkins, VP of Engineering",
        approvalSignatureHash: "sig_sha256_8f93ab0192e8ca92bfa041",
        deliverableArtifacts: [
          { label: "Architecture Spec & RFC", url: "/lab", type: "docs" },
          { label: "Supabase Schema Migration", url: "https://github.com/abuhanifmain-art/hanif", type: "github" },
        ],
        createdAt: "2026-10-15T09:00:00Z",
      },
      {
        id: "ms-apex-2",
        orderId: "ord-apex-1001",
        milestoneIndex: 2,
        title: "Phase 2: Customer Portal & Stripe Subscriptions",
        deliverablesSummary: "Webhook idempotency, customer billing portal, role management",
        amount: 6750.0,
        dueDate: "2026-11-10",
        status: "in_progress",
        deliverableArtifacts: [
          { label: "Staging Preview Portal", url: "https://apex.abuhanifmia.com", type: "staging" },
        ],
        createdAt: "2026-10-15T09:00:00Z",
      },
      {
        id: "ms-apex-3",
        orderId: "ord-apex-1001",
        milestoneIndex: 3,
        title: "Phase 3: Production Hardening & Handover",
        deliverablesSummary: "k6 load tests (10k VUs), 100% IP transfer, 30-day bug warranty",
        amount: 4500.0,
        dueDate: "2026-11-26",
        status: "pending",
        createdAt: "2026-10-15T09:00:00Z",
      },
    ],
    createdAt: "2026-10-15T09:00:00Z",
    updatedAt: new Date().toISOString(),
  },
  {
    id: "ord-cloudscale-1002",
    orderNumber: "ORD-2026-1002",
    customerId: "cust-cloudscale-02",
    customer: initialCustomers[1],
    title: "PostgreSQL Scale & P99 Query Optimization Sprint",
    serviceTier: "Database Optimization & High-Throughput Sprints",
    status: "milestone_review",
    paymentStatus: "paid",
    currency: "USD",
    subtotalAmount: 15000.0,
    taxAmount: 0.0,
    totalAmount: 15000.0,
    amountPaid: 15000.0,
    startDate: "2026-10-01",
    targetCompletionDate: "2026-10-28",
    completedAt: undefined,
    clientAccessToken: "token_cloudscale_postgres_8271fe98231ba71625bcda41",
    milestones: [
      {
        id: "ms-cloud-1",
        orderId: "ord-cloudscale-1002",
        milestoneIndex: 1,
        title: "Phase 1: Deep Slow-Query Log Analysis & EXPLAIN Audit",
        deliverablesSummary: "pg_stat_statements profiling, index bloat remediation plan",
        amount: 7500.0,
        dueDate: "2026-10-12",
        status: "client_approved",
        approvedAt: "2026-10-13T10:00:00Z",
        approvedBy: "Marcus Thorne, Chief Architect",
        approvalSignatureHash: "sig_sha256_31a7bc819024fba9182371",
        deliverableArtifacts: [
          { label: "EXPLAIN Query Audit Report", url: "/blog/mastering-postgres-indexing-query-optimization", type: "report" },
        ],
        createdAt: "2026-10-01T09:00:00Z",
      },
      {
        id: "ms-cloud-2",
        orderId: "ord-cloudscale-1002",
        milestoneIndex: 2,
        title: "Phase 2: BRIN/B-Tree Indexing & Supavisor Pooling",
        deliverablesSummary: "P99 reduced from 420ms to 24ms under 50k QPS load spike",
        amount: 7500.0,
        dueDate: "2026-10-26",
        status: "submitted",
        deliverableArtifacts: [
          { label: "Live Cluster Benchmarks", url: "/status", type: "benchmark" },
          { label: "Migration Pull Request", url: "https://github.com/abuhanifmain-art/hanif", type: "github" },
        ],
        createdAt: "2026-10-01T09:00:00Z",
      },
    ],
    createdAt: "2026-10-01T09:00:00Z",
    updatedAt: new Date().toISOString(),
  },
];

// In-memory fallback stores
let customersStore = [...initialCustomers];
let ordersStore = [...initialOrders];

// -----------------------------------------------------------------------------
// CRYPTOGRAPHIC TOKEN GENERATION (HMAC-SHA256)
// -----------------------------------------------------------------------------
export function generateClientAccessToken(
  orderId: string,
  customerId: string,
  createdAt: string
): string {
  const payload = `order:${orderId}:${customerId}:${createdAt}`;
  const sig = crypto
    .createHmac("sha256", OMS_SECRET)
    .update(payload)
    .digest("hex");
  return `ord_live_${sig.substring(0, 36)}`;
}

// -----------------------------------------------------------------------------
// FINANCIAL INTEGRITY VALIDATOR
// -----------------------------------------------------------------------------
export function validateOrderFinancials(
  subtotal: number,
  tax: number,
  total: number,
  milestones: Array<{ amount: number }>
): { valid: boolean; error?: string } {
  if (subtotal < 0 || tax < 0 || total < 0) {
    return { valid: false, error: "Financial amounts cannot be negative." };
  }

  const expectedTotal = Number((subtotal + tax).toFixed(2));
  if (Math.abs(expectedTotal - total) > 0.01) {
    return {
      valid: false,
      error: `Total amount ($${total.toFixed(2)}) must equal subtotal ($${subtotal.toFixed(2)}) + tax ($${tax.toFixed(2)}).`,
    };
  }

  if (milestones.length === 0) {
    return { valid: false, error: "An order must include at least 1 milestone." };
  }

  const milestoneSum = Number(
    milestones.reduce((acc, m) => acc + (Number(m.amount) || 0), 0).toFixed(2)
  );

  if (Math.abs(milestoneSum - total) > 0.01) {
    return {
      valid: false,
      error: `Sum of milestone amounts ($${milestoneSum.toFixed(2)}) must equal total order value ($${total.toFixed(2)}).`,
    };
  }

  return { valid: true };
}

// -----------------------------------------------------------------------------
// STATE MACHINE TRANSITION GUARD
// -----------------------------------------------------------------------------
const PERMITTED_TRANSITIONS: Record<OrderStatus, OrderStatus[]> = {
  draft: ["quoted", "cancelled"],
  quoted: ["deposit_paid", "cancelled"],
  deposit_paid: ["in_progress", "refunded"],
  in_progress: ["milestone_review", "refunded"],
  milestone_review: ["in_progress", "completed", "refunded"],
  completed: ["delivered", "refunded"],
  delivered: [], // Terminal state
  cancelled: [], // Terminal state
  refunded: [],  // Terminal state
};

export function isValidOrderTransition(
  current: OrderStatus,
  target: OrderStatus
): boolean {
  if (current === target) return true;
  const allowed = PERMITTED_TRANSITIONS[current] || [];
  return allowed.includes(target);
}

// -----------------------------------------------------------------------------
// PIPELINE METRICS CALCULATOR
// -----------------------------------------------------------------------------
export function calculatePipelineMetrics(
  orders: OrderRecord[],
  customers: CustomerRecord[]
): OrderPipelineMetrics {
  let totalContractValueUsd = 0;
  let totalRevenueCollectedUsd = 0;
  let inFlightContractValueUsd = 0;
  let activeOrdersCount = 0;
  let pendingApprovalsCount = 0;

  for (const order of orders) {
    if (order.status !== "cancelled" && order.status !== "refunded") {
      totalContractValueUsd += order.totalAmount;
      totalRevenueCollectedUsd += order.amountPaid;
    }

    if (
      order.status === "in_progress" ||
      order.status === "deposit_paid" ||
      order.status === "milestone_review"
    ) {
      inFlightContractValueUsd += order.totalAmount;
      activeOrdersCount++;
    }

    if (order.status === "milestone_review") {
      pendingApprovalsCount++;
    }
  }

  return {
    totalContractValueUsd: Number(totalContractValueUsd.toFixed(2)),
    totalRevenueCollectedUsd: Number(totalRevenueCollectedUsd.toFixed(2)),
    inFlightContractValueUsd: Number(inFlightContractValueUsd.toFixed(2)),
    activeOrdersCount,
    pendingApprovalsCount,
    totalClientsCount: customers.length,
  };
}

// -----------------------------------------------------------------------------
// 1-CLICK INQUIRY-TO-ORDER CONVERTER
// -----------------------------------------------------------------------------
export function convertInquiryToOrderPayload(
  inquiry: {
    id: string;
    name: string;
    email: string;
    phone?: string;
    projectType: string;
    budgetRange: string;
    message: string;
  },
  customTotalAmount?: number
): CreateOrderPayload {
  let total = customTotalAmount;

  if (!total) {
    // Parse numeric value from budget range strings (e.g. "$15,000 - $30,000")
    const matches = inquiry.budgetRange.match(/[\d,]+/g);
    if (matches && matches.length > 0) {
      const clean = matches[0].replace(/,/g, "");
      total = Number(clean) || 10000;
    } else {
      total = 10000;
    }
  }

  // Generate 3 standard engineering sprint milestones:
  // Phase 1: 50% Kick-off Deposit
  // Phase 2: 30% Architecture & Alpha Delivery
  // Phase 3: 20% Production Cutover & 100% IP Transfer
  const p1 = Number((total * 0.5).toFixed(2));
  const p2 = Number((total * 0.3).toFixed(2));
  const p3 = Number((total - p1 - p2).toFixed(2));

  return {
    newCustomer: {
      companyName: `${inquiry.name} Engagement`,
      primaryContactName: inquiry.name,
      email: inquiry.email,
      phone: inquiry.phone,
    },
    inquiryId: inquiry.id,
    title: `${inquiry.projectType} Contract`,
    serviceTier: inquiry.projectType,
    currency: "USD",
    subtotalAmount: total,
    taxAmount: 0,
    milestones: [
      {
        title: "Phase 1: Kick-off Architecture & Infrastructure Setup",
        deliverablesSummary: "Architecture specification, Supabase schema, baseline benchmark setup",
        amount: p1,
      },
      {
        title: "Phase 2: Core Engineering & Staging Implementation",
        deliverablesSummary: "API implementation, core features, and staging preview deployment",
        amount: p2,
      },
      {
        title: "Phase 3: Production Hardening, Audit & IP Transfer",
        deliverablesSummary: "SLA load testing, 100% IP transfer, and 30-day bug warranty",
        amount: p3,
      },
    ],
  };
}

// -----------------------------------------------------------------------------
// CRYPTOGRAPHIC APPROVAL SIGNATURE (SHA-256)
// -----------------------------------------------------------------------------
export function generateApprovalSignature(
  orderId: string,
  milestoneId: string,
  approverName: string,
  approvedAt: string
): string {
  const payload = `signoff:${orderId}:${milestoneId}:${approverName}:${approvedAt}`;
  const hash = crypto.createHmac("sha256", OMS_SECRET).update(payload).digest("hex");
  return `sig_sha256_${hash.substring(0, 32)}`;
}

// -----------------------------------------------------------------------------
// INSTITUTIONAL TAX INVOICE GENERATOR (INV-YYYY-XXXX)
// -----------------------------------------------------------------------------
export function generateInvoiceForOrder(
  order: OrderRecord,
  customer?: CustomerRecord,
  milestoneIndex?: number
): InvoiceRecord {
  const cust = customer || order.customer || {
    id: order.customerId,
    companyName: "Client Organization",
    primaryContactName: "Client Lead",
    email: "client@example.com",
    clientTier: "active_client" as const,
    ndaStatus: "none" as const,
    totalSpendUsd: order.totalAmount,
    createdAt: order.createdAt,
    updatedAt: order.updatedAt,
  };

  const invoiceNumber = milestoneIndex
    ? `INV-${order.orderNumber.replace("ORD-", "")}-M${milestoneIndex}`
    : `INV-${order.orderNumber.replace("ORD-", "")}`;

  let lineItems: InvoiceLineItem[] = [];
  let subtotal = 0;
  let taxAmount = 0;
  let totalAmount = 0;
  let amountPaid = 0;

  if (milestoneIndex) {
    const ms = order.milestones.find((m) => m.milestoneIndex === milestoneIndex);
    if (ms) {
      lineItems = [
        {
          description: `Milestone Phase ${ms.milestoneIndex}: ${ms.title} (${ms.deliverablesSummary})`,
          quantity: 1,
          unitPrice: ms.amount,
          total: ms.amount,
        },
      ];
      subtotal = ms.amount;
      taxAmount = 0;
      totalAmount = ms.amount;
      amountPaid = ms.status === "paid" ? ms.amount : 0;
    }
  } else {
    lineItems = order.milestones.map((m) => ({
      description: `Phase ${m.milestoneIndex}: ${m.title} — ${m.deliverablesSummary}`,
      quantity: 1,
      unitPrice: m.amount,
      total: m.amount,
    }));
    subtotal = order.subtotalAmount;
    taxAmount = order.taxAmount;
    totalAmount = order.totalAmount;
    amountPaid = order.amountPaid;
  }

  const balanceDue = Number(Math.max(0, totalAmount - amountPaid).toFixed(2));
  const paymentStatus =
    amountPaid >= totalAmount
      ? "paid"
      : amountPaid > 0
      ? "partially_paid"
      : "unpaid";

  return {
    invoiceNumber,
    orderId: order.id,
    orderNumber: order.orderNumber,
    issueDate: order.createdAt.split("T")[0] || new Date().toISOString().split("T")[0],
    dueDate: order.targetCompletionDate || new Date(Date.now() + 14 * 86400000).toISOString().split("T")[0],
    currency: order.currency,
    customer: {
      companyName: cust.companyName,
      primaryContactName: cust.primaryContactName,
      email: cust.email,
      billingAddress: cust.billingAddress,
      vatTaxId: cust.vatTaxId,
    },
    issuer: {
      name: "Abu Hanif Mia",
      title: "Principal Full-Stack & Cloud Systems Architect",
      email: "contact@abuhanifmia.com",
      address: "Dhaka, Bangladesh • Global Remote Consulting",
      taxId: "TAX-ENG-2026-HANIF",
      wireDetails: {
        bankName: "Standard Chartered Bank / Wise Commercial Routing",
        swiftBic: "SCBLBDDX",
        accountOrIban: "BD29SCBL00025491823901",
        cryptoUsdtErc20: "0x71C...b9F1 (USDT / USDC ERC-20 on request)",
      },
    },
    lineItems,
    subtotal,
    taxAmount,
    totalAmount,
    amountPaid,
    balanceDue,
    paymentStatus,
    notes:
      "All intellectual property, source repositories, and deployment credentials transfer 100% upon milestone settlement. Includes standard 30-day bug warranty.",
  };
}

// -----------------------------------------------------------------------------
// CLIENT MILESTONE DIGITAL SIGN-OFF & APPROVAL ENGINE
// -----------------------------------------------------------------------------
export async function approveOrderMilestone(
  orderToken: string,
  milestoneId: string,
  approverName: string,
  notes?: string,
  clientIp?: string
): Promise<{ order: OrderRecord; milestone: OrderMilestoneRecord }> {
  if (!approverName || approverName.trim().length < 2) {
    throw new Error("Approver name is required for legal milestone sign-off.");
  }

  const order = await getOrderByIdOrToken(orderToken);
  if (!order) {
    throw new Error("Order not found or access token invalid.");
  }

  const milestone = order.milestones.find((m) => m.id === milestoneId);
  if (!milestone) {
    throw new Error(`Milestone '${milestoneId}' not found on order '${order.orderNumber}'.`);
  }

  if (milestone.status === "client_approved" || milestone.status === "paid") {
    return { order, milestone };
  }

  if (milestone.status !== "submitted") {
    throw new Error(
      `Milestone cannot be approved while in '${milestone.status}' status. It must be in 'submitted' status.`
    );
  }

  const approvedAt = new Date().toISOString();
  const signatureHash = generateApprovalSignature(
    order.id,
    milestone.id,
    approverName.trim(),
    approvedAt
  );

  milestone.status = "client_approved";
  milestone.approvedAt = approvedAt;
  milestone.approvedBy = approverName.trim();
  milestone.approvalSignatureHash = signatureHash;

  // Check if all milestones are now approved; if so, transition order to 'completed'
  const allApproved = order.milestones.every(
    (m) => m.status === "client_approved" || m.status === "paid"
  );
  if (allApproved && order.status === "milestone_review") {
    order.status = "completed";
    order.completedAt = approvedAt;
  }
  order.updatedAt = approvedAt;

  // If Supabase is configured, persist
  if (isSupabaseConfigured && supabase) {
    try {
      await supabase
        .from("order_milestones")
        .update({
          status: "client_approved",
          approved_at: approvedAt,
          approved_by: approverName.trim(),
          approval_signature_hash: signatureHash,
        })
        .eq("id", milestone.id);

      if (allApproved) {
        await supabase
          .from("orders")
          .update({
            status: order.status,
            completed_at: order.completedAt,
            updated_at: order.updatedAt,
          })
          .eq("id", order.id);
      }

      await supabase.from("order_audit_logs").insert([
        {
          order_id: order.id,
          actor: `Client: ${approverName.trim()}`,
          action: "MILESTONE_APPROVED",
          previous_state: { milestoneId: milestone.id, previousStatus: "submitted" },
          new_state: {
            milestoneId: milestone.id,
            status: "client_approved",
            approvedBy: approverName.trim(),
            signatureHash,
            notes,
          },
          ip_address: clientIp,
        },
      ]);
    } catch (err) {
      console.error("Supabase milestone approval error:", err);
    }
  }

  return { order, milestone };
}

// -----------------------------------------------------------------------------
// DATA ACCESS LAYER (Supabase with Local In-Memory Fallback)
// -----------------------------------------------------------------------------
export async function getOrders(): Promise<OrderRecord[]> {
  if (isSupabaseConfigured && supabase) {
    try {
      const { data: ordersData, error: ordersErr } = await supabase
        .from("orders")
        .select(`
          *,
          customer:customers(*),
          milestones:order_milestones(*)
        `)
        .order("created_at", { ascending: false });

      if (!ordersErr && ordersData && ordersData.length > 0) {
        return ordersData.map((o: any) => ({
          id: o.id,
          orderNumber: o.order_number,
          customerId: o.customer_id,
          customer: o.customer
            ? {
                id: o.customer.id,
                companyName: o.customer.company_name,
                primaryContactName: o.customer.primary_contact_name,
                email: o.customer.email,
                phone: o.customer.phone,
                billingAddress: o.customer.billing_address,
                vatTaxId: o.customer.vat_tax_id,
                clientTier: o.customer.client_tier,
                ndaStatus: o.customer.nda_status,
                totalSpendUsd: Number(o.customer.total_spend_usd) || 0,
                internalNotes: o.customer.internal_notes,
                createdAt: o.customer.created_at,
                updatedAt: o.customer.updated_at,
              }
            : undefined,
          inquiryId: o.inquiry_id,
          title: o.title,
          serviceTier: o.service_tier,
          status: o.status,
          paymentStatus: o.payment_status,
          currency: o.currency,
          subtotalAmount: Number(o.subtotal_amount),
          taxAmount: Number(o.tax_amount),
          totalAmount: Number(o.total_amount),
          amountPaid: Number(o.amount_paid),
          startDate: o.start_date,
          targetCompletionDate: o.target_completion_date,
          completedAt: o.completed_at,
          sowDocumentUrl: o.sow_document_url,
          clientAccessToken: o.client_access_token,
          milestones: (o.milestones || []).map((m: any) => ({
            id: m.id,
            orderId: m.order_id,
            milestoneIndex: m.milestone_index,
            title: m.title,
            deliverablesSummary: m.deliverables_summary,
            amount: Number(m.amount),
            dueDate: m.due_date,
            status: m.status,
            approvedAt: m.approved_at,
            createdAt: m.created_at,
          })),
          createdAt: o.created_at,
          updatedAt: o.updated_at,
        }));
      }
    } catch (e) {
      console.warn("Supabase getOrders fetch error, falling back to local memory:", e);
    }
  }

  return [...ordersStore];
}

export async function getOrderByIdOrToken(
  idOrToken: string
): Promise<OrderRecord | null> {
  const allOrders = await getOrders();
  return (
    allOrders.find(
      (o) => o.id === idOrToken || o.clientAccessToken === idOrToken || o.orderNumber === idOrToken
    ) || null
  );
}

export async function getCustomers(): Promise<CustomerRecord[]> {
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from("customers")
        .select("*")
        .order("total_spend_usd", { ascending: false });

      if (!error && data && data.length > 0) {
        return data.map((c: any) => ({
          id: c.id,
          companyName: c.company_name,
          primaryContactName: c.primary_contact_name,
          email: c.email,
          phone: c.phone,
          billingAddress: c.billing_address,
          vatTaxId: c.vat_tax_id,
          clientTier: c.client_tier,
          ndaStatus: c.nda_status,
          totalSpendUsd: Number(c.total_spend_usd) || 0,
          internalNotes: c.internal_notes,
          createdAt: c.created_at,
          updatedAt: c.updated_at,
        }));
      }
    } catch (e) {
      console.warn("Supabase getCustomers fetch error, using fallback store:", e);
    }
  }

  return [...customersStore];
}

export async function createOrder(
  payload: CreateOrderPayload,
  actor: string = "Admin"
): Promise<OrderRecord> {
  const subtotal = Number(payload.subtotalAmount) || 0;
  const tax = Number(payload.taxAmount) || 0;
  const total = Number((subtotal + tax).toFixed(2));

  // 1. Validate Financials
  const validation = validateOrderFinancials(subtotal, tax, total, payload.milestones);
  if (!validation.valid) {
    throw new Error(validation.error || "Financial balance validation failed.");
  }

  // 2. Resolve or Create Customer
  let customerId = payload.customerId;
  let customerRecord: CustomerRecord | undefined;

  if (!customerId && payload.newCustomer) {
    const existing = customersStore.find(
      (c) => c.email.toLowerCase() === payload.newCustomer!.email.toLowerCase()
    );

    if (existing) {
      customerId = existing.id;
      customerRecord = existing;
    } else {
      const newCust: CustomerRecord = {
        id: `cust-${Date.now()}`,
        companyName: payload.newCustomer.companyName,
        primaryContactName: payload.newCustomer.primaryContactName,
        email: payload.newCustomer.email.toLowerCase(),
        phone: payload.newCustomer.phone,
        clientTier: "active_client",
        ndaStatus: "none",
        totalSpendUsd: total,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      customersStore.push(newCust);
      customerId = newCust.id;
      customerRecord = newCust;

      if (isSupabaseConfigured && supabase) {
        try {
          await supabase.from("customers").insert([
            {
              id: newCust.id,
              company_name: newCust.companyName,
              primary_contact_name: newCust.primaryContactName,
              email: newCust.email,
              phone: newCust.phone,
              client_tier: newCust.clientTier,
              nda_status: newCust.ndaStatus,
              total_spend_usd: newCust.totalSpendUsd,
            },
          ]);
        } catch {}
      }
    }
  } else if (customerId) {
    customerRecord = customersStore.find((c) => c.id === customerId);
    if (customerRecord) {
      customerRecord.totalSpendUsd += total;
    }
  }

  if (!customerId) {
    throw new Error("Unable to link order to a customer. Customer information is required.");
  }

  // 3. Create Order Record
  const now = new Date().toISOString();
  const orderId = `ord-${Date.now()}`;
  const orderNumber = `ORD-2026-${Math.floor(1000 + Math.random() * 9000)}`;
  const token = generateClientAccessToken(orderId, customerId, now);

  const orderMilestones: OrderMilestoneRecord[] = payload.milestones.map((m, idx) => ({
    id: `ms-${orderId}-${idx + 1}`,
    orderId,
    milestoneIndex: idx + 1,
    title: m.title,
    deliverablesSummary: m.deliverablesSummary,
    amount: Number(m.amount),
    dueDate: m.dueDate,
    status: idx === 0 ? "in_progress" : "pending",
    createdAt: now,
  }));

  const newOrder: OrderRecord = {
    id: orderId,
    orderNumber,
    customerId,
    customer: customerRecord,
    inquiryId: payload.inquiryId,
    title: payload.title,
    serviceTier: payload.serviceTier,
    status: "quoted",
    paymentStatus: "unpaid",
    currency: payload.currency || "USD",
    subtotalAmount: subtotal,
    taxAmount: tax,
    totalAmount: total,
    amountPaid: 0,
    startDate: payload.startDate || now.split("T")[0],
    targetCompletionDate: payload.targetCompletionDate,
    sowDocumentUrl: payload.sowDocumentUrl,
    clientAccessToken: token,
    milestones: orderMilestones,
    createdAt: now,
    updatedAt: now,
  };

  ordersStore.unshift(newOrder);

  // Sync with Supabase if online
  if (isSupabaseConfigured && supabase) {
    try {
      await supabase.from("orders").insert([
        {
          id: newOrder.id,
          order_number: newOrder.orderNumber,
          customer_id: newOrder.customerId,
          inquiry_id: newOrder.inquiryId,
          title: newOrder.title,
          service_tier: newOrder.serviceTier,
          status: newOrder.status,
          payment_status: newOrder.paymentStatus,
          currency: newOrder.currency,
          subtotal_amount: newOrder.subtotalAmount,
          tax_amount: newOrder.taxAmount,
          total_amount: newOrder.totalAmount,
          amount_paid: newOrder.amountPaid,
          start_date: newOrder.startDate,
          target_completion_date: newOrder.targetCompletionDate,
          client_access_token: newOrder.clientAccessToken,
        },
      ]);

      const milestonesRows = newOrder.milestones.map((m) => ({
        id: m.id,
        order_id: m.orderId,
        milestone_index: m.milestoneIndex,
        title: m.title,
        deliverables_summary: m.deliverablesSummary,
        amount: m.amount,
        due_date: m.dueDate,
        status: m.status,
      }));

      await supabase.from("order_milestones").insert(milestonesRows);

      await supabase.from("order_audit_logs").insert([
        {
          order_id: newOrder.id,
          actor,
          action: "ORDER_CREATED",
          new_state: newOrder,
        },
      ]);
    } catch (e) {
      console.warn("Supabase createOrder insert error:", e);
    }
  }

  return newOrder;
}

export async function updateOrder(
  id: string,
  payload: UpdateOrderPayload,
  actor: string = "Admin"
): Promise<OrderRecord> {
  const order = ordersStore.find((o) => o.id === id);
  if (!order) {
    throw new Error(`Order ${id} not found.`);
  }

  // State Transition Validation
  if (payload.status && !isValidOrderTransition(order.status, payload.status)) {
    throw new Error(
      `Invalid order state transition from '${order.status}' to '${payload.status}'.`
    );
  }

  const previousState = { ...order };

  if (payload.status) order.status = payload.status;
  if (payload.paymentStatus) order.paymentStatus = payload.paymentStatus;
  if (typeof payload.amountPaid === "number") {
    if (payload.amountPaid > order.totalAmount) {
      throw new Error("Amount paid cannot exceed total order value.");
    }
    order.amountPaid = payload.amountPaid;
    if (order.amountPaid >= order.totalAmount) {
      order.paymentStatus = "paid";
    } else if (order.amountPaid > 0) {
      order.paymentStatus = "partially_paid";
    }
  }
  if (payload.title) order.title = payload.title;
  if (payload.targetCompletionDate) order.targetCompletionDate = payload.targetCompletionDate;
  if (payload.sowDocumentUrl) order.sowDocumentUrl = payload.sowDocumentUrl;
  order.updatedAt = new Date().toISOString();

  if (isSupabaseConfigured && supabase) {
    try {
      await supabase
        .from("orders")
        .update({
          status: order.status,
          payment_status: order.paymentStatus,
          amount_paid: order.amountPaid,
          title: order.title,
          target_completion_date: order.targetCompletionDate,
          sow_document_url: order.sowDocumentUrl,
          updated_at: order.updatedAt,
        })
        .eq("id", order.id);

      await supabase.from("order_audit_logs").insert([
        {
          order_id: order.id,
          actor,
          action: "ORDER_UPDATED",
          previous_state: previousState,
          new_state: order,
        },
      ]);
    } catch (e) {
      console.warn("Supabase updateOrder error:", e);
    }
  }

  return order;
}

export async function deleteOrder(id: string, actor: string = "Admin"): Promise<boolean> {
  const index = ordersStore.findIndex((o) => o.id === id);
  if (index === -1) return false;

  const deleted = ordersStore.splice(index, 1)[0];

  if (isSupabaseConfigured && supabase) {
    try {
      await supabase.from("orders").delete().eq("id", id);
    } catch {}
  }

  return true;
}

// Reset state helper for testing
export function _resetOmsStoresForTesting(): void {
  customersStore = JSON.parse(JSON.stringify(initialCustomers));
  ordersStore = JSON.parse(JSON.stringify(initialOrders));
}
