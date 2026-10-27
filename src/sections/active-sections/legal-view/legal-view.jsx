import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useMemo } from 'react';
import { Controller, useForm } from 'react-hook-form';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { z as zod } from 'zod';

import { LoadingButton } from '@mui/lab';
import Paper from '@mui/material/Paper';
import { styled, useTheme } from '@mui/material/styles';
import { Box, Stack } from '@mui/system';

import { Form } from 'src/components/hook-form';
import { LoadingScreen } from 'src/components/loading-screen';
import { toast } from 'src/components/snackbar';
import { handleApiError } from 'src/utils/errorHandler';
import {
  useCreateSettingsMutation,
  useGetAboutUsQuery,
  useGetPrivacyPolicyQuery,
  useGetTermsConditionsQuery,
  useUpdateSettingsMutation,
} from 'src/store/Reducer/settings-api';

const FIELD_BY_TYPE = {
  terms: 'terms_and_conditions',
  about: 'about_us',
  policy: 'privacy_policy',
};

const stripHtml = (value) =>
  String(value || '')
    .replace(/<[^>]*>/g, '')
    .replace(/&nbsp;/g, ' ')
    .trim();

const LegalSchema = zod.object({
  content: zod.string().refine((value) => stripHtml(value).length > 0, {
    message: 'Content is required',
  }),
});

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  maxWidth: '100%',
  overflow: 'hidden',
  boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
  [theme.breakpoints.up('sm')]: {
    padding: theme.spacing(3),
  },
}));

export default function LegalView({ type }) {
  const theme = useTheme();
  const fieldKey = FIELD_BY_TYPE[type];

  const termsQuery = useGetTermsConditionsQuery(undefined, { skip: type !== 'terms' });
  const aboutQuery = useGetAboutUsQuery(undefined, { skip: type !== 'about' });
  const privacyQuery = useGetPrivacyPolicyQuery(undefined, { skip: type !== 'policy' });

  const [createSettings] = useCreateSettingsMutation();
  const [updateSettings] = useUpdateSettingsMutation();

  const pageQuery =
    type === 'terms' ? termsQuery : type === 'about' ? aboutQuery : privacyQuery;

  const settingsId = pageQuery.data?.data?._id;

  const defaultValues = useMemo(
    () => ({
      content: pageQuery.data?.data?.[fieldKey] || '',
    }),
    [fieldKey, pageQuery.data]
  );

  const methods = useForm({
    resolver: zodResolver(LegalSchema),
    defaultValues,
  });

  const {
    control,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = methods;

  useEffect(() => {
    reset(defaultValues);
  }, [defaultValues, reset]);

  useEffect(() => {
    if (pageQuery.error && pageQuery.error.status !== 404) {
      handleApiError(pageQuery.error);
    }
  }, [pageQuery.error]);

  const onSubmit = handleSubmit(async (formData) => {
    try {
      const payload = { [fieldKey]: formData.content };

      const response = settingsId
        ? await updateSettings({ id: settingsId, ...payload }).unwrap()
        : await createSettings(payload).unwrap();

      if (response.message) toast.success(response.message);
    } catch (error) {
      handleApiError(error);
    }
  });

  if (pageQuery.isLoading) {
    return <LoadingScreen />;
  }

  return (
    <Box sx={{ px: { xs: 2, md: 6 }, pb: 5, display: 'flex', flexDirection: 'column' }}>
      <Form methods={methods} onSubmit={onSubmit}>
        <Stack>
          <StyledPaper
            elevation={3}
            sx={{
              '.ql-toolbar': {
                borderColor: theme.palette.divider,
                display: 'flex',
                flexWrap: 'wrap',
                ...(theme.palette.mode === 'dark' && {
                  backgroundColor: theme.palette.background.neutral,
                  '& .ql-stroke': { stroke: theme.palette.text.primary },
                  '& .ql-fill': { fill: theme.palette.text.primary },
                  '& .ql-picker-label': { color: theme.palette.text.primary },
                  '& .ql-picker-item': { color: theme.palette.text.primary },
                  '& .ql-picker-options': {
                    backgroundColor: theme.palette.background.paper,
                    border: `1px solid ${theme.palette.divider}`,
                  },
                }),
              },
              '.ql-container': {
                borderColor: theme.palette.divider,
              },
            }}
          >
            <Controller
              name="content"
              control={control}
              render={({ field, fieldState: { error } }) => (
                <>
                  <ReactQuill
                    value={field.value}
                    onChange={field.onChange}
                    modules={{
                      toolbar: [
                        [{ header: '1' }, { header: '2' }, { font: [] }],
                        [{ size: [] }],
                        ['bold', 'italic', 'underline', 'strike', 'blockquote'],
                        [{ list: 'ordered' }, { list: 'bullet' }, { indent: '-1' }, { indent: '+1' }],
                        ['link', 'image', 'video'],
                        ['clean'],
                      ],
                    }}
                    formats={[
                      'header',
                      'font',
                      'size',
                      'bold',
                      'italic',
                      'underline',
                      'strike',
                      'blockquote',
                      'list',
                      'bullet',
                      'indent',
                      'link',
                      'image',
                      'video',
                    ]}
                  />
                  {error?.message ? (
                    <Box sx={{ color: 'error.main', typography: 'caption', mt: 1 }}>
                      {error.message}
                    </Box>
                  ) : null}
                </>
              )}
            />
          </StyledPaper>

          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
            <LoadingButton
              type="submit"
              color="primary"
              variant="contained"
              loading={isSubmitting}
            >
              Save
            </LoadingButton>
          </Box>
        </Stack>
      </Form>
    </Box>
  );
}
