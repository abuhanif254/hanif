export interface InquiryRecord {
  id: string;
  name: string;
  email: string;
  phone?: string;
  projectType: string;
  budgetRange: string;
  message: string;
  status: "new" | "reviewed" | "contacted" | "archived";
  createdAt: string;
}

/**
 * Sanitizes an individual cell value against CSV / Spreadsheet formula injection (CWE-1236).
 * Prepends a single quote (') if the string begins with =, +, -, @, \t, or \r.
 * Wraps values in quotes and escapes internal double quotes per RFC 4180.
 */
export function sanitizeCsvCell(val: string | number | undefined | null): string {
  if (val === undefined || val === null) {
    return '""';
  }
  let clean = String(val).replace(/\r\n/g, "\n").replace(/\r/g, "\n");

  // Anti-CSV Formula Injection Shield:
  // If the cell begins with formula characters (or leading whitespace/newlines followed by formula chars),
  // neutralize it by prefixing with a single quote
  if (/^[\s\r\n]*[=+\-@\t\r]/.test(clean) || /^[=+\-@\t\r]/.test(clean)) {
    clean = `'${clean}`;
  }

  // RFC 4180: double any internal quotes
  return `"${clean.replace(/"/g, '""')}"`;
}

/**
 * Generates an RFC 4180-compliant CSV string from inquiry records with security sanitization.
 */
export function exportInquiriesToCsv(records: InquiryRecord[]): string {
  const headers = [
    "Inquiry ID",
    "Received Date (UTC)",
    "Client Name",
    "Email Address",
    "Phone Number",
    "Project Type",
    "Budget Range",
    "Status",
    "Requirements Message",
  ];

  const headerRow = headers.map((h) => `"${h}"`).join(",");
  const dataRows = records.map((inq) =>
    [
      sanitizeCsvCell(inq.id),
      sanitizeCsvCell(inq.createdAt),
      sanitizeCsvCell(inq.name),
      sanitizeCsvCell(inq.email),
      sanitizeCsvCell(inq.phone || "Not specified"),
      sanitizeCsvCell(inq.projectType),
      sanitizeCsvCell(inq.budgetRange),
      sanitizeCsvCell(inq.status),
      sanitizeCsvCell(inq.message),
    ].join(",")
  );

  return [headerRow, ...dataRows].join("\r\n");
}

/**
 * Generates structured JSON formatted for CRM / webhook ingestion.
 */
export function exportInquiriesToJson(records: InquiryRecord[]): string {
  return JSON.stringify(records, null, 2);
}

/**
 * Filters and searches inquiry records by status and free-text query.
 */
export function filterInquiries(
  records: InquiryRecord[],
  statusFilter: "all" | "new" | "reviewed" | "contacted" | "archived",
  searchQuery: string
): InquiryRecord[] {
  const query = searchQuery.trim().toLowerCase();
  return records.filter((inq) => {
    const matchesStatus = statusFilter === "all" || inq.status === statusFilter;
    if (!matchesStatus) return false;
    if (!query) return true;
    return (
      inq.name.toLowerCase().includes(query) ||
      inq.email.toLowerCase().includes(query) ||
      (inq.phone ? inq.phone.toLowerCase().includes(query) : false) ||
      inq.projectType.toLowerCase().includes(query) ||
      inq.budgetRange.toLowerCase().includes(query) ||
      inq.message.toLowerCase().includes(query)
    );
  });
}
