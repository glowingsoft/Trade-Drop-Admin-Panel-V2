import { z as zod } from 'zod';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';

import { paths } from 'src/routes/paths';
import { useRouter, useSearchParams } from 'src/routes/hooks';

import { Form, Field } from 'src/components/hook-form';
import { toast } from 'src/components/snackbar';

import { useVerifyOtpMutation } from 'src/store/Reducer/auth';
import { handleApiError } from 'src/utils/errorHandler';

// ----------------------------------------------------------------------

export const VerifyPasswordSchema = zod.object({
  otp: zod
    .string()
    .min(4, { message: 'Code is required!' })
    .max(6, { message: 'Code must be 4-6 digits!' })
    .regex(/^\d+$/, { message: 'Code must contain only digits!' }),
});

// ----------------------------------------------------------------------

export function JwtVerifyPasswordView() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const email = searchParams.get('email');

  const [verifyOtp] = useVerifyOtpMutation();

  useEffect(() => {
    if (!email) {
      router.replace(paths.auth.jwt.forgetPassword);
    }
  }, [email, router]);

  const defaultValues = {
    otp: '',
  };

  const methods = useForm({
    resolver: zodResolver(VerifyPasswordSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    setValue,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    try {
      await verifyOtp({ email, purpose: 'password_reset', code: data.otp }).unwrap();

      router.push(`${paths.auth.jwt.resetPassword}?email=${encodeURIComponent(email)}`);
    } catch (error) {
      handleApiError(error);
    }
  });

  const renderHead = (
    <Stack spacing={1.5} sx={{ mb: 5 }}>
      <Typography variant="h5">Check your email</Typography>

      <Typography variant="body2" sx={{ color: 'text.secondary' }}>
        Please enter the verification code sent to your email address.
      </Typography>
    </Stack>
  );

  const renderForm = (
    <Stack spacing={3}>
      <Field.Text
        name="otp"
        label="Verification code"
        InputLabelProps={{ shrink: true }}
        inputProps={{ maxLength: 6, inputMode: 'numeric', pattern: '[0-9]*', autoComplete: 'one-time-code' }}
        onChange={(event) => {
          const digitsOnly = event.target.value.replace(/\D/g, '').slice(0, 6);
          setValue('otp', digitsOnly, { shouldValidate: true });
        }}
      />

      <LoadingButton
        fullWidth
        color="primary"
        size="large"
        type="submit"
        variant="contained"
        loading={isSubmitting}
        loadingIndicator="Verifying..."
      >
        Verify code
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
