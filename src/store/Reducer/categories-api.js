import { createApi } from '@reduxjs/toolkit/query/react';
import { API_ROUTES } from '../apiRoutes';
import { createCustomFetchBaseQuery } from '../baseQuery';

export const categoriesApi = createApi({
  reducerPath: 'categoriesApi',
  baseQuery: createCustomFetchBaseQuery(),
  tagTypes: ['category', 'timingChip'],
  endpoints: (builder) => ({
    getCategories: builder.query({
      query: ({ search, page = 0, status, limit = 10 } = {}) => {
        const params = {
          page: page + 1,
          limit,
        };
        if (search) params.keyword = search;
        if (status) params.status = status;
        return {
          url: API_ROUTES.CATEGORIES_ALL,
          method: 'GET',
          params,
        };
      },
      transformResponse: (res) => ({
        data: res.data || [],
        meta: res.meta || {},
        total_length: res.meta?.totalRecords || 0,
      }),
      providesTags: ['category'],
    }),

    addCategory: builder.mutation({
      query: (body) => ({
        url: API_ROUTES.CATEGORIES,
        method: 'POST',
        body,
      }),
      invalidatesTags: ['category'],
    }),

    updateCategory: builder.mutation({
      query: ({ id, ...body }) => ({
        url: API_ROUTES.CATEGORIES_BY_ID(id),
        method: 'PUT',
        body,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'category', id }, 'category'],
    }),

    getTimingChips: builder.query({
      query: ({ page = 0, limit = 10 } = {}) => ({
        url: API_ROUTES.TIMING_CHIPS,
        method: 'GET',
        params: {
          page: page + 1,
          limit,
        },
      }),
      transformResponse: (res) => {
        const payload = res.data;
        const list = Array.isArray(payload) ? payload : payload?.data || [];
        const meta = Array.isArray(payload) ? res.meta || {} : payload?.meta || {};
        return {
          data: list,
          meta,
          total_length: meta.totalRecords ?? list.length,
        };
      },
      providesTags: ['timingChip'],
    }),

    addTimingChip: builder.mutation({
      query: (body) => ({
        url: API_ROUTES.TIMING_CHIPS,
        method: 'POST',
        body,
      }),
      invalidatesTags: ['timingChip'],
    }),

    updateTimingChip: builder.mutation({
      query: ({ id, ...body }) => ({
        url: API_ROUTES.TIMING_CHIPS_BY_ID(id),
        method: 'PATCH',
        body,
      }),
      invalidatesTags: ['timingChip'],
    }),

    deleteTimingChip: builder.mutation({
      query: (id) => ({
        url: API_ROUTES.TIMING_CHIPS_BY_ID(id),
        method: 'DELETE',
      }),
      invalidatesTags: ['timingChip'],
    }),
  }),
});

export const {
  useGetCategoriesQuery,
  useAddCategoryMutation,
  useUpdateCategoryMutation,
  useGetTimingChipsQuery,
  useAddTimingChipMutation,
  useUpdateTimingChipMutation,
  useDeleteTimingChipMutation,
} = categoriesApi;
