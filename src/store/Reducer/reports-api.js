import { createApi } from '@reduxjs/toolkit/query/react';
import { API_ROUTES } from '../apiRoutes';
import { createCustomFetchBaseQuery } from '../baseQuery';

const asReportList = (res) => {
  if (Array.isArray(res?.data)) return res.data;
  if (Array.isArray(res?.data?.reports)) return res.data.reports;
  if (Array.isArray(res?.reports)) return res.reports;
  if (res?.data && typeof res.data === 'object' && !Array.isArray(res.data)) return [res.data];
  return [];
};

export const reportsApi = createApi({
  reducerPath: 'reportsApi',
  baseQuery: createCustomFetchBaseQuery(),
  tagTypes: ['report'],
  endpoints: (builder) => ({
    getReports: builder.query({
      query: ({ resourceID, page = 1, limit = 50 } = {}) => {
        const params = {
          page,
          limit,
        };
        if (resourceID) params.resourceID = resourceID;

        return {
          url: API_ROUTES.ADMIN_REPORTS,
          method: 'GET',
          params,
        };
      },
      transformResponse: (res) => {
        const list = asReportList(res);
        const meta = res?.meta || {};

        return {
          message: res?.message,
          data: list,
          meta,
          total_length: meta.totalRecords ?? list.length,
        };
      },
      providesTags: ['report'],
    }),
  }),
});

export const { useGetReportsQuery } = reportsApi;
