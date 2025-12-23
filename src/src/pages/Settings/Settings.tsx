import { useState } from 'react';
import {
  Container,
  Typography,
  Box,
  Paper,
  TextField,
  MenuItem,
  Button,
  Alert,
  Grid,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useStore } from '../../store/useStore';

const countries = [
  { code: 'GB', name: 'United Kingdom', languages: ['en'] },
  { code: 'SE', name: 'Sweden', languages: ['sv'] },
  { code: 'CH', name: 'Switzerland', languages: ['de', 'fr', 'it'] },
  { code: 'CA', name: 'Canada', languages: ['en', 'fr'] },
  { code: 'US', name: 'United States', languages: ['en'] },
  { code: 'NL', name: 'Netherlands', languages: ['nl'] },
  { code: 'FR', name: 'France', languages: ['fr'] },
  { code: 'CZ', name: 'Czech Republic', languages: ['cs'] },
  { code: 'SK', name: 'Slovakia', languages: ['sk'] },
  { code: 'DE', name: 'Germany', languages: ['de'] },
  { code: 'RO', name: 'Romania', languages: ['ro'] },
  { code: 'PL', name: 'Poland', languages: ['pl'] },
  { code: 'HU', name: 'Hungary', languages: ['hu'] },
  { code: 'IT', name: 'Italy', languages: ['it'] },
  { code: 'AT', name: 'Austria', languages: ['de'] },
];

export const Settings = () => {
  const { t, i18n } = useTranslation('settings');
  const { settings, setSettings } = useStore();
  const [localSettings, setLocalSettings] = useState(settings);
  const [saved, setSaved] = useState(false);

  const selectedCountry = countries.find((c) => c.code === localSettings.country);

  const handleSave = () => {
    setSettings(localSettings);
    i18n.changeLanguage(localSettings.language);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const handleCountryChange = (countryCode: string) => {
    const country = countries.find((c) => c.code === countryCode);
    if (country) {
      setLocalSettings({
        country: countryCode,
        language: country.languages[0],
      });
    }
  };

  return (
    <Container maxWidth="md">
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          {t('title')}
        </Typography>
        <Typography variant="body1" color="text.secondary">
          {t('subtitle')}
        </Typography>
      </Box>

      {saved && (
        <Alert severity="success" sx={{ mb: 3 }}>
          {t('settingsSaved')}
        </Alert>
      )}

      <Paper sx={{ p: 4 }}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              select
              label={t('selectCountry')}
              value={localSettings.country}
              onChange={(e) => handleCountryChange(e.target.value)}
            >
              {countries.map((country) => (
                <MenuItem key={country.code} value={country.code}>
                  {t(`countries.${country.code}`)}
                </MenuItem>
              ))}
            </TextField>
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              select
              label={t('selectLanguage')}
              value={localSettings.language}
              onChange={(e) =>
                setLocalSettings({ ...localSettings, language: e.target.value })
              }
              disabled={!selectedCountry}
              helperText={
                selectedCountry
                  ? `Available languages for ${t(`countries.${selectedCountry.code}`)}`
                  : 'Please select a country first'
              }
            >
              {selectedCountry?.languages.map((lang) => (
                <MenuItem key={lang} value={lang}>
                  {t(`languages.${lang}`)}
                </MenuItem>
              ))}
            </TextField>
          </Grid>

          <Grid item xs={12}>
            <Button
              fullWidth
              variant="contained"
              size="large"
              onClick={handleSave}
            >
              {t('saveSettings')}
            </Button>
          </Grid>
        </Grid>
      </Paper>

      <Paper sx={{ p: 3, mt: 3 }}>
        <Typography variant="h6" gutterBottom>
          Preview
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <Typography variant="caption" color="text.secondary">
              Selected Country
            </Typography>
            <Typography>
              {selectedCountry ? t(`countries.${selectedCountry.code}`) : '-'}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="caption" color="text.secondary">
              Selected Language
            </Typography>
            <Typography>
              {localSettings.language ? t(`languages.${localSettings.language}`) : '-'}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="caption" color="text.secondary">
              Date Format Example
            </Typography>
            <Typography>
              {new Intl.DateTimeFormat(
                localSettings.language === 'en' ? 'en-US' : `${localSettings.language}-${localSettings.country}`
              ).format(new Date())}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="caption" color="text.secondary">
              Number Format Example
            </Typography>
            <Typography>
              {new Intl.NumberFormat(
                localSettings.language === 'en' ? 'en-US' : `${localSettings.language}-${localSettings.country}`
              ).format(1234567.89)}
            </Typography>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
};
