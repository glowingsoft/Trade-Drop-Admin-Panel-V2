import { createApi } from '@reduxjs/toolkit/query/react';
import { API_ROUTES } from '../apiRoutes';
import { createCustomFetchBaseQuery } from '../baseQuery';

export const badgesApi = createApi({
  reducerPath: 'badgesApi',
  baseQuery: createCustomFetchBaseQuery(),
  tagTypes: ['badge'],
  endpoints: (builder) => ({
    getBadges: builder.query({
      query: () => ({
        url: API_ROUTES.BADGES,
        method: 'GET',
      }),
      transformResponse: (res) => ({
        data: Array.isArray(res.data) ? res.data : res.data?.data || [],
      }),
      providesTags: ['badge'],
    }),

    addBadge: builder.mutation({
      query: (body) => ({
        url: API_ROUTES.BADGES,
        method: 'POST',
        body,
      }),
      invalidatesTags: ['badge'],
    }),

    updateBadge: builder.mutation({
      query: ({ id, ...body }) => ({
        url: API_ROUTES.BADGES_BY_ID(id),
        method: 'PUT',
        body,
      }),
      invalidatesTags: ['badge'],
    }),

    deleteBadge: builder.mutation({
      query: (id) => ({
        url: API_ROUTES.BADGES_BY_ID(id),
        method: 'DELETE',
      }),
      invalidatesTags: ['badge'],
    }),
  }),
});

export const {
  useGetBadgesQuery,
  useAddBadgeMutation,
  useUpdateBadgeMutation,
  useDeleteBadgeMutation,
} = badgesApi;
