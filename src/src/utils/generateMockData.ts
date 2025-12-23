import { faker } from '@faker-js/faker';
import type { Customer, Invoice, AgentMetric, InvoiceStage } from '../types';

const countries = [
  { code: 'GB', name: 'United Kingdom', currency: 'GBP', languages: ['en'] },
  { code: 'SE', name: 'Sweden', currency: 'SEK', languages: ['sv'] },
  { code: 'CH', name: 'Switzerland', currency: 'CHF', languages: ['de', 'fr', 'it'] },
  { code: 'CA', name: 'Canada', currency: 'CAD', languages: ['en', 'fr'] },
  { code: 'US', name: 'United States', currency: 'USD', languages: ['en'] },
  { code: 'NL', name: 'Netherlands', currency: 'EUR', languages: ['nl'] },
  { code: 'FR', name: 'France', currency: 'EUR', languages: ['fr'] },
  { code: 'CZ', name: 'Czech Republic', currency: 'CZK', languages: ['cs'] },
  { code: 'SK', name: 'Slovakia', currency: 'EUR', languages: ['sk'] },
  { code: 'DE', name: 'Germany', currency: 'EUR', languages: ['de'] },
  { code: 'RO', name: 'Romania', currency: 'RON', languages: ['ro'] },
  { code: 'PL', name: 'Poland', currency: 'PLN', languages: ['pl'] },
  { code: 'HU', name: 'Hungary', currency: 'HUF', languages: ['hu'] },
  { code: 'IT', name: 'Italy', currency: 'EUR', languages: ['it'] },
  { code: 'AT', name: 'Austria', currency: 'EUR', languages: ['de'] },
];

const stages: InvoiceStage[] = [
  'received',
  'extracted',
  'validated',
  'sent_for_approval',
  'approved',
  'assigned_to_payments',
  'paid',
];

const agentTypes = ['Invoice Processor', 'Customer Insights', 'Order Processor'];

export const generateCustomers = (count: number): Customer[] => {
  const customers: Customer[] = [];
  
  for (let i = 0; i < count; i++) {
    const country = faker.helpers.arrayElement(countries);
    const creditScore = faker.number.int({ min: 300, max: 850 });
    const accountsPayable = faker.number.float({ min: 0, max: 500000, fractionDigits: 2 });
    const accountsReceivable = faker.number.float({ min: 0, max: 500000, fractionDigits: 2 });
    
    customers.push({
      id: `CUST-${String(i + 1).padStart(6, '0')}`,
      name: faker.company.name(),
      email: faker.internet.email(),
      phone: faker.phone.number(),
      country: country.code,
      region: faker.location.state(),
      creditScore,
      accountsPayable,
      accountsReceivable,
      balance: accountsReceivable - accountsPayable,
      pendingOrders: faker.number.int({ min: 0, max: 50 }),
      createdAt: faker.date.between({ 
        from: '2023-01-01', 
        to: '2023-12-31' 
      }).toISOString(),
      lastActivity: faker.date.between({ 
        from: '2023-01-01', 
        to: '2025-12-31' 
      }).toISOString(),
      actionHistory: [],
    });
  }
  
  return customers;
};

export const generateInvoices = (count: number, customers: Customer[]): Invoice[] => {
  const invoices: Invoice[] = [];
  
  for (let i = 0; i < count; i++) {
    const customer = faker.helpers.arrayElement(customers);
    const country = countries.find(c => c.code === customer.country)!;
    const issueDate = faker.date.between({ 
      from: '2023-01-01', 
      to: '2025-11-30' 
    });
    const dueDate = new Date(issueDate);
    dueDate.setDate(dueDate.getDate() + faker.number.int({ min: 15, max: 90 }));
    
    const stage = faker.helpers.arrayElement(stages);
    const amount = faker.number.float({ min: 100, max: 100000, fractionDigits: 2 });
    const riskScore = faker.number.int({ min: 0, max: 100 });
    
    const activityTimeline = [];
    let currentDate = new Date(issueDate);
    
    const stageIndex = stages.indexOf(stage);
    for (let j = 0; j <= stageIndex; j++) {
      activityTimeline.push({
        stage: stages[j],
        timestamp: new Date(currentDate).toISOString(),
        user: faker.person.fullName(),
        notes: `${stages[j].replace(/_/g, ' ')} completed`,
      });
      currentDate = new Date(currentDate.getTime() + faker.number.int({ min: 1, max: 5 }) * 24 * 60 * 60 * 1000);
    }
    
    invoices.push({
      id: `INV-${String(i + 1).padStart(6, '0')}`,
      customerId: customer.id,
      customerName: customer.name,
      amount,
      currency: country.currency,
      issueDate: issueDate.toISOString(),
      dueDate: dueDate.toISOString(),
      stage,
      riskScore,
      country: customer.country,
      pdfUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
      extractedFields: {
        invoiceNumber: `INV-${String(i + 1).padStart(6, '0')}`,
        vendor: faker.company.name(),
        customer: customer.name,
        amount,
        currency: country.currency,
        issueDate: issueDate.toISOString().split('T')[0],
        dueDate: dueDate.toISOString().split('T')[0],
        items: Array.from({ length: faker.number.int({ min: 1, max: 5 }) }, () => {
          const quantity = faker.number.int({ min: 1, max: 100 });
          const unitPrice = faker.number.float({ min: 10, max: 1000, fractionDigits: 2 });
          return {
            description: faker.commerce.productName(),
            quantity,
            unitPrice,
            total: quantity * unitPrice,
          };
        }),
      },
      activityTimeline,
    });
  }
  
  return invoices;
};

export const generateAgentMetrics = (count: number): AgentMetric[] => {
  const metrics: AgentMetric[] = [];
  
  for (let i = 0; i < count; i++) {
    const date = faker.date.between({ 
      from: '2023-01-01', 
      to: '2025-12-31' 
    });
    const agent = faker.helpers.arrayElement(agentTypes);
    const country = faker.helpers.arrayElement(countries);
    
    metrics.push({
      id: `METRIC-${String(i + 1).padStart(6, '0')}`,
      date: date.toISOString(),
      agent,
      country: country.code,
      volume: faker.number.int({ min: 10, max: 500 }),
      accuracy: faker.number.float({ min: 85, max: 99.9, fractionDigits: 2 }),
      positiveFeedback: faker.number.int({ min: 0, max: 50 }),
      negativeFeedback: faker.number.int({ min: 0, max: 10 }),
      averageProcessingTime: faker.number.int({ min: 30, max: 300 }),
    });
  }
  
  return metrics;
};

export const generateAllMockData = () => {
  console.log('Starting mock data generation...');
  try {
    const customers = generateCustomers(100); // Reduced from 1200
    console.log('Generated customers:', customers.length);
    
    const invoices = generateInvoices(100, customers); // Reduced from 1200
    console.log('Generated invoices:', invoices.length);
    
    const agentMetrics = generateAgentMetrics(100); // Reduced from 1200
    console.log('Generated metrics:', agentMetrics.length);
    
    return {
      customers,
      invoices,
      agentMetrics,
      countries,
    };
  } catch (error) {
    console.error('Error in generateAllMockData:', error);
    throw error;
  }
};