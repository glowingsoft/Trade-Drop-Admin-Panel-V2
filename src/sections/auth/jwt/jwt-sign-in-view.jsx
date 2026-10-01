import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'src/components/snackbar';
import { z as zod } from 'zod';

import LoadingButton from '@mui/lab/LoadingButton';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import { RouterLink } from 'src/routes/components';
import { useRouter } from 'src/routes/hooks';
import { paths } from 'src/routes/paths';

import { useBoolean } from 'src/hooks/use-boolean';

import { CONFIG } from 'src/config-global';

import { Field, Form } from 'src/components/hook-form';
import { Iconify } from 'src/components/iconify';
import { Logo } from 'src/components/logo';

import { useDispatch } from 'react-redux';
import { useLoginMutation } from 'src/store/Reducer/auth';
import { setUser } from 'src/store/slices/userSlice';
import { handleApiError } from 'src/utils/errorHandler';

// ----------------------------------------------------------------------

export const SignInSchema = zod.object({
  email: zod.string().min(1, { message: 'Email is required!' }).email({ message: 'Email must be a valid email address!' }),
  password: zod.string().min(1, { message: 'Password is required!' }).min(6, { message: 'Password must be at least 6 characters!' }),
});

// ----------------------------------------------------------------------

export function JwtSignInView() {
  const router = useRouter();
  const dispatch = useDispatch();

  const [login] = useLoginMutation();

  const [errorMsg, setErrorMsg] = useState('');

  const password = useBoolean();

  const defaultValues = {
    email: '',
    password: '',
  };

  const methods = useForm({
    resolver: zodResolver(SignInSchema),
    defaultValues,
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const goTo = (permission) => {
    switch (permission) {
      case 1:
        router.push(paths.adminDashboard.root);
        break;
      case 2:
        router.push(paths.dashboard.root);
        break;
      default:
        router.push('/');
        break;
    }
  };

  const onSubmit = handleSubmit(async (data) => {
    const payload = {
      email: data.email.trim().toLowerCase(),
      password: data.password,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      userType: data.email.includes('admin') ? 'admin' : 'user',
      deviceType: 'web',
      deviceId: '123',
    };

    try {
      const response = await login(payload).unwrap();

      console.log('Login Response:', response);

      if (!response.data) {
        toast.error('Login failed: No user data received');
        router.push('/');
        return null;
      }

      const user = response.data;

      if (!user) {
        return router.push('/404');
      }

      if (user?.accountState?.status !== 'active') {
        toast.error('Your account is inactive. Please contact support.');
        return null;
      }

      const user_type = user?.accountState?.userType === 'user' ? 2 : 1;
      const permission = user_type;

      const UpdatedUserData = {
        ...user,
        permission,
      };

      console.log('Updated User Data', UpdatedUserData);

      dispatch(setUser(UpdatedUserData));
      goTo(user_type);

      reset();
      // toast.success('Login successful!');
    } catch (error) {
      setErrorMsg(typeof error === 'string' ? error : error.message);
      handleApiError(error);
    }
  });

  const renderHead = (
    <Stack spacing={1} sx={{ mb: 4 }}>
      <Stack direction="row" spacing={1.25} alignItems="center">
        <Logo disableLink width={26} height={28} />

        <Typography variant="h4" sx={{ fontWeight: 700, letterSpacing: '-0.01em' }}>
          {CONFIG.site.name}
        </Typography>
      </Stack>

      <Box sx={{ pt: 2 }}>
        <Typography variant="h3" sx={{ fontWeight: 700, letterSpacing: '-0.02em' }}>
          Welcome back!
        </Typography>
      </Box>

      <Typography variant="body2" sx={{ color: 'text.secondary' }}>
        Sign in with your authorized admin credentials to continue.
      </Typography>
    </Stack>
  );

  const renderForm = (
    <Stack spacing={3}>
      <Field.Text name="email" label="Email address" InputLabelProps={{ shrink: true }} />

      <Stack spacing={1.5}>
        <Field.Text
          name="password"
          label="Password"
          placeholder="6+ characters"
          type={password.value ? 'text' : 'password'}
          InputLabelProps={{ shrink: true }}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={password.onToggle} edge="end">
                  <Iconify icon={password.value ? 'solar:eye-bold' : 'solar:eye-closed-bold'} />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />

        <Link
          component={RouterLink}
          href={paths.auth.jwt.forgetPassword}
          variant="body2"
          color="inherit"
          sx={{ alignSelf: 'flex-end' }}
        >
          Forgot password?
        </Link>
      </Stack>

      <LoadingButton fullWidth color="primary" size="large" type="submit" variant="contained" loading={isSubmitting} loadingIndicator="Sign in...">
        Sign in
      </LoadingButton>
    </Stack>
  );

  return (
    <>
      {renderHead}

      {!!errorMsg && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {errorMsg}
        </Alert>
      )}

      <Form methods={methods} onSubmit={onSubmit}>
        {renderForm}
      </Form>
    </>
  );
}
