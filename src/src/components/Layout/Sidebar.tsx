import { Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Toolbar, Box } from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import BarChartIcon from '@mui/icons-material/BarChart';
import AssessmentIcon from '@mui/icons-material/Assessment';

const drawerWidth = 260;

export const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation('nav');

  const menuItems = [
    { path: '/agents', label: t('agents'), icon: <SmartToyIcon /> },
    { path: '/analytics', label: t('dataAnalytics'), icon: <BarChartIcon /> },
    { path: '/metrics', label: t('agentMetrics'), icon: <AssessmentIcon /> },
  ];

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: drawerWidth,
          boxSizing: 'border-box',
          backgroundColor: '#1a1a2e',
          color: '#fff',
        },
      }}
    >
      <Toolbar>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <SmartToyIcon sx={{ color: '#4a90e2' }} />
          <span style={{ fontWeight: 600 }}>Nova Platform</span>
        </Box>
      </Toolbar>
      <List sx={{ pt: 3 }}>
        {menuItems.map((item) => (
          <ListItem key={item.path} disablePadding>
            <ListItemButton
              selected={location.pathname.startsWith(item.path)}
              onClick={() => navigate(item.path)}
              sx={{
                '&.Mui-selected': {
                  backgroundColor: 'rgba(74, 144, 226, 0.2)',
                  borderRight: '3px solid #4a90e2',
                  '&:hover': {
                    backgroundColor: 'rgba(74, 144, 226, 0.3)',
                  },
                },
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.05)',
                },
              }}
            >
              <ListItemIcon sx={{ color: 'inherit', minWidth: 40 }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText primary={item.label} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Drawer>
  );
};