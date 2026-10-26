export type ClientTier =
  | "lead"
  | "active_client"
  | "vip_partner"
  | "retained"
  | "churned";

export type NdaStatus =
  | "none"
  | "requested"
  | "signed"
  | "mutual_nda_active";

export type OrderStatus =
  | "draft"
  | "quoted"
  | "deposit_paid"
  | "in_progress"
  | "milestone_review"
  | "completed"
  | "delivered"
  | "cancelled"
  | "refunded";

export type PaymentStatus =
  | "unpaid"
  | "partially_paid"
  | "paid"
  | "refunded";

export type CurrencyCode = "USD" | "EUR" | "GBP";

export type MilestoneStatus =
  | "pending"
  | "in_progress"
  | "submitted"
  | "client_approved"
  | "paid";

export interface CustomerRecord {
  id: string;
  companyName: string;
  primaryContactName: string;
  email: string;
  phone?: string;
  billingAddress?: {
    street?: string;
    city?: string;
    state?: string;
    country?: string;
    postalCode?: string;
  };
  vatTaxId?: string;
  clientTier: ClientTier;
  ndaStatus: NdaStatus;
  totalSpendUsd: number;
  internalNotes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface OrderMilestoneRecord {
  id: string;
  orderId: string;
  milestoneIndex: number;
  title: string;
  deliverablesSummary: string;
  amount: number;
  dueDate?: string;
  status: MilestoneStatus;
  approvedAt?: string;
  createdAt: string;
}

export interface OrderRecord {
  id: string;
  orderNumber: string;
  customerId: string;
  customer?: CustomerRecord;
  inquiryId?: string;
  title: string;
  serviceTier: string;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  currency: CurrencyCode;
  subtotalAmount: number;
  taxAmount: number;
  totalAmount: number;
  amountPaid: number;
  startDate?: string;
  targetCompletionDate?: string;
  completedAt?: string;
  sowDocumentUrl?: string;
  clientAccessToken: string;
  milestones: OrderMilestoneRecord[];
  createdAt: string;
  updatedAt: string;
}

export interface OrderAuditLogRecord {
  id: string;
  orderId: string;
  actor: string;
  action: string;
  previousState?: Record<string, unknown>;
  newState?: Record<string, unknown>;
  ipAddress?: string;
  createdAt: string;
}

export interface OrderPipelineMetrics {
  totalContractValueUsd: number;
  totalRevenueCollectedUsd: number;
  inFlightContractValueUsd: number;
  activeOrdersCount: number;
  pendingApprovalsCount: number;
  totalClientsCount: number;
}

export interface CreateOrderPayload {
  customerId?: string;
  newCustomer?: {
    companyName: string;
    primaryContactName: string;
    email: string;
    phone?: string;
  };
  inquiryId?: string;
  title: string;
  serviceTier: string;
  currency?: CurrencyCode;
  subtotalAmount: number;
  taxAmount?: number;
  startDate?: string;
  targetCompletionDate?: string;
  sowDocumentUrl?: string;
  milestones: Array<{
    title: string;
    deliverablesSummary: string;
    amount: number;
    dueDate?: string;
  }>;
}

export interface UpdateOrderPayload {
  status?: OrderStatus;
  paymentStatus?: PaymentStatus;
  amountPaid?: number;
  title?: string;
  targetCompletionDate?: string;
  sowDocumentUrl?: string;
}
