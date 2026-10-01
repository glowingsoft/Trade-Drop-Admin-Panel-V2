import { createApi } from '@reduxjs/toolkit/query/react';
import { API_ROUTES } from '../apiRoutes';
import { createCustomFetchBaseQuery } from '../baseQuery';

export const settingsApi = createApi({
  reducerPath: 'settingsApi',
  baseQuery: createCustomFetchBaseQuery(),
  tagTypes: ['settings'],
  endpoints: (builder) => ({
    getTermsConditions: builder.query({
      query: () => ({
        url: API_ROUTES.SETTINGS_TERMS,
        method: 'GET',
      }),
      providesTags: ['settings'],
    }),

    getAboutUs: builder.query({
      query: () => ({
        url: API_ROUTES.SETTINGS_ABOUT,
        method: 'GET',
      }),
      providesTags: ['settings'],
    }),

    getPrivacyPolicy: builder.query({
      query: () => ({
        url: API_ROUTES.SETTINGS_PRIVACY,
        method: 'GET',
      }),
      providesTags: ['settings'],
    }),

    createSettings: builder.mutation({
      query: (body) => ({
        url: API_ROUTES.SETTINGS_CREATE,
        method: 'POST',
        body,
      }),
      invalidatesTags: ['settings'],
    }),

    updateSettings: builder.mutation({
      query: ({ id, ...body }) => ({
        url: API_ROUTES.SETTINGS_UPDATE(id),
        method: 'PUT',
        body,
      }),
      invalidatesTags: ['settings'],
    }),
  }),
});

export const {
  useGetTermsConditionsQuery,
  useGetAboutUsQuery,
  useGetPrivacyPolicyQuery,
  useCreateSettingsMutation,
  useUpdateSettingsMutation,
} = settingsApi;
