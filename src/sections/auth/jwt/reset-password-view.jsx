import { z as zod } from 'zod';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import Stack from '@mui/material/Stack';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';
import InputAdornment from '@mui/material/InputAdornment';

import { paths } from 'src/routes/paths';
import { useRouter, useSearchParams } from 'src/routes/hooks';

import { useBoolean } from 'src/hooks/use-boolean';

import { Iconify } from 'src/components/iconify';
import { Form, Field } from 'src/components/hook-form';
import { toast } from 'src/components/snackbar';

import { useResetPasswordMutation } from 'src/store/Reducer/auth';
import { handleApiError } from 'src/utils/errorHandler';

// ----------------------------------------------------------------------

export const ResetPasswordSchema = zod
  .object({
    newPassword: zod
      .string()
      .min(1, { message: 'New password is required!' })
      .min(6, { message: 'New password must be at least 6 characters!' }),
    confirmPassword: zod.string().min(1, { message: 'Please confirm your new password!' }),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'Passwords do not match!',
    path: ['confirmPassword'],
  });

// ----------------------------------------------------------------------

export function JwtResetPasswordView() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const email = searchParams.get('email');

  const [resetPassword] = useResetPasswordMutation();

  const newPassword = useBoolean();
  const confirmPassword = useBoolean();

  useEffect(() => {
    if (!email) {
      router.replace(paths.auth.jwt.forgetPassword);
    }
  }, [email, router]);

  const defaultValues = {
    newPassword: '',
    confirmPassword: '',
  };

  const methods = useForm({
    resolver: zodResolver(ResetPasswordSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    try {
      await resetPassword({ email, password: data.newPassword }).unwrap();

      toast.success('Password reset successfully. Please sign in.');
      router.push(paths.auth.jwt.signIn);
    } catch (error) {
      handleApiError(error);
    }
  });

  const renderHead = (
    <Stack spacing={1.5} sx={{ mb: 5 }}>
      <Typography variant="h5">Set a new password</Typography>

      <Typography variant="body2" sx={{ color: 'text.secondary' }}>
        Your new password must be different from previously used passwords.
      </Typography>
    </Stack>
  );

  const renderForm = (
    <Stack spacing={3}>
      <Field.Text
        name="newPassword"
        label="New password"
        placeholder="6+ characters"
        type={newPassword.value ? 'text' : 'password'}
        InputLabelProps={{ shrink: true }}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton onClick={newPassword.onToggle} edge="end">
                <Iconify icon={newPassword.value ? 'solar:eye-bold' : 'solar:eye-closed-bold'} />
              </IconButton>
            </InputAdornment>
          ),
        }}
      />

      <Field.Text
        name="confirmPassword"
        label="Confirm new password"
        type={confirmPassword.value ? 'text' : 'password'}
        InputLabelProps={{ shrink: true }}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton onClick={confirmPassword.onToggle} edge="end">
                <Iconify
                  icon={confirmPassword.value ? 'solar:eye-bold' : 'solar:eye-closed-bold'}
                />
              </IconButton>
            </InputAdornment>
          ),
        }}
      />

      <LoadingButton
        fullWidth
        color="primary"
        size="large"
        type="submit"
        variant="contained"
        loading={isSubmitting}
        loadingIndicator="Resetting..."
      >
        Reset password
      </LoadingButton>
    </Stack>
  );

  return (
    <>
      {renderHead}

      <Form methods={methods} onSubmit={onSubmit}>
        {renderForm}
      </Form>
    </>
  );
}
