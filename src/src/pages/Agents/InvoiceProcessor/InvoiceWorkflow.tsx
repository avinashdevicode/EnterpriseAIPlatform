import { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Paper,
  Grid,
  Button,
  Stepper,
  Step,
  StepLabel,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  CircularProgress,
  Chip,
  Alert,
} from '@mui/material';
import {
  Timeline,
  TimelineItem,
  TimelineSeparator,
  TimelineConnector,
  TimelineContent,
  TimelineDot,
  TimelineOppositeContent,
} from '@mui/lab';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
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

export const InvoiceWorkflow = () => {
  const { invoiceId } = useParams<{ invoiceId: string }>();
  const navigate = useNavigate();
  const { t } = useTranslation(['invoice', 'common']);
  const { settings } = useStore();
  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchInvoice();
  }, [invoiceId]);

  const fetchInvoice = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/invoices/${invoiceId}`);
      const data = await response.json();
      setInvoice(data);
    } catch (error) {
      console.error('Error fetching invoice:', error);
    } finally {
      setLoading(false);
    }
  };

  const moveToNextStage = async () => {
    if (!invoice) return;

    const currentIndex = stages.indexOf(invoice.stage);
    if (currentIndex >= stages.length - 1) return;

    const nextStage = stages[currentIndex + 1];

    try {
      const response = await fetch(`/api/invoices/${invoiceId}/stage`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          stage: nextStage,
          user: 'Current User',
        }),
      });

      const updatedInvoice = await response.json();
      setInvoice(updatedInvoice);
    } catch (error) {
      console.error('Error updating invoice:', error);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!invoice) {
    return (
      <Container maxWidth="lg">
        <Box sx={{ mt: 4 }}>
          <Alert severity="error">Invoice not found</Alert>
          <Button onClick={() => navigate(-1)} sx={{ mt: 2 }}>
            Go Back
          </Button>
        </Box>
      </Container>
    );
  }

  if (!invoice) {
    return (
      <Container>
        <Alert severity="error">Invoice not found</Alert>
      </Container>
    );
  }

  const currentStageIndex = stages.indexOf(invoice.stage);
  const canAdvance = currentStageIndex < stages.length - 1;

  return (
    <Container maxWidth="xl">
      <Box sx={{ mb: 3 }}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/agents/invoice-processor')}
          sx={{ mb: 2 }}
        >
          {t('invoice:backToList')}
        </Button>
        <Typography variant="h4" gutterBottom>
          {t('invoice:workflow')} - {invoice.invoice_number || invoice.invoice_id || invoice.id}
        </Typography>
        <Typography variant="body1" color="text.secondary">
          {invoice.customerName}
        </Typography>
      </Box>

      <Paper sx={{ p: 3, mb: 3 }}>
        <Stepper activeStep={currentStageIndex} alternativeLabel>
          {stages.map((stage) => (
            <Step key={stage}>
              <StepLabel>{t(`invoice:stages.${stage}`)}</StepLabel>
            </Step>
          ))}
        </Stepper>

        <Box sx={{ mt: 3, display: 'flex', justifyContent: 'center' }}>
          <Button
            variant="contained"
            endIcon={<ArrowForwardIcon />}
            onClick={moveToNextStage}
            disabled={!canAdvance}
            size="large"
          >
            {canAdvance
              ? `${t('invoice:moveToNextStage')}: ${t(`invoice:stages.${stages[currentStageIndex + 1]}`)}`
              : t('invoice:stages.paid')}
          </Button>
        </Box>
      </Paper>

      <Grid container spacing={3}>
        <Grid item size={{ xs: 12, md: 6 }}>
          <Paper sx={{ p: 3, height: '100%' }}>
            <Typography variant="h6" gutterBottom>
              {t('invoice:pdfPreview')}
            </Typography>
            <Box
              sx={{
                width: '100%',
                height: 500,
                bgcolor: '#f5f5f5',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: 1,
              }}
            >
              <iframe
                src={invoice.pdfUrl}
                width="100%"
                height="100%"
                style={{ border: 'none' }}
                title="Invoice PDF"
              />
            </Box>
          </Paper>
        </Grid>

        <Grid item size={{ xs: 12, md: 6 }}>
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              {t('invoice:extractedFields')}
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Typography variant="caption" color="text.secondary">
                  {t('invoice:invoiceNumber')}
                </Typography>
                <Typography>{invoice.invoice_number || invoice.invoiceNumber}</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="caption" color="text.secondary">
                  {t('invoice:vendor')}
                </Typography>
                <Typography>{invoice.customer_name || invoice.vendor || 'N/A'}</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="caption" color="text.secondary">
                  {t('invoice:customer')}
                </Typography>
                <Typography>{invoice.customer_name || invoice.customer || 'N/A'}</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="caption" color="text.secondary">
                  {t('invoice:amount')}
                </Typography>
                <Typography>
                  {formatCurrency(
                    invoice.amount,
                    invoice.currency,
                    settings.language
                  )}
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="caption" color="text.secondary">
                  {t('invoice:issueDate')}
                </Typography>
                <Typography>{formatDate(invoice.date, settings.language)}</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="caption" color="text.secondary">
                  {t('invoice:dueDate')}
                </Typography>
                <Typography>{formatDate(invoice.due_date, settings.language)}</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="caption" color="text.secondary">
                  {t('invoice:riskScore')}
                </Typography>
                <Chip label="Low" color="success" />
              </Grid>
            </Grid>

            <Typography variant="h6" sx={{ mt: 3, mb: 2 }}>
              {t('invoice:items')}
            </Typography>
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>{t('invoice:description')}</TableCell>
                    <TableCell align="right">{t('invoice:quantity')}</TableCell>
                    <TableCell align="right">{t('invoice:unitPrice')}</TableCell>
                    <TableCell align="right">{t('invoice:lineTotal')}</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {[
                    { description: 'Professional Services', quantity: 10, unitPrice: invoice.amount / 2, total: (invoice.amount / 2) },
                    { description: 'Support & Maintenance', quantity: 5, unitPrice: invoice.amount / 10, total: (invoice.amount / 10) },
                  ].map((item, index) => (
                    <TableRow key={index}>
                      <TableCell>{item.description}</TableCell>
                      <TableCell align="right">{item.quantity}</TableCell>
                      <TableCell align="right">
                        {formatCurrency(item.unitPrice, invoice.currency, settings.language)}
                      </TableCell>
                      <TableCell align="right">
                        {formatCurrency(item.total, invoice.currency, settings.language)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>

          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              {t('invoice:activityTimeline')}
            </Typography>
            <Timeline>
              {stages.filter(stage => stages.indexOf(stage) <= stages.indexOf(invoice.stage)).map((stage, index, arr) => (
                <TimelineItem key={stage}>
                  <TimelineOppositeContent color="text.secondary" sx={{ flex: 0.3 }}>
                    <Typography variant="caption">
                      {formatDate(invoice.date, settings.language)}
                    </Typography>
                  </TimelineOppositeContent>
                  <TimelineSeparator>
                    <TimelineDot color="primary" />
                    {index < arr.length - 1 && <TimelineConnector />}
                  </TimelineSeparator>
                  <TimelineContent>
                    <Typography>{stage.replace(/_/g, ' ')}</Typography>
                    <Typography variant="caption" color="text.secondary">
                      Automated Processing
                    </Typography>
                  </TimelineContent>
                </TimelineItem>
              ))}
            </Timeline>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};