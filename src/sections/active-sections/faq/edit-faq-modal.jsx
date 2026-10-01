import { zodResolver } from '@hookform/resolvers/zod';
import PropTypes from 'prop-types';
import { useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { z as zod } from 'zod';

import LoadingButton from '@mui/lab/LoadingButton';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';

import { Form, RHFTextField } from 'src/components/hook-form';
import { toast } from 'src/components/snackbar';
import { handleApiError } from 'src/utils/errorHandler';
import { useUpdateFaqMutation } from 'src/store/Reducer/faqs-api';

const EditFaqSchema = zod.object({
  question: zod.string().min(1, { message: 'Question is required' }),
  answer: zod.string().min(1, { message: 'Answer is required' }),
});

export default function EditFaqForm({ row, open, onClose }) {
  const [updateFaq] = useUpdateFaqMutation();

  const defaultValues = useMemo(
    () => ({
      question: row?.question || '',
      answer: row?.answer || '',
    }),
    [row]
  );

  const methods = useForm({
    resolver: zodResolver(EditFaqSchema),
    defaultValues,
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  useEffect(() => {
    reset(defaultValues);
  }, [defaultValues, reset]);

  const onSubmit = handleSubmit(async (data) => {
    try {
      const response = await updateFaq({
        id: row._id,
        question: data.question.trim(),
        answer: data.answer.trim(),
        type: row?.type || 'general',
      }).unwrap();

      if (response.message) toast.success(response.message);
      reset();
      onClose();
    } catch (error) {
      handleApiError(error);
    }
  });

  return (
    <Dialog
      fullWidth
      maxWidth={false}
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: { maxWidth: 550 },
      }}
    >
      <Form methods={methods} onSubmit={onSubmit}>
        <DialogTitle>Edit Faq</DialogTitle>

        <DialogContent>
          <Box
            mt={1}
            rowGap={2}
            columnGap={2}
            display="grid"
            gridTemplateColumns={{
              xs: 'repeat(1, 1fr)',
              sm: 'repeat(1, 1fr)',
            }}
          >
            <RHFTextField name="question" label="Enter question" />
            <RHFTextField name="answer" label="Enter Answer" rows={3} multiline />
          </Box>
        </DialogContent>

        <DialogActions>
          <Button variant="outlined" onClick={onClose}>
            Close
          </Button>

          <LoadingButton
            type="submit"
            sx={{ px: 3 }}
            color="primary"
            variant="contained"
            loading={isSubmitting}
          >
            Update
          </LoadingButton>
        </DialogActions>
      </Form>
    </Dialog>
  );
}

EditFaqForm.propTypes = {
  row: PropTypes.object,
  onClose: PropTypes.func,
  open: PropTypes.bool,
};
