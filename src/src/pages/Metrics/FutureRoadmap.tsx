import React, { useState, useMemo } from 'react';
import {
    Box,
    Container,
    Grid,
    Paper,
    Typography,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Chip,
    FormControl,
    Select,
    MenuItem,
    Card,
    CardContent,
    TextField,
    InputAdornment,
} from '@mui/material';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    ScatterChart,
    Scatter,
    ZAxis,
    Cell,
    ReferenceLine
} from 'recharts';
import SearchIcon from '@mui/icons-material/Search';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import SavingsIcon from '@mui/icons-material/Savings';
import EngineeringIcon from '@mui/icons-material/Engineering';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import { agents } from '../../data/agents.tsx';

// --- Data Parsing Helpers ---

const parseCurrencyRangeAverage = (str: string): number => {
    // Matches "$50,000" or "$100,000"
    const numbers = str.match(/[\d,]+/g);
    if (!numbers) return 0;

    const validNumbers = numbers.map(s => parseInt(s.replace(/,/g, ''), 10));
    const sum = validNumbers.reduce((a, b) => a + b, 0);
    return sum / validNumbers.length;
};

const parseHours = (str: string): number => {
    // Matches "1,200" or "800"
    const match = str.match(/[\d,]+/);
    return match ? parseInt(match[0].replace(/,/g, ''), 10) : 0;
};

// --- ROI Calculation ---
const HOURLY_RATE = 50; // Assumed blended internal hourly rate saved
const INFRA_MULTIPLIER = 0.2; // Assumed annual infra cost is 20% of build

interface RoadmapItem {
    id: string;
    name: string;
    function: string;
    buildCost: number; // One-time
    annualInfraCost: number; // Recurring
    monthlyHoursSaved: number;
    annualSavingsValue: number; // (Monthly Hours * 12 * Rate)
    totalFirstYearCost: number; // Build + Infra
    roiRatio: number; // Annual Savings / First Year Cost
    score: number; // Normalized priority score
}

const calculateRoadmapData = (): RoadmapItem[] => {
    return agents
        .filter(a => a.status === 'coming-soon')
        .map(agent => {
            const buildCost = parseCurrencyRangeAverage(agent.documentation.roi.costToBuild);
            const monthlyHours = parseHours(agent.documentation.roi.manHoursReduced);

            // Heuristic for infra if string parsing fails or is complex
            const infraCost = buildCost * INFRA_MULTIPLIER;

            const annualSavings = monthlyHours * 12 * HOURLY_RATE;
            const totalCost1stYear = buildCost + infraCost;

            // Avoid division by zero
            const ratio = totalCost1stYear > 0 ? annualSavings / totalCost1stYear : 0;

            return {
                id: agent.id,
                name: agent.name,
                function: agent.businessFunction,
                buildCost: buildCost,
                annualInfraCost: infraCost,
                monthlyHoursSaved: monthlyHours,
                annualSavingsValue: annualSavings,
                totalFirstYearCost: totalCost1stYear,
                roiRatio: parseFloat(ratio.toFixed(2)),
                score: parseFloat((ratio * 10).toFixed(1)), // Just scaling it up
            };
        })
        .sort((a, b) => b.roiRatio - a.roiRatio); // Default sort by highest ROI
};

const KPICard = ({ title, value, subtext, icon, color }: any) => (
    <Card sx={{ height: '100%', borderRadius: '16px', border: '1px solid #f0f0f0', boxShadow: 'none' }}>
        <CardContent>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                <Box>
                    <Typography variant="body2" color="text.secondary" fontWeight="600" gutterBottom>
                        {title}
                    </Typography>
                    <Typography variant="h4" fontWeight="800" sx={{ color: '#1a202c' }}>
                        {value}
                    </Typography>
                </Box>
                <Box sx={{ p: 1.5, borderRadius: '12px', bgcolor: `${color}15`, color: color }}>
                    {icon}
                </Box>
            </Box>
            <Typography variant="caption" color="text.secondary">
                {subtext}
            </Typography>
        </CardContent>
    </Card>
);

export const FutureRoadmap = () => {
    const rawData = useMemo(() => calculateRoadmapData(), []);
    const [filterFunction, setFilterFunction] = useState('All');
    const [searchTerm, setSearchTerm] = useState('');

    // --- Filtering ---
    const functions = ['All', ...Array.from(new Set(rawData.map(i => i.function)))];

    const filteredData = useMemo(() => {
        return rawData.filter(item => {
            const matchesFunction = filterFunction === 'All' || item.function === filterFunction;
            const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
            return matchesFunction && matchesSearch;
        });
    }, [rawData, filterFunction, searchTerm]);

    // --- Aggregates ---
    const totalPotentialSavings = filteredData.reduce((acc, curr) => acc + curr.annualSavingsValue, 0);
    const totalInvestment = filteredData.reduce((acc, curr) => acc + curr.totalFirstYearCost, 0);
    const overallROI = totalInvestment > 0 ? (totalPotentialSavings / totalInvestment).toFixed(1) : '0';

    return (
        <Container maxWidth="xl" sx={{ py: 4 }}>
            {/* Header */}
            <Box sx={{ mb: 4 }}>
                <Typography variant="h4" fontWeight="800" sx={{ mb: 1, color: '#1a202c' }}>
                    Future Roadmap & Prioritization
                </Typography>
                <Typography variant="body1" color="text.secondary">
                    Strategic analysis of 'Coming Soon' agents based on Effort vs. BAU Savings.
                </Typography>
            </Box>

            {/* KPI Cards */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
                <Grid item xs={12} sm={4}>
                    <KPICard
                        title="Potential Annual Savings"
                        value={`$${(totalPotentialSavings / 1000000).toFixed(1)}M`}
                        subtext="Est. value of reduced human hours (Year 1)"
                        icon={<SavingsIcon />}
                        color="#10b981"
                    />
                </Grid>
                <Grid item xs={12} sm={4}>
                    <KPICard
                        title="Total Investment Required"
                        value={`$${(totalInvestment / 1000000).toFixed(1)}M`}
                        subtext="Build + 1 Year Infrastructure"
                        icon={<EngineeringIcon />}
                        color="#ef4444"
                    />
                </Grid>
                <Grid item xs={12} sm={4}>
                    <KPICard
                        title="Aggregated ROI Multiplier"
                        value={`${overallROI}x`}
                        subtext="Return per dollar invested in first year"
                        icon={<TrendingUpIcon />}
                        color="#3b82f6"
                    />
                </Grid>
            </Grid>

            {/* Filters */}
            <Paper sx={{ p: 2, mb: 3, borderRadius: '12px' }}>
                <Grid container spacing={2} alignItems="center">
                    <Grid item xs={12} md={3}>
                        <FormControl fullWidth size="small">
                            <Select
                                value={filterFunction}
                                onChange={(e) => setFilterFunction(e.target.value)}
                                displayEmpty
                                MenuProps={{ PaperProps: { sx: { maxHeight: 300 } } }}
                            >
                                {functions.map(f => (
                                    <MenuItem key={f} value={f}>{f}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <TextField
                            fullWidth
                            size="small"
                            placeholder="Search agents..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <SearchIcon fontSize="small" color="action" />
                                    </InputAdornment>
                                ),
                            }}
                        />
                    </Grid>
                </Grid>
            </Paper>

            {/* Charts Row */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
                {/* Scatter Plot: Cost vs Savings */}
                <Grid item xs={12} lg={7}>
                    <Paper sx={{ p: 3, borderRadius: '16px', height: '450px', width: '550px', display: 'flex', flexDirection: 'column' }}>
                        <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>
                            Investment vs. Impact Matrix
                        </Typography>
                        <Box sx={{ flexGrow: 1, minHeight: 0 }}>
                            <ResponsiveContainer width="100%" height="100%">
                                <ScatterChart margin={{ top: 20, right: 20, bottom: 30, left: 10 }}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis
                                        type="number"
                                        dataKey="buildCost"
                                        name="Build Cost"
                                        unit="$"
                                        tickFormatter={(val) => `$${val / 1000}k`}
                                        label={{ value: 'Est. Implementation Cost', position: 'bottom', offset: 0 }}
                                    />
                                    <YAxis
                                        type="number"
                                        dataKey="monthlyHoursSaved"
                                        name="Hours Saved"
                                        unit="h"
                                        width={80}
                                        label={{ value: 'Monthly Hours Saved', angle: -90, position: 'insideLeft', style: { textAnchor: 'middle' } }}
                                    />
                                    <ZAxis type="number" dataKey="roiRatio" range={[60, 400]} name="ROI Score" />
                                    <Tooltip
                                        cursor={{ strokeDasharray: '3 3' }}
                                        content={({ active, payload }: any) => {
                                            if (active && payload && payload.length) {
                                                const data = payload[0].payload;
                                                return (
                                                    <Box sx={{ bgcolor: 'white', p: 2, borderRadius: 2, boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}>
                                                        <Typography variant="subtitle2" fontWeight="bold">{data.name}</Typography>
                                                        <Typography variant="body2">Cost: ${data.buildCost.toLocaleString()}</Typography>
                                                        <Typography variant="body2">Saved: {data.monthlyHoursSaved} hrs/mo</Typography>
                                                        <Typography variant="body2" color="primary.main" fontWeight="bold">ROI: {data.roiRatio}x</Typography>
                                                    </Box>
                                                );
                                            }
                                            return null;
                                        }}
                                    />
                                    <Scatter name="Agents" data={filteredData} fill="#8884d8">
                                        {filteredData.map((_, index) => (
                                            <Cell key={`cell-${index}`} fill={filteredData[index].roiRatio > 2.5 ? "#10b981" : "#3b82f6"} />
                                        ))}
                                    </Scatter>
                                    <ReferenceLine x={75000} stroke="red" strokeDasharray="3 3" label="High Cost" />
                                    <ReferenceLine y={600} stroke="green" strokeDasharray="3 3" label="High Impact" />
                                </ScatterChart>
                            </ResponsiveContainer>
                        </Box>
                    </Paper>
                </Grid>

                {/* Bar Chart: Efficiency Ranking */}
                <Grid item xs={12} lg={5}>
                    <Paper sx={{ p: 3, borderRadius: '16px', height: '450px', width: '550px', display: 'flex', flexDirection: 'column' }}>
                        <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>
                            Top ROI Opportunities
                        </Typography>
                        <Box sx={{ flexGrow: 1, minHeight: 0 }}>
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart
                                    layout="vertical"
                                    data={filteredData.slice(0, 8)} // Top 8
                                    margin={{ top: 5, right: 30, left: 40, bottom: 5 }}
                                >
                                    <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
                                    <XAxis type="number" hide />
                                    <YAxis type="category" dataKey="name" width={150} tick={{ fontSize: 11 }} interval={0} />
                                    <Tooltip
                                        cursor={{ fill: 'transparent' }}
                                        contentStyle={{ borderRadius: '8px' }}
                                    />
                                    <Bar dataKey="roiRatio" fill="#3b82f6" radius={[0, 4, 4, 0]} name="ROI Ratio">
                                        {filteredData.slice(0, 8).map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={index < 3 ? "#10b981" : "#3b82f6"} />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </Box>
                    </Paper>
                </Grid>
            </Grid>

            {/* Detailed Table */}
            <Paper sx={{ width: '100%', overflow: 'hidden', borderRadius: '16px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}>
                <TableContainer sx={{ maxHeight: 600 }}>
                    <Table stickyHeader>
                        <TableHead>
                            <TableRow>
                                <TableCell sx={{ fontWeight: 'bold' }}>Agent Name</TableCell>
                                <TableCell sx={{ fontWeight: 'bold' }}>Business Function</TableCell>
                                <TableCell align="right" sx={{ fontWeight: 'bold' }}>Est. Build Cost</TableCell>
                                <TableCell align="right" sx={{ fontWeight: 'bold' }}>Est. Annual Infra</TableCell>
                                <TableCell align="right" sx={{ fontWeight: 'bold' }}>Hours Saved/Mo</TableCell>
                                <TableCell align="right" sx={{ fontWeight: 'bold' }}>Efficiency (ROI)</TableCell>
                                <TableCell align="center" sx={{ fontWeight: 'bold' }}>Priority</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {filteredData.map((row) => (
                                <TableRow hover key={row.id}>
                                    <TableCell component="th" scope="row" sx={{ fontWeight: 500 }}>
                                        {row.name}
                                    </TableCell>
                                    <TableCell>{row.function}</TableCell>
                                    <TableCell align="right">${row.buildCost.toLocaleString()}</TableCell>
                                    <TableCell align="right">${row.annualInfraCost.toLocaleString()}</TableCell>
                                    <TableCell align="right">
                                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 0.5 }}>
                                            <AccessTimeIcon fontSize="small" sx={{ color: '#94a3b8', fontSize: 16 }} />
                                            {row.monthlyHoursSaved}
                                        </Box>
                                    </TableCell>
                                    <TableCell align="right">
                                        <Typography fontWeight="bold" sx={{ color: row.roiRatio > 2.5 ? '#10b981' : '#3b82f6' }}>
                                            {row.roiRatio}x
                                        </Typography>
                                    </TableCell>
                                    <TableCell align="center">
                                        <Chip
                                            label={row.roiRatio > 3.0 ? "High" : row.roiRatio > 2.0 ? "Medium" : "Low"}
                                            size="small"
                                            color={row.roiRatio > 3.0 ? "success" : row.roiRatio > 2.0 ? "primary" : "default"}
                                            variant="filled"
                                            sx={{
                                                bgcolor: row.roiRatio > 3.0 ? '#dcfce7' : row.roiRatio > 2.0 ? '#dbeafe' : '#f1f5f9',
                                                color: row.roiRatio > 3.0 ? '#166534' : row.roiRatio > 2.0 ? '#1e40af' : '#475569',
                                                fontWeight: 600
                                            }}
                                        />
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Paper>
        </Container>
    );
};


