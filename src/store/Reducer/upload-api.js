import { createApi } from '@reduxjs/toolkit/query/react';
import { API_ROUTES } from '../apiRoutes';
import { createCustomFetchBaseQuery } from '../baseQuery';

export const uploadApi = createApi({
  reducerPath: 'uploadApi',
  baseQuery: createCustomFetchBaseQuery(),
  endpoints: (builder) => ({
    uploadFile: builder.mutation({
      query: (file) => {
        const formData = new FormData();
        formData.append('file', file);
        return {
          url: API_ROUTES.UPLOAD,
          method: 'POST',
          body: formData,
        };
      },
    }),
  }),
});

export const { useUploadFileMutation } = uploadApi;
