import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { z as zod } from 'zod';

import LoadingButton from '@mui/lab/LoadingButton';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Unstable_Grid2';

import {
  ACCEPTED_IMAGE_EXTENSIONS,
  ACCEPTED_IMAGE_TYPES,
  MAX_AVATAR_SIZE,
  isImagePublicId,
} from 'src/constants/upload';
import { handleApiError } from 'src/utils/errorHandler';
import { fData } from 'src/utils/format-number';

import { Field, Form } from 'src/components/hook-form';
import { toast } from 'src/components/snackbar';
import { toE164Phone, toPhonePayload } from 'src/components/phone-input/utils';

import { useMockedUser } from 'src/auth/hooks';
import { useUploadFileMutation } from 'src/store/Reducer/upload-api';
import { useUpdateUserMutation } from 'src/store/Reducer/users-api';
import { setUser } from 'src/store/slices/userSlice';

export const UpdateUserSchema = zod.object({
  displayName: zod
    .string()
    .trim()
    .min(1, { message: 'Name is required!' })
    .max(80, { message: 'Name must be at most 80 characters!' }),
  email: zod
    .string()
    .trim()
    .min(1, { message: 'Email is required!' })
    .email({ message: 'Email must be a valid email address!' }),
  image: zod
    .any()
    .optional()
    .nullable()
    .refine(
      (value) =>
        value == null ||
        value === '' ||
        typeof value === 'string' ||
        (value instanceof File && value.size <= MAX_AVATAR_SIZE),
      { message: `Image size must be less than ${fData(MAX_AVATAR_SIZE)}` }
    )
    .refine(
      (value) => !(value instanceof File) || ACCEPTED_IMAGE_TYPES.includes(value.type),
      { message: 'Only PNG, JPG, JPEG, WEBP, AVIF and GIF images are allowed' }
    ),
  phoneNumber: zod.preprocess(
    (value) => (typeof value === 'string' ? value : ''),
    zod.string()
  ),
});

const getFormValues = (user) => ({
  displayName: user?.basicInfo?.name || user?.displayName || '',
  email: user?.basicInfo?.email || '',
  image: user?.basicInfo?.profileIcon || user?.basicInfo?.image || user?.basicInfo?.avatarUrl || '',
  phoneNumber: toE164Phone(user?.basicInfo?.phoneNumber),
});

const buildUpdateBody = (data, image) => {
  const name = data.displayName.trim();
  const email = data.email.trim().toLowerCase();
  const body = {
    name,
    email,
    phoneNumber: toPhonePayload(data.phoneNumber),
  };

  if (isImagePublicId(image)) body.profileIcon = image;

  return body;
};

export function AccountGeneral() {
  const dispatch = useDispatch();
  const { user } = useMockedUser();

  const [updateUser] = useUpdateUserMutation();
  const [uploadFile] = useUploadFileMutation();

  const defaultValues = useMemo(() => getFormValues(user), [user]);

  const methods = useForm({
    mode: 'all',
    resolver: zodResolver(UpdateUserSchema),
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
    const userId = user?.basicInfo?._id;

    if (!userId) {
      toast.error('Unable to update profile. Please sign in again.');
      return;
    }

    try {
      let image = isImagePublicId(data.image) ? data.image : undefined;

      if (data.image instanceof File) {
        const uploadResponse = await uploadFile(data.image).unwrap();
        image = uploadResponse?.data?.file;
      }

      const response = await updateUser({
        id: userId,
        body: buildUpdateBody(data, image),
      }).unwrap();

      const apiUser = response?.data;
      const nextName = apiUser?.basicInfo?.name ?? data.displayName.trim();
      const nextEmail = apiUser?.basicInfo?.email ?? data.email.trim().toLowerCase();
      const nextImage =
        apiUser?.basicInfo?.profileIcon ??
        apiUser?.basicInfo?.image ??
        apiUser?.basicInfo?.avatarUrl ??
        image ??
        user?.basicInfo?.profileIcon ??
        user?.basicInfo?.avatarUrl ??
        '';
      const nextPhone =
        apiUser?.basicInfo?.phoneNumber ?? toPhonePayload(data.phoneNumber);

      dispatch(
        setUser({
          ...user,
          ...(apiUser && typeof apiUser === 'object' ? apiUser : {}),
          basicInfo: {
            ...user?.basicInfo,
            ...(apiUser?.basicInfo || {}),
            name: nextName,
            email: nextEmail,
            profileIcon: nextImage,
            image: nextImage,
            avatarUrl: nextImage,
            phoneNumber: nextPhone,
          },
          token: apiUser?.token || user.token,
          permission: user.permission,
        })
      );

      if (response.message) {
        toast.success(response.message);
      }
    } catch (error) {
      handleApiError(error);
    }
  });

  return (
    <Form methods={methods} onSubmit={onSubmit}>
      <Grid container spacing={3}>
        <Grid xs={12} md={4}>
          <Card
            sx={{
              height: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexDirection: 'column',
              py: 5,
              px: 3,
              textAlign: 'center',
            }}
          >
            <Field.UploadImage
              name="image"
              variant="avatar"
              maxSize={MAX_AVATAR_SIZE}
              helperText={
                <Typography
                  variant="caption"
                  sx={{
                    mt: 3,
                    mx: 'auto',
                    display: 'block',
                    textAlign: 'center',
                    color: 'text.disabled',
                  }}
                >
                  Allowed {ACCEPTED_IMAGE_EXTENSIONS.join(', ')}
                  <br /> max size of {fData(MAX_AVATAR_SIZE)}
                </Typography>
              }
            />
          </Card>
        </Grid>

        <Grid xs={12} md={8}>
          <Card sx={{ p: 3, height: 1 }}>
            <Typography variant="h6" sx={{ mb: 3 }}>
              Personal Information
            </Typography>

            <Box
              rowGap={3}
              columnGap={2}
              display="grid"
              gridTemplateColumns={{
                xs: 'repeat(1, 1fr)',
                sm: 'repeat(2, 1fr)',
              }}
            >
              <Field.Text name="displayName" label="Full Name" sx={{ gridColumn: { sm: '1 / -1' } }} />
              <Field.Text name="email" label="Email address" />
              <Field.Phone name="phoneNumber" label="Phone number" />
            </Box>
          </Card>
        </Grid>
      </Grid>

      <Stack direction="row" alignItems="center" justifyContent="flex-end" spacing={2} sx={{ mt: 3 }}>
        <Button variant="outlined" color="inherit" onClick={() => reset(defaultValues)}>
          Cancel
        </Button>

        <LoadingButton type="submit" variant="contained" color="primary" loading={isSubmitting}>
          Save changes
        </LoadingButton>
      </Stack>
    </Form>
  );
}
