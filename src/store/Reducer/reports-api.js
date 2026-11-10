import { createApi } from '@reduxjs/toolkit/query/react';
import { API_ROUTES } from '../apiRoutes';
import { createCustomFetchBaseQuery } from '../baseQuery';

export const REPORT_REASONS = [
  'harassment',
  'spam',
  'inappropriate_content',
  'impersonation',
  'scams_fraud',
  'other',
];

export const REPORT_RESOURCE_TYPES = ['user', 'drop', 'message', 'circle', 'event'];

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
      query: ({ resourceID, resourceId, resourceType, page = 1, limit = 50 } = {}) => {
        const params = {
          page,
          limit,
        };
        const id = resourceID || resourceId;
        if (id) params.resourceID = id;
        if (resourceType) params.resourceType = resourceType;

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

    createReport: builder.mutation({
      query: ({
        reportedUserId,
        reason,
        description,
        resourceType,
        blockUser = false,
        resourceId,
        resourceID,
      }) => {
        const body = {
          reason,
          resourceType,
          blockUser: Boolean(blockUser),
        };

        if (reportedUserId) body.reportedUserId = reportedUserId;
        if (description != null && description !== '') body.description = description;

        const id = resourceId || resourceID;
        if (id) body.resourceId = id;

        return {
          url: API_ROUTES.REPORTS,
          method: 'POST',
          body,
        };
      },
      invalidatesTags: ['report'],
    }),
  }),
});

export const { useGetReportsQuery, useCreateReportMutation } = reportsApi;
