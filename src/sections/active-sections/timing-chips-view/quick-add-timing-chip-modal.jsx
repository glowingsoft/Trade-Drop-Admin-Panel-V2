import { zodResolver } from '@hookform/resolvers/zod';
import { LoadingButton } from '@mui/lab';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  MenuItem,
} from '@mui/material';
import { useEffect, useMemo } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { z as zod } from 'zod';

import { WALLET_STATUS_OPTIONS } from 'src/_mock';
import { Field, Form } from 'src/components/hook-form';
import { toast } from 'src/components/snackbar';
import { handleApiError } from 'src/utils/errorHandler';
import {
  useAddTimingChipMutation,
  useUpdateTimingChipMutation,
} from 'src/store/Reducer/categories-api';

const toChipValue = (value) =>
  String(value || '')
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_|_$/g, '');

const schema = zod.object({
  label: zod.string().trim().min(1, 'Label is required'),
  value: zod
    .string()
    .transform((val) => toChipValue(val))
    .pipe(zod.string().min(1, 'Value is required')),
  sortOrder: zod.coerce.number({ invalid_type_error: 'Sort order is required' }).int().min(1, {
    message: 'Sort order must be at least 1',
  }),
  status: zod.string().min(1, 'Status is required'),
});

export default function QuickAddEditTimingChipModal({ currentChip, open, onClose }) {
  const [addTimingChip] = useAddTimingChipMutation();
  const [updateTimingChip] = useUpdateTimingChipMutation();

  const defaultValues = useMemo(
    () => ({
      label: currentChip?.label || '',
      value: currentChip?.value || '',
      sortOrder: currentChip?.sortOrder ?? '',
      status: currentChip?.status === 'inactive' ? 'inactive' : 'active',
    }),
    [currentChip]
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

  const labelValue = useWatch({ control, name: 'label' });

  useEffect(() => {
    reset(defaultValues);
  }, [defaultValues, reset]);

  useEffect(() => {
    if (!dirtyFields.label || dirtyFields.value) return;
    setValue('value', toChipValue(labelValue));
  }, [labelValue, dirtyFields.label, dirtyFields.value, setValue]);

  const handleClose = () => {
    onClose();
    reset();
  };

  const onSubmit = handleSubmit(async (data) => {
    try {
      const nextValues = {
        label: data.label.trim(),
        value: data.value,
        sortOrder: Number(data.sortOrder),
        status: data.status === 'inactive' ? 'inactive' : 'active',
      };

      let response;

      if (currentChip) {
        const previousValues = {
          label: (currentChip.label || '').trim(),
          value: currentChip.value || '',
          sortOrder: Number(currentChip.sortOrder),
          status: currentChip.status === 'inactive' ? 'inactive' : 'active',
        };

        const payload = Object.fromEntries(
          Object.entries(nextValues).filter(([key, val]) => val !== previousValues[key])
        );

        if (!Object.keys(payload).length) {
          handleClose();
          return;
        }

        response = await updateTimingChip({ id: currentChip._id, ...payload }).unwrap();
      } else {
        const { status, ...payload } = nextValues;
        response = await addTimingChip(payload).unwrap();
      }

      if (response.message) toast.success(response.message);
      handleClose();
    } catch (error) {
      handleApiError(error);
    }
  });

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
      <Form methods={methods} onSubmit={onSubmit}>
        <DialogTitle>{currentChip ? 'Edit Timing Chip' : 'Add Timing Chip'}</DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Field.Text name="label" label="Label" />
            <Field.Text name="value" label="Value" />
            <Field.Text name="sortOrder" label="Sort Order" type="number" />

            {currentChip ? (
              <Field.Select name="status" label="Status">
                {WALLET_STATUS_OPTIONS.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Field.Select>
            ) : null}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button variant="outlined" onClick={handleClose}>
            Cancel
          </Button>
          <LoadingButton type="submit" variant="contained" color="primary" loading={isSubmitting}>
            {currentChip ? 'Update' : 'Add'}
          </LoadingButton>
        </DialogActions>
      </Form>
    </Dialog>
  );
}
