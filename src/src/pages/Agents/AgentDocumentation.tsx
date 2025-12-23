import React from 'react';
import { useParams } from 'react-router-dom';
import { Container, Typography, Paper, Grid, Box, Chip, Divider } from '@mui/material';
import { agents } from '../../data/agents';

const AgentDocumentation = () => {
    const { agentId } = useParams<{ agentId: string }>();
    const agent = agents.find(a => a.id === agentId);

    if (!agent) {
        return (
            <Container maxWidth="md" sx={{ py: 4 }}>
                <Typography variant="h5">Agent not found.</Typography>
            </Container>
        );
    }

    const { name, description, documentation } = agent;
    const { businessUseCase, roi, realizationTimeline } = documentation;

    const InfoCard = ({ title, content }: { title: string, content: string }) => (
        <Grid item xs={12} sm={6}>
            <Paper elevation={2} sx={{ p: 3, height: '100%' }}>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>{title}</Typography>
                <Typography variant="body1">{content}</Typography>
            </Paper>
        </Grid>
    );

    return (
        <Container maxWidth="lg" sx={{ py: 5 }}>
            <Paper elevation={3} sx={{ p: 4, borderRadius: '12px' }}>
                <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', mb: 2 }}>{name}</Typography>
                <Chip label={agent.businessFunction} color="primary" sx={{ mb: 2 }} />
                <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>{description}</Typography>
                
                <Divider sx={{ my: 4 }} />

                <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold' }}>Business Use Case</Typography>
                <Typography paragraph>{businessUseCase}</Typography>

                <Divider sx={{ my: 4 }} />

                <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold', mb: 3 }}>Return on Investment (ROI)</Typography>
                <Grid container spacing={3}>
                    <InfoCard title="Cost to Build" content={roi.costToBuild} />
                    <InfoCard title="Expected Token Utilization" content={roi.expectedTokenUtilization} />
                    <InfoCard title="Maintenance vs. Business Benefits" content={roi.maintenanceVsBusinessBenefits} />
                    <InfoCard title="Man-Hours Reduced" content={roi.manHoursReduced} />
                </Grid>

                <Divider sx={{ my: 4 }} />

                <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold' }}>Realization Timeline</Typography>
                <Typography paragraph>{realizationTimeline}</Typography>
            </Paper>
        </Container>
    );
};

export default AgentDocumentation;
