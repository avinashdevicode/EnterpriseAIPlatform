import { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  MenuItem,
  Button,
  Chip,
  Grid,
  CircularProgress,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { Invoice, InvoiceStage } from '../../../types';
import { formatCurrency, formatDate } from '../../../utils/formatters';
import { useStore } from '../../../store/useStore';

const stages: InvoiceStage[] = [
  'received',
  'extracted',
  'validated',
  'sent_for_approval',
  'approved',
  'assigned_to_payments',
  'paid',
];

export const InvoiceList = () => {
  const navigate = useNavigate();
  const { t } = useTranslation(['invoice', 'common']);
  const { settings } = useStore();
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    dateFrom: null as Date | null,
    dateTo: null as Date | null,
    customer: '',
    stage: 'all',
    country: 'all',
  });

  useEffect(() => {
    fetchInvoices();
  }, [filters]);

  const fetchInvoices = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filters.customer) params.append('customer', filters.customer);
      if (filters.stage !== 'all') params.append('stage', filters.stage);
      if (filters.country !== 'all') params.append('country', filters.country);
      if (filters.dateFrom) params.append('from', filters.dateFrom.toISOString());
      if (filters.dateTo) params.append('to', filters.dateTo.toISOString());

      const response = await fetch(`/api/invoices?${params.toString()}`);
      const data = await response.json();
      setInvoices(data);
    } catch (error) {
      console.error('Error fetching invoices:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStageColor = (stage: InvoiceStage) => {
    const colors: Record<InvoiceStage, any> = {
      received: 'default',
      extracted: 'info',
      validated: 'primary',
      sent_for_approval: 'warning',
      approved: 'success',
      assigned_to_payments: 'secondary',
      paid: 'success',
    };
    return colors[stage];
  };

  const getRiskColor = (score: number) => {
    if (score >= 70) return 'error';
    if (score >= 40) return 'warning';
    return 'success';
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Container maxWidth="xl">
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" gutterBottom>
            {t('invoice:title')}
          </Typography>
          <Typography variant="body1" color="text.secondary">
            {t('invoice:subtitle')}
          </Typography>
        </Box>

        <Paper sx={{ p: 3, mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            {t('common:filter')}
          </Typography>
          <Grid container spacing={2}>
            <Grid item size={{ xs: 12, sm: 6, md: 3 }}>
              <DatePicker
                label={t('invoice:filters.dateRange') + ' - From'}
                value={filters.dateFrom}
                onChange={(date) => setFilters({ ...filters, dateFrom: date })}
                slotProps={{ textField: { fullWidth: true, size: 'small' } }}
              />
            </Grid>
            <Grid item size={{ xs: 12, sm: 6, md: 3 }}>
              <DatePicker
                label={t('invoice:filters.dateRange') + ' - To'}
                value={filters.dateTo}
                onChange={(date) => setFilters({ ...filters, dateTo: date })}
                slotProps={{ textField: { fullWidth: true, size: 'small' } }}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={2}>
              <TextField
                fullWidth
                size="small"
                label={t('invoice:filters.customer')}
                value={filters.customer}
                onChange={(e) => setFilters({ ...filters, customer: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={2}>
              <TextField
                fullWidth
                size="small"
                select
                label={t('invoice:filters.stage')}
                value={filters.stage}
                onChange={(e) => setFilters({ ...filters, stage: e.target.value })}
              >
                <MenuItem value="all">{t('common:all')}</MenuItem>
                {stages.map((stage) => (
                  <MenuItem key={stage} value={stage}>
                    {t(`invoice:stages.${stage}`)}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6} md={2}>
              <Button
                fullWidth
                variant="outlined"
                onClick={() =>
                  setFilters({
                    dateFrom: null,
                    dateTo: null,
                    customer: '',
                    stage: 'all',
                    country: 'all',
                  })
                }
              >
                {t('common:reset')}
              </Button>
            </Grid>
          </Grid>
        </Paper>

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
            <CircularProgress />
          </Box>
        ) : (
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>{t('invoice:id')}</TableCell>
                  <TableCell>{t('invoice:customer')}</TableCell>
                  <TableCell>{t('invoice:amount')}</TableCell>
                  <TableCell>{t('invoice:issueDate')}</TableCell>
                  <TableCell>{t('invoice:dueDate')}</TableCell>
                  <TableCell>{t('invoice:stage')}</TableCell>
                  <TableCell>{t('invoice:riskScore')}</TableCell>
                  <TableCell>{t('common:actions')}</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {invoices.map((invoice, idx) => (
                  <TableRow key={invoice.invoice_id || idx} hover>
                    <TableCell>{invoice.invoice_number || invoice.id}</TableCell>
                    <TableCell>{invoice.customer_name || invoice.customerName}</TableCell>
                    <TableCell>
                      {formatCurrency(invoice.amount, invoice.currency, settings.language)}
                    </TableCell>
                    <TableCell>{formatDate(invoice.date, settings.language, 'PP')}</TableCell>
                    <TableCell>{formatDate(invoice.due_date, settings.language, 'PP')}</TableCell>
                    <TableCell>
                      <Chip
                        label={t(`invoice:stages.${invoice.stage}`)}
                        color={getStageColor(invoice.stage)}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={invoice.riskScore}
                        color={getRiskColor(invoice.riskScore)}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <Button
                        size="small"
                        variant="outlined"
                        onClick={() => navigate(`/agents/invoice-processor/${invoice.invoice_id || invoice.id}`)}
                      >
                        {t('common:view')}
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Container>
    </LocalizationProvider>
  );
};