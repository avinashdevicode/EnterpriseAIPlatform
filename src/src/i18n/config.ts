import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import common from './locales/en/common.json';
import nav from './locales/en/nav.json';
import agents from './locales/en/agents.json';
import analytics from './locales/en/analytics.json';
import metrics from './locales/en/metrics.json';
import invoice from './locales/en/invoice.json';
import customer from './locales/en/customer.json';
import settings from './locales/en/settings.json';

i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: {
        common,
        nav,
        agents,
        analytics,
        metrics,
        invoice,
        customer,
        settings,
      },
    },
    lng: 'en',
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
    ns: ['common', 'nav', 'agents', 'analytics', 'metrics', 'invoice', 'customer', 'settings'],
    defaultNS: 'common',
    react: {
      useSuspense: false,
    },
  });

export default i18n;