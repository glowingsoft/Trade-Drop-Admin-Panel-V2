import { createApi } from '@reduxjs/toolkit/query/react';
import { API_ROUTES } from '../apiRoutes';
import { createCustomFetchBaseQuery } from '../baseQuery';

export const disputesApi = createApi({
  reducerPath: 'disputesApi',
  baseQuery: createCustomFetchBaseQuery(),
  tagTypes: ['dispute'],
  endpoints: (builder) => ({
    getDisputes: builder.query({
      query: ({ page = 0, limit = 10, scope = 'all', status, priority, keyword } = {}) => {
        const params = {
          scope,
          page: page + 1,
          limit,
        };
        if (status) params.status = status;
        if (priority) params.priority = priority;
        if (keyword) params.keyword = keyword;
        return {
          url: API_ROUTES.DISPUTES,
          method: 'GET',
          params,
        };
      },
      transformResponse: (res) => ({
        data: res.data || [],
        meta: res.meta || {},
        total_length: res.meta?.totalRecords || 0,
      }),
      providesTags: ['dispute'],
    }),

    getDisputeById: builder.query({
      query: (id) => ({
        url: API_ROUTES.DISPUTES_BY_ID(id),
        method: 'GET',
      }),
      transformResponse: (res) => res?.data ?? res,
      providesTags: (result, error, id) => [{ type: 'dispute', id }, 'dispute'],
    }),

    resolveDispute: builder.mutation({
      query: ({ id, ...body }) => ({
        url: API_ROUTES.DISPUTES_RESOLVE(id),
        method: 'POST',
        body,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'dispute', id }, 'dispute'],
    }),
  }),
});

export const { useGetDisputesQuery, useGetDisputeByIdQuery, useResolveDisputeMutation } = disputesApi;
