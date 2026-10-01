import { createApi } from "@reduxjs/toolkit/query/react";
import { API_ROUTES } from '../apiRoutes';
import { createCustomFetchBaseQuery } from "../baseQuery";

const ADMIN_ACCESS_TOKEN = import.meta.env.VITE_BASE_ADMIN_ACCESS_TOKEN;

export const authApi = createApi({
  reducerPath: "auth",
  baseQuery: createCustomFetchBaseQuery(),
  tagTypes: ['profile'],
  endpoints: (builder) => ({

    login: builder.mutation({
      query: (login) => ({
        url: API_ROUTES.AUTH.LOGIN,
        method: "POST",
        body: login,
        headers: {
          'x-admin-access-token': ADMIN_ACCESS_TOKEN,
        },
      }),
    }),

    forgotPassword: builder.mutation({
      query: (body) => ({
        url: API_ROUTES.AUTH.FORGOT_PASSWORD,
        method: "POST",
        body,
      }),
    }),

    verifyOtp: builder.mutation({
      query: (body) => ({
        url: API_ROUTES.AUTH.VERIFY_OTP,
        method: "POST",
        body,
      }),
    }),

    resetPassword: builder.mutation({
      query: (body) => ({
        url: API_ROUTES.AUTH.RESET_PASSWORD,
        method: "POST",
        body,
      }),
    }),

    changePassword: builder.mutation({
      query: (body) => ({
        url: API_ROUTES.AUTH.CHANGE_PASSWORD,
        method: "POST",
        body,
      }),
    }),
  })
});

export const {
  useLoginMutation,
  useForgotPasswordMutation,
  useVerifyOtpMutation,
  useResetPasswordMutation,
  useChangePasswordMutation,
} = authApi;
