import { zodResolver } from '@hookform/resolvers/zod';
import { LoadingButton } from '@mui/lab';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  MenuItem,
} from '@mui/material';
import { useEffect, useMemo } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { z as zod } from 'zod';

import { WALLET_STATUS_OPTIONS } from 'src/_mock';
import { Field, Form } from 'src/components/hook-form';
import { toast } from 'src/components/snackbar';
import {
  ACCEPTED_IMAGE_TYPES,
  MAX_AVATAR_SIZE,
  isImagePublicId,
} from 'src/constants/upload';
import { useAddBadgeMutation, useUpdateBadgeMutation } from 'src/store/Reducer/badges-api';
import { useUploadFileMutation } from 'src/store/Reducer/upload-api';
import { handleApiError } from 'src/utils/errorHandler';
import { fData } from 'src/utils/format-number';

const METRIC_OPTIONS = [
  // { value: 'user_registration_number', label: 'User registration number' },
  { value: 'completed_trades', label: 'Completed trades' },
  { value: 'founding_member', label: 'Founding member' },
];

const getBadgeStatus = (badge) =>
  badge?.status === 'inactive' || badge?.isActive === false ? 'inactive' : 'active';

const toSlug = (value) =>
  String(value || '')
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

const toImagePublicId = (value) => {
  if (!value || typeof value !== 'string') return '';
  if (isImagePublicId(value)) return value.trim();
  const marker = '/image/upload/';
  const index = value.indexOf(marker);
  if (index === -1) return '';
  return value.slice(index + marker.length).replace(/^v\d+\//, '');
};

const schema = zod.object({
  name: zod.string().trim().min(1, 'Name is required'),
  slug: zod
    .string()
    .transform((value) => toSlug(value))
    .pipe(zod.string().min(1, 'Slug is required')),
  icon: zod
    .any()
    .refine(
      (value) => value instanceof File || (typeof value === 'string' && value.trim().length > 0),
      { message: 'Icon is required' }
    )
    .refine((value) => !(value instanceof File) || value.size <= MAX_AVATAR_SIZE, {
      message: `Image size must be less than ${fData(MAX_AVATAR_SIZE)}`,
    })
    .refine((value) => !(value instanceof File) || ACCEPTED_IMAGE_TYPES.includes(value.type), {
      message: 'Only PNG, JPG, JPEG, WEBP, AVIF and GIF images are allowed',
    }),
  metric: zod.string().min(1, 'Metric is required'),
  threshold: zod.coerce.number({ invalid_type_error: 'Threshold is required' }),
  sortOrder: zod.coerce.number({ invalid_type_error: 'Sort order is required' }).int().min(1, {
    message: 'Sort order must be at least 1',
  }),
  status: zod.enum(['active', 'inactive']),
});

export default function QuickAddEditBadgeModal({ currentBadge, open, onClose }) {
  const [uploadFile] = useUploadFileMutation();
  const [addBadge] = useAddBadgeMutation();
  const [updateBadge] = useUpdateBadgeMutation();

  const defaultValues = useMemo(
    () => ({
      name: currentBadge?.name || '',
      slug: currentBadge?.slug || toSlug(currentBadge?.name || ''),
      icon: currentBadge?.icon || '',
      metric: currentBadge?.metric || METRIC_OPTIONS[0].value,
      threshold: currentBadge?.threshold ?? '',
      sortOrder: currentBadge?.sortOrder ?? '',
      status: getBadgeStatus(currentBadge),
    }),
    [currentBadge]
  );

  const methods = useForm({
    resolver: zodResolver(schema),
    defaultValues,
  });

  const {
    control,
    reset,
    setValue,
    handleSubmit,
    formState: { isSubmitting, dirtyFields },
  } = methods;

  const nameValue = useWatch({ control, name: 'name' });

  useEffect(() => {
    reset(defaultValues);
  }, [defaultValues, reset]);

  useEffect(() => {
    if (!dirtyFields.name || dirtyFields.slug) return;
    setValue('slug', toSlug(nameValue));
  }, [nameValue, dirtyFields.name, dirtyFields.slug, setValue]);

  const handleClose = () => {
    onClose();
    reset();
  };

  const onSubmit = handleSubmit(async (data) => {
    try {
      let icon = toImagePublicId(data.icon);

      if (data.icon instanceof File) {
        const uploadResponse = await uploadFile(data.icon).unwrap();
        icon = uploadResponse?.data?.file;
      }

      const payload = {
        name: data.name.trim(),
        slug: data.slug,
        icon,
        metric: data.metric,
        operator: '=',
        threshold: Number(data.threshold),
        sortOrder: Number(data.sortOrder),
        status: data.status === 'inactive' ? 'inactive' : 'active',
      };

      const response = currentBadge
        ? await updateBadge({ id: currentBadge._id, ...payload }).unwrap()
        : await addBadge(payload).unwrap();

      if (response.message) toast.success(response.message);
      handleClose();
    } catch (error) {
      handleApiError(error);
    }
  });

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
      <Form methods={methods} onSubmit={onSubmit}>
        <DialogTitle>{currentBadge ? 'Edit Badge' : 'Add Badge'}</DialogTitle>
        <DialogContent>
          <Field.UploadImage name="icon" sx={{ mt: 1, mb: 2 }} />

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Field.Text name="name" label="Name" />
            <Field.Text name="slug" label="Slug" />
            <Field.Select name="metric" label="Metric">
              {METRIC_OPTIONS.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Field.Select>
            <Field.Text name="threshold" label="Threshold" type="number" />
            <Field.Text name="sortOrder" label="Sort Order" type="number" />
            <Field.Select name="status" label="Status">
              {WALLET_STATUS_OPTIONS.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Field.Select>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button variant="outlined" onClick={handleClose}>
            Cancel
          </Button>
          <LoadingButton type="submit" variant="contained" color="primary" loading={isSubmitting}>
            {currentBadge ? 'Update' : 'Add'}
          </LoadingButton>
        </DialogActions>
      </Form>
    </Dialog>
  );
}
