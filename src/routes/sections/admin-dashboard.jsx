import { lazy, Suspense } from 'react';
import { Outlet } from 'react-router-dom';

import { CONFIG } from 'src/config-global';
import { DashboardLayout } from 'src/layouts/dashboard';

import { LoadingScreen } from 'src/components/loading-screen';

// import { AuthGuard } from 'src/auth/guard';
import ProtectedRoute from 'src/auth/guard/custom-auth-guard';

// ----------------------------------------------------------------------

// Overview
const IndexPage = lazy(() => import('src/pages/dashboard'));

const BlankPage = lazy(() => import('src/pages/dashboard/blank'));

// ----------------------------------------------------------------------

//users
const UserListPage = lazy(() => import('src/pages/dashboard/active-routes/user/list'));
const UserProfilePage = lazy(() => import('src/pages/dashboard/active-routes/user/detail'));
//categories
const CategoryListPage = lazy(() => import('src/pages/dashboard/active-routes/categories'));
//timing chips
const TimingChipsListPage = lazy(() => import('src/pages/dashboard/active-routes/timing-chips'));
//settings
const SettingsPage = lazy(() => import('src/pages/dashboard/active-routes/settings'));
//profile
const ProfilePage = lazy(() => import('src/pages/dashboard/active-routes/profile'));
//drops
const DropsListPage = lazy(() => import('src/pages/dashboard/active-routes/drops'));
//badges
const BadgesListPage = lazy(() => import('src/pages/dashboard/active-routes/badges'));
//disputes
const DisputesListPage = lazy(() => import('src/pages/dashboard/active-routes/disputes'));
const DisputesDetailsPage = lazy(() => import('src/pages/dashboard/active-routes/disputes-detail'));
//notifications
const NotificationPage = lazy(() => import('src/pages/dashboard/active-routes/notifications'));

//legal pages
const TermsPage = lazy(() => import('src/pages/dashboard/active-routes/terms'));
const AboutPage = lazy(() => import('src/pages/dashboard/active-routes/about'));
const PrivacyPage = lazy(() => import('src/pages/dashboard/active-routes/policy'));

//faqs
const FAQsPage = lazy(() => import('src/pages/dashboard/active-routes/faq'));



const layoutContent = (
  <DashboardLayout>
    <Suspense fallback={<LoadingScreen />}>
      <Outlet />
    </Suspense>
  </DashboardLayout>
);

export const adminDashboardRoutes = [
  {
    path: 'admin-dashboard',
    // element: CONFIG.auth.skip ? <>{layoutContent}</> : <>{layoutContent}</>,
    element: CONFIG.auth.skip ? <>{layoutContent}</> : <ProtectedRoute requiredPermission={[1]}>{layoutContent}</ProtectedRoute>,
    children: [
      { element: <IndexPage />, index: true },
      {
        path: "users", children: [
          { index: true, element: <UserListPage /> },
          { path: ":id", element: <UserProfilePage /> }
        ]
      },
      { path: 'drops', element: <DropsListPage /> },
      { path: "categories", element: <CategoryListPage /> },
      { path: "timing-chips", element: <TimingChipsListPage /> },
      { path: "badges", element: <BadgesListPage /> },
      { path: "disputes", element: <DisputesListPage /> },
      { path: "disputes/:id", element: <DisputesDetailsPage /> },
      { path: "notifications", element: <NotificationPage /> },
      {
        path: "cms", children: [
          { path: "terms", element: <TermsPage /> },
          { path: "about", element: <AboutPage /> },
          { path: "privacy", element: <PrivacyPage /> },
          { path: "faqs", element: <FAQsPage /> }
        ]
      },
      { path: "settings", element: <SettingsPage /> },
      { path: "profile", element: <ProfilePage /> },
    ],
  },
];
