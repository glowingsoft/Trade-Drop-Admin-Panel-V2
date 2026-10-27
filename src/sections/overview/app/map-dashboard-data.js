import { fToNow } from 'src/utils/format-time';

export const DASHBOARD_RANGE_OPTIONS = [
  { label: 'All Time', value: 'all_time' },
  { label: 'Last 7 days', value: 'last_7_days' },
  { label: 'Last 30 days', value: 'last_30_days' },
  { label: 'Last 90 days', value: 'last_90_days' },
];

const EMPTY_CARDS = {
  users: 0,
  activeUsers: 0,
  tapInsSent: 0,
  dropsPosted: 0,
  dropsLive: 0,
  dropsCompleted: 0,
  dropsPaused: 0,
  dropsHidden: 0,
};

function formatShare(share) {
  if (share == null || share === '') return '0%';
  if (typeof share === 'number') return `${share}%`;
  return String(share).includes('%') ? String(share) : `${share}%`;
}

function mapCategories(items = []) {
  return items.map((item) => ({
    category: item.category || item.name || item.title || '',
    activeDrops: item.activeDrops ?? item.drops ?? item.dropCount ?? item.count ?? 0,
    share: formatShare(item.share ?? item.sharePercent),
  }));
}

function mapAreas(items = []) {
  return items.map((item) => ({
    area: item.area || item.name || item.areaLabel || item.title || '',
    activeUsers: item.activeUsers ?? item.users ?? item.count ?? 0,
    share: formatShare(item.share ?? item.sharePercent),
  }));
}

function mapActivity(items = []) {
  return items.map((item) => {
    const time = fToNow(item.createdAt);
    const timeLabel = time ? `${time} ago` : '';
    const name = item.user?.name;
    const area = item.user?.areaLabel;

    let description = timeLabel;
    if (name && area) description = `${name} from ${area} · ${timeLabel}`;
    else if (name) description = `${name} · ${timeLabel}`;

    return {
      title: item.action || item.type || '',
      description,
    };
  });
}

export function mapDashboardData(data) {
  const cards = { ...EMPTY_CARDS, ...(data?.cards || {}) };
  const tradeReport = data?.tradeReport || {};
  const tradeActivity = data?.tradeActivity || {};
  const dropsChart = data?.charts?.drops || [];
  const usersChart = data?.charts?.users || [];

  return {
    cards,
    tradesReport: {
      stats: {
        tapsIn: tradeReport.tapIns ?? 0,
        tradesStarted: tradeReport.tradesStarted ?? 0,
        completed: tradeReport.completed ?? 0,
        completionRate: tradeReport.completionRate ?? 0,
      },
      chart: {
        categories: dropsChart.map((item) => item.label),
        completed: dropsChart.map((item) => item.completedDrops ?? 0),
        newDrops: dropsChart.map((item) => item.newDrops ?? 0),
      },
    },
    tradeActivity: {
      mostTraded: tradeActivity.mostTraded || '',
      series: [
        { label: 'Completed', value: tradeActivity.completed?.count ?? 0 },
        { label: 'In progress', value: tradeActivity.inProgress?.count ?? 0 },
        { label: 'Declined', value: tradeActivity.declined?.count ?? 0 },
        { label: 'Awaiting confirm', value: tradeActivity.awaitingConfirmation?.count ?? 0 },
      ],
    },
    userTrends: {
      categories: usersChart.map((item) => item.label),
      series: [
        { name: 'Active', data: usersChart.map((item) => item.activeUsers ?? 0) },
        { name: 'Deactivated', data: usersChart.map((item) => item.deactivatedUsers ?? 0) },
      ],
    },
    categories: mapCategories(data?.topCategories),
    areas: mapAreas(data?.topAreas),
    activities: mapActivity(data?.recentActivity),
  };
}
