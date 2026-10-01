import { Controller, useFormContext } from 'react-hook-form';

import { PhoneInput } from '../phone-input';

export function RHFPhoneInput({ name, helperText, ...other }) {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <PhoneInput
          name={field.name}
          inputRef={field.ref}
          fullWidth
          value={typeof field.value === 'string' ? field.value : ''}
          onChange={(newValue) => field.onChange(typeof newValue === 'string' ? newValue : '')}
          onBlur={field.onBlur}
          error={!!error}
          helperText={error ? error?.message : helperText}
          {...other}
        />
      )}
    />
  );
}
