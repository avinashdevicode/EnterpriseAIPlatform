import { Container, Typography, Box, Paper, Button } from '@mui/material';
import { useTranslation } from 'react-i18next';
import ConstructionIcon from '@mui/icons-material/Construction';

export const OrderList = () => {
  const { t } = useTranslation('agents');

  return (
    <Container maxWidth="xl">
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          {t('orderProcessor')}
        </Typography>
        <Typography variant="body1" color="text.secondary">
          {t('orderProcessorDesc')}
        </Typography>
      </Box>

      <Paper
        sx={{
          p: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '400px',
          backgroundColor: '#f8f9fa',
        }}
      >
        <ConstructionIcon sx={{ fontSize: 80, color: '#9b59b6', mb: 3 }} />
        <Typography variant="h5" gutterBottom>
          {t('comingSoon')}
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 3, textAlign: 'center', maxWidth: 600 }}>
          The Order Processor agent is currently under development. This module will provide intelligent order
          processing capabilities including automated order validation, routing, and fulfillment tracking.
        </Typography>
        <Button variant="outlined" color="primary" disabled>
          {t('notifyMe')}
        </Button>
      </Paper>
    </Container>
  );
};
