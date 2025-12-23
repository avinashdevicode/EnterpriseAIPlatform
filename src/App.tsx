import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import { MainLayout } from './src/components/Layout/MainLayout';
import { Login } from './src/pages/Login/Login';
import { AgentsList } from './src/pages/Agents/AgentsList';
import AgentDocumentation from './src/pages/Agents/AgentDocumentation';
import { InvoiceList } from './src/pages/Agents/InvoiceProcessor/InvoiceList';
import { InvoiceWorkflow } from './src/pages/Agents/InvoiceProcessor/InvoiceWorkflow';
import { CustomerList } from './src/pages/Agents/CustomerInsights/CustomerList';
import { CustomerDetail } from './src/pages/Agents/CustomerInsights/CustomerDetail';
import { OrderList } from './src/pages/Agents/OrderProcessor/OrderList';
import { DataAnalytics } from './src/pages/Analytics/DataAnalytics';
import { AgentMetrics } from './src/pages/Metrics/AgentMetrics';
import { GlobalOverview } from './src/pages/Metrics/GlobalOverview';
import { AgentFinancials } from './src/pages/Metrics/AgentFinancials';
import { FutureRoadmap } from './src/pages/Metrics/FutureRoadmap';
import { Settings } from './src/pages/Settings/Settings';
import { useStore } from './src/store/useStore';
import './index.css';

const theme = createTheme({
  palette: {
    primary: {
      main: '#4a90e2',
    },
    secondary: {
      main: '#50c878',
    },
    background: {
      default: '#f5f6fa',
      paper: '#ffffff',
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: 8,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
        },
      },
    },
  },
});

const ProtectedRoute = ({ element }: { element: React.ReactNode }) => {
  const { isLoggedIn } = useStore();
  return isLoggedIn ? element : <Navigate to="/login" replace />;
};

export default function App() {
  const { isLoggedIn } = useStore();

  return (
    <BrowserRouter>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Routes>
          <Route path="/login" element={isLoggedIn ? <Navigate to="/" replace /> : <Login />} />
          <Route path="/" element={<ProtectedRoute element={<MainLayout />} />}>
            <Route index element={<Navigate to="/agents" replace />} />
            <Route path="agents" element={<AgentsList />} />
            <Route path="agents/documentation/:agentId" element={<AgentDocumentation />} />
            <Route path="agents/invoice-processor" element={<InvoiceList />} />
            <Route path="agents/invoice-processor/:invoiceId" element={<InvoiceWorkflow />} />
            <Route path="agents/customer-insights" element={<CustomerList />} />
            <Route path="agents/customer-insights/:customerId" element={<CustomerDetail />} />
            <Route path="agents/order-processor" element={<OrderList />} />
            <Route path="analytics" element={<DataAnalytics />} />
            <Route path="metrics" element={<AgentMetrics />} />
            <Route path="metrics/global" element={<GlobalOverview />} />
            <Route path="metrics/financials" element={<AgentFinancials />} />
            <Route path="metrics/roadmap" element={<FutureRoadmap />} />
            <Route path="settings" element={<Settings />} />
          </Route>
        </Routes>
      </ThemeProvider>
    </BrowserRouter>
  );
}
