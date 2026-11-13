import { lazy, Suspense } from 'react';
import { Outlet } from 'react-router-dom';

import { CONFIG } from 'src/config-global';
import { DashboardLayout } from 'src/layouts/dashboard';

import { LoadingScreen } from 'src/components/loading-screen';

import ProtectedRoute from 'src/auth/guard/custom-auth-guard';


const IndexPage = lazy(() => import('src/pages/dashboard'));

const BlankPage = lazy(() => import('src/pages/dashboard/blank'));


const UserListPage = lazy(() => import('src/pages/dashboard/active-routes/user/list'));
const UserProfilePage = lazy(() => import('src/pages/dashboard/active-routes/user/detail'));
const CategoryListPage = lazy(() => import('src/pages/dashboard/active-routes/categories'));
const CategoryDetailPage = lazy(() => import('src/pages/dashboard/active-routes/categories/detail'));
const TimingChipsListPage = lazy(() => import('src/pages/dashboard/active-routes/timing-chips'));
const SettingsPage = lazy(() => import('src/pages/dashboard/active-routes/settings'));
const ProfilePage = lazy(() => import('src/pages/dashboard/active-routes/profile'));
const DropsListPage = lazy(() => import('src/pages/dashboard/active-routes/drops'));
const CirclesListPage = lazy(() => import('src/pages/dashboard/active-routes/circles'));
const CircleDetailPage = lazy(() => import('src/pages/dashboard/active-routes/circles/detail'));
const EventsListPage = lazy(() => import('src/pages/dashboard/active-routes/events'));
const EventDetailPage = lazy(() => import('src/pages/dashboard/active-routes/events/detail'));
const BadgesListPage = lazy(() => import('src/pages/dashboard/active-routes/badges'));
const DisputesListPage = lazy(() => import('src/pages/dashboard/active-routes/disputes'));
const DisputesDetailsPage = lazy(() => import('src/pages/dashboard/active-routes/disputes-detail'));
const NotificationPage = lazy(() => import('src/pages/dashboard/active-routes/notifications'));

const TermsPage = lazy(() => import('src/pages/dashboard/active-routes/terms'));
const AboutPage = lazy(() => import('src/pages/dashboard/active-routes/about'));
const PrivacyPage = lazy(() => import('src/pages/dashboard/active-routes/policy'));

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
      { path: 'circles', element: <CirclesListPage /> },
      { path: 'circles/:id', element: <CircleDetailPage /> },
      { path: 'events', element: <EventsListPage /> },
      { path: 'events/:id', element: <EventDetailPage /> },
      { path: "categories", element: <CategoryListPage /> },
      { path: "categories/:id", element: <CategoryDetailPage /> },
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
