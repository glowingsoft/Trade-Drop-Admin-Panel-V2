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

import { Field, Form } from 'src/components/hook-form';
import { toast } from 'src/components/snackbar';
import { useAddBadgeMutation, useUpdateBadgeMutation } from 'src/store/Reducer/badges-api';
import { handleApiError } from 'src/utils/errorHandler';

const METRIC_OPTIONS = [
  { value: 'user_registration_number', label: 'User registration number' },
  { value: 'completed_trades', label: 'Completed trades' },
  { value: 'founding_member', label: 'Founding member' },
];

const OPERATOR_OPTIONS = [
  { value: '>=', label: '>=' },
  { value: '>', label: '>' },
  { value: '=', label: '=' },
  { value: '<=', label: '<=' },
  { value: '<', label: '<' },
];

const toSlug = (value) =>
  String(value || '')
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

const schema = zod.object({
  name: zod.string().trim().min(1, 'Name is required'),
  slug: zod
    .string()
    .transform((value) => toSlug(value))
    .pipe(zod.string().min(1, 'Slug is required')),
  description: zod.string().trim().min(1, 'Description is required'),
  icon: zod.string().trim().min(1, 'Icon is required'),
  metric: zod.string().min(1, 'Metric is required'),
  operator: zod.string().min(1, 'Operator is required'),
  threshold: zod.coerce.number({ invalid_type_error: 'Threshold is required' }),
  sortOrder: zod.coerce.number({ invalid_type_error: 'Sort order is required' }).int().min(1, {
    message: 'Sort order must be at least 1',
  }),
  isActive: zod.boolean(),
});

const buildPayload = (data) => ({
  name: data.name.trim(),
  slug: data.slug,
  description: data.description.trim(),
  icon: data.icon.trim(),
  metric: data.metric,
  operator: data.operator,
  threshold: Number(data.threshold),
  sortOrder: Number(data.sortOrder),
  isActive: !!data.isActive,
});

export default function QuickAddEditBadgeModal({ currentBadge, open, onClose }) {
  const [addBadge] = useAddBadgeMutation();
  const [updateBadge] = useUpdateBadgeMutation();

  const defaultValues = useMemo(
    () => ({
      name: currentBadge?.name || '',
      slug: currentBadge?.slug || toSlug(currentBadge?.name || ''),
      description: currentBadge?.description || '',
      icon: currentBadge?.icon || '',
      metric: currentBadge?.metric || METRIC_OPTIONS[0].value,
      operator: currentBadge?.operator || '<=',
      threshold: currentBadge?.threshold ?? '',
      sortOrder: currentBadge?.sortOrder ?? '',
      isActive: currentBadge?.isActive !== false,
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
      const payload = buildPayload(data);
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
          <Box sx={{ mt: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Field.Text name="name" label="Name" />
            <Field.Text name="slug" label="Slug" />
            <Field.Text name="description" label="Description" multiline rows={3} />
            <Field.Text name="icon" label="Icon" placeholder="⭐" />
            <Field.Select name="metric" label="Metric">
              {METRIC_OPTIONS.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Field.Select>
            <Field.Select name="operator" label="Operator">
              {OPERATOR_OPTIONS.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Field.Select>
            <Field.Text name="threshold" label="Threshold" type="number" />
            <Field.Text name="sortOrder" label="Sort Order" type="number" />
            <Field.Switch name="isActive" label="Active" />
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
