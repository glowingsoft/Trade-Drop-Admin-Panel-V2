export const API_ROUTES = {
    AUTH: {
        LOGIN: '/auth/login',
        FORGOT_PASSWORD: '/auth/forgot-password',
        VERIFY_OTP: '/auth/verify-otp/email',
        RESET_PASSWORD: '/auth/reset-password',
        CHANGE_PASSWORD: '/auth/change-password',
    },

    WALLETS: '/wallets',
    WALLETS_BY_ID: (id) => `/wallets/${id}`,

    TRANSACTIONS: '/transactions',
    TRANSACTIONS_BY_ID: (id) => `/transactions/${id}`,

    USERS: '/users',
    USERS_BY_ID: (id) => `/users/${id}`,
    ADMIN_USERS: '/admin/users',
    ADMIN_USERS_BY_ID: (id) => `/admin/users/${id}`,
    ADMIN_USER_REVIEWS: '/admin/users/reviews',

    CATEGORIES: '/admin/catalog/categories',
    CATEGORIES_ALL: '/admin/catalog/categories/all',
    CATEGORIES_BY_ID: (id) => `/admin/catalog/categories/${id}`,
    CATEGORIES_STATUS: (id) => `/admin/catalog/categories/${id}/status`,
    TIMING_CHIPS: '/admin/catalog/timing-chips',
    TIMING_CHIPS_BY_ID: (id) => `/admin/catalog/timing-chips/${id}`,
    APP_SETTINGS: '/admin/catalog/app-settings',

    UPLOAD: '/upload',

    DASHBOARD_STATS: '/admin/dashboard-stats',

    FAQS: '/admin/faqs',
    FAQS_BY_ID: (id) => `/admin/faqs/${id}`,

    SETTINGS_CREATE: '/admin/settings/create',
    SETTINGS_UPDATE: (id) => `/admin/settings/update/${id}`,
    SETTINGS_TERMS: '/admin/settings/terms-conditions',
    SETTINGS_ABOUT: '/admin/settings/about-us',
    SETTINGS_PRIVACY: '/admin/settings/privacy-policy',

    ANNOUNCEMENTS: '/admin/announcements',
    ANNOUNCEMENTS_BY_ID: (id) => `/admin/announcements/${id}`,
    NOTIFICATION_SEGMENTS: '/notifications/segments',
    NOTIFICATIONS_SEND_BY_SEGMENTS: '/notifications/send-by-segments',

    DROPS_ALL: '/drops/all',
    TAP_INS: '/tap-ins',

    BADGES: '/admin/badges',
    BADGES_BY_ID: (id) => `/admin/badges/${id}`,

    DISPUTES: '/disputes',
    DISPUTES_BY_ID: (id) => `/disputes/${id}`,
    DISPUTES_RESOLVE: (id) => `/disputes/${id}/resolve`,
};