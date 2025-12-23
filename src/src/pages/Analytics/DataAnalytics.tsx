import { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Paper,
  Grid,
  TextField,
  MenuItem,
  Card,
  CardContent,
  CircularProgress,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { Invoice } from '../../types';
import { formatCurrency, formatNumber } from '../../utils/formatters';
import { useStore } from '../../store/useStore';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import DescriptionIcon from '@mui/icons-material/Description';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import TimerIcon from '@mui/icons-material/Timer';

const COLORS = ['#4a90e2', '#50c878', '#f39c12', '#e74c3c', '#9b59b6', '#1abc9c', '#34495e'];

export const DataAnalytics = () => {
  const { t } = useTranslation(['analytics', 'common']);
  const { settings } = useStore();
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    dateFrom: new Date('2023-01-01'),
    dateTo: new Date('2025-12-31'),
    country: 'all',
    agent: 'all',
  });

  useEffect(() => {
    fetchData();
  }, [filters]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filters.dateFrom) params.append('from', filters.dateFrom.toISOString());
      if (filters.dateTo) params.append('to', filters.dateTo.toISOString());
      if (filters.country !== 'all') params.append('country', filters.country);

      const response = await fetch(`/api/invoices?${params.toString()}`);
      const data = await response.json();
      setInvoices(data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Calculate KPIs
  const totalInvoices = invoices.length;
  const validatedCount = invoices.filter((inv) =>
    ['validated', 'sent_for_approval', 'approved', 'assigned_to_payments', 'paid'].includes(inv.stage)
  ).length;
  const approvedCount = invoices.filter((inv) =>
    ['approved', 'assigned_to_payments', 'paid'].includes(inv.stage)
  ).length;
  const paidCount = invoices.filter((inv) => inv.stage === 'paid').length;

  const validatedRate = totalInvoices > 0 ? (validatedCount / totalInvoices) * 100 : 0;
  const approvedRate = totalInvoices > 0 ? (approvedCount / totalInvoices) * 100 : 0;
  const paidRate = totalInvoices > 0 ? (paidCount / totalInvoices) * 100 : 0;

  // Calculate average approval time (mock data)
  const avgApprovalTime = 3.5;

  // Calculate AR and AP
  const accountsReceivable = invoices
    .filter((inv) => inv.stage !== 'paid')
    .reduce((sum, inv) => sum + inv.amount, 0);
  const accountsPayable = invoices
    .filter((inv) => inv.stage === 'paid')
    .reduce((sum, inv) => sum + inv.amount, 0);

  // Monthly invoices data
  const monthlyData = invoices.reduce((acc: any, inv) => {
    const dateStr = inv.date || inv.issueDate;
    if (!dateStr) return acc;
    const date = new Date(dateStr);
    const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    if (!acc[monthKey]) {
      acc[monthKey] = { month: monthKey, count: 0, amount: 0 };
    }
    acc[monthKey].count++;
    acc[monthKey].amount += (inv.amount || 0);
    return acc;
  }, {});

  const monthlyInvoices = Object.values(monthlyData).sort((a: any, b: any) =>
    a.month.localeCompare(b.month)
  );

  // Stage distribution
  const stageData = invoices.reduce((acc: any, inv) => {
    if (!acc[inv.stage]) {
      acc[inv.stage] = 0;
    }
    acc[inv.stage]++;
    return acc;
  }, {});

  const stageDistribution = Object.entries(stageData).map(([stage, count]) => ({
    name: stage,
    value: count as number,
  }));

  // Currency split
  const currencyData = invoices.reduce((acc: any, inv) => {
    if (!acc[inv.currency]) {
      acc[inv.currency] = 0;
    }
    acc[inv.currency] += inv.amount;
    return acc;
  }, {});

  const currencySplit = Object.entries(currencyData).map(([currency, amount]) => ({
    name: currency,
    value: amount as number,
  }));

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Container maxWidth="xl">
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" gutterBottom>
            {t('analytics:title')}
          </Typography>
          <Typography variant="body1" color="text.secondary">
            {t('analytics:subtitle')}
          </Typography>
        </Box>

        <Paper sx={{ p: 3, mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            {t('analytics:filters')}
          </Typography>
          <Grid container spacing={2}>
            <Grid item size={{ xs: 12, sm: 6, md: 3 }}>
              <DatePicker
                label={t('analytics:from')}
                value={filters.dateFrom}
                onChange={(date) => setFilters({ ...filters, dateFrom: date || new Date() })}
                slotProps={{ textField: { fullWidth: true, size: 'small' } }}
              />
            </Grid>
            <Grid item size={{ xs: 12, sm: 6, md: 3 }}>
              <DatePicker
                label={t('analytics:to')}
                value={filters.dateTo}
                onChange={(date) => setFilters({ ...filters, dateTo: date || new Date() })}
                slotProps={{ textField: { fullWidth: true, size: 'small' } }}
              />
            </Grid>
            <Grid item size={{ xs: 12, sm: 6, md: 3 }}>
              <TextField
                fullWidth
                size="small"
                select
                label={t('analytics:country')}
                value={filters.country}
                onChange={(e) => setFilters({ ...filters, country: e.target.value })}
              >
                <MenuItem value="all">{t('common:all')}</MenuItem>
                <MenuItem value="US">United States</MenuItem>
                <MenuItem value="GB">United Kingdom</MenuItem>
                <MenuItem value="DE">Germany</MenuItem>
              </TextField>
            </Grid>
            <Grid item size={{ xs: 12, sm: 6, md: 3 }}>
              <TextField
                fullWidth
                size="small"
                select
                label={t('analytics:agent')}
                value={filters.agent}
                onChange={(e) => setFilters({ ...filters, agent: e.target.value })}
              >
                <MenuItem value="all">{t('common:all')}</MenuItem>
                <MenuItem value="invoice">Invoice Processor</MenuItem>
                <MenuItem value="customer">Customer Insights</MenuItem>
              </TextField>
            </Grid>
          </Grid>
        </Paper>

        <Grid container spacing={3}>
          <Grid item size={{ xs: 12, sm: 6, md: 3 }}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                  <DescriptionIcon color="primary" />
                  <Typography variant="caption" color="text.secondary">
                    {t('analytics:totalInvoices')}
                  </Typography>
                </Box>
                <Typography variant="h4">{formatNumber(totalInvoices, settings.language)}</Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item size={{ xs: 12, sm: 6, md: 3 }}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                  <CheckCircleIcon color="success" />
                  <Typography variant="caption" color="text.secondary">
                    {t('analytics:validatedRate')}
                  </Typography>
                </Box>
                <Typography variant="h4">{validatedRate.toFixed(1)}%</Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item size={{ xs: 12, sm: 6, md: 3 }}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                  <CheckCircleIcon color="success" />
                  <Typography variant="caption" color="text.secondary">
                    {t('analytics:approvedRate')}
                  </Typography>
                </Box>
                <Typography variant="h4">{approvedRate.toFixed(1)}%</Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item size={{ xs: 12, sm: 6, md: 3 }}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                  <TimerIcon color="warning" />
                  <Typography variant="caption" color="text.secondary">
                    {t('analytics:avgApprovalTime')}
                  </Typography>
                </Box>
                <Typography variant="h4">
                  {avgApprovalTime} {t('analytics:days')}
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item size={{ xs: 12, sm: 6 }}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                  <TrendingUpIcon color="success" />
                  <Typography variant="caption" color="text.secondary">
                    {t('analytics:accountsReceivable')}
                  </Typography>
                </Box>
                <Typography variant="h5">
                  {formatCurrency(accountsReceivable, 'USD', settings.language)}
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item size={{ xs: 12, sm: 6 }}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                  <TrendingUpIcon color="error" />
                  <Typography variant="caption" color="text.secondary">
                    {t('analytics:accountsPayable')}
                  </Typography>
                </Box>
                <Typography variant="h5">
                  {formatCurrency(accountsPayable, 'USD', settings.language)}
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item size={{ xs: 12, md: 6 }}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                {t('analytics:monthlyInvoices')}
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={monthlyInvoices}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="count" stroke="#4a90e2" name="Count" />
                </LineChart>
              </ResponsiveContainer>
            </Paper>
          </Grid>

          <Grid item size={{ xs: 12, md: 6 }}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                {t('analytics:stageDistribution')}
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={stageDistribution}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={(entry) => entry.name}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {stageDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </Paper>
          </Grid>

          <Grid item size={{ xs: 12 }}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                {t('analytics:currencySplit')}
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={currencySplit}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="value" fill="#4a90e2" name="Amount" />
                </BarChart>
              </ResponsiveContainer>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </LocalizationProvider>
  );
};
