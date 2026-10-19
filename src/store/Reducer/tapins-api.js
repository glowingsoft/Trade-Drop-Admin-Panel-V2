import { createApi } from '@reduxjs/toolkit/query/react';
import { API_ROUTES } from '../apiRoutes';
import { createCustomFetchBaseQuery } from '../baseQuery';

export const tapInsApi = createApi({
  reducerPath: 'tapInsApi',
  baseQuery: createCustomFetchBaseQuery(),
  tagTypes: ['tapIn'],
  endpoints: (builder) => ({
    getTapIns: builder.query({
      query: ({ page = 0, limit = 10, applicantId, category, timingChip, status, keyword } = {}) => {
        const params = {
          page: page + 1,
          limit,
        };
        if (applicantId) params.applicantId = applicantId;
        if (category) params.category = category;
        if (timingChip) params.timingChip = timingChip;
        if (status) params.status = status;
        if (keyword) params.keyword = keyword;
        return {
          url: API_ROUTES.TAP_INS,
          method: 'GET',
          params,
        };
      },
      transformResponse: (res) => ({
        data: res.data || [],
        meta: res.meta || {},
        total_length: res.meta?.totalRecords || 0,
      }),
      providesTags: ['tapIn'],
    }),
  }),
});

export const { useGetTapInsQuery } = tapInsApi;
