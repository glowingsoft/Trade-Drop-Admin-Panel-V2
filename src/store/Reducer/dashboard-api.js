import { createApi } from '@reduxjs/toolkit/query/react';
import { API_ROUTES } from '../apiRoutes';
import { createCustomFetchBaseQuery } from '../baseQuery';

export const dashboardApi = createApi({
  reducerPath: 'dashboardApi',
  baseQuery: createCustomFetchBaseQuery(),
  tagTypes: ['dashboard'],
  endpoints: (builder) => ({
    getDashboardStats: builder.query({
      query: ({ range } = {}) => ({
        url: API_ROUTES.DASHBOARD_STATS,
        method: 'GET',
        params: {
          range,
          timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        },
      }),
      transformResponse: (res) => res.data,
      providesTags: ['dashboard'],
    }),
  }),
});

export const { useGetDashboardStatsQuery } = dashboardApi;
