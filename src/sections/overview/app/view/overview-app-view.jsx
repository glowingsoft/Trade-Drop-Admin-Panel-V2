import { useEffect, useState } from 'react';

import Grid from '@mui/material/Grid';

import { DashboardContent } from 'src/layouts/dashboard';
import { CONFIG } from 'src/config-global';
import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';
import { handleApiError } from 'src/utils/errorHandler';

import { CourseWidgetSummary } from '../../course/course-widget-summary';
import { AnalyticsWebsiteVisits } from '../../analytics/analytics-website-visits';
import { AppCategories } from '../app-categories';
import { AppTradesReport } from '../app-trades-report';
import { AppTradeActivity } from '../app-trade-activity';
import { AppHeaderWelcome } from '../app-header-welcome';
import { AppAreas } from '../app-areas';
import AppLastActivities from '../app-last-activities';
import { mapDashboardData } from '../map-dashboard-data';
import { useGetDashboardStatsQuery } from 'src/store/Reducer/dashboard-api';

export function OverviewAppView() {
  const router = useRouter();
  const [range, setRange] = useState('last_7_days');

  const { data, error, isFetching, refetch } = useGetDashboardStatsQuery({ range });
  const dashboard = mapDashboardData(data);

  useEffect(() => {
    if (error) handleApiError(error);
  }, [error]);

  return (
    <DashboardContent maxWidth={false}>
      <AppHeaderWelcome
        range={range}
        onRangeChange={setRange}
        onRefresh={refetch}
        refreshing={isFetching}
      />

      <Grid container spacing={2} sx={{ width: '100%', minWidth: 0 }}>
        <Grid item xs={12} md={3}>
          <CourseWidgetSummary
            title="Users"
            total={dashboard.cards.users}
            color="primary"
            icon={`${CONFIG.site.basePath}/assets/icons/navbar/ic-users.svg`}
            onClick={() => router.push(paths.adminDashboard.users.root)}
            sx={{ cursor: 'pointer' }}
          />
        </Grid>

        <Grid item xs={12} md={3}>
          <CourseWidgetSummary
            title="Active Users"
            total={dashboard.cards.activeUsers}
            color="success"
            icon={`${CONFIG.site.basePath}/assets/icons/navbar/ic-users.svg`}
            onClick={() => router.push(paths.adminDashboard.users.root)}
            sx={{ cursor: 'pointer' }}
          />
        </Grid>

        <Grid item xs={12} md={3}>
          <CourseWidgetSummary
            title="Taps In Sent"
            total={dashboard.cards.tapInsSent}
            color="primary"
            icon={`${CONFIG.site.basePath}/assets/icons/navbar/ic-tab.svg`}
            onClick={() => router.push(paths.adminDashboard.drops)}
            sx={{ cursor: 'pointer' }}
          />
        </Grid>

        <Grid item xs={12} md={3}>
          <CourseWidgetSummary
            title="Drops Posted"
            total={dashboard.cards.dropsPosted}
            color="primary"
            icon={`${CONFIG.site.basePath}/assets/icons/navbar/ic-request.svg`}
            onClick={() => router.push(paths.adminDashboard.drops)}
            sx={{ cursor: 'pointer' }}
          />
        </Grid>

        <Grid item xs={12} md={3}>
          <CourseWidgetSummary
            title="Drops Live"
            total={dashboard.cards.dropsLive}
            color="success"
            icon={`${CONFIG.site.basePath}/assets/icons/navbar/ic-request.svg`}
            onClick={() => router.push(paths.adminDashboard.drops)}
            sx={{ cursor: 'pointer' }}
          />
        </Grid>

        <Grid item xs={12} md={3}>
          <CourseWidgetSummary
            title="Drops Completed"
            total={dashboard.cards.dropsCompleted}
            color="success"
            icon={`${CONFIG.site.basePath}/assets/icons/navbar/ic-request.svg`}
            onClick={() => router.push(paths.adminDashboard.drops)}
            sx={{ cursor: 'pointer' }}
          />
        </Grid>

        <Grid item xs={12} md={3}>
          <CourseWidgetSummary
            title="Drops Paused"
            total={dashboard.cards.dropsPaused}
            color="secondary"
            icon={`${CONFIG.site.basePath}/assets/icons/navbar/ic-request.svg`}
            onClick={() => router.push(paths.adminDashboard.drops)}
            sx={{ cursor: 'pointer' }}
          />
        </Grid>

        <Grid item xs={12} md={3}>
          <CourseWidgetSummary
            title="Drops hidden"
            total={dashboard.cards.dropsHidden}
            color="error"
            icon={`${CONFIG.site.basePath}/assets/icons/navbar/ic-request.svg`}
            onClick={() => router.push(paths.adminDashboard.drops)}
            sx={{ cursor: 'pointer' }}
          />
        </Grid>

        <Grid item xs={12} md={6} lg={6}>
          <AppTradesReport
            title="Trades Report"
            stats={dashboard.tradesReport.stats}
            chart={dashboard.tradesReport.chart}
          />
        </Grid>

        <Grid item xs={12} md={6} lg={6}>
          <AppTradeActivity
            title="Trade Activity"
            mostTraded={dashboard.tradeActivity.mostTraded}
            chart={{ series: dashboard.tradeActivity.series }}
          />
        </Grid>

        <Grid item xs={12} md={12} lg={12}>
          <AnalyticsWebsiteVisits
            title="User Trends"
            chart={dashboard.userTrends}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <AppCategories
            title="Top Categories"
            tableData={dashboard.categories}
            onClick={() => router.push(paths.adminDashboard.categories)}
            headLabel={[
              { id: 'category', label: 'Category' },
              { id: 'activeDrops', label: 'Drops', align: 'center' },
              { id: 'share', label: 'Share', align: 'center' },
            ]}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <AppAreas
            title="Trades by Area"
            tableData={dashboard.areas}
            headLabel={[
              { id: 'area', label: 'Area' },
              { id: 'activeUsers', label: 'Active Users', align: 'center' },
              { id: 'share', label: 'Share', align: 'center' },
            ]}
          />
        </Grid>

        <Grid item xs={12} md={12}>
          <AppLastActivities title="Recent Activity" list={dashboard.activities} />
        </Grid>
      </Grid>
    </DashboardContent>
  );
}
