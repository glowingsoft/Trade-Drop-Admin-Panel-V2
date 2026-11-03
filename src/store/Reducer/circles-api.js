import { createApi } from '@reduxjs/toolkit/query/react';
import { API_ROUTES } from '../apiRoutes';
import { createCustomFetchBaseQuery } from '../baseQuery';

const ADMIN_ACCESS_TOKEN = import.meta.env.VITE_BASE_ADMIN_ACCESS_TOKEN;

const asCircleList = (res) => {
  if (Array.isArray(res?.data)) return res.data;
  if (Array.isArray(res?.data?.circles)) return res.data.circles;
  if (Array.isArray(res?.circles)) return res.circles;
  if (res?.data && typeof res.data === 'object' && !Array.isArray(res.data)) return [res.data];
  return [];
};

export const circlesApi = createApi({
  reducerPath: 'circlesApi',
  baseQuery: createCustomFetchBaseQuery(),
  tagTypes: ['circle'],
  endpoints: (builder) => ({
    getCircles: builder.query({
      query: ({
        page = 1,
        limit = 20,
        keyword,
        city,
        privacy,
        category,
      } = {}) => {
        const params = {
          page,
          limit,
        };
        if (keyword) params.keyword = keyword;
        if (city) params.city = city;
        if (privacy) params.privacy = privacy;
        if (category) params.category = category;

        return {
          url: API_ROUTES.CIRCLES_ALL,
          method: 'GET',
          params,
        };
      },
      transformResponse: (res) => {
        const list = asCircleList(res);
        const meta = res?.meta || {};

        return {
          message: res?.message,
          data: list,
          meta,
          total_length: meta.totalRecords ?? list.length,
          count: meta.count || {},
          categories: Array.isArray(meta.categories) ? meta.categories : [],
          privacyOptions: Array.isArray(meta.privacy) ? meta.privacy : [],
        };
      },
      providesTags: ['circle'],
    }),

    getCircleById: builder.query({
      query: (id) => ({
        url: API_ROUTES.CIRCLES_BY_ID(id),
        method: 'GET',
      }),
      transformResponse: (res) => {
        const list = asCircleList(res);
        return list[0] || null;
      },
      providesTags: (result, error, id) => [{ type: 'circle', id }, 'circle'],
    }),

    getCircleMembers: builder.query({
      query: ({ id, page = 1, limit = 20 } = {}) => ({
        url: API_ROUTES.CIRCLES_MEMBERS(id),
        method: 'GET',
        params: { page, limit },
        headers: ADMIN_ACCESS_TOKEN
          ? { 'x-admin-access-token': ADMIN_ACCESS_TOKEN }
          : undefined,
      }),
      transformResponse: (res) => {
        const list = Array.isArray(res?.data) ? res.data : [];
        const meta = res?.meta || {};

        return {
          message: res?.message,
          data: list,
          meta,
          total_length: meta.totalRecords ?? list.length,
        };
      },
      providesTags: (result, error, arg) => [{ type: 'circle', id: arg?.id }, 'circle'],
    }),
  }),
});

export const {
  useGetCirclesQuery,
  useGetCircleByIdQuery,
  useLazyGetCircleMembersQuery,
} = circlesApi;
