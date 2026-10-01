import { z as zod } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';
import { RouterLink } from 'src/routes/components';

import { Iconify } from 'src/components/iconify';
import { Form, Field } from 'src/components/hook-form';
import { toast } from 'src/components/snackbar';

import { useForgotPasswordMutation } from 'src/store/Reducer/auth';
import { handleApiError } from 'src/utils/errorHandler';

// ----------------------------------------------------------------------

export const ForgetPasswordSchema = zod.object({
  email: zod
    .string()
    .min(1, { message: 'Email is required!' })
    .email({ message: 'Email must be a valid email address!' }),
});

// ----------------------------------------------------------------------

export function JwtForgetPasswordView() {
  const router = useRouter();

  const [forgotPassword] = useForgotPasswordMutation();

  const defaultValues = {
    email: '',
  };

  const methods = useForm({
    resolver: zodResolver(ForgetPasswordSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    const email = data.email.trim().toLowerCase();

    try {
      await forgotPassword({ email }).unwrap();

      toast.success('A verification code has been sent to your email.');
      router.push(`${paths.auth.jwt.verifyPassword}?email=${encodeURIComponent(email)}`);
    } catch (error) {
      handleApiError(error);
    }
  });

  const renderHead = (
    <Stack spacing={1.5} sx={{ mb: 5 }}>
      <Typography variant="h5">Forgot your password?</Typography>

      <Typography variant="body2" sx={{ color: 'text.secondary' }}>
        Enter the email address linked to your account and we'll send you a code to reset your
        password.
      </Typography>
    </Stack>
  );

  const renderForm = (
    <Stack spacing={3}>
      <Field.Text name="email" label="Email address" InputLabelProps={{ shrink: true }} />

      <LoadingButton
        fullWidth
        color="primary"
        size="large"
        type="submit"
        variant="contained"
        loading={isSubmitting}
        loadingIndicator="Sending..."
      >
        Send code
      </LoadingButton>

      <Link
        component={RouterLink}
        href={paths.auth.jwt.signIn}
        color="inherit"
        variant="subtitle2"
        sx={{ gap: 0.5, alignSelf: 'center', alignItems: 'center', display: 'inline-flex' }}
      >
        <Iconify width={16} icon="eva:arrow-ios-back-fill" />
        Return to sign in
      </Link>
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
