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
  Button,
  Chip,
  Grid,
  CircularProgress,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Customer } from '../../../types';
import { formatCurrency, formatDate } from '../../../utils/formatters';
import { useStore } from '../../../store/useStore';
import WarningIcon from '@mui/icons-material/Warning';

export const CustomerList = () => {
  const navigate = useNavigate();
  const { t } = useTranslation(['customer', 'common']);
  const { settings } = useStore();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    name: '',
    region: '',
    minScore: '',
    maxScore: '',
    country: 'all',
  });

  useEffect(() => {
    fetchCustomers();
  }, [filters]);

  const fetchCustomers = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filters.name) params.append('name', filters.name);
      if (filters.region) params.append('region', filters.region);
      if (filters.minScore) params.append('minScore', filters.minScore);
      if (filters.maxScore) params.append('maxScore', filters.maxScore);
      if (filters.country !== 'all') params.append('country', filters.country);

      const response = await fetch(`/api/customers?${params.toString()}`);
      const data = await response.json();
      setCustomers(data);
    } catch (error) {
      console.error('Error fetching customers:', error);
    } finally {
      setLoading(false);
    }
  };

  const getCreditScoreColor = (score: number) => {
    if (score >= 700) return 'success';
    if (score >= 600) return 'warning';
    return 'error';
  };

  return (
    <Container maxWidth="xl">
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          {t('customer:title')}
        </Typography>
        <Typography variant="body1" color="text.secondary">
          {t('customer:subtitle')}
        </Typography>
      </Box>

      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          {t('common:filter')}
        </Typography>
        <Grid container spacing={2}>
          <Grid item size={{ xs: 12, sm: 6, md: 3 }}>
            <TextField
              fullWidth
              size="small"
              label={t('customer:filters.name')}
              value={filters.name}
              onChange={(e) => setFilters({ ...filters, name: e.target.value })}
            />
          </Grid>
          <Grid item size={{ xs: 12, sm: 6, md: 3 }}>
            <TextField
              fullWidth
              size="small"
              label={t('customer:filters.region')}
              value={filters.region}
              onChange={(e) => setFilters({ ...filters, region: e.target.value })}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={2}>
            <TextField
              fullWidth
              size="small"
              type="number"
              label={t('customer:filters.minScore')}
              value={filters.minScore}
              onChange={(e) => setFilters({ ...filters, minScore: e.target.value })}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={2}>
            <TextField
              fullWidth
              size="small"
              type="number"
              label={t('customer:filters.maxScore')}
              value={filters.maxScore}
              onChange={(e) => setFilters({ ...filters, maxScore: e.target.value })}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={2}>
            <Button
              fullWidth
              variant="outlined"
              onClick={() =>
                setFilters({
                  name: '',
                  region: '',
                  minScore: '',
                  maxScore: '',
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
                <TableCell>{t('customer:id')}</TableCell>
                <TableCell>{t('customer:name')}</TableCell>
                <TableCell>{t('customer:region')}</TableCell>
                <TableCell>{t('customer:creditScore')}</TableCell>
                <TableCell>{t('customer:balance')}</TableCell>
                <TableCell>{t('customer:pendingOrders')}</TableCell>
                <TableCell>{t('customer:lastActivity')}</TableCell>
                <TableCell>{t('common:actions')}</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {customers.map((customer, idx) => (
                <TableRow key={customer.customer_id || customer.id || idx} hover>
                  <TableCell>{customer.customer_id || customer.id}</TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      {customer.credit_score < 600 && (
                        <WarningIcon color="error" fontSize="small" />
                      )}
                      {customer.customer_name || customer.name}
                    </Box>
                  </TableCell>
                  <TableCell>{customer.region}</TableCell>
                  <TableCell>
                    <Chip
                      label={customer.credit_score}
                      color={getCreditScoreColor(customer.credit_score)}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    {formatCurrency(customer.balance, 'USD', settings.language)}
                  </TableCell>
                  <TableCell>{customer.pendingOrders}</TableCell>
                  <TableCell>
                    {formatDate(customer.lastActivity, settings.language, 'PP')}
                  </TableCell>
                  <TableCell>
                    <Button
                      size="small"
                      variant="outlined"
                      onClick={() => navigate(`/agents/customer-insights/${customer.customer_id || customer.id}`)}
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
  );
};