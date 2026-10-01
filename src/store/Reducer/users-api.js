import { createApi } from '@reduxjs/toolkit/query/react';
import { API_ROUTES } from '../apiRoutes';
import { createCustomFetchBaseQuery } from '../baseQuery';

export const usersApi = createApi({
  reducerPath: 'usersApi',
  baseQuery: createCustomFetchBaseQuery(),
  tagTypes: ['user'],
  endpoints: (builder) => ({
    getUsers: builder.query({
      query: ({ page = 0, limit = 10, keyword, status } = {}) => {
        const params = {
          page: page + 1,
          limit,
        };
        if (keyword) params.keyword = keyword;
        if (status) params.status = status;
        return {
          url: API_ROUTES.ADMIN_USERS,
          method: 'GET',
          params,
        };
      },
      transformResponse: (res) => ({
        data: res.data || [],
        meta: res.meta || {},
        total_length: res.meta?.totalRecords || 0,
      }),
      providesTags: ['user'],
    }),

    updateUser: builder.mutation({
      query: ({ id, body }) => ({
        url: API_ROUTES.ADMIN_USERS_BY_ID(id),
        method: 'PUT',
        body,
      }),
      invalidatesTags: ['user'],
    }),
  }),
});

export const { useGetUsersQuery, useUpdateUserMutation } = usersApi;
