import { zodResolver } from '@hookform/resolvers/zod';
import PropTypes from 'prop-types';
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
import { useAddFaqMutation } from 'src/store/Reducer/faqs-api';

const AddFaqSchema = zod.object({
  question: zod.string().min(1, { message: 'Question is required' }),
  answer: zod.string().min(1, { message: 'Answer is required' }),
});

export default function AddFaqForm({ open, onClose }) {
  const [addFaq] = useAddFaqMutation();

  const defaultValues = {
    question: '',
    answer: '',
  };

  const methods = useForm({
    resolver: zodResolver(AddFaqSchema),
    defaultValues,
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    try {
      const response = await addFaq({
        question: data.question.trim(),
        answer: data.answer.trim(),
        type: 'general',
      }).unwrap();

      reset();
      onClose();
      if (response.message) toast.success(response.message);
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
        <DialogTitle>Add Faq</DialogTitle>

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
            <RHFTextField name="question" label="Enter Question " />
            <RHFTextField name="answer" label="Enter Answer" rows={3} multiline />
          </Box>
        </DialogContent>

        <DialogActions>
          <Button variant="outlined" onClick={onClose}>
            Close
          </Button>

          <LoadingButton type="submit" sx={{ px: 3 }} color="primary" variant="contained" loading={isSubmitting}>
            Add
          </LoadingButton>
        </DialogActions>
      </Form>
    </Dialog>
  );
}

AddFaqForm.propTypes = {
  onClose: PropTypes.func,
  open: PropTypes.bool,
};
