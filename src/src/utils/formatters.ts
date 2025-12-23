import { format } from 'date-fns';

const currencyMap: Record<string, string> = {
  GB: 'GBP',
  SE: 'SEK',
  CH: 'CHF',
  CA: 'CAD',
  US: 'USD',
  NL: 'EUR',
  FR: 'EUR',
  CZ: 'CZK',
  SK: 'EUR',
  DE: 'EUR',
  RO: 'RON',
  PL: 'PLN',
  HU: 'HUF',
  IT: 'EUR',
  AT: 'EUR',
};

const localeMap: Record<string, string> = {
  en: 'en-US',
  sv: 'sv-SE',
  de: 'de-DE',
  fr: 'fr-FR',
  it: 'it-IT',
  nl: 'nl-NL',
  cs: 'cs-CZ',
  sk: 'sk-SK',
  ro: 'ro-RO',
  pl: 'pl-PL',
  hu: 'hu-HU',
};

export const formatCurrency = (
  amount: number,
  currency: string,
  locale: string = 'en'
): string => {
  const localeCode = localeMap[locale] || 'en-US';
  return new Intl.NumberFormat(localeCode, {
    style: 'currency',
    currency: currency,
  }).format(amount);
};

export const formatNumber = (
  num: number,
  locale: string = 'en',
  options?: Intl.NumberFormatOptions
): string => {
  const localeCode = localeMap[locale] || 'en-US';
  return new Intl.NumberFormat(localeCode, options).format(num);
};

export const formatDate = (
  date: string | Date | null | undefined,
  locale: string = 'en',
  formatStr: string = 'PP'
): string => {
  try {
    if (!date) {
      return '-';
    }
    
    let dateObj: Date | null = null;
    
    if (typeof date === 'string') {
      // Handle date strings like "2025-01-15"
      dateObj = new Date(date + 'T00:00:00Z');
      if (!dateObj || isNaN(dateObj.getTime())) {
        // Fallback: parse manually
        const parts = date.split('-');
        if (parts.length === 3) {
          const year = parseInt(parts[0]);
          const month = parseInt(parts[1]);
          const day = parseInt(parts[2]);
          if (!isNaN(year) && !isNaN(month) && !isNaN(day)) {
            dateObj = new Date(year, month - 1, day);
          }
        }
      }
    } else if (date instanceof Date) {
      dateObj = date;
    }
    
    if (!dateObj || isNaN(dateObj.getTime())) {
      return '-';
    }
    return format(dateObj, formatStr);
  } catch (error) {
    console.error('Error formatting date:', error, date);
    return '-';
  }
};

export const formatDateTime = (
  date: string | Date,
  locale: string = 'en'
): string => {
  try {
    let dateObj: Date;
    if (typeof date === 'string') {
      dateObj = new Date(date + 'T00:00:00Z');
      if (isNaN(dateObj.getTime())) {
        const parts = date.split('-');
        if (parts.length === 3) {
          dateObj = new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]));
        } else {
          dateObj = new Date(date);
        }
      }
    } else {
      dateObj = date;
    }
    
    if (isNaN(dateObj.getTime())) {
      return 'Invalid date';
    }
    
    const localeCode = localeMap[locale] || 'en-US';
    return new Intl.DateTimeFormat(localeCode, {
      dateStyle: 'medium',
      timeStyle: 'short',
    }).format(dateObj);
  } catch (error) {
    console.error('Error formatting date time:', error, date);
    return 'Invalid date';
  }
};

export const getCurrencyByCountry = (countryCode: string): string => {
  return currencyMap[countryCode] || 'USD';
};

export const formatPercentage = (value: number, locale: string = 'en'): string => {
  const localeCode = localeMap[locale] || 'en-US';
  return new Intl.NumberFormat(localeCode, {
    style: 'percent',
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  }).format(value / 100);
};
