import React, { useState, useMemo } from 'react';
import {
    Box,
    Container,
    Grid,
    Paper,
    Typography,
    Card,
    CardContent,
    useTheme,
    LinearProgress,
    FormControl,
    Select,
    MenuItem,
    Chip,
} from '@mui/material';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    AreaChart,
    Area,
    BarChart,
    Bar,
} from 'recharts';
import SpeedIcon from '@mui/icons-material/Speed';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import DataUsageIcon from '@mui/icons-material/DataUsage';
import HealthAndSafetyIcon from '@mui/icons-material/HealthAndSafety';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import { agents } from '../../data/agents.tsx';

// Mock Data Generators with simple "filtering" simulation
const generateVolumeData = (agentId: string) => {
    // Seed-like effect based on length for variety
    const base = agentId === 'all' ? 4000 : 1000 + (agentId.length * 200);
    return Array.from({ length: 30 }, (_, i) => ({
        day: i + 1,
        requests: Math.floor(Math.random() * (base * 0.5)) + base,
        tasks: Math.floor(Math.random() * (base * 0.5)) + (base * 0.9),
    }));
};

const generateSentimentData = (agentId: string) => {
    return Array.from({ length: 30 }, (_, i) => ({
        day: i + 1,
        positive: Math.floor(Math.random() * 80) + 20,
        negative: Math.floor(Math.random() * 15),
    }));
};

const generateHourlyTrafficData = () => {
    const data = [];

    for (let h = 0; h < 24; h++) {
        let baseValue = Math.floor(Math.random() * 20) + 10;

        // Peak Hours Logic: 10AM-12PM and 3PM-4PM (simulating average)
        if ((h >= 10 && h <= 12) || (h >= 15 && h <= 16)) {
            baseValue += Math.floor(Math.random() * 40) + 40; // Higher average load
        }

        // Simulating some "night" drop
        if (h < 6 || h > 20) {
            baseValue = Math.max(5, baseValue - 10);
        }

        data.push({
            hour: `${h}:00`,
            value: baseValue,
        });
    }
    return data;
};

const MetricCard = ({ title, value, subtext, icon, color, progress }: any) => (
    <Card sx={{ height: '100%', borderRadius: '16px', position: 'relative', overflow: 'visible' }}>
        <CardContent>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                <Box>
                    <Typography variant="subtitle2" color="text.secondary" fontWeight="600" gutterBottom>
                        {title}
                    </Typography>
                    <Typography variant="h4" fontWeight="800" sx={{ color: '#1a202c' }}>
                        {value}
                    </Typography>
                </Box>
                <Box
                    sx={{
                        p: 1.5,
                        borderRadius: '12px',
                        bgcolor: `${color}15`,
                        color: color,
                    }}
                >
                    {icon}
                </Box>
            </Box>

            {progress !== undefined && (
                <Box sx={{ mt: 1, mb: 0.5 }}>
                    <LinearProgress
                        variant="determinate"
                        value={progress}
                        sx={{
                            height: 6,
                            borderRadius: 3,
                            bgcolor: `${color}15`,
                            '& .MuiLinearProgress-bar': {
                                bgcolor: color
                            }
                        }}
                    />
                </Box>
            )}

            {subtext && (
                <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
                    {subtext}
                </Typography>
            )}
        </CardContent>
    </Card>
);

export const GlobalOverview = () => {
    const theme = useTheme();
    const [selectedAgent, setSelectedAgent] = useState('all');

    // Memoize data to simulate fetching based on filter
    const volumeTrendData = useMemo(() => generateVolumeData(selectedAgent), [selectedAgent]);
    const sentimentData = useMemo(() => generateSentimentData(selectedAgent), [selectedAgent]);
    const hourlyTrafficData = useMemo(() => generateHourlyTrafficData(), []);

    return (
        <Container maxWidth="xl" sx={{ py: 4 }}>
            <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 2 }}>
                <Box>
                    <Typography variant="h4" fontWeight="800" sx={{ mb: 1, color: '#1a202c' }}>
                        Global Active Agent Overview
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                        Real-time operational health and adoption monitoring across the entire agent fleet.
                    </Typography>
                </Box>

                <FormControl sx={{ minWidth: 250 }}>
                    <Select
                        value={selectedAgent}
                        onChange={(e) => setSelectedAgent(e.target.value)}
                        displayEmpty
                        size="small"
                        sx={{ borderRadius: '10px', bgcolor: 'white', fontWeight: 600 }}
                    >
                        <MenuItem value="all">
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center', fontWeight: 'bold' }}>
                                All Agents
                            </Box>
                        </MenuItem>
                        {agents.filter(a => a.status === 'active').map((agent) => (
                            <MenuItem key={agent.id} value={agent.id}>
                                {agent.name}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
            </Box>

            {/* Top Metrics Bar */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
                <Grid item xs={12} sm={6} md={2.4}>
                    <MetricCard
                        title="Active Agents"
                        value={selectedAgent === 'all' ? "12 / 18" : "1 / 1"}
                        subtext={selectedAgent === 'all' ? "66% Deployment Rate" : "Active"}
                        icon={<SpeedIcon />}
                        color="#3b82f6"
                        progress={selectedAgent === 'all' ? 66 : 100}
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={2.4}>
                    <MetricCard
                        title="User Engagement"
                        value={selectedAgent === 'all' ? "3.2k" : "450"}
                        subtext={selectedAgent === 'all' ? "DAU / 15k MAU" : "Active Users"}
                        icon={<PeopleAltIcon />}
                        color="#8b5cf6"
                        progress={21}
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={2.4}>
                    <MetricCard
                        title="Throughput (24h)"
                        value={selectedAgent === 'all' ? "145k" : "12.5k"}
                        subtext="Requests Processed"
                        icon={<DataUsageIcon />}
                        color="#10b981"
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={2.4}>
                    <MetricCard
                        title="System Health"
                        value="98.2%"
                        subtext="Weighted uptime & error score"
                        icon={<HealthAndSafetyIcon />}
                        color="#ef4444"
                        progress={98.2}
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={2.4}>
                    <MetricCard
                        title="Avg Latency"
                        value={selectedAgent === 'all' ? "240ms" : "180ms"}
                        subtext="Global Response Time"
                        icon={<AccessTimeIcon />}
                        color="#f59e0b"
                    />
                </Grid>
            </Grid>

            {/* Top Charts Section - Volume Trend & Sentiment */}
            <Grid container spacing={3} sx={{ mb: 3 }}>
                {/* Volume Trend - Multi-line Chart - Increased Width (lg=6) */}
                <Grid item xs={12} md={12} lg={12}>
                    <Paper sx={{ p: 3, borderRadius: '16px', height: '300px', width: '520px', display: 'flex', flexDirection: 'column' }}>
                        <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>
                            Volume Trend (30 Days)
                        </Typography>
                        <Box sx={{ flexGrow: 1, minHeight: 0 }}>
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={volumeTrendData}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                                    <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: '#64748b' }} />
                                    <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b' }} />
                                    <Tooltip
                                        contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                                    />
                                    <Line
                                        type="monotone"
                                        dataKey="requests"
                                        name="Requests Received"
                                        stroke="#3b82f6"
                                        strokeWidth={3}
                                        dot={false}
                                        activeDot={{ r: 6 }}
                                    />
                                    <Line
                                        type="monotone"
                                        dataKey="tasks"
                                        name="Tasks Completed"
                                        stroke="#10b981"
                                        strokeWidth={3}
                                        dot={false}
                                    />
                                </LineChart>
                            </ResponsiveContainer>
                        </Box>
                    </Paper>
                </Grid>

                {/* User Sentiment Trend - Increased Width (lg=6) */}
                <Grid item xs={12} md={12} lg={12}>
                    <Paper sx={{ p: 3, borderRadius: '16px', height: '300px', width: '520px', display: 'flex', flexDirection: 'column' }}>
                        <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>
                            User Sentiment
                        </Typography>
                        <Box sx={{ flexGrow: 1, minHeight: 0 }}>
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={sentimentData}>
                                    <defs>
                                        <linearGradient id="colorPositive" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#10b981" stopOpacity={0.8} />
                                            <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                                        </linearGradient>
                                        <linearGradient id="colorNegative" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#ef4444" stopOpacity={0.8} />
                                            <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <XAxis dataKey="day" hide />
                                    <YAxis hide />
                                    <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
                                    <Area type="monotone" dataKey="positive" stroke="#10b981" fillOpacity={1} fill="url(#colorPositive)" />
                                    <Area type="monotone" dataKey="negative" stroke="#ef4444" fillOpacity={1} fill="url(#colorNegative)" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </Box>
                        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 4, mt: 2 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Box sx={{ width: 12, height: 12, borderRadius: '50%', bgcolor: '#10b981' }} />
                                <Typography variant="body2" fontWeight="500">Positive</Typography>
                            </Box>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Box sx={{ width: 12, height: 12, borderRadius: '50%', bgcolor: '#ef4444' }} />
                                <Typography variant="body2" fontWeight="500">Negative</Typography>
                            </Box>
                        </Box>
                    </Paper>
                </Grid>
            </Grid>

            {/* Bottom Charts Section - Average Hourly Traffic */}
            <Grid container spacing={3}>
                {/* Traffic Bar Chart */}
                <Grid item xs={12}>
                    <Paper sx={{ p: 3, borderRadius: '16px', height: '500px', width: '1050px', display: 'flex', flexDirection: 'column' }}>
                        <Typography variant="h6" fontWeight="bold" sx={{ mb: 1 }}>
                            Average Hourly Traffic
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                            Average activity density by Hour of Day (Peak: 10-12PM & 3-4PM)
                        </Typography>
                        <Box sx={{ flexGrow: 1, minHeight: 0 }}>
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart
                                    data={hourlyTrafficData}
                                    margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                                >
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                                    <XAxis
                                        dataKey="hour"
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fill: '#64748b' }}
                                    />
                                    <YAxis
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fill: '#64748b' }}
                                    />
                                    <Tooltip
                                        cursor={{ fill: 'transparent' }}
                                        contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                                    />
                                    <Bar
                                        dataKey="value"
                                        name="Avg Load"
                                        fill="#3b82f6"
                                        radius={[4, 4, 0, 0]}
                                    />
                                </BarChart>
                            </ResponsiveContainer>
                        </Box>
                    </Paper>
                </Grid>
            </Grid>
        </Container>
    );
};
