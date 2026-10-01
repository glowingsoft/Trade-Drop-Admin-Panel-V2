import { Controller, useFormContext } from 'react-hook-form';

import Box from '@mui/material/Box';
import FormHelperText from '@mui/material/FormHelperText';

import {
  ACCEPTED_IMAGE_EXTENSIONS,
  ACCEPTED_IMAGE_TYPES,
  MAX_AVATAR_SIZE,
  getDisplayImage,
} from 'src/constants/upload';
import { fData } from 'src/utils/format-number';

import { Upload } from './upload';
import { UploadAvatar } from './upload-avatar';

export function UploadImage({
  name,
  variant = 'avatar',
  helperText,
  maxSize = MAX_AVATAR_SIZE,
  ...other
}) {
  const { control, setValue, setError, clearErrors } = useFormContext();

  const handleDrop = (acceptedFiles) => {
    const file = acceptedFiles[0];

    if (!file) return;

    if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
      setError(name, { type: 'manual', message: 'Only PNG, JPG, JPEG, WEBP, AVIF and GIF images are allowed' });
      return;
    }

    if (file.size > maxSize) {
      setError(name, { type: 'manual', message: `Image size must be less than ${fData(maxSize)}` });
      return;
    }

    clearErrors(name);
    setValue(name, file, { shouldValidate: true, shouldDirty: true });
  };

  const UploadComponent = variant === 'avatar' ? UploadAvatar : Upload;

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => {
        const previewValue =
          field.value instanceof File
            ? field.value
            : getDisplayImage(field.value);

        return (
          <Box
            sx={{
              position: 'relative',
              width: variant === 'avatar' ? 144 : 1,
              mx: variant === 'avatar' ? 'auto' : undefined,
            }}
          >
            <UploadComponent
              value={previewValue}
              error={!!error}
              onDrop={handleDrop}
              maxSize={maxSize}
              accept={{ 'image/*': ACCEPTED_IMAGE_EXTENSIONS }}
              helperText={helperText}
              {...other}
            />

            {!!error && (
              <FormHelperText error sx={{ px: 2, textAlign: 'center' }}>
                {error.message}
              </FormHelperText>
            )}
          </Box>
        );
      }}
    />
  );
}
