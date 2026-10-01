import { createApi } from '@reduxjs/toolkit/query/react';
import { API_ROUTES } from '../apiRoutes';
import { createCustomFetchBaseQuery } from '../baseQuery';

export const faqsApi = createApi({
  reducerPath: 'faqsApi',
  baseQuery: createCustomFetchBaseQuery(),
  tagTypes: ['faq'],
  endpoints: (builder) => ({
    getFaqs: builder.query({
      query: ({ keyword, status } = {}) => {
        const params = {};
        if (keyword) params.keyword = keyword;
        if (status) params.status = status;
        return {
          url: API_ROUTES.FAQS,
          method: 'GET',
          params,
        };
      },
      transformResponse: (res) => ({
        data: res.data || [],
        meta: res.meta,
      }),
      providesTags: ['faq'],
    }),

    addFaq: builder.mutation({
      query: (body) => ({
        url: API_ROUTES.FAQS,
        method: 'POST',
        body,
      }),
      invalidatesTags: ['faq'],
    }),

    updateFaq: builder.mutation({
      query: ({ id, ...body }) => ({
        url: API_ROUTES.FAQS_BY_ID(id),
        method: 'PUT',
        body,
      }),
      invalidatesTags: ['faq'],
    }),

    deleteFaq: builder.mutation({
      query: (id) => ({
        url: API_ROUTES.FAQS_BY_ID(id),
        method: 'DELETE',
      }),
      invalidatesTags: ['faq'],
    }),
  }),
});

export const {
  useGetFaqsQuery,
  useAddFaqMutation,
  useUpdateFaqMutation,
  useDeleteFaqMutation,
} = faqsApi;
