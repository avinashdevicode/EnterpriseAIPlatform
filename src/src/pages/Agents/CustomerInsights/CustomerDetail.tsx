import { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Paper,
  Grid,
  Button,
  CircularProgress,
  Alert,
  Chip,
  List,
  ListItem,
  ListItemText,
  Divider,
  Card,
  CardContent,
} from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SendIcon from '@mui/icons-material/Send';
import { Customer } from '../../../types';
import { formatCurrency } from '../../../utils/formatters';
import { useStore } from '../../../store/useStore';

export const CustomerDetail = () => {
  const { customerId } = useParams<{ customerId: string }>();
  const navigate = useNavigate();
  const { t } = useTranslation(['customer', 'common']);
  const { settings } = useStore();
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionMessage, setActionMessage] = useState('');

  useEffect(() => {
    fetchCustomer();
  }, [customerId]);

  const fetchCustomer = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/customers/${customerId}`);
      const data = await response.json();
      setCustomer(data);
    } catch (error) {
      console.error('Error fetching customer:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (action: string) => {
    if (!customer) return;

    try {
      const response = await fetch(`/api/customers/${customerId}/action`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action,
          user: 'Current User',
        }),
      });

      const updatedCustomer = await response.json();
      setCustomer(updatedCustomer);
      setActionMessage(t('customer:actionSuccess'));
      setTimeout(() => setActionMessage(''), 3000);
    } catch (error) {
      console.error('Error performing action:', error);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!customerId || !customer) {
    return (
      <Container>
        <Alert severity="error">{!customerId ? 'Invalid customer ID' : 'Customer not found'}</Alert>
        <Button onClick={() => navigate(-1)} sx={{ mt: 2 }}>
          Go Back
        </Button>
      </Container>
    );
  }

  // Mock trend data
  const pendingOrders = Math.floor(Math.random() * 10) + 1;
  const mockActions = [
    { id: '1', action: 'Account Created', timestamp: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toLocaleDateString(), user: 'System' },
    { id: '2', action: 'Credit Limit Approved', timestamp: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toLocaleDateString(), user: 'John Smith' },
    { id: '3', action: 'Payment Received', timestamp: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toLocaleDateString(), user: 'System' },
    { id: '4', action: 'Invoice Generated', timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toLocaleDateString(), user: 'System' },
  ];
  const trendData = [
    { month: 'Jan 2023', balance: (customer.balance || 0) * 0.7, orders: pendingOrders * 0.5 },
    { month: 'Apr 2023', balance: (customer.balance || 0) * 0.8, orders: pendingOrders * 0.7 },
    { month: 'Jul 2023', balance: (customer.balance || 0) * 0.9, orders: pendingOrders * 0.8 },
    { month: 'Oct 2023', balance: (customer.balance || 0) * 0.85, orders: pendingOrders * 0.9 },
    { month: 'Jan 2024', balance: (customer.balance || 0) * 0.95, orders: pendingOrders * 0.95 },
    { month: 'Apr 2024', balance: customer.balance || 0, orders: pendingOrders },
  ];

  return (
    <Container maxWidth="xl">
      <Box sx={{ mb: 3 }}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/agents/customer-insights')}
          sx={{ mb: 2 }}
        >
          Back to Customers
        </Button>
        <Typography variant="h4" gutterBottom>
          {t('customer:details')}
        </Typography>
        <Typography variant="h6" color="text.secondary">
          {customer.customer_name || customer.name}
        </Typography>
      </Box>

      {actionMessage && (
        <Alert severity="success" sx={{ mb: 3 }}>
          {actionMessage}
        </Alert>
      )}

      {(customer.credit_score || customer.creditScore || 0) < 600 && (
        <Alert severity="warning" sx={{ mb: 3 }}>
          {t('customer:lowCreditWarning')}
        </Alert>
      )}

      <Grid container spacing={3}>
        <Grid item size={{ xs: 12, md: 6 }}>
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              Customer Information
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Typography variant="caption" color="text.secondary">
                  {t('customer:id')}
                </Typography>
                <Typography>{customer.customer_id || customer.id}</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="caption" color="text.secondary">
                  {t('customer:email')}
                </Typography>
                <Typography>{customer.email || 'N/A'}</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="caption" color="text.secondary">
                  {t('customer:phone')}
                </Typography>
                <Typography>{customer.phone || 'N/A'}</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="caption" color="text.secondary">
                  {t('customer:region')}
                </Typography>
                <Typography>{customer.region}</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="caption" color="text.secondary">
                  {t('customer:creditScore')}
                </Typography>
                <Chip
                  label={customer.credit_score || customer.creditScore || 0}
                  color={(customer.credit_score || customer.creditScore || 0) >= 700 ? 'success' : (customer.credit_score || customer.creditScore || 0) >= 600 ? 'warning' : 'error'}
                />
              </Grid>
            </Grid>
          </Paper>

          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <Card>
                <CardContent>
                  <Typography variant="caption" color="text.secondary">
                    {t('customer:accountsPayable')}
                  </Typography>
                  <Typography variant="h6">
                    {formatCurrency(customer.accounts_payable || customer.accountsPayable || 0, 'USD', settings.language)}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Card>
                <CardContent>
                  <Typography variant="caption" color="text.secondary">
                    {t('customer:accountsReceivable')}
                  </Typography>
                  <Typography variant="h6">
                    {formatCurrency(customer.accounts_receivable || customer.accountsReceivable || 0, 'USD', settings.language)}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Card>
                <CardContent>
                  <Typography variant="caption" color="text.secondary">
                    {t('customer:balance')}
                  </Typography>
                  <Typography variant="h6" color={customer.balance >= 0 ? 'success.main' : 'error.main'}>
                    {formatCurrency(customer.balance, 'USD', settings.language)}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Card>
                <CardContent>
                  <Typography variant="caption" color="text.secondary">
                    {t('customer:pendingOrders')}
                  </Typography>
                  <Typography variant="h6">{pendingOrders}</Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Grid>

        <Grid item size={{ xs: 12, md: 6 }}>
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              {t('customer:actions')}
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Button
                  fullWidth
                  variant="outlined"
                  color="warning"
                  onClick={() => handleAction('Suggest Close Orders')}
                  disabled={(customer.credit_score || customer.creditScore || 0) >= 600}
                >
                  {t('customer:suggestCloseOrders')}
                </Button>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Button
                  fullWidth
                  variant="outlined"
                  color="error"
                  onClick={() => handleAction('Trigger Close Order')}
                  disabled={(customer.credit_score || customer.creditScore || 0) >= 600}
                >
                  {t('customer:triggerCloseOrder')}
                </Button>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Button
                  fullWidth
                  variant="outlined"
                  startIcon={<SendIcon />}
                  onClick={() => handleAction('Send Payment Email')}
                >
                  {t('customer:sendPaymentEmail')}
                </Button>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Button
                  fullWidth
                  variant="outlined"
                  startIcon={<SendIcon />}
                  onClick={() => handleAction('Send Receivable Email')}
                >
                  {t('customer:sendReceivableEmail')}
                </Button>
              </Grid>
            </Grid>
          </Paper>

          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              {t('customer:actionHistory')}
            </Typography>
            <List>
              {mockActions.map((action: any) => (
                <div key={action.id}>
                  <ListItem>
                    <ListItemText
                      primary={action.action}
                      secondary={`${action.timestamp} - ${action.user}`}
                    />
                  </ListItem>
                  <Divider />
                </div>
              ))}
            </List>
          </Paper>
        </Grid>

        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              {t('customer:trends')} (2023-2025)
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="balance" stroke="#4a90e2" name="Balance" />
                <Line type="monotone" dataKey="orders" stroke="#50c878" name="Orders" />
              </LineChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};