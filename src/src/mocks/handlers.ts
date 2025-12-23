import { http, HttpResponse, delay } from 'msw';
import { getMockData } from './dataLoader';

let mockDataCache = {
  invoices: [] as any[],
  customers: [] as any[],
  metrics: [] as any[],
};

// Load data on first use
let dataLoadPromise: Promise<void> | null = null;

const ensureDataLoaded = async () => {
  if (!dataLoadPromise) {
    dataLoadPromise = getMockData().then((data) => {
      mockDataCache = data;
      console.log('Mock data loaded:', {
        invoices: mockDataCache.invoices.length,
        customers: mockDataCache.customers.length,
        metrics: mockDataCache.metrics.length,
      });
    });
  }
  await dataLoadPromise;
};

// Generate monthly aggregated data for charts
const generateMonthlyData = (startDate: Date, months: number = 12) => {
  const data = [];
  for (let i = 0; i < months; i++) {
    const date = new Date(startDate);
    date.setMonth(date.getMonth() + i);
    data.push({
      month: date.toLocaleString('en-US', { month: 'short', year: '2-digit' }),
      invoices: Math.floor(Math.random() * 50) + 20,
      validated: Math.floor(Math.random() * 40) + 10,
      approved: Math.floor(Math.random() * 35) + 8,
      paid: Math.floor(Math.random() * 30) + 5,
    });
  }
  return data;
};

// Generate currency split data
const generateCurrencySplit = (invoices: any[]) => {
  const currencies: Record<string, number> = {};
  invoices.forEach((inv: any) => {
    currencies[inv.currency] = (currencies[inv.currency] || 0) + inv.amount;
  });
  return Object.entries(currencies).map(([currency, amount]) => ({
    currency,
    amount: Number(amount),
  }));
};

// Sample agents data
const agentsData = [
  {
    id: 'AGENT001',
    name: 'Invoice Processor AI',
    description: 'Automated invoice extraction and processing',
    status: 'active',
    uptime: 99.8,
    documentsProcessed: 15420,
    accuracy: 97.5,
    averageProcessingTime: 2.3,
  },
  {
    id: 'AGENT002',
    name: 'Customer Insights Engine',
    description: 'Advanced customer credit analysis and insights',
    status: 'active',
    uptime: 99.6,
    documentsProcessed: 8930,
    accuracy: 96.8,
    averageProcessingTime: 1.8,
  },
  {
    id: 'AGENT003',
    name: 'Order Processor',
    description: 'Intelligent order processing and fulfillment',
    status: 'coming_soon',
    uptime: 0,
    documentsProcessed: 0,
    accuracy: 0,
    averageProcessingTime: 0,
  },
];

export const handlers = [
  // Get all invoices with filtering
  http.get('/api/invoices', async ({ request }) => {
    await ensureDataLoaded();
    await delay(50);
    const url = new URL(request.url);
    let filtered = [...mockDataCache.invoices];

    const status = url.searchParams.get('status');
    const stage = url.searchParams.get('stage');
    const customer = url.searchParams.get('customer');
    const from = url.searchParams.get('from');
    const to = url.searchParams.get('to');

    if (status) {
      filtered = filtered.filter((inv: any) => inv.status === status);
    }
    if (stage) {
      filtered = filtered.filter((inv: any) => inv.stage === stage);
    }
    if (customer) {
      filtered = filtered.filter((inv: any) => inv.customer_name?.toLowerCase().includes(customer.toLowerCase()));
    }
    if (from) {
      filtered = filtered.filter((inv: any) => new Date(inv.date) >= new Date(from));
    }
    if (to) {
      filtered = filtered.filter((inv: any) => new Date(inv.date) <= new Date(to));
    }

    return HttpResponse.json(filtered);
  }),

  // Get invoice by ID
  http.get('/api/invoices/:id', async ({ params }) => {
    await ensureDataLoaded();
    const invoice = mockDataCache.invoices.find((inv: any) => inv.invoice_id === params.id);
    if (invoice) {
      return HttpResponse.json(invoice);
    }
    return HttpResponse.json({ error: 'Not found' }, { status: 404 });
  }),

  // Get all customers
  http.get('/api/customers', async ({ request }) => {
    await ensureDataLoaded();
    await delay(50);
    const url = new URL(request.url);
    let filtered = [...mockDataCache.customers];

    const country = url.searchParams.get('country');
    const status = url.searchParams.get('status');

    if (country) {
      filtered = filtered.filter((cust: any) => cust.country === country);
    }
    if (status) {
      filtered = filtered.filter((cust: any) => cust.status === status);
    }

    return HttpResponse.json(filtered);
  }),

  // Get customer by ID
  http.get('/api/customers/:id', async ({ params }) => {
    await ensureDataLoaded();
    const customer = mockDataCache.customers.find((cust: any) => cust.customer_id === params.id);
    if (customer) {
      return HttpResponse.json(customer);
    }
    return HttpResponse.json({ error: 'Not found' }, { status: 404 });
  }),

  // Get all metrics with filtering
  http.get('/api/metrics', async ({ request }) => {
    await ensureDataLoaded();
    const url = new URL(request.url);
    let filtered = [...mockDataCache.metrics];

    const agent = url.searchParams.get('agent');
    const country = url.searchParams.get('country');
    const dateFrom = url.searchParams.get('dateFrom');
    const dateTo = url.searchParams.get('dateTo');

    if (agent && agent !== 'all') {
      filtered = filtered.filter((m: any) => m.agent === agent);
    }
    if (country && country !== 'all') {
      filtered = filtered.filter((m: any) => m.country === country);
    }
    if (dateFrom) {
      filtered = filtered.filter((m: any) => new Date(m.date) >= new Date(dateFrom));
    }
    if (dateTo) {
      filtered = filtered.filter((m: any) => new Date(m.date) <= new Date(dateTo));
    }

    return HttpResponse.json(filtered);
  }),

  // Get agent metrics
  http.get('/api/agent-metrics', async ({ request }) => {
    await ensureDataLoaded();
    return HttpResponse.json(mockDataCache.metrics);
  }),

  // Get analytics data with properly formatted chart data
  http.get('/api/analytics', async ({ request }) => {
    await ensureDataLoaded();
    const totalInvoices = mockDataCache.invoices.length;
    const paidInvoices = mockDataCache.invoices.filter((inv: any) => inv.status === 'paid').length;
    const validatedInvoices = mockDataCache.invoices.filter((inv: any) => inv.stage === 'validated').length;
    const approvedInvoices = mockDataCache.invoices.filter((inv: any) => inv.stage === 'approved').length;
    
    const monthlyData = generateMonthlyData(new Date('2023-01-01'), 12);
    const currencyData = generateCurrencySplit(mockDataCache.invoices);
    
    return HttpResponse.json({
      totalInvoices,
      validatedRate: totalInvoices > 0 ? ((validatedInvoices / totalInvoices) * 100).toFixed(1) : 0,
      approvedRate: totalInvoices > 0 ? ((approvedInvoices / totalInvoices) * 100).toFixed(1) : 0,
      paidRate: totalInvoices > 0 ? ((paidInvoices / totalInvoices) * 100).toFixed(1) : 0,
      averageApprovalTime: 3.5,
      accountsReceivable: mockDataCache.customers.reduce((sum: number, cust: any) => sum + (cust.accounts_receivable || 0), 0),
      monthlyTrend: monthlyData,
      currencySplit: currencyData,
    });
  }),

  // Get agents list
  http.get('/api/agents', async () => {
    return HttpResponse.json(agentsData);
  }),

  // Get agent by ID
  http.get('/api/agents/:id', async ({ params }) => {
    const agent = agentsData.find((a: any) => a.id === params.id);
    if (agent) {
      return HttpResponse.json({
        ...agent,
        monthlyMetrics: generateMonthlyData(new Date('2023-01-01'), 12),
        performanceHistory: generateMonthlyData(new Date('2023-01-01'), 12).map((m: any) => ({
          ...m,
          processingTime: (Math.random() * 3 + 1).toFixed(1),
          costPerDoc: (Math.random() * 0.5 + 0.5).toFixed(2),
        })),
      });
    }
    return HttpResponse.json({ error: 'Not found' }, { status: 404 });
  }),

  // Get invoice processor agent details
  http.get('/api/agents/invoice-processor/workflow', async () => {
    await ensureDataLoaded();
    return HttpResponse.json({
      stages: [
        { name: 'extracted', count: mockDataCache.invoices.filter((inv: any) => inv.stage === 'extracted').length, percentage: 15 },
        { name: 'validated', count: mockDataCache.invoices.filter((inv: any) => inv.stage === 'validated').length, percentage: 29 },
        { name: 'approved', count: mockDataCache.invoices.filter((inv: any) => inv.stage === 'approved').length, percentage: 36 },
        { name: 'assigned_to_payments', count: 48, percentage: 16 },
        { name: 'paid', count: mockDataCache.invoices.filter((inv: any) => inv.status === 'paid').length, percentage: 4 },
      ],
      recentDocuments: mockDataCache.invoices.slice(0, 5).map((inv: any) => ({
        id: inv.invoice_id,
        customer: inv.customer_name,
        amount: inv.amount,
        status: inv.status,
        date: inv.date,
      })),
    });
  }),

  // Get customer insights agent details
  http.get('/api/agents/customer-insights/analysis', async () => {
    await ensureDataLoaded();
    return HttpResponse.json({
      topCustomers: mockDataCache.customers.slice(0, 5).map((cust: any) => ({
        name: cust.customer_name,
        creditScore: cust.credit_score,
        balance: cust.balance,
        trend: 'up',
      })),
      riskAnalysis: [
        { 
          name: 'At Risk', 
          count: mockDataCache.customers.filter((c: any) => c.status === 'at_risk').length, 
          percentage: 26.7, 
          customers: mockDataCache.customers.filter((c: any) => c.status === 'at_risk').map((c: any) => c.customer_name) 
        },
        { 
          name: 'Low Risk', 
          count: mockDataCache.customers.filter((c: any) => c.status === 'active').length, 
          percentage: 73.3, 
          customers: ['Active Customers'] 
        },
      ],
      trends: generateMonthlyData(new Date('2023-01-01'), 12).map((m: any) => ({
        ...m,
        creditQuality: Math.floor(Math.random() * 30) + 70,
        defaultRate: Math.floor(Math.random() * 5) + 1,
      })),
    });
  }),

  // Get countries
  http.get('/api/countries', async () => {
    return HttpResponse.json([
      { code: 'GB', name: 'United Kingdom' },
      { code: 'DE', name: 'Germany' },
      { code: 'FR', name: 'France' },
      { code: 'US', name: 'United States' },
      { code: 'NL', name: 'Netherlands' },
      { code: 'SE', name: 'Sweden' },
      { code: 'CH', name: 'Switzerland' },
      { code: 'IT', name: 'Italy' },
      { code: 'ES', name: 'Spain' },
      { code: 'BE', name: 'Belgium' },
    ]);
  }),
];