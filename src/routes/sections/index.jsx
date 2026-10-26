import { lazy, Suspense } from 'react';
import { Navigate, useRoutes } from 'react-router-dom';

import { SplashScreen } from 'src/components/loading-screen';

import { adminDashboardRoutes } from './admin-dashboard';
import { authRoutes } from './auth';
import { authDemoRoutes } from './auth-demo';
import { componentsRoutes } from './components';
import { dashboardRoutes } from './dashboard';
import { mainRoutes } from './main';


const LandingPage = lazy(() => import('src/pages/landing'));

export function Router() {
  return useRoutes([
    {
      path: '/',
      element: (
        <Suspense fallback={<SplashScreen />}>
          <LandingPage />
        </Suspense>
      ),
    },

    // Auth
    ...authRoutes,
    ...authDemoRoutes,

    // Dashboard
    ...dashboardRoutes,

    // Admin Dashboard
    ...adminDashboardRoutes,

    // Main
    ...mainRoutes,

    // Components
    ...componentsRoutes,

    // No match
    { path: '*', element: <Navigate to="/404" replace /> },
  ]);
}
