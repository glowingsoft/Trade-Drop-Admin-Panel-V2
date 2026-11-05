import { createApi } from '@reduxjs/toolkit/query/react';
import { API_ROUTES } from '../apiRoutes';
import { createCustomFetchBaseQuery } from '../baseQuery';

const ADMIN_ACCESS_TOKEN = import.meta.env.VITE_BASE_ADMIN_ACCESS_TOKEN;

const asEventList = (res) => {
  if (Array.isArray(res?.data)) return res.data;
  if (Array.isArray(res?.data?.events)) return res.data.events;
  if (Array.isArray(res?.events)) return res.events;
  if (res?.data && typeof res.data === 'object' && !Array.isArray(res.data)) return [res.data];
  return [];
};

export const eventsApi = createApi({
  reducerPath: 'eventsApi',
  baseQuery: createCustomFetchBaseQuery(),
  tagTypes: ['event'],
  endpoints: (builder) => ({
    getEvents: builder.query({
      query: ({
        page = 1,
        limit = 20,
        keyword,
        status,
      } = {}) => {
        const params = {
          page,
          limit,
        };
        if (keyword) params.keyword = keyword;
        if (status) params.status = status;

        return {
          url: API_ROUTES.EVENTS_ALL,
          method: 'GET',
          params,
        };
      },
      transformResponse: (res) => {
        const list = asEventList(res);
        const meta = res?.meta || {};

        return {
          message: res?.message,
          data: list,
          meta,
          total_length: meta.totalRecords ?? meta.total ?? list.length,
          count: meta.count || {},
        };
      },
      providesTags: ['event'],
    }),

    getEventById: builder.query({
      query: (id) => ({
        url: API_ROUTES.EVENTS_BY_ID(id),
        method: 'GET',
      }),
      transformResponse: (res) => {
        if (res?.data && typeof res.data === 'object' && !Array.isArray(res.data)) {
          return res.data;
        }
        const list = asEventList(res);
        return list[0] || null;
      },
      providesTags: (result, error, id) => [{ type: 'event', id }, 'event'],
    }),

    updateEvent: builder.mutation({
      query: ({ id, ...body }) => ({
        url: API_ROUTES.EVENTS_BY_ID(id),
        method: 'PATCH',
        body,
        headers: ADMIN_ACCESS_TOKEN
          ? { 'x-admin-access-token': ADMIN_ACCESS_TOKEN }
          : undefined,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'event', id }, 'event'],
    }),

    cancelEvent: builder.mutation({
      query: (id) => ({
        url: API_ROUTES.EVENTS_CANCEL(id),
        method: 'POST',
        headers: ADMIN_ACCESS_TOKEN
          ? { 'x-admin-access-token': ADMIN_ACCESS_TOKEN }
          : undefined,
      }),
      invalidatesTags: (result, error, id) => [{ type: 'event', id }, 'event'],
    }),

    publishEvent: builder.mutation({
      query: (id) => ({
        url: API_ROUTES.EVENTS_PUBLISH(id),
        method: 'POST',
        headers: ADMIN_ACCESS_TOKEN
          ? { 'x-admin-access-token': ADMIN_ACCESS_TOKEN }
          : undefined,
      }),
      invalidatesTags: (result, error, id) => [{ type: 'event', id }, 'event'],
    }),
  }),
});

export const {
  useGetEventsQuery,
  useGetEventByIdQuery,
  useUpdateEventMutation,
  useCancelEventMutation,
  usePublishEventMutation,
} = eventsApi;
