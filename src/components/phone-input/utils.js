import { parsePhoneNumber } from 'react-phone-number-input';

import { countries } from 'src/assets/data/countries';

// ----------------------------------------------------------------------

export function getCountryCode(inputValue, countryCode) {
  if (typeof inputValue === 'string' && inputValue) {
    const phoneNumber = parsePhoneNumber(inputValue);

    if (phoneNumber) {
      return phoneNumber?.country;
    }
  }

  return countryCode ?? 'US';
}

export function toE164Phone(phoneNumber) {
  if (typeof phoneNumber === 'string') return phoneNumber;
  if (!phoneNumber || typeof phoneNumber !== 'object') return '';

  const code = String(phoneNumber.code || '').trim();
  const number = String(phoneNumber.number || '').trim();
  if (!code && !number) return '';

  const dialCode = !code ? '' : code.startsWith('+') ? code : `+${code}`;
  return `${dialCode}${number}`;
}

export function toPhonePayload(value) {
  if (!value) {
    return { code: '', number: '' };
  }

  if (typeof value === 'object') {
    return {
      code: String(value.code || ''),
      number: String(value.number || ''),
    };
  }

  if (typeof value !== 'string' || !value.trim()) {
    return { code: '', number: '' };
  }

  const parsed = parsePhoneNumber(value);
  if (parsed?.countryCallingCode) {
    return {
      code: `+${parsed.countryCallingCode}`,
      number: parsed.nationalNumber || '',
    };
  }

  return { code: '', number: value.replace(/^\+/, '') };
}

// ----------------------------------------------------------------------

export function getCountry(countryCode) {
  const option = countries.filter((country) => country.code === countryCode)[0];
  return option;
}

export function applyFilter({ inputData, query }) {
  if (query) {
    return inputData.filter(
      (country) =>
        country.label.toLowerCase().indexOf(query.toLowerCase()) !== -1 ||
        country.code.toLowerCase().indexOf(query.toLowerCase()) !== -1 ||
        country.phone.toLowerCase().indexOf(query.toLowerCase()) !== -1
    );
  }

  return inputData;
}
