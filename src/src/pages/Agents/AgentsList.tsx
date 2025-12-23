import React, { useState } from 'react';
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  Box,
  Chip,
  Divider,
  Stack,
  Link,
  Collapse,
  IconButton,
  Select,
  MenuItem,
  OutlinedInput,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import DescriptionIcon from '@mui/icons-material/Description';
import PeopleIcon from '@mui/icons-material/People';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import EmailIcon from '@mui/icons-material/Email';
import LinkIcon from '@mui/icons-material/Link';
import { Link as RouterLink } from 'react-router-dom';
import { Agent, agents } from '../../data/agents';

interface AgentCardProps {
  agent: Agent;
  isExpandedProp?: boolean;
  onToggleExpand?: (id: string, expanded: boolean) => void;
}

const AgentCard = ({ agent, isExpandedProp = false, onToggleExpand }: AgentCardProps) => {
  const navigate = useNavigate();

  const handleExpandClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onToggleExpand) {
      onToggleExpand(agent.id, !isExpandedProp);
    }
  };

  return (
    <Card
      sx={{
        minHeight: '10cm',
        width: '8cm',
        display: 'flex',
        flexDirection: 'column',
        background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
        border: '1px solid #e8ecf1',
        borderRadius: '12px',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        '&:hover': {
          transform: 'translateY(-8px)',
          boxShadow: '0 12px 32px rgba(0, 0, 0, 0.12)',
          borderColor: '#d0d7e0',
        },
        cursor: 'pointer',
      }}
    >
      <CardContent sx={{ flexGrow: 1, pb: 1 }}>
        {/* Tile Header with Icon and Status */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            mb: 2,
            pb: 2,
            borderBottom: '2px solid #f0f2f5',
          }}
        >
          <Box
            sx={{
              p: 1.5,
              borderRadius: '10px',
              bgcolor: 'rgba(74, 144, 226, 0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {agent.icon}
          </Box>
          <Chip
            label={agent.status === 'active' ? 'Active' : 'Coming Soon'}
            color={agent.status === 'active' ? 'success' : 'default'}
            size="small"
            sx={{ fontWeight: 600 }}
          />
        </Box>

        {/* Title */}
        <Typography variant="h6" gutterBottom sx={{ fontWeight: 700, color: '#1a202c', mb: 1.5 }}>
          {agent.name}
        </Typography>

        {/* Description */}
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            mb: 2,
            lineHeight: 1.4,
            fontSize: '0.8rem',
            color: '#4a5568',
            display: '-webkit-box',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            WebkitLineClamp: 3,
            WebkitBoxOrient: 'vertical',
            whiteSpace: 'normal',
            wordBreak: 'break-word',
          }}
        >
          {agent.description}
        </Typography>

        {/* Business Function Chip */}
        <Box sx={{ mb: 2 }}>
          <Chip
            label={agent.businessFunction}
            variant="outlined"
            size="small"
            sx={{
              fontSize: '0.75rem',
              fontWeight: 600,
              borderColor: '#cbd5e0',
              bgcolor: '#f7fafc',
            }}
          />
        </Box>

        {/* Collapsible Details */}
        <Collapse in={isExpandedProp} timeout="auto">
          <Box sx={{ mt: 2, pt: 2, borderTop: '1px solid #e8ecf1' }}>
            {/* Technologies Grid */}
            <Box sx={{ mb: 2 }}>
              <Typography variant="caption" sx={{ fontWeight: 700, display: 'block', mb: 1, color: '#2d3748' }}>
                APPS/PLATFORMS
              </Typography>
              <Stack direction="row" spacing={0.8} flexWrap="wrap" useFlexGap>
                {agent.technologies.apps.map((app, idx) => (
                  <Chip
                    key={idx}
                    label={app}
                    size="small"
                    sx={{
                      mb: 0.5,
                      bgcolor: '#edf2f7',
                      color: '#2d3748',
                      fontWeight: 500,
                      fontSize: '0.75rem',
                    }}
                  />
                ))}
              </Stack>
            </Box>
            <Box sx={{ mb: 2 }}>
              <Typography variant="caption" sx={{ fontWeight: 700, display: 'block', mb: 1, color: '#2d3748' }}>
                AI/ML
              </Typography>
              <Stack direction="row" spacing={0.8} flexWrap="wrap" useFlexGap>
                {agent.technologies.aiml.map((ai, idx) => (
                  <Chip
                    key={idx}
                    label={ai}
                    size="small"
                    variant="outlined"
                    sx={{
                      mb: 0.5,
                      borderColor: '#cbd5e0',
                      fontSize: '0.75rem',
                    }}
                  />
                ))}
              </Stack>
            </Box>

            <Box sx={{ mb: 2 }}>
              <Typography variant="caption" sx={{ fontWeight: 700, display: 'block', mb: 1, color: '#2d3748' }}>
                INTEGRATIONS
              </Typography>
              <Stack direction="row" spacing={0.8} flexWrap="wrap" useFlexGap>
                {agent.technologies.integrations.map((integ, idx) => (
                  <Chip
                    key={idx}
                    label={integ}
                    size="small"
                    variant="outlined"
                    sx={{
                      mb: 0.5,
                      borderColor: '#cbd5e0',
                      fontSize: '0.75rem',
                    }}
                  />
                ))}
              </Stack>
            </Box>

            {/* Data Sources */}
            <Box sx={{ mb: 2 }}>
              <Typography variant="caption" sx={{ fontWeight: 700, display: 'block', mb: 0.5, color: '#2d3748' }}>
                DATA SOURCES
              </Typography>
              <Typography variant="caption" color="text.secondary" sx={{ display: 'block', lineHeight: 1.5, fontSize: '0.75rem' }}>
                {agent.dataSources.join(' • ')}
              </Typography>
            </Box>

            {/* Trigger Types */}
            <Box sx={{ mb: 2 }}>
              <Typography variant="caption" sx={{ fontWeight: 700, display: 'block', mb: 0.5, color: '#2d3748' }}>
                TRIGGER TYPES
              </Typography>
              <Typography variant="caption" color="text.secondary" sx={{ display: 'block', lineHeight: 1.5, fontSize: '0.75rem' }}>
                {agent.triggerTypes.join(' • ')}
              </Typography>
            </Box>
          </Box>
        </Collapse>

        {/* Contact & Document Links - Always Visible */}
        <Divider sx={{ my: 2, borderColor: '#e8ecf1' }} />

        <Stack spacing={0.8}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <EmailIcon sx={{ fontSize: 16, color: '#718096' }} />
            <Link href={`mailto:${agent.contact}`} underline="hover" variant="body2" sx={{ fontSize: '0.75rem' }}>
              {agent.contact}
            </Link>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <LinkIcon sx={{ fontSize: 16, color: '#718096' }} />
            <RouterLink to={agent.document} style={{ textDecoration: 'none' }}>
              <Link component="span" underline="hover" variant="body2" sx={{ fontSize: '0.75rem' }}>
                View Documentation
              </Link>
            </RouterLink>
          </Box>
        </Stack>
      </CardContent>

      {/* Actions */}
      <CardActions sx={{ pt: 0, gap: 1 }}>
        <IconButton
          size="small"
          onClick={handleExpandClick}
          sx={{
            ml: 'auto',
            color: '#4a90e2',
            '&:hover': {
              bgcolor: 'rgba(74, 144, 226, 0.1)',
            },
          }}
          aria-expanded={isExpandedProp}
        >
          {isExpandedProp ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
        </IconButton>
        <Button
          size="small"
          variant="contained"
          onClick={() => navigate(agent.path)}
          disabled={agent.status === 'coming-soon'}
          sx={{
            flex: 1,
            background: agent.status === 'coming-soon' ? '#cbd5e0' : 'linear-gradient(135deg, #4a90e2 0%, #357abd 100%)',
            textTransform: 'none',
            fontWeight: 600,
            py: 0.8,
            borderRadius: '8px',
            '&:hover': {
              background: agent.status === 'coming-soon' ? '#cbd5e0' : 'linear-gradient(135deg, #357abd 0%, #2563a1 100%)',
            },
          }}
        >
          View Details
        </Button>
      </CardActions>
    </Card>
  );
};

export const AgentsList = () => {
  const [expandedCards, setExpandedCards] = useState<Record<string, boolean>>({});
  const [selectedFunctions, setSelectedFunctions] = useState<string[]>([]);
  const [selectedCountries, setSelectedCountries] = useState<string[]>([]);

  const businessFunctions = [
    'Extended Finance Functions',
    'Human Resources',
    'Supply Chain',
    'Marketing',
    'Manufacturing',
  ];

  const countriesList = [
    { code: 'GB', name: 'United Kingdom' },
    { code: 'SE', name: 'Sweden' },
    { code: 'CH', name: 'Switzerland' },
    { code: 'CA', name: 'Canada' },
    { code: 'US', name: 'United States' },
    { code: 'NL', name: 'Netherlands' },
    { code: 'FR', name: 'France' },
    { code: 'CZ', name: 'Czech Republic' },
    { code: 'SK', name: 'Slovakia' },
    { code: 'DE', name: 'Germany' },
    { code: 'RO', name: 'Romania' },
    { code: 'PL', name: 'Poland' },
    { code: 'HU', name: 'Hungary' },
    { code: 'IT', name: 'Italy' },
    { code: 'AT', name: 'Austria' },
  ];

  const handleFunctionToggle = (func: string) => {
    setSelectedFunctions((prev) =>
      prev.includes(func) ? prev.filter((f) => f !== func) : [...prev, func]
    );
  };

  const handleCountryChange = (event: any) => {
    setSelectedCountries(event.target.value);
  };

  const handleToggleExpand = (agentId: string, isExpanded: boolean) => {
    setExpandedCards((prev) => ({
      ...prev,
      [agentId]: isExpanded,
    }));
  };

  // Filter agents based on selected business functions and countries
  const filteredAgents = agents.filter((agent) => {
    // Check business function filter
    const functionMatches =
      selectedFunctions.length === 0 ||
      selectedFunctions.some((func) => agent.businessFunction.includes(func));

    // Check country filter
    const countryMatches =
      selectedCountries.length === 0 ||
      selectedCountries.some((country) => agent.countries.includes(country));

    return functionMatches && countryMatches;
  });

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Box sx={{ mb: 6 }}>
        <Typography variant="h4" gutterBottom sx={{ fontWeight: 700, color: '#1a202c' }}>
          AI Agents
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ fontSize: '1rem', color: '#4a5568', mb: 3 }}>
          Explore our intelligent agents designed to automate key business processes across Finance, Marketing, and Supply Chain operations.
        </Typography>

        {/* Business Function Filter Banner */}
        <Box
          sx={{
            mb: 4,
            p: 3,
            background: 'linear-gradient(135deg, #f0f4f8 0%, #e8eef7 100%)',
            borderRadius: '12px',
            border: '2px solid #d0dce9',
          }}
        >
          <Stack direction="column" spacing={2}>
            {/* Business Function Chips */}
            <Stack direction="row" spacing={1.5} flexWrap="wrap" useFlexGap>
              {businessFunctions.map((func) => {
                const isSelected = selectedFunctions.includes(func);
                return (
                  <Chip
                    key={func}
                    label={func}
                    onClick={() => handleFunctionToggle(func)}
                    variant={isSelected ? 'filled' : 'outlined'}
                    sx={{
                      fontWeight: 600,
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      backgroundColor: isSelected ? '#4a90e2' : 'transparent',
                      color: isSelected ? '#ffffff' : '#2d3748',
                      borderColor: isSelected ? '#4a90e2' : '#cbd5e0',
                      borderWidth: '2px',
                      '&:hover': {
                        borderColor: '#4a90e2',
                        backgroundColor: isSelected ? '#357abd' : 'rgba(74, 144, 226, 0.1)',
                        transform: 'translateY(-2px)',
                        boxShadow: '0 4px 12px rgba(74, 144, 226, 0.2)',
                      },
                      py: 1,
                      px: 2,
                    }}
                  />
                );
              })}
            </Stack>

            {/* Country Filter Dropdown */}
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Select
                multiple
                value={selectedCountries}
                onChange={handleCountryChange}
                input={<OutlinedInput />}
                displayEmpty
                renderValue={(selected) => {
                  if (selected.length === 0) {
                    return <span style={{ color: '#999' }}>All Countries</span>;
                  }
                  return selected.join(', ');
                }}
                sx={{
                  width: 150,
                  height: 30,
                  backgroundColor: '#ffffff',
                  borderRadius: '8px',
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#cbd5e0',
                    borderWidth: '2px',
                  },
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#4a90e2',
                  },
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#4a90e2',
                    borderWidth: '2px',
                  },
                  '& .MuiChip-root': {
                    backgroundColor: '#4a90e2',
                    color: '#ffffff',
                    fontWeight: 600,
                  },
                }}
              >
                {countriesList.map((country) => (
                  <MenuItem key={country.code} value={country.code}>
                    {country.name} ({country.code})
                  </MenuItem>
                ))}
              </Select>
            </Box>

            {/* Clear All Filters Button */}
            {(selectedFunctions.length > 0 || selectedCountries.length > 0) && (
              <Box sx={{ display: 'flex', gap: 1 }}>
                {selectedFunctions.length > 0 && (
                  <Button
                    size="small"
                    variant="outlined"
                    onClick={() => setSelectedFunctions([])}
                    sx={{
                      borderColor: '#cbd5e0',
                      color: '#2d3748',
                      fontWeight: 600,
                      '&:hover': {
                        borderColor: '#4a90e2',
                        color: '#4a90e2',
                        backgroundColor: 'rgba(74, 144, 226, 0.05)',
                      },
                    }}
                  >
                    Clear Business Function Filters
                  </Button>
                )}
                {selectedCountries.length > 0 && (
                  <Button
                    size="small"
                    variant="outlined"
                    onClick={() => setSelectedCountries([])}
                    sx={{
                      borderColor: '#cbd5e0',
                      color: '#2d3748',
                      fontWeight: 600,
                      '&:hover': {
                        borderColor: '#4a90e2',
                        color: '#4a90e2',
                        backgroundColor: 'rgba(74, 144, 226, 0.05)',
                      },
                    }}
                  >
                    Clear Country Filters
                  </Button>
                )}
              </Box>
            )}
          </Stack>
        </Box>
      </Box>

      <Grid container spacing={3}>
        {filteredAgents.map((agent) => (
          <Grid xs={12} sm={6} md={4} key={agent.id}>
            <AgentCard
              agent={agent}
              isExpandedProp={expandedCards[agent.id] || false}
              onToggleExpand={handleToggleExpand}
            />
          </Grid>
        ))}
      </Grid>
      {filteredAgents.length === 0 && (
        <Box sx={{ textAlign: 'center', py: 6 }}>
          <Typography variant="body1" color="text.secondary">
            No agents found for the selected business functions.
          </Typography>
        </Box>
      )}
    </Container>
  );
};