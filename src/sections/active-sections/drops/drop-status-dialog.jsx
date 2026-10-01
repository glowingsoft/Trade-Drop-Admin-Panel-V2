import { zodResolver } from '@hookform/resolvers/zod';
import { LoadingButton } from '@mui/lab';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, MenuItem } from '@mui/material';
import { useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { z as zod } from 'zod';

import { Field, Form } from 'src/components/hook-form';

import { DROP_STATUS_OPTIONS, DROP_STATUS_VALUES } from './drop-status';

const schema = zod.object({
  status: zod.enum(DROP_STATUS_VALUES),
});

const QuickStatusChangeModal = ({ currentUser, open, onClose }) => {
  const defaultValues = useMemo(
    () => ({
      status: DROP_STATUS_VALUES.includes(currentUser?.status) ? currentUser.status : 'active',
    }),
    [currentUser]
  );

  const methods = useForm({
    resolver: zodResolver(schema),
    defaultValues,
  });

  useEffect(() => {
    methods.reset(defaultValues);
  }, [defaultValues]);

  const handleClose = () => {
    onClose();
    methods.reset(defaultValues);
  };

  const onSubmit = methods.handleSubmit(() => {
    handleClose();
  });

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="xs">
      <Form methods={methods} onSubmit={onSubmit}>
        <DialogTitle sx={{ pb: 0 }}>Quick Status Change </DialogTitle>
        <DialogContent>
          <Field.Select name="status" label="Status" sx={{ mt: 2 }}>
            {DROP_STATUS_OPTIONS.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </Field.Select>
        </DialogContent>
        <DialogActions>
          <Button variant="outlined" onClick={handleClose}>
            Cancel
          </Button>
          <LoadingButton
            type="submit"
            variant="contained"
            color="primary"
            loading={methods.formState.isSubmitting}
          >
            Save
          </LoadingButton>
        </DialogActions>
      </Form>
    </Dialog>
  );
};

export default QuickStatusChangeModal;
