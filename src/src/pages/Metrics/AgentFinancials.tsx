import React, { useState } from 'react';
import {
    Box,
    Container,
    Grid,
    Paper,
    Typography,
    Card,
    CardContent,
    FormControl,
    Select,
    MenuItem,
    Stack,
    Chip,
} from '@mui/material';
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    ScatterChart,
    Scatter,
    ZAxis,
    Legend,
} from 'recharts';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import BugReportIcon from '@mui/icons-material/BugReport';
import BuildIcon from '@mui/icons-material/Build';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import PsychologyIcon from '@mui/icons-material/Psychology';

import { agents } from '../../data/agents.tsx'; // Import actual agent list for dropdown

// Mock Financial Data Generator
const generateAgentData = (id: string) => {
    // Deterministic random based on ID char codes to keep it consistent-ish
    const seed = id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const rand = (mod: number) => (seed % mod) / mod; // very basic pseudo-rand

    const roiData = Array.from({ length: 12 }, (_, i) => ({
        month: `M${i + 1}`,
        cost: 5000 + (i * 200), // Development/Maintenance Cost
        savings: 1000 + (i * i * 150), // Exponential savings growth
    }));

    const costBreakdownData = [
        { name: 'LLM Tokens', value: 45 },
        { name: 'Compute Infra', value: 20 },
        { name: 'Human Oversight', value: 25 },
        { name: 'Maintenance', value: 10 },
    ];

    const reliabilityData = Array.from({ length: 20 }, (_, i) => ({
        volume: Math.floor(Math.random() * 1000) + 100,
        issues: Math.floor(Math.random() * 20),
        severity: Math.floor(Math.random() * 3) + 1, // 1-3 severity (bubble size)
    }));

    return { roiData, costBreakdownData, reliabilityData };
};

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444'];

const MetricCard = ({ title, value, subtext, icon, color }: any) => (
    <Card sx={{ height: '100%', borderRadius: '16px', border: '1px solid #e0e0e0', boxShadow: 'none' }}>
        <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Box
                    sx={{
                        p: 1,
                        borderRadius: '12px',
                        bgcolor: `${color}15`,
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
            <Typography variant="h4" fontWeight="800" sx={{ color: '#1a202c', mb: 1 }}>
                {value}
            </Typography>
            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', lineHeight: 1.4 }}>
                {subtext}
            </Typography>
        </CardContent>
    </Card>
);

export const AgentFinancials = () => {
    // Default to the first active agent
    const activeAgents = agents.filter(a => a.status === 'active');
    const [selectedAgentId, setSelectedAgentId] = useState(activeAgents.length > 0 ? activeAgents[0].id : '');

    const selectedAgent = agents.find(a => a.id === selectedAgentId) || activeAgents[0];
    const { roiData, costBreakdownData, reliabilityData } = generateAgentData(selectedAgentId);

    return (
        <Container maxWidth="xl" sx={{ py: 4 }}>
            <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 2 }}>
                <Box>
                    <Typography variant="h4" fontWeight="800" sx={{ mb: 1, color: '#1a202c' }}>
                        Agent Financials & Analysis
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                        Deep-dive into individual agent efficiency, cost-benefit analysis, and operational ROI.
                    </Typography>
                </Box>

                <FormControl sx={{ minWidth: 250 }}>
                    <Select
                        value={selectedAgentId}
                        onChange={(e) => setSelectedAgentId(e.target.value)}
                        displayEmpty
                        size="small"
                        sx={{ borderRadius: '10px', bgcolor: 'white', fontWeight: 600 }}
                    >
                        {agents.map((agent) => (
                            <MenuItem key={agent.id} value={agent.id} disabled={agent.status !== 'active'}>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
                                    {agent.name}
                                    {agent.status !== 'active' && <Chip label="Coming Soon" size="small" sx={{ ml: 1, height: 20, fontSize: '0.6rem' }} />}
                                </Box>
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
            </Box>

            {/* Financial Key Metrics */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
                <Grid item xs={12} sm={6} md={2.4}>
                    <MetricCard
                        title="Total Cost of Ownership"
                        value="$45,200"
                        subtext="Combined Tokens, Infra, & Oversight"
                        icon={<AttachMoneyIcon />}
                        color="#ef4444"
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={2.4}>
                    <MetricCard
                        title="ROI"
                        value="+245%"
                        subtext="Net Savings / Total Investment"
                        icon={<TrendingUpIcon />}
                        color="#10b981"
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={2.4}>
                    <MetricCard
                        title="Issue Rate"
                        value="1.2%"
                        subtext="Hallucinations/Bugs per 1k req"
                        icon={<BugReportIcon />}
                        color="#f59e0b"
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={2.4}>
                    <MetricCard
                        title="Maintenance Effort"
                        value="12 hrs"
                        subtext="Developer time this month"
                        icon={<BuildIcon />}
                        color="#6366f1"
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={2.4}>
                    <MetricCard
                        title="Cost-to-Value Ratio"
                        value="8.5/10"
                        subtext="Efficiency Score"
                        icon={<PsychologyIcon />}
                        color="#3b82f6"
                    />
                </Grid>
            </Grid>


            <Grid container spacing={3}>
                {/* ROI Growth Curve */}
                <Grid item xs={12} lg={8}>
                    <Paper sx={{ p: 3, borderRadius: '16px', height: '450px', display: 'flex', flexDirection: 'column' }}>
                        <Box sx={{ mb: 2 }}>
                            <Typography variant="h6" fontWeight="bold">
                                ROI Growth Curve
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                                Cumulative Investment vs. Value Realized (Manual Labor Savings) - Spot the Break-even point.
                            </Typography>
                        </Box>

                        <Box sx={{ flexGrow: 1, minHeight: 0 }}>
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={roiData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                                    <defs>
                                        <linearGradient id="colorSavings" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#10b981" stopOpacity={0.8} />
                                            <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                                        </linearGradient>
                                        <linearGradient id="colorCost" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#ef4444" stopOpacity={0.1} />
                                            <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#64748b' }} />
                                    <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b' }} tickFormatter={(value) => `$${value}`} />
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                    <Tooltip
                                        contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                                        formatter={(value: any) => [`$${value.toLocaleString()}`, undefined]}
                                    />
                                    <Area type="monotone" dataKey="savings" name="Value Realized" stroke="#10b981" fillOpacity={1} fill="url(#colorSavings)" />
                                    <Area type="monotone" dataKey="cost" name="Cumulative Cost" stroke="#ef4444" fillOpacity={1} fill="url(#colorCost)" />
                                    <Legend verticalAlign="top" height={36} />
                                </AreaChart>
                            </ResponsiveContainer>
                        </Box>
                    </Paper>
                </Grid>

                {/* Cost Breakdown */}
                <Grid item xs={12} md={6} lg={4}>
                    <Paper sx={{ p: 3, borderRadius: '16px', height: '450px', width: '450px', display: 'flex', flexDirection: 'column' }}>
                        <Typography variant="h6" fontWeight="bold" sx={{ mb: 1 }}>
                            Cost Breakdown
                        </Typography>
                        <Box sx={{ flexGrow: 1, minHeight: 0 }}>
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={costBreakdownData}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={60}
                                        outerRadius={90}
                                        paddingAngle={5}
                                        dataKey="value"
                                    >
                                        {costBreakdownData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip contentStyle={{ borderRadius: '8px', border: 'none' }} />
                                    <Legend
                                        layout="vertical"
                                        verticalAlign="middle"
                                        align="right"
                                        wrapperStyle={{ fontSize: '12px' }}
                                    />
                                </PieChart>
                            </ResponsiveContainer>
                        </Box>
                    </Paper>
                </Grid>

                {/* Reliability Scatter */}
                <Grid item xs={12} md={6} lg={12}>
                    <Paper sx={{ p: 3, borderRadius: '16px', height: '450px', width: '1050px', display: 'flex', flexDirection: 'column' }}>
                        <Typography variant="h6" fontWeight="bold" sx={{ mb: 1 }}>
                            Reliability Correlation
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                            Does higher volume lead to more issues? (Bubble size = Severity)
                        </Typography>
                        <Box sx={{ flexGrow: 1, minHeight: 0 }}>
                            <ResponsiveContainer width="100%" height="100%">
                                <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                                    <XAxis type="number" dataKey="volume" name="Request Volume" unit=" reqs" axisLine={false} tickLine={false} />
                                    <YAxis type="number" dataKey="issues" name="Reported Issues" unit=" bugs" axisLine={false} tickLine={false} />
                                    <ZAxis type="number" dataKey="severity" range={[60, 400]} name="Severity Score" />
                                    <Tooltip cursor={{ strokeDasharray: '3 3' }} contentStyle={{ borderRadius: '8px' }} />
                                    <Scatter name="Reliability" data={reliabilityData} fill="#8884d8">
                                        {reliabilityData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.issues > 10 ? '#ef4444' : '#3b82f6'} />
                                        ))}
                                    </Scatter>
                                </ScatterChart>
                            </ResponsiveContainer>
                        </Box>
                    </Paper>
                </Grid>

            </Grid>
        </Container>
    );
};
