import { useState, forwardRef } from 'react';
import PhoneNumberInput from 'react-phone-number-input/input';

import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';

import { getCountryCode } from './utils';
import { CountryListPopover } from './list';

export const PhoneInput = forwardRef(
  ({ value, onChange, placeholder, country: inputCountryCode, disableSelect, inputRef, ...other }, ref) => {
    const phoneValue = typeof value === 'string' ? value : '';
    const defaultCountryCode = getCountryCode(phoneValue, inputCountryCode);

    const [selectedCountry, setSelectedCountry] = useState(defaultCountryCode);

    return (
      <PhoneNumberInput
        {...other}
        ref={inputRef || ref}
        country={selectedCountry}
        inputComponent={CustomInput}
        value={phoneValue}
        onChange={(newValue) => onChange?.(typeof newValue === 'string' ? newValue : '')}
        placeholder={placeholder ?? 'Enter phone number'}
        InputProps={
          disableSelect
            ? undefined
            : {
                startAdornment: (
                  <InputAdornment position="start" sx={{ ml: 1 }}>
                    <CountryListPopover
                      countryCode={selectedCountry}
                      onClickCountry={(countryCode) => setSelectedCountry(countryCode)}
                    />
                  </InputAdornment>
                ),
              }
        }
      />
    );
  }
);

const CustomInput = forwardRef(({ onChange, ...props }, ref) => (
  <TextField
    {...props}
    inputRef={ref}
    onChange={(event) => {
      if (typeof onChange !== 'function') return;
      onChange(event);
    }}
  />
));
