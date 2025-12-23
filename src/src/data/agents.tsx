import React from 'react';
import DescriptionIcon from '@mui/icons-material/Description';
import PeopleIcon from '@mui/icons-material/People';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';

// This should be moved to a shared location.
interface AgentDocumentationData {
  businessUseCase: string;
  roi: {
    costToBuild: string;
    expectedTokenUtilization: string;
    maintenanceVsBusinessBenefits: string;
    manHoursReduced: string;
  };
  realizationTimeline: string;
}

export interface Agent {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  status: 'active' | 'coming-soon';
  path: string;
  technologies: {
    apps: string[];
    automation: string[];
    aiml: string[];
    integrations: string[];
  };
  businessFunction: string;
  dataSources: string[];
  triggerTypes: string[];
  contact: string;
  document: string;
  countries: string[];
  documentation: AgentDocumentationData;
}

export const agents: Agent[] = [
    {
      id: 'invoice-processor',
      name: 'Invoice Processor',
      description:
        'Automates end-to-end AP/AR invoice handling—ingestion, OCR/validation, 2/3-way match (PO/GR), policy controls, exception routing, approval workflows, and ERP posting.',
      icon: <DescriptionIcon sx={{ fontSize: 48, color: '#4a90e2' }} />,
      status: 'active',
      path: '/agents/invoice-processor',
      technologies: {
        apps: ['SAP S/4HANA AP', 'Oracle Financials', 'Coupa', 'NetSuite'],
        automation: ['Power Automate', 'UiPath'],
        aiml: ['OCR (Azure AI Vision)', 'Anomaly Detection', 'Duplicate Detection'],
        integrations: ['ERP Posting APIs', 'Email Inbox', 'Supplier Portals', 'SFTP/EDI'],
      },
      businessFunction: 'Extended Finance Functions',
      dataSources: ['Supplier invoices (PDF/email/EDI)', 'POs', 'GRNs/Receipts', 'Vendor Master', 'Tax Engine Rules'],
      triggerTypes: ['Email ingestion', 'Portal upload', 'EDI receipt', 'Scheduled batch'],
      contact: 'abc@xyz.com',
      document: '/agents/documentation/invoice-processor',
      countries: ['DE', 'FR', 'IT', 'SE'],
      documentation: {
        businessUseCase: "Automate the entire lifecycle of invoice processing, from receiving and digitizing invoices to matching them with purchase orders and goods receipts, handling exceptions, and posting them to the ERP system. This reduces manual effort, improves accuracy, and accelerates payment cycles.",
        roi: {
            costToBuild: "$50,000 - $80,000",
            expectedTokenUtilization: "1.2M tokens/month (based on 10,000 invoices)",
            maintenanceVsBusinessBenefits: "Maintenance costs are approximately 15% of the build cost annually. Business benefits include a 70-80% reduction in manual processing time, improved data accuracy leading to fewer payment errors, and better supplier relationships.",
            manHoursReduced: "Reduces approximately 1,200 man-hours per month.",
        },
        realizationTimeline: "Initial benefits visible within 3 months of deployment, with full ROI realization expected within 9-12 months."
      }
    },
    {
      id: 'customer-insights',
      name: 'Customer Insights Agent',
      description:
        'Consolidates customer data from CRM, web, product, and support systems; builds segmentation, CLV/attrition models, cohorts, and dashboards; activates insights to CRM/marketing.',
      icon: <PeopleIcon sx={{ fontSize: 48, color: '#50c878' }} />,
      status: 'active',
      path: '/agents/customer-insights',
      technologies: {
        apps: ['Dynamics 365', 'Salesforce', 'HubSpot', 'Adobe Experience Platform'],
        automation: ['Marketing Automation APIs'],
        aiml: ['Propensity Models', 'Churn Prediction', 'LTV', 'RFM', 'Topic Modeling'],
        integrations: ['CDP Connectors', 'CRM APIs', 'Marketing Automation', 'Web Analytics'],
      },
      businessFunction: 'Marketing (cross-functional: Extended Finance & Supply Chain)',
      dataSources: [
        'CRM Accounts/Opportunities',
        'Product Usage/Telemetry',
        'Web Analytics',
        'Support Tickets',
        'Billing/Subscription',
        'Campaigns',
      ],
      triggerTypes: ['CRM updates', 'Customer interactions', 'Campaign events', 'Usage threshold triggers'],
      contact: 'abc@xyz.com',
      document: '/agents/documentation/customer-insights',
      countries: ['US', 'CA', 'GB'],
      documentation: {
        businessUseCase: "Provides a 360-degree view of the customer by unifying data from various sources. It enables proactive customer engagement, reduces churn by identifying at-risk customers, and increases cross-sell/upsell opportunities through intelligent segmentation and personalized marketing campaigns.",
        roi: {
            costToBuild: "$70,000 - $100,000",
            expectedTokenUtilization: "800K tokens/month",
            maintenanceVsBusinessBenefits: "Annual maintenance is around 20% of build cost. Benefits include a 5-10% reduction in customer churn, a 15% increase in marketing campaign effectiveness, and improved customer lifetime value (CLV).",
            manHoursReduced: "Frees up 800 man-hours per month for data analysts and marketing teams.",
        },
        realizationTimeline: "Key insights and dashboards available within 4 months. ROI realization within 12-18 months."
      }
    },
    {
      id: 'order-processor',
      name: 'Order Processor',
      description:
        'Orchestrates quote-to-order intake, validation, credit/hold checks, pricing, ATP/availability, order creation, and downstream fulfillment signaling; tracks exceptions and statuses.',
      icon: <ShoppingCartIcon sx={{ fontSize: 48, color: '#9b59b6' }} />,
      status: 'coming-soon',
      path: '/agents/order-processor',
      technologies: {
        apps: ['SAP SD', 'Oracle Order Management', 'Salesforce CPQ/Orders'],
        automation: ['Power Automate', 'UiPath'],
        aiml: ['ETA Predictions', 'Order Risk Scoring', 'Backorder Prioritization'],
        integrations: ['EDI/API Order Intake', 'WMS', 'Carrier APIs', 'Payment Gateways'],
      },
      businessFunction: 'Supply Chain (touchpoints with Extended Finance Functions)',
      dataSources: [
        'Customer Master',
        'Pricing/Discounts',
        'Product Catalog/BOM',
        'Inventory & ATP',
        'Credit Limits',
        'Shipping/Carrier Rules',
      ],
      triggerTypes: ['Order submission', 'Credit check completion', 'Inventory updates', 'Manual processing'],
      contact: 'abc@xyz.com',
      document: '/agents/documentation/order-processor',
      countries: ['NL', 'AT', 'CH'],
       documentation: {
        businessUseCase: "The Order Processor agent automates the entire order management cycle, from intake to fulfillment. It validates orders, performs credit checks, confirms pricing and availability, and creates orders in the system, significantly speeding up the order-to-cash cycle and reducing manual errors.",
        roi: {
            costToBuild: "$60,000 - $90,000",
            expectedTokenUtilization: "1.5M tokens/month (for 20,000 orders)",
            maintenanceVsBusinessBenefits: "Maintenance at 15% of build cost. Key benefits are a 60% reduction in order processing time, improved order accuracy, and enhanced customer satisfaction due to faster fulfillment.",
            manHoursReduced: "Saves up to 1,500 man-hours per month in the order management team.",
        },
        realizationTimeline: "First phase operational in 4 months. Full ROI expected within 12 months."
      }
    },
    {
      id: 'master-data-management',
      name: 'Master Data Management (MDM) Agent',
      description:
        'Automates creation, validation, deduplication, and governance for master records (Customer, Vendor, Material, Chart of Accounts). Orchestrates approvals and synchronizes golden records across systems.',
      icon: <DescriptionIcon sx={{ fontSize: 48, color: '#f59e0b' }} />,
      status: 'coming-soon',
      path: '/agents/master-data-management',
      technologies: {
        apps: ['SAP S/4HANA MDG', 'Oracle Fusion', 'Informatica MDM', 'Collibra'],
        automation: ['Power Automate', 'UiPath'],
        aiml: ['Azure OpenAI (entity reconciliation)', 'Anomaly Detection'],
        integrations: ['API/ETL via Azure Data Factory', 'Kafka'],
      },
      businessFunction: 'Extended Finance Functions (cross-functional: HR, Supply Chain, Manufacturing)',
      dataSources: ['ERP (SAP/Oracle)', 'CRM (Salesforce)', 'HRIS (Workday)', 'Supplier portals'],
      triggerTypes: ['Request submission', 'New record event', 'Scheduled cleansing'],
      contact: 'abc@xyz.com',
      document: '/agents/documentation/master-data-management',
      countries: ['DE', 'CH', 'AT', 'FR'],
      documentation: {
        businessUseCase: "Ensures data consistency and accuracy across the enterprise by automating the lifecycle of master data. It reduces manual data entry errors, eliminates duplicates, and establishes a single source of truth for critical business data, improving reporting and operational efficiency.",
        roi: {
            costToBuild: "$100,000 - $150,000",
            expectedTokenUtilization: "500K tokens/month",
            maintenanceVsBusinessBenefits: "Maintenance is about 20% of build cost. Benefits include improved data quality, reduced operational risks, and streamlined compliance reporting. The business benefits significantly outweigh the maintenance costs over time.",
            manHoursReduced: "Reduces data stewardship effort by 1,000 man-hours per month.",
        },
        realizationTimeline: "Core data objects governed within 6 months. Full enterprise-wide implementation within 18-24 months."
      }
    },
    {
      id: 'tax-check-requests',
      name: 'Tax Check Requests Agent',
      description:
        'Handles tax determination checks (VAT/GST), WHT validations, certificate management, and request routing to tax team with automated evidence collection.',
      icon: <DescriptionIcon sx={{ fontSize: 48, color: '#8b5cf6' }} />,
      status: 'coming-soon',
      path: '/agents/tax-check-requests',
      technologies: {
        apps: ['Thomson Reuters ONESOURCE', 'Vertex', 'SAP Tax Service'],
        automation: ['Power Automate', 'UiPath'],
        aiml: ['Document Classification', 'Rule-based Decisioning'],
        integrations: ['ERP Tax Engines', 'CRM Orders', 'Vendor Portals'],
      },
      businessFunction: 'Extended Finance Functions',
      dataSources: ['Invoices', 'Purchase Orders', 'Jurisdiction Rules', 'Exemption Certificates'],
      triggerTypes: ['New Invoice/Order', 'Tax Exception', 'Certificate Expiry'],
      contact: 'abc@xyz.com',
      document: '/agents/documentation/tax-check-requests',
      countries: ['IT', 'ES', 'PT', 'BE'],
      documentation: {
        businessUseCase: "Automates the complex process of tax compliance by validating tax information on transactions, managing exemption certificates, and ensuring adherence to local and international tax regulations. It minimizes compliance risks and reduces the burden on the tax team.",
        roi: {
            costToBuild: "$40,000 - $60,000",
            expectedTokenUtilization: "300K tokens/month",
            maintenanceVsBusinessBenefits: "Low maintenance costs. The primary benefit is risk mitigation, avoiding potentially large penalties for non-compliance. Also improves the efficiency of the tax and finance teams.",
            manHoursReduced: "Saves 400 man-hours per month.",
        },
        realizationTimeline: "Implementation in 3-4 months. Immediate benefits in risk reduction."
      }
    },
    {
      id: 'onboarding-provisioning',
      name: 'Onboarding & Provisioning Agent',
      description:
        'Automates preboarding, document collection, HRIS setup, access provisioning, and equipment requests for seamless employee onboarding.',
      icon: <PeopleIcon sx={{ fontSize: 48, color: '#ec4899' }} />,
      status: 'coming-soon',
      path: '/agents/onboarding-provisioning',
      technologies: {
        apps: ['Workday', 'ServiceNow', 'Azure AD', 'DocuSign'],
        automation: ['Power Automate', 'UiPath'],
        aiml: ['Document Processing'],
        integrations: ['HRIS APIs', 'Identity Management', 'IT Service Management'],
      },
      businessFunction: 'Human Resources',
      dataSources: ['Employee Records', 'Policy Documents', 'System Access Requests', 'Equipment Catalog'],
      triggerTypes: ['New Hire Event', 'Offer Acceptance', 'Start Date Trigger'],
      contact: 'abc@xyz.com',
      document: '/agents/documentation/onboarding-provisioning',
      countries: ['GB', 'IE', 'AU', 'NZ'],
      documentation: {
        businessUseCase: "Streamlines the new hire onboarding process by automating account creation, system access, and equipment procurement. This ensures that new employees are productive from day one, improving their onboarding experience and reducing the administrative load on HR and IT teams.",
        roi: {
            costToBuild: "$50,000 - $75,000",
            expectedTokenUtilization: "200K tokens/month",
            maintenanceVsBusinessBenefits: "Maintenance is low. The main benefits are improved employee satisfaction, faster time-to-productivity for new hires, and enhanced security through standardized access control.",
            manHoursReduced: "Reduces onboarding administration by 500 man-hours per month.",
        },
        realizationTimeline: "Operational within 3 months. Positive impact on employee experience is immediate."
      }
    },
    {
      id: 'payroll-variance-controls',
      name: 'Payroll Variance & Controls Agent',
      description:
        'Monitors payroll runs for variances, retro-pay adjustments, and tax changes; raises actionable alerts for finance team review.',
      icon: <DescriptionIcon sx={{ fontSize: 48, color: '#06b6d4' }} />,
      status: 'coming-soon',
      path: '/agents/payroll-variance-controls',
      technologies: {
        apps: ['Workday Payroll', 'ADP', 'Analytics Platforms'],
        automation: ['Power Automate', 'Excel/VBA'],
        aiml: ['Anomaly Detection', 'Predictive Variance Analysis'],
        integrations: ['Payroll APIs', 'GL Integration', 'Bank File APIs'],
      },
      businessFunction: 'Human Resources',
      dataSources: ['Payroll Master Data', 'Tax Rules', 'Deduction Codes', 'GL Mappings'],
      triggerTypes: ['Payroll Run Completion', 'Tax Updates', 'Manual Override'],
      contact: 'abc@xyz.com',
      document: '/agents/documentation/payroll-variance-controls',
      countries: ['US', 'CA', 'MX'],
      documentation: {
        businessUseCase: "Provides an automated layer of control over the payroll process by detecting anomalies and variances before payments are made. This reduces the risk of overpayments or underpayments, ensures compliance, and provides assurance to the finance and HR teams.",
        roi: {
            costToBuild: "$45,000 - $65,000",
            expectedTokenUtilization: "400K tokens/month",
            maintenanceVsBusinessBenefits: "Low maintenance. Key benefits are financial control, risk reduction, and improved payroll accuracy. It helps prevent costly errors that can impact employee morale.",
            manHoursReduced: "Saves 300 man-hours of manual checking per month.",
        },
        realizationTimeline: "Live within 3 months. Risk reduction benefits are realized immediately."
      }
    },
    {
      id: 'talent-acquisition-screening',
      name: 'Talent Acquisition Screening Agent',
      description:
        'Screens candidates for eligibility and compliance, detects duplicates, and automatically schedules interviews based on qualifications.',
      icon: <PeopleIcon sx={{ fontSize: 48, color: '#10b981' }} />,
      status: 'coming-soon',
      path: '/agents/talent-acquisition-screening',
      technologies: {
        apps: ['Workday Recruiting', 'Greenhouse', 'Calendaring APIs'],
        automation: ['Power Automate', 'UiPath'],
        aiml: ['Azure OpenAI (CV parsing)', 'Candidate Matching'],
        integrations: ['ATS APIs', 'Email/Calendar Integration', 'Background Check APIs'],
      },
      businessFunction: 'Human Resources',
      dataSources: ['Job Requisitions', 'Applicant Data', 'Background Check Results', 'Interview Feedback'],
      triggerTypes: ['Application Submission', 'Interview Feedback', 'Offer Decision'],
      contact: 'abc@xyz.com',
      document: '/agents/documentation/talent-acquisition-screening',
      countries: ['DE', 'NL', 'BE', 'CZ'],
      documentation: {
        businessUseCase: "Accelerates the hiring process by automating the initial screening of candidates. It parses resumes, matches qualifications to job requirements, and schedules interviews with qualified candidates, allowing recruiters to focus on high-value interactions.",
        roi: {
            costToBuild: "$55,000 - $80,000",
            expectedTokenUtilization: "1M tokens/month (for high volume recruiting)",
            maintenanceVsBusinessBenefits: "Maintenance at 15%. Benefits include a 50% reduction in time-to-hire, improved quality of candidates, and a better candidate experience.",
            manHoursReduced: "Saves 800 man-hours for the recruitment team per month.",
        },
        realizationTimeline: "Operational in 4 months. Time-to-hire reduction seen in the first hiring cycles."
      }
    },
    {
      id: 'demand-inventory-rebalancing',
      name: 'Demand & Inventory Rebalancing Agent',
      description:
        'Detects stockouts and overstock situations, proposes inventory transfers or re-orders using real-time demand signals and forecasts.',
      icon: <ShoppingCartIcon sx={{ fontSize: 48, color: '#f97316' }} />,
      status: 'coming-soon',
      path: '/agents/demand-inventory-rebalancing',
      technologies: {
        apps: ['SAP IBP', 'Oracle SCP', 'Kinaxis'],
        automation: ['Power Automate', 'RPA'],
        aiml: ['Demand Forecasting', 'Optimization Models'],
        integrations: ['WMS APIs', 'ERP Integration', 'Sales Order Data'],
      },
      businessFunction: 'Supply Chain',
      dataSources: ['Sales Orders', 'Inventory Levels', 'Demand Forecasts', 'Lead Times', 'Supplier Capacity'],
      triggerTypes: ['Inventory Threshold Alert', 'Demand Spike', 'Scheduled Rebalancing'],
      contact: 'abc@xyz.com',
      document: '/agents/documentation/demand-inventory-rebalancing',
      countries: ['FR', 'DE', 'NL', 'CH'],
      documentation: {
        businessUseCase: "Optimizes inventory levels across the supply chain by predicting demand and identifying imbalances. It helps prevent stockouts that lead to lost sales and reduces carrying costs from overstock situations, improving overall capital efficiency.",
        roi: {
            costToBuild: "$80,000 - $120,000",
            expectedTokenUtilization: "2M tokens/month",
            maintenanceVsBusinessBenefits: "Maintenance at 20%. Benefits include a 5-15% reduction in inventory carrying costs, a 10% reduction in stockouts, and improved planner productivity.",
            manHoursReduced: "Automates 1,000 man-hours of manual analysis per month.",
        },
        realizationTimeline: "Forecasting models tuned in 6 months. Inventory reduction benefits seen within 9-12 months."
      }
    },
    {
      id: 'supplier-risk-compliance',
      name: 'Supplier Risk & Compliance Agent',
      description:
        'Monitors supplier SLAs, delivery performance, certification expiries, and ESG flags to maintain supply chain compliance and reduce risk.',
      icon: <DescriptionIcon sx={{ fontSize: 48, color: '#ef4444' }} />,
      status: 'coming-soon',
      path: '/agents/supplier-risk-compliance',
      technologies: {
        apps: ['Ariba', 'Coupa', 'SAP Risk Management'],
        automation: ['Power Automate', 'UiPath'],
        aiml: ['Risk Scoring Models', 'Anomaly Detection'],
        integrations: ['Supplier Portal APIs', 'Certification Databases', 'Communication Tools'],
      },
      businessFunction: 'Supply Chain',
      dataSources: ['Supplier Master', 'Purchase Orders', 'Delivery Records', 'Quality Inspections', 'Certification Databases'],
      triggerTypes: ['SLA Breach', 'Certification Expiry', 'Quality Issue', 'ESG Flag'],
      contact: 'abc@xyz.com',
      document: '/agents/documentation/supplier-risk-compliance',
      countries: ['PL', 'HU', 'RO', 'SK'],
      documentation: {
        businessUseCase: "Proactively manages supplier risk by monitoring performance, compliance, and external risk factors. It helps ensure business continuity, protects brand reputation, and supports ethical sourcing goals by providing timely alerts and insights.",
        roi: {
            costToBuild: "$60,000 - $85,000",
            expectedTokenUtilization: "700K tokens/month",
            maintenanceVsBusinessBenefits: "Maintenance at 15%. The main benefit is risk mitigation, which can prevent significant financial and reputational damage. Also improves supplier performance through continuous monitoring.",
            manHoursReduced: "Saves 600 man-hours of supplier management effort per month.",
        },
        realizationTimeline: "Live in 4-5 months. Risk dashboard and alerts provide immediate value."
      }
    },
    {
      id: 'returns-rma-orchestration',
      name: 'Returns & RMA Orchestration Agent',
      description:
        'Automates returns approval workflows, generates shipping labels, captures inspection outcomes, and processes credit notes efficiently.',
      icon: <ShoppingCartIcon sx={{ fontSize: 48, color: '#6366f1' }} />,
      status: 'coming-soon',
      path: '/agents/returns-rma-orchestration',
      technologies: {
        apps: ['SAP ERP', 'Oracle WMS', 'Shopify/Magento'],
        automation: ['Power Automate', 'UiPath'],
        aiml: ['Return Reason Classification', 'Fraud Detection'],
        integrations: ['WMS APIs', 'Carrier APIs', 'Financial Systems', 'Email Notifications'],
      },
      businessFunction: 'Supply Chain',
      dataSources: ['Return Authorizations', 'Inspection Reports', 'Carrier Data', 'Customer Orders'],
      triggerTypes: ['Return Request', 'Inspection Completion', 'Carrier Pickup', 'Credit Note Trigger'],
      contact: 'abc@xyz.com',
      document: '/agents/documentation/returns-rma-orchestration',
      countries: ['SE', 'NO', 'DK', 'FI'],
      documentation: {
        businessUseCase: "Manages the reverse logistics process by automating return merchandise authorizations (RMA). It improves the customer experience with a smooth returns process and provides valuable data on return reasons, helping to identify product or process issues.",
        roi: {
            costToBuild: "$50,000 - $70,000",
            expectedTokenUtilization: "600K tokens/month",
            maintenanceVsBusinessBenefits: "Low maintenance. Benefits include improved customer loyalty, faster processing of credits, and better data for root cause analysis of returns.",
            manHoursReduced: "Reduces manual processing by 700 man-hours per month.",
        },
        realizationTimeline: "Operational in 3-4 months. Customer experience improvement is immediate."
      }
    },
    {
      id: 'campaign-compliance-tagging',
      name: 'Campaign Compliance & Tagging Agent',
      description:
        'Validates marketing assets against brand and regulatory requirements, applies automatic tagging for Digital Asset Management systems.',
      icon: <DescriptionIcon sx={{ fontSize: 48, color: '#ec4899' }} />,
      status: 'coming-soon',
      path: '/agents/campaign-compliance-tagging',
      technologies: {
        apps: ['Adobe Experience Cloud', 'CMS/DAM Systems'],
        automation: ['Power Automate', 'Workflow Automation'],
        aiml: ['Azure OpenAI (content validation)', 'Image Recognition', 'Brand Compliance Checking'],
        integrations: ['DAM APIs', 'Campaign Management APIs', 'Compliance Databases'],
      },
      businessFunction: 'Marketing',
      dataSources: ['Brand Guidelines', 'Regulatory Requirements', 'Campaign Assets', 'Audit Trails'],
      triggerTypes: ['Asset Upload', 'Campaign Launch', 'Compliance Review', 'Scheduled Audit'],
      contact: 'abc@xyz.com',
      document: '/agents/documentation/campaign-compliance-tagging',
      countries: ['GB', 'FR', 'DE', 'IT'],
      documentation: {
        businessUseCase: "Ensures all marketing materials are compliant with brand guidelines and legal regulations before launch. It automates the review and tagging of assets, reducing the risk of brand damage or legal issues and improving the efficiency of marketing operations.",
        roi: {
            costToBuild: "$40,000 - $60,000",
            expectedTokenUtilization: "800K tokens/month (for image and text analysis)",
            maintenanceVsBusinessBenefits: "Primary benefit is risk mitigation. It also improves brand consistency and accelerates campaign launches by streamlining the review process.",
            manHoursReduced: "Saves 400 man-hours of manual review per month.",
        },
        realizationTimeline: "Live in 3 months. Ensures compliance for all new campaigns immediately."
      }
    },
    {
      id: 'lead-scoring-routing',
      name: 'Lead Scoring & Routing Agent',
      description:
        'Scores leads based on engagement and fit, routes qualified leads to sales reps by territory and product fit; monitors conversion metrics.',
      icon: <PeopleIcon sx={{ fontSize: 48, color: '#f59e0b' }} />,
      status: 'coming-soon',
      path: '/agents/lead-scoring-routing',
      technologies: {
        apps: ['Salesforce', 'HubSpot', 'Marketo'],
        automation: ['Power Automate', 'Workflow Rules'],
        aiml: ['ML Scoring Models', 'Lead Matching Algorithms'],
        integrations: ['CRM APIs', 'Marketing Automation APIs', 'Analytics Platforms'],
      },
      businessFunction: 'Marketing',
      dataSources: ['Lead Records', 'Engagement Data', 'Product Catalog', 'Sales Territory Data'],
      triggerTypes: ['New Lead Creation', 'Engagement Event', 'Score Threshold', 'Manual Assignment'],
      contact: 'abc@xyz.com',
      document: '/agents/documentation/lead-scoring-routing',.
      countries: ['CA', 'US', 'NL', 'CH'],
      documentation: {
        businessUseCase: "Improves sales efficiency by automatically scoring and routing leads to the most appropriate sales representative. This ensures that high-potential leads are acted upon quickly, increasing conversion rates and aligning sales and marketing efforts.",
        roi: {
            costToBuild: "$50,000 - $70,000",
            expectedTokenUtilization: "500K tokens/month",
            maintenanceVsBusinessBenefits: "Maintenance at 15%. Benefits include a 10-20% increase in lead conversion rates, improved sales productivity, and better alignment between marketing spend and sales outcomes.",
            manHoursReduced: "Eliminates 300 man-hours of manual lead assignment per month.",
        },
        realizationTimeline: "Scoring models effective within 3 months. Conversion uplift seen within 6 months."
      }
    },
    {
      id: 'event-roi-attribution',
      name: 'Event ROI & Attribution Agent',
      description:
        'Tracks event registrations through to pipeline and revenue, provides multi-touch attribution reporting for marketing effectiveness measurement.',
      icon: <DescriptionIcon sx={{ fontSize: 48, color: '#06b6d4' }} />,
      status: 'coming-soon',
      path: '/agents/event-roi-attribution',
      technologies: {
        apps: ['Salesforce', 'Marketing Automation Platforms', 'BI Tools'],
        automation: ['Power Automate', 'Scheduled Reporting'],
        aiml: ['Attribution Modeling', 'Predictive Analytics'],
        integrations: ['Event Management APIs', 'CRM APIs', 'Analytics APIs', 'BI Platform APIs'],
      },
      businessFunction: 'Marketing',
      dataSources: ['Event Registration Data', 'CRM Pipeline', 'Revenue Records', 'Campaign Performance Data'],
      triggerTypes: ['Event Completion', 'Deal Close', 'Monthly Review', 'Executive Reporting'],
      contact: 'abc@xyz.com',
      document: '/agents/documentation/event-roi-attribution',
      countries: ['DE', 'AT', 'CH', 'IT'],
      documentation: {
        businessUseCase: "Provides clear visibility into the return on investment (ROI) of marketing events by tracking their influence on the sales pipeline. It helps marketing leaders make data-driven decisions about which events to invest in and how to optimize their marketing mix.",
        roi: {
            costToBuild: "$40,000 - $60,000",
            expectedTokenUtilization: "300K tokens/month",
            maintenanceVsBusinessBenefits: "The primary benefit is improved marketing effectiveness and budget allocation. It provides the data needed to justify marketing spend and optimize future investments.",
            manHoursReduced: "Automates 250 man-hours of manual data collection and reporting per month.",
        },
        realizationTimeline: "Attribution reports available after the first full quarter of data. Full ROI seen in budget optimization over 12 months."
      }
    },
    {
      id: 'quality-ncr',
      name: 'Quality Non-Conformance (NCR) Agent',
      description:
        'Captures non-conformance events, initiates Corrective Action and Preventive Action (CAPA) workflows, tracks resolutions and trend analysis.',
      icon: <DescriptionIcon sx={{ fontSize: 48, color: '#ef4444' }} />,
      status: 'coming-soon',
      path: '/agents/quality-ncr',
      technologies: {
        apps: ['MES/QMS (Dassault, Siemens)', 'SAP Quality'],
        automation: ['Power Automate', 'UiPath'],
        aiml: ['Trend Analysis', 'Root Cause Classification'],
        integrations: ['MES APIs', 'Analytics Platforms', 'Email/Notification Systems'],
      },
      businessFunction: 'Manufacturing',
      dataSources: ['Quality Inspection Data', 'Production Records', 'Supplier Quality', 'Corrective Actions'],
      triggerTypes: ['Inspection Failure', 'Manual NC Report', 'Supplier Alert', 'CAPA Completion'],
      contact: 'abc@xyz.com',
      document: '/agents/documentation/quality-ncr',
      countries: ['DE', 'CZ', 'PL', 'AT'],
      documentation: {
        businessUseCase: "Streamlines the management of non-conformance and corrective actions in manufacturing. It ensures that quality issues are documented, addressed, and tracked systematically, leading to improved product quality and compliance with industry standards.",
        roi: {
            costToBuild: "$50,000 - $75,000",
            expectedTokenUtilization: "400K tokens/month",
            maintenanceVsBusinessBenefits: "Benefits include reduced cost of poor quality, improved compliance, and better visibility into quality trends. These benefits far exceed the maintenance cost.",
            manHoursReduced: "Reduces administrative overhead in quality management by 500 man-hours per month.",
        },
        realizationTimeline: "Live in 4 months. Quality trend data becomes valuable after 6-9 months."
      }
    },
    {
      id: 'production-scheduling-optimization',
      name: 'Production Scheduling Optimization Agent',
      description:
        'Re-optimizes production schedules based on machine availability, BOM constraints, and urgent orders to maximize efficiency and meet deadlines.',
      icon: <ShoppingCartIcon sx={{ fontSize: 48, color: '#8b5cf6' }} />,
      status: 'coming-soon',
      path: '/agents/production-scheduling-optimization',
      technologies: {
        apps: ['SAP APS', 'Kinaxis', 'Aspen PIMS'],
        automation: ['Power Automate', 'Scheduler APIs'],
        aiml: ['Optimization Algorithms', 'Constraint-based Scheduling'],
        integrations: ['MES APIs', 'ERP Integration', 'Machine Data APIs'],
      },
      businessFunction: 'Manufacturing',
      dataSources: ['Production Orders', 'Machine Capacity', 'BOM Data', 'Material Availability', 'Demand Signals'],
      triggerTypes: ['New Order Receipt', 'Machine Downtime', 'Material Shortage', 'Schedule Review'],
      contact: 'abc@xyz.com',
      document: '/agents/documentation/production-scheduling-optimization',
      countries: ['SK', 'HU', 'RO', 'IT'],
      documentation: {
        businessUseCase: "Improves manufacturing efficiency and throughput by dynamically optimizing production schedules. It responds to real-time events like machine downtime or urgent orders, ensuring that production targets are met while minimizing costs.",
        roi: {
            costToBuild: "$90,000 - $130,000",
            expectedTokenUtilization: "1.5M tokens/month",
            maintenanceVsBusinessBenefits: "Benefits include a 5-10% improvement in Overall Equipment Effectiveness (OEE), reduced lead times, and better on-time delivery performance. These operational improvements provide a strong ROI.",
            manHoursReduced: "Frees up 800 man-hours for production planners per month.",
        },
        realizationTimeline: "Initial scheduling improvements in 6 months. Full optimization benefits realized over 12-18 months."
      }
    },
    {
      id: 'maintenance-predictive-alerts',
      name: 'Maintenance Predictive Alerts Agent',
      description:
        'Predicts equipment failures using sensor data and machine learning; schedules preventive maintenance tasks to minimize unplanned downtime.',
      icon: <DescriptionIcon sx={{ fontSize: 48, color: '#10b981' }} />,
      status: 'coming-soon',
      path: '/agents/maintenance-predictive-alerts',
      technologies: {
        apps: ['IoT Platforms (Azure IoT)', 'CMMS (Maximo, Infor)', 'Sensors/SCADA'],
        automation: ['Power Automate', 'UiPath'],
        aiml: ['ML Anomaly Detection', 'Predictive Maintenance Models', 'Time Series Analysis'],
        integrations: ['Sensor Data APIs', 'CMMS APIs', 'Alerting Systems', 'Work Order Automation'],
      },
      businessFunction: 'Manufacturing',
      dataSources: ['Equipment Sensor Data', 'Maintenance History', 'Machine Specifications', 'Performance Metrics'],
      triggerTypes: ['Anomaly Detection', 'Sensor Threshold Alert', 'Maintenance Due', 'Equipment Failure'],
      contact: 'abc@xyz.com',
      document: '/agents/documentation/maintenance-predictive-alerts',
      countries: ['US', 'GB', 'FR', 'DE'],
      documentation: {
        businessUseCase: "Reduces unplanned downtime and maintenance costs by predicting equipment failures before they happen. It allows maintenance to be scheduled proactively, extending asset life and improving operational stability.",
        roi: {
            costToBuild: "$100,000 - $160,000",
            expectedTokenUtilization: "3M tokens/month (for high-frequency sensor data)",
            maintenanceVsBusinessBenefits: "The primary benefit is the avoidance of costly unplanned downtime, which can run into millions of dollars per year. The ROI is typically very high for manufacturing operations.",
            manHoursReduced: "Improves maintenance team efficiency by 20-30%, equivalent to over 1,000 man-hours per month.",
        },
        realizationTimeline: "Accurate predictions after 6-9 months of data collection and model training. Downtime reduction benefits grow over time."
      }
    },
];