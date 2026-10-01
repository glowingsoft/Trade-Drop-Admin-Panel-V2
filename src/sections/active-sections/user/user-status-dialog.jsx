import { zodResolver } from '@hookform/resolvers/zod';
import { LoadingButton } from '@mui/lab';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, MenuItem } from '@mui/material';
import { useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { z as zod } from 'zod';

import { Field, Form } from 'src/components/hook-form';
import { toast } from 'src/components/snackbar';
import { useUpdateUserMutation } from 'src/store/Reducer/users-api';
import { handleApiError } from 'src/utils/errorHandler';

import { USER_ACCOUNT_STATUS_OPTIONS, USER_ACCOUNT_STATUS_VALUES } from './user-status';

const schema = zod.object({
  status: zod.enum(USER_ACCOUNT_STATUS_VALUES),
});

const QuickStatusChangeModal = ({ currentUser, open, onClose }) => {
  const [updateUser] = useUpdateUserMutation();

  const defaultValues = useMemo(
    () => ({
      status: USER_ACCOUNT_STATUS_VALUES.includes(currentUser?.status)
        ? currentUser.status
        : 'active',
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

  const onSubmit = methods.handleSubmit(async (data) => {
    if (!currentUser?.id) return;

    try {
      const response = await updateUser({
        id: currentUser.id,
        body: { status: data.status },
      }).unwrap();

      if (response.message) toast.success(response.message);
      handleClose();
    } catch (error) {
      handleApiError(error);
    }
  });

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="xs">
      <Form methods={methods} onSubmit={onSubmit}>
        <DialogTitle sx={{ pb: 0 }}>Quick Status Change </DialogTitle>
        <DialogContent>
          <Field.Select name="status" label="Status" sx={{ mt: 2 }}>
            {USER_ACCOUNT_STATUS_OPTIONS.map((option) => (
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
