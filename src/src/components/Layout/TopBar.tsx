import { AppBar, Toolbar, IconButton, Menu, MenuItem, Box, Avatar, Typography } from '@mui/material';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import SettingsIcon from '@mui/icons-material/Settings';
import LogoutIcon from '@mui/icons-material/Logout';
import { useStore } from '../../store/useStore';

const drawerWidth = 260;

export const TopBar = () => {
  const navigate = useNavigate();
  const { t } = useTranslation('nav');
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const { settings, userProfile, setIsLoggedIn } = useStore();

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleSettings = () => {
    handleMenuClose();
    navigate('/settings');
  };

  const handleLogout = () => {
    handleMenuClose();
    setIsLoggedIn(false);
    navigate('/login');
  };

  return (
    <AppBar
      position="fixed"
      sx={{
        width: `calc(100% - ${drawerWidth}px)`,
        ml: `${drawerWidth}px`,
        backgroundColor: '#fff',
        color: '#1a1a2e',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
      }}
    >
      <Toolbar>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <img src="asahi-home-logo.png" alt="Asahi Logo" style={{ height: 80, marginRight: 10 }} />
          <Typography variant="h6" component="div" sx={{ color: '#1a1a2e' }}>
          </Typography>
        </Box>
        <Box sx={{ flexGrow: 1 }} />
        
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Box sx={{ textAlign: 'right', mr: 1 }}>
            <Typography variant="caption" sx={{ display: 'block', color: '#666' }}>
              {settings.country}
            </Typography>
            <Typography variant="caption" sx={{ display: 'block', color: '#999' }}>
              {settings.language.toUpperCase()}
            </Typography>
          </Box>

          <IconButton onClick={handleSettings} sx={{ color: '#666' }}>
            <SettingsIcon />
          </IconButton>

          <IconButton onClick={handleMenuOpen}>
            <Avatar sx={{ width: 32, height: 32, bgcolor: '#4a90e2' }}>
              {userProfile.name.charAt(0)}
            </Avatar>
          </IconButton>

          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'right',
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
          >
            <MenuItem onClick={handleSettings}>
              <SettingsIcon sx={{ mr: 1 }} fontSize="small" />
              {t('settings')}
            </MenuItem>
            <MenuItem onClick={handleLogout}>
              <LogoutIcon sx={{ mr: 1 }} fontSize="small" />
              {t('logout', 'Logout')}
            </MenuItem>
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
};