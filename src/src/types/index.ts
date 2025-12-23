export interface Country {
  code: string;
  name: string;
  currency: string;
  languages: string[];
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  country: string;
  region: string;
  creditScore: number;
  accountsPayable: number;
  accountsReceivable: number;
  balance: number;
  pendingOrders: number;
  createdAt: string;
  lastActivity: string;
  actionHistory: ActionHistoryItem[];
}

export interface ActionHistoryItem {
  id: string;
  timestamp: string;
  action: string;
  user: string;
  notes?: string;
}

export interface Invoice {
  id: string;
  customerId: string;
  customerName: string;
  amount: number;
  currency: string;
  issueDate: string;
  dueDate: string;
  stage: InvoiceStage;
  riskScore: number;
  country: string;
  pdfUrl: string;
  extractedFields: ExtractedFields;
  activityTimeline: ActivityTimelineItem[];
}

export type InvoiceStage =
  | 'received'
  | 'extracted'
  | 'validated'
  | 'sent_for_approval'
  | 'approved'
  | 'assigned_to_payments'
  | 'paid';

export interface ExtractedFields {
  invoiceNumber: string;
  vendor: string;
  customer: string;
  amount: number;
  currency: string;
  issueDate: string;
  dueDate: string;
  items: LineItem[];
}

export interface LineItem {
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export interface ActivityTimelineItem {
  stage: string;
  timestamp: string;
  user: string;
  notes?: string;
}

export interface AgentMetric {
  id: string;
  date: string;
  agent: string;
  country: string;
  volume: number;
  accuracy: number;
  positiveFeedback: number;
  negativeFeedback: number;
  averageProcessingTime: number;
}

export interface DateRange {
  from: Date | null;
  to: Date | null;
}

export interface InvoiceFilters {
  dateRange: DateRange;
  customer: string;
  stage: InvoiceStage | 'all';
  country: string;
}

export interface CustomerFilters {
  name: string;
  region: string;
  creditScoreMin: number;
  creditScoreMax: number;
  country: string;
}

export interface AnalyticsFilters {
  dateRange: DateRange;
  country: string;
  agent: string;
}
