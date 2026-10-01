import { createApi } from '@reduxjs/toolkit/query/react';
import { API_ROUTES } from '../apiRoutes';
import { createCustomFetchBaseQuery } from '../baseQuery';

export const dropsApi = createApi({
  reducerPath: 'dropsApi',
  baseQuery: createCustomFetchBaseQuery(),
  tagTypes: ['drop'],
  endpoints: (builder) => ({
    getDrops: builder.query({
      query: ({ page = 0, limit = 10, category, area, timingChip, status } = {}) => {
        const params = {
          page: page + 1,
          limit,
        };
        if (category) params.category = category;
        if (area) params.area = area;
        if (timingChip) params.timingChip = timingChip;
        if (status) params.status = status;
        return {
          url: API_ROUTES.DROPS_ALL,
          method: 'GET',
          params,
        };
      },
      transformResponse: (res) => ({
        data: res.data || [],
        meta: res.meta || {},
        total_length: res.meta?.totalRecords || 0,
      }),
      providesTags: ['drop'],
    }),
  }),
});

export const { useGetDropsQuery } = dropsApi;
