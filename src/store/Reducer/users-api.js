import { createApi } from '@reduxjs/toolkit/query/react';
import { API_ROUTES } from '../apiRoutes';
import { createCustomFetchBaseQuery } from '../baseQuery';

export const usersApi = createApi({
  reducerPath: 'usersApi',
  baseQuery: createCustomFetchBaseQuery(),
  tagTypes: ['user', 'userReview'],
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

    getUserReviews: builder.query({
      query: ({ page = 0, limit = 10, keyword, toUserId, categoryId } = {}) => {
        const params = {
          page: page + 1,
          limit,
        };
        if (keyword) params.keyword = keyword;
        if (toUserId) params.toUserId = toUserId;
        if (categoryId) params.categoryId = categoryId;
        return {
          url: API_ROUTES.ADMIN_USER_REVIEWS,
          method: 'GET',
          params,
        };
      },
      transformResponse: (res) => ({
        data: res.data || [],
        meta: res.meta || {},
        total_length: res.meta?.totalRecords || 0,
      }),
      providesTags: ['userReview'],
    }),

    getUserById: builder.query({
      query: (id) => ({
        url: API_ROUTES.ADMIN_USERS_BY_ID(id),
        method: 'GET',
      }),
      transformResponse: (res) => res?.data ?? res,
      providesTags: (result, error, id) => [{ type: 'user', id }, 'user'],
    }),

    updateUser: builder.mutation({
      query: ({ id, body }) => ({
        url: API_ROUTES.ADMIN_USERS_BY_ID(id),
        method: 'PUT',
        body,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'user', id }, 'user'],
    }),
  }),
});

export const {
  useGetUsersQuery,
  useGetUserReviewsQuery,
  useGetUserByIdQuery,
  useUpdateUserMutation,
} = usersApi;
