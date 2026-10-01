import { createApi } from '@reduxjs/toolkit/query/react';
import { API_ROUTES } from '../apiRoutes';
import { createCustomFetchBaseQuery } from '../baseQuery';

export const announcementsApi = createApi({
  reducerPath: 'announcementsApi',
  baseQuery: createCustomFetchBaseQuery(),
  tagTypes: ['announcement', 'notificationSegment'],
  endpoints: (builder) => ({
    getAnnouncements: builder.query({
      query: () => ({
        url: API_ROUTES.ANNOUNCEMENTS,
        method: 'GET',
      }),
      transformResponse: (res) => ({
        data: res.data || [],
        meta: res.meta || {},
      }),
      providesTags: ['announcement'],
    }),

    createAnnouncement: builder.mutation({
      query: (body) => ({
        url: API_ROUTES.ANNOUNCEMENTS,
        method: 'POST',
        body,
      }),
      invalidatesTags: ['announcement'],
    }),

    updateAnnouncement: builder.mutation({
      query: ({ id, ...body }) => ({
        url: API_ROUTES.ANNOUNCEMENTS_BY_ID(id),
        method: 'PUT',
        body,
      }),
      invalidatesTags: ['announcement'],
    }),

    deleteAnnouncement: builder.mutation({
      query: (id) => ({
        url: API_ROUTES.ANNOUNCEMENTS_BY_ID(id),
        method: 'DELETE',
      }),
      invalidatesTags: ['announcement'],
    }),

    getNotificationSegments: builder.query({
      query: () => ({
        url: API_ROUTES.NOTIFICATION_SEGMENTS,
        method: 'GET',
      }),
      transformResponse: (res) => ({
        categories: res.data?.categories || [],
        areas: res.data?.areas || [],
        activities: res.data?.activities || [],
      }),
      providesTags: ['notificationSegment'],
    }),

    sendNotificationBySegments: builder.mutation({
      query: (body) => ({
        url: API_ROUTES.NOTIFICATIONS_SEND_BY_SEGMENTS,
        method: 'POST',
        body,
      }),
    }),
  }),
});

export const {
  useGetAnnouncementsQuery,
  useCreateAnnouncementMutation,
  useUpdateAnnouncementMutation,
  useDeleteAnnouncementMutation,
  useGetNotificationSegmentsQuery,
  useSendNotificationBySegmentsMutation,
} = announcementsApi;
