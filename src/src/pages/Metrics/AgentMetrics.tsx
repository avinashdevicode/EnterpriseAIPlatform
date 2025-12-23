import { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Paper,
  Grid,
  TextField,
  MenuItem,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  CircularProgress,
  ToggleButton,
  ToggleButtonGroup,
  Card,
  CardContent,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import DownloadIcon from '@mui/icons-material/Download';
import { AgentMetric } from '../../types';
import { formatNumber } from '../../utils/formatters';
import { useStore } from '../../store/useStore';

export const AgentMetrics = () => {
  const { t } = useTranslation(['metrics', 'common']);
  const { settings } = useStore();
  const [metrics, setMetrics] = useState<AgentMetric[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewBy, setViewBy] = useState<'day' | 'week' | 'month'>('month');
  const [filters, setFilters] = useState({
    dateFrom: new Date('2023-01-01'),
    dateTo: new Date('2025-12-31'),
    agent: 'all',
    country: 'all',
  });

  useEffect(() => {
    fetchMetrics();
  }, [filters]);

  const fetchMetrics = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filters.dateFrom) params.append('from', filters.dateFrom.toISOString());
      if (filters.dateTo) params.append('to', filters.dateTo.toISOString());
      if (filters.agent !== 'all') params.append('agent', filters.agent);
      if (filters.country !== 'all') params.append('country', filters.country);

      const response = await fetch(`/api/metrics?${params.toString()}`);
      const data = await response.json();
      setMetrics(data);
    } catch (error) {
      console.error('Error fetching metrics:', error);
    } finally {
      setLoading(false);
    }
  };

  const exportToCSV = () => {
    const headers = [
      'Date',
      'Agent',
      'Country',
      'Volume',
      'Accuracy',
      'Positive Feedback',
      'Negative Feedback',
      'Avg Processing Time (s)',
    ];

    const csvData = metrics.map((metric) => [
      metric.date,
      metric.agent,
      metric.country,
      metric.volume,
      metric.accuracy,
      metric.positiveFeedback,
      metric.negativeFeedback,
      metric.averageProcessingTime,
    ]);

    const csvContent = [
      headers.join(','),
      ...csvData.map((row) => row.join(',')),
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `agent-metrics-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Aggregate metrics by agent
  const agentSummary = metrics.reduce((acc: any, metric) => {
    const agentName = metric.agent_name || metric.agent;
    if (!acc[agentName]) {
      acc[agentName] = {
        agent: agentName,
        totalVolume: 0,
        avgAccuracy: 0,
        totalPositiveFeedback: 0,
        totalNegativeFeedback: 0,
        avgProcessingTime: 0,
        count: 0,
      };
    }
    acc[agentName].totalVolume += (metric.documents_processed || metric.volume || 0);
    acc[agentName].avgAccuracy += (metric.accuracy_rate || metric.accuracy || 0);
    acc[agentName].totalPositiveFeedback += (metric.positiveFeedback || 0);
    acc[agentName].totalNegativeFeedback += (metric.validation_errors || metric.negativeFeedback || 0);
    acc[agentName].avgProcessingTime += (metric.processing_time_avg || metric.averageProcessingTime || 0);
    acc[agentName].count++;
    return acc;
  }, {});

  const agentData = Object.values(agentSummary).map((agent: any) => ({
    ...agent,
    avgAccuracy: agent.avgAccuracy / agent.count,
    avgProcessingTime: agent.avgProcessingTime / agent.count,
  }));

  // Volume over time
  const volumeData = metrics.reduce((acc: any, metric) => {
    const date = new Date(metric.date);
    let key = '';
    
    if (viewBy === 'day') {
      key = date.toISOString().split('T')[0];
    } else if (viewBy === 'week') {
      const weekNum = Math.ceil((date.getDate() - date.getDay() + 1) / 7);
      key = `${date.getFullYear()}-W${weekNum}`;
    } else {
      key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    }

    if (!acc[key]) {
      acc[key] = { period: key, volume: 0, accuracy: 0, count: 0 };
    }
    acc[key].volume += (metric.documents_processed || metric.volume || 0);
    acc[key].accuracy += (metric.accuracy_rate || metric.accuracy || 0);
    acc[key].count++;
    return acc;
  }, {});

  const volumeOverTime = Object.values(volumeData)
    .map((item: any) => ({
      ...item,
      accuracy: item.accuracy / item.count,
    }))
    .sort((a: any, b: any) => a.period.localeCompare(b.period));

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
        <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box>
            <Typography variant="h4" gutterBottom>
              {t('metrics:title')}
            </Typography>
            <Typography variant="body1" color="text.secondary">
              {t('metrics:subtitle')}
            </Typography>
          </Box>
          <Button
            variant="contained"
            startIcon={<DownloadIcon />}
            onClick={exportToCSV}
          >
            {t('metrics:exportCSV')}
          </Button>
        </Box>

        <Paper sx={{ p: 3, mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            {t('common:filter')}
          </Typography>
          <Grid container spacing={2} sx={{ mb: 2 }}>
            <Grid item size={{ xs: 12, sm: 6, md: 3 }}>
              <DatePicker
                label="From"
                value={filters.dateFrom}
                onChange={(date) => setFilters({ ...filters, dateFrom: date || new Date() })}
                slotProps={{ textField: { fullWidth: true, size: 'small' } }}
              />
            </Grid>
            <Grid item size={{ xs: 12, sm: 6, md: 3 }}>
              <DatePicker
                label="To"
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
                label={t('metrics:agentName')}
                value={filters.agent}
                onChange={(e) => setFilters({ ...filters, agent: e.target.value })}
              >
                <MenuItem value="all">{t('common:all')}</MenuItem>
                <MenuItem value="Invoice Processor">Invoice Processor</MenuItem>
                <MenuItem value="Customer Insights">Customer Insights</MenuItem>
                <MenuItem value="Order Processor">Order Processor</MenuItem>
              </TextField>
            </Grid>
            <Grid item size={{ xs: 12, sm: 6, md: 3 }}>
              <TextField
                fullWidth
                size="small"
                select
                label="Country"
                value={filters.country}
                onChange={(e) => setFilters({ ...filters, country: e.target.value })}
              >
                <MenuItem value="all">{t('common:all')}</MenuItem>
                <MenuItem value="US">United States</MenuItem>
                <MenuItem value="GB">United Kingdom</MenuItem>
                <MenuItem value="DE">Germany</MenuItem>
              </TextField>
            </Grid>
          </Grid>
          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            <ToggleButtonGroup
              value={viewBy}
              exclusive
              onChange={(e, value) => value && setViewBy(value)}
              size="small"
            >
              <ToggleButton value="day">{t('metrics:day')}</ToggleButton>
              <ToggleButton value="week">{t('metrics:week')}</ToggleButton>
              <ToggleButton value="month">{t('metrics:month')}</ToggleButton>
            </ToggleButtonGroup>
          </Box>
        </Paper>

        <Grid container spacing={3} sx={{ mb: 3 }}>
          <Grid item size={{ xs: 12, sm: 6, md: 3 }}>
            <Card>
              <CardContent>
                <Typography variant="caption" color="text.secondary">
                  {t('metrics:totalVolume')}
                </Typography>
                <Typography variant="h4">
                  {formatNumber(
                    metrics.reduce((sum, m) => sum + (m.documents_processed || m.volume || 0), 0),
                    settings.language
                  )}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item size={{ xs: 12, sm: 6, md: 3 }}>
            <Card>
              <CardContent>
                <Typography variant="caption" color="text.secondary">
                  {t('metrics:accuracy')}
                </Typography>
                <Typography variant="h4">
                  {(
                    metrics.reduce((sum, m) => sum + (m.accuracy_rate || m.accuracy || 0), 0) / metrics.length
                  ).toFixed(1)}
                  %
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item size={{ xs: 12, sm: 6, md: 3 }}>
            <Card>
              <CardContent>
                <Typography variant="caption" color="text.secondary">
                  {t('metrics:positiveFeedback')}
                </Typography>
                <Typography variant="h4">
                  {formatNumber(
                    metrics.reduce((sum, m) => sum + (m.positiveFeedback || 0), 0),
                    settings.language
                  )}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item size={{ xs: 12, sm: 6, md: 3 }}>
            <Card>
              <CardContent>
                <Typography variant="caption" color="text.secondary">
                  {t('metrics:avgProcessingTime')}
                </Typography>
                <Typography variant="h4">
                  {(
                    metrics.reduce((sum, m) => sum + (m.processing_time_avg || m.averageProcessingTime || 0), 0) /
                    metrics.length
                  ).toFixed(0)}
                  s
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        <Paper sx={{ p: 3, mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            {t('metrics:volume')} Over Time ({viewBy})
          </Typography>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={volumeOverTime}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="period" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="volume" fill="#4a90e2" name="Volume" />
            </BarChart>
          </ResponsiveContainer>
        </Paper>

        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>{t('metrics:agentName')}</TableCell>
                <TableCell align="right">{t('metrics:totalVolume')}</TableCell>
                <TableCell align="right">{t('metrics:accuracy')}</TableCell>
                <TableCell align="right">{t('metrics:positiveFeedback')}</TableCell>
                <TableCell align="right">{t('metrics:negativeFeedback')}</TableCell>
                <TableCell align="right">{t('metrics:avgProcessingTime')}</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {agentData.map((agent: any) => (
                <TableRow key={agent.agent}>
                  <TableCell>{agent.agent}</TableCell>
                  <TableCell align="right">
                    {formatNumber(agent.totalVolume, settings.language)}
                  </TableCell>
                  <TableCell align="right">{agent.avgAccuracy.toFixed(2)}%</TableCell>
                  <TableCell align="right">
                    {formatNumber(agent.totalPositiveFeedback, settings.language)}
                  </TableCell>
                  <TableCell align="right">
                    {formatNumber(agent.totalNegativeFeedback, settings.language)}
                  </TableCell>
                  <TableCell align="right">{agent.avgProcessingTime.toFixed(0)}s</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Container>
    </LocalizationProvider>
  );
};
