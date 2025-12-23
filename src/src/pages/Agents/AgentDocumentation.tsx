import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    Container,
    Typography,
    Paper,
    Grid,
    Box,
    Chip,
    Divider,
    Button,
    Stack,
    Card,
    CardContent,
    Accordion,
    AccordionSummary,
    AccordionDetails,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import BusinessIcon from '@mui/icons-material/Business';
import IntegrationInstructionsIcon from '@mui/icons-material/IntegrationInstructions';
import StorageIcon from '@mui/icons-material/Storage';
import AutoModeIcon from '@mui/icons-material/AutoMode';
import ArchitectureIcon from '@mui/icons-material/AccountTree';

// Explicit import with extension
import { agents } from '../../data/agents.tsx';

const AgentDocumentation = () => {
    const { agentId } = useParams<{ agentId: string }>();
    const navigate = useNavigate();
    const agent = agents.find((a) => a.id === agentId);

    if (!agent) {
        return (
            <Container maxWidth="md" sx={{ py: 4 }}>
                <Typography variant="h5">Agent not found.</Typography>
                <Button onClick={() => navigate('/agents')} sx={{ mt: 2 }}>
                    Back to Agents
                </Button>
            </Container>
        );
    }

    const { name, description, documentation, technologies, businessFunction } = agent;
    const { businessUseCase, roi, realizationTimeline } = documentation;

    // Helper to parse man hours and calculate savings
    const parseSavings = (text: string) => {
        // Extract first number found (e.g., "1,200", "800")
        const match = text.match(/([\d,]+)/);
        if (!match) return { hours: 'N/A', dollars: 'N/A' };

        const hoursStr = match[1].replace(/,/g, '');
        const hours = parseInt(hoursStr, 10);

        // Assume $50/hour blended rate for calculation
        const HOURLY_RATE = 50;
        const savings = hours * HOURLY_RATE;

        return {
            hours: hours.toLocaleString(),
            dollars: `$${savings.toLocaleString()}`
        };
    };

    // Helper to extract simple timeline
    const parseTimeline = (text: string) => {
        // Look for patterns like "9-12 months", "3 months", "4-5 months"
        const match = text.match(/(\d+(?:-\d+)?\s+(?:months|years))/i);
        if (match) return match[1];
        return text.split('.')[0]; // Fallback to first sentence
    };

    const savingsData = parseSavings(roi.manHoursReduced);
    const breakevenTime = parseTimeline(realizationTimeline);

    const MetricCard = ({
        title,
        primaryValue,
        secondaryValue,
        icon,
        color,
        subtext,
    }: {
        title: string;
        primaryValue: React.ReactNode;
        secondaryValue?: string;
        icon: React.ReactNode;
        color: string;
        subtext?: string;
    }) => (
        <Card
            elevation={0}
            sx={{
                height: '100%',
                borderRadius: '16px',
                border: '1px solid #e0e0e0',
                background: `linear-gradient(135deg, #ffffff 0%, ${color}10 100%)`,
                transition: 'transform 0.2s',
                '&:hover': {
                    transform: 'translateY(-4px)',
                    borderColor: color,
                },
            }}
        >
            <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Box
                        sx={{
                            p: 1,
                            borderRadius: '12px',
                            bgcolor: `${color}20`,
                            color: color,
                            mr: 2,
                            display: 'flex',
                        }}
                    >
                        {icon}
                    </Box>
                    <Typography variant="subtitle2" color="text.secondary" fontWeight="600">
                        {title}
                    </Typography>
                </Box>
                <Typography variant="h5" fontWeight="bold" sx={{ color: '#1a202c', mb: 0.5 }}>
                    {primaryValue}
                </Typography>
                {secondaryValue && (
                    <Typography variant="h6" fontWeight="bold" sx={{ color: color, mb: 1 }}>
                        {secondaryValue}
                    </Typography>
                )}
                {subtext && (
                    <Typography variant="caption" color="text.secondary" sx={{ lineHeight: 1.2, display: 'block' }}>
                        {subtext}
                    </Typography>
                )}
            </CardContent>
        </Card>
    );

    return (
        <Box sx={{ bgcolor: '#f8fafc', minHeight: '100vh', pb: 8 }}>
            {/* Header / Hero Section */}
            <Box
                sx={{
                    background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
                    color: 'white',
                    pt: 8,
                    pb: 10,
                    px: 2,
                }}
            >
                <Container maxWidth="lg">
                    <Button
                        startIcon={<ArrowBackIcon />}
                        onClick={() => navigate('/agents')}
                        sx={{ color: 'rgba(255,255,255,0.7)', mb: 4, '&:hover': { color: 'white' } }}
                    >
                        Back to Agents
                    </Button>
                    <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2 }}>
                        <Box>
                            <Typography
                                variant="h2"
                                component="h1"
                                fontWeight="800"
                                sx={{
                                    mb: 2,
                                    background: 'linear-gradient(90deg, #ffffff 0%, #94a3b8 100%)',
                                    WebkitBackgroundClip: 'text',
                                    WebkitTextFillColor: 'transparent',
                                }}
                            >
                                {name}
                            </Typography>
                            <Typography variant="h6" sx={{ color: '#94a3b8', maxWidth: '800px', lineHeight: 1.6 }}>
                                {description}
                            </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
                            <Chip
                                label={agent.status === 'active' ? 'Active' : 'Coming Soon'}
                                color={agent.status === 'active' ? 'success' : 'default'}
                                sx={{ fontWeight: 'bold' }}
                            />
                            <Chip label={businessFunction} variant="outlined" sx={{ color: 'white', borderColor: 'rgba(255,255,255,0.3)' }} />
                        </Box>
                    </Box>
                </Container>
            </Box>

            <Container maxWidth="lg" sx={{ mt: -6 }}>
                <Stack spacing={4}>
                    {/* Main Content Paper */}
                    <Paper elevation={3} sx={{ borderRadius: '24px', overflow: 'hidden', border: '1px solid #e2e8f0' }}>

                        {/* Business Use Case Section */}
                        <Box sx={{ p: 4, borderBottom: '1px solid #f1f5f9' }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                <BusinessIcon color="primary" sx={{ mr: 1 }} />
                                <Typography variant="h6" fontWeight="bold" color="#334155">
                                    Business Use Case
                                </Typography>
                            </Box>
                            <Typography variant="body1" paragraph sx={{ color: '#475569', fontSize: '1.1rem', lineHeight: 1.7 }}>
                                {businessUseCase}
                            </Typography>
                        </Box>

                        {/* Metrics Dashboard */}
                        <Box sx={{ p: 4, bgcolor: '#ffffff' }}>
                            <Typography variant="h6" fontWeight="bold" sx={{ mb: 3, color: '#334155' }}>
                                Projected ROI & Impact
                            </Typography>
                            <Grid container spacing={3} sx={{ mb: 4 }}>
                                <Grid item xs={12} md={4}>
                                    <MetricCard
                                        title="Total Cost to Build"
                                        primaryValue={roi.costToBuild}
                                        icon={<AttachMoneyIcon />}
                                        color="#ef4444"
                                        subtext="Estimated one-time cost"
                                    />
                                </Grid>
                                <Grid item xs={12} md={4}>
                                    <MetricCard
                                        title="Savings per Month"
                                        primaryValue={savingsData.dollars}
                                        secondaryValue={`${savingsData.hours} Man Hours`}
                                        icon={<AccessTimeIcon />}
                                        color="#10b981"
                                        subtext="Estimated operational savings"
                                    />
                                </Grid>
                                <Grid item xs={12} md={4}>
                                    <MetricCard
                                        title="Breakeven / Timeline"
                                        primaryValue={breakevenTime}
                                        icon={<TrendingUpIcon />}
                                        color="#3b82f6"
                                        subtext="For full ROI realization"
                                    />
                                </Grid>
                            </Grid>

                            {/* Calculation Breakdown Accordion */}
                            <Accordion elevation={0} sx={{ bgcolor: '#f8fafc', borderRadius: '12px', '&::before': { display: 'none' } }}>
                                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                                    <Typography variant="subtitle2" fontWeight="600" color="text.secondary">
                                        How we calculated this (Maintenance vs Benefits)
                                    </Typography>
                                </AccordionSummary>
                                <AccordionDetails>
                                    <Typography variant="body2" color="text.secondary">
                                        {roi.maintenanceVsBusinessBenefits}
                                    </Typography>
                                    <Divider sx={{ my: 1 }} />
                                    <Typography variant="caption" display="block">
                                        <strong>Expected Token Usage:</strong> {roi.expectedTokenUtilization}
                                    </Typography>
                                </AccordionDetails>
                            </Accordion>
                        </Box>
                    </Paper>

                    {/* Architecture Section */}
                    <Paper elevation={0} sx={{ p: 4, borderRadius: '24px', border: '1px solid #e2e8f0', bgcolor: 'white' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
                            <ArchitectureIcon color="secondary" sx={{ mr: 1.5, fontSize: 32 }} />
                            <Typography variant="h5" fontWeight="bold" sx={{ color: '#1e293b' }}>
                                Agent Architecture & Stack
                            </Typography>
                        </Box>

                        <Grid container spacing={4}>
                            {/* Tech Stack Column */}
                            <Grid item xs={12} md={6}>
                                <Typography variant="subtitle1" fontWeight="700" sx={{ mb: 2, color: '#475569', display: 'flex', alignItems: 'center' }}>
                                    <StorageIcon sx={{ fontSize: 20, mr: 1 }} /> Technology Stack
                                </Typography>
                                <Stack spacing={2}>
                                    <Box>
                                        <Typography variant="caption" fontWeight="bold" color="text.secondary">APPS & PLATFORMS</Typography>
                                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 0.5 }}>
                                            {technologies.apps.map((app, i) => (
                                                <Chip key={i} label={app} size="small" sx={{ bgcolor: '#f1f5f9', fontWeight: 500 }} />
                                            ))}
                                        </Box>
                                    </Box>
                                    <Box>
                                        <Typography variant="caption" fontWeight="bold" color="text.secondary">AI & ML MODELS</Typography>
                                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 0.5 }}>
                                            {technologies.aiml.map((ai, i) => (
                                                <Chip key={i} label={ai} size="small" sx={{ bgcolor: '#f0fdf4', color: '#166534', border: '1px solid #bbf7d0', fontWeight: 500 }} />
                                            ))}
                                        </Box>
                                    </Box>
                                    <Box>
                                        <Typography variant="caption" fontWeight="bold" color="text.secondary">AUTOMATION</Typography>
                                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 0.5 }}>
                                            {technologies.automation.map((auto, i) => (
                                                <Chip key={i} label={auto} size="small" sx={{ bgcolor: '#eff6ff', color: '#1e40af', border: '1px solid #bfdbfe', fontWeight: 500 }} />
                                            ))}
                                        </Box>
                                    </Box>
                                </Stack>
                            </Grid>

                            {/* Integrations & Data Column */}
                            <Grid item xs={12} md={6}>
                                <Typography variant="subtitle1" fontWeight="700" sx={{ mb: 2, color: '#475569', display: 'flex', alignItems: 'center' }}>
                                    <IntegrationInstructionsIcon sx={{ fontSize: 20, mr: 1 }} /> Data & Integrations
                                </Typography>
                                <Stack spacing={2}>
                                    <Box>
                                        <Typography variant="caption" fontWeight="bold" color="text.secondary">INTEGRATION POINTS</Typography>
                                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 0.5 }}>
                                            {technologies.integrations.map((int, i) => (
                                                <Chip key={i} label={int} size="small" variant="outlined" sx={{ borderColor: '#cbd5e1' }} />
                                            ))}
                                        </Box>
                                    </Box>
                                    <Box>
                                        <Typography variant="caption" fontWeight="bold" color="text.secondary">DATA SOURCES</Typography>
                                        <Typography variant="body2" sx={{ mt: 0.5, color: '#475569' }}>
                                            {agent.dataSources.join(', ')}
                                        </Typography>
                                    </Box>
                                    <Box>
                                        <Typography variant="caption" fontWeight="bold" color="text.secondary">TRIGGERS</Typography>
                                        <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
                                            <AutoModeIcon sx={{ fontSize: 16, color: '#64748b', mr: 1 }} />
                                            <Typography variant="body2" sx={{ color: '#475569' }}>
                                                {agent.triggerTypes.join(' • ')}
                                            </Typography>
                                        </Box>
                                    </Box>
                                </Stack>
                            </Grid>
                        </Grid>
                    </Paper>
                </Stack>
            </Container>
        </Box>
    );
};

export default AgentDocumentation;
