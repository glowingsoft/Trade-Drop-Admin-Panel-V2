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
import {
  ACCEPTED_IMAGE_TYPES,
  MAX_AVATAR_SIZE,
  isImagePublicId,
} from 'src/constants/upload';
import { fData } from 'src/utils/format-number';
import { handleApiError } from 'src/utils/errorHandler';
import { useUploadFileMutation } from 'src/store/Reducer/upload-api';
import {
  useAddCategoryMutation,
  useUpdateCategoryMutation,
} from 'src/store/Reducer/categories-api';

import { getCategoryInterests } from './map-category';

const toSlug = (value) =>
  String(value || '')
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

const toImagePublicId = (value) => {
  if (!value || typeof value !== 'string') return '';
  if (isImagePublicId(value)) return value.trim();
  const marker = '/image/upload/';
  const index = value.indexOf(marker);
  if (index === -1) return '';
  return value.slice(index + marker.length).replace(/^v\d+\//, '');
};

const schema = zod.object({
  name: zod.string().trim().min(1, 'Name is required'),
  slug: zod
    .string()
    .transform((value) => toSlug(value))
    .pipe(zod.string().min(1, 'Slug is required')),
  sortOrder: zod.coerce.number({ invalid_type_error: 'Sort order is required' }).int().min(1, {
    message: 'Sort order must be at least 1',
  }),
  status: zod.string().min(1, 'Status is required'),
  image: zod
    .any()
    .refine(
      (value) => value instanceof File || (typeof value === 'string' && value.trim().length > 0),
      { message: 'Image is required' }
    )
    .refine((value) => !(value instanceof File) || value.size <= MAX_AVATAR_SIZE, {
      message: `Image size must be less than ${fData(MAX_AVATAR_SIZE)}`,
    })
    .refine((value) => !(value instanceof File) || ACCEPTED_IMAGE_TYPES.includes(value.type), {
      message: 'Only PNG, JPG, JPEG, WEBP, AVIF and GIF images are allowed',
    }),
});

const QuickAddEditCategoryModal = ({ currentCategory, open, onClose }) => {
  const [uploadFile] = useUploadFileMutation();
  const [addCategory] = useAddCategoryMutation();
  const [updateCategory] = useUpdateCategoryMutation();

  const defaultValues = useMemo(
    () => ({
      image: currentCategory?.image || '',
      name: currentCategory?.name || '',
      slug: currentCategory?.slug || toSlug(currentCategory?.name || ''),
      sortOrder: currentCategory?.sortOrder ?? '',
      status: currentCategory?.active === false ? 'inactive' : 'active',
    }),
    [currentCategory]
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

  const nameValue = useWatch({ control, name: 'name' });

  useEffect(() => {
    reset(defaultValues);
  }, [defaultValues, reset]);

  useEffect(() => {
    if (!dirtyFields.name || dirtyFields.slug) return;
    setValue('slug', toSlug(nameValue));
  }, [nameValue, dirtyFields.name, dirtyFields.slug, setValue]);

  const handleClose = () => {
    onClose();
    reset();
  };

  const onSubmit = handleSubmit(async (data) => {
    try {
      let image = toImagePublicId(data.image);

      if (data.image instanceof File) {
        const uploadResponse = await uploadFile(data.image).unwrap();
        image = uploadResponse?.data?.file;
      }

      const nextValues = {
        slug: data.slug,
        name: data.name.trim(),
        image,
        sortOrder: Number(data.sortOrder),
        status: data.status === 'inactive' ? 'inactive' : 'active',
      };

      let response;

      if (currentCategory) {
        const previousValues = {
          slug: currentCategory.slug || '',
          name: (currentCategory.name || '').trim(),
          image: toImagePublicId(currentCategory.image),
          sortOrder: Number(currentCategory.sortOrder),
          status: currentCategory.active === false ? 'inactive' : 'active',
        };

        const payload = Object.fromEntries(
          Object.entries(nextValues).filter(([key, value]) => value !== previousValues[key])
        );

        if (!Object.keys(payload).length) {
          handleClose();
          return;
        }

        response = await updateCategory({ id: currentCategory._id, ...payload }).unwrap();
      } else {
        const { status, ...payload } = nextValues;
        response = await addCategory({
          ...payload,
          intrests: getCategoryInterests(currentCategory),
        }).unwrap();
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
        <DialogTitle sx={{ textAlign: 'center' }}>
          {currentCategory ? 'Edit Category' : 'Add Category'}
        </DialogTitle>
        <DialogContent>
          <Field.UploadImage name="image" sx={{ mt: 0, mb: 2 }} />

          <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Field.Text name="name" label="Name" />
            <Field.Text name="slug" label="Slug" />
            <Field.Text name="sortOrder" label="Sort Order" type="number" />

            {currentCategory ? (
              <Field.Select name="status" label="Status">
                <Divider sx={{ borderStyle: 'dashed' }} />
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
          <LoadingButton
            type="submit"
            variant="contained"
            color="primary"
            loading={isSubmitting}
            sx={{ px: 2 }}
          >
            {currentCategory ? 'Update' : 'Add'}
          </LoadingButton>
        </DialogActions>
      </Form>
    </Dialog>
  );
};

export default QuickAddEditCategoryModal;
