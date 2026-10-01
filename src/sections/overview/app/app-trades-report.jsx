import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import CardHeader from '@mui/material/CardHeader';
import Typography from '@mui/material/Typography';
import { useTheme } from '@mui/material/styles';

import { fNumber, fPercent } from 'src/utils/format-number';

import { Chart, useChart, ChartLegends } from 'src/components/chart';

import { DashboardNoData } from './dashboard-no-data';

// ----------------------------------------------------------------------

const STATS = [
  { key: 'tapsIn', label: 'Taps in' },
  { key: 'tradesStarted', label: 'Trades started' },
  { key: 'completed', label: 'Completed' },
  { key: 'completionRate', label: 'Completion rate', isPercent: true },
];

export function AppTradesReport({
  title,
  subheader,
  stats = {},
  chart = { categories: [], completed: [], newDrops: [] },
  sx,
  ...other
}) {
  const theme = useTheme();

  const categories = chart.categories || [];
  const completed = chart.completed || [];
  const newDrops = chart.newDrops || [];

  const chartColors = [theme.palette.primary.main, theme.palette.grey[700]];

  const chartOptions = useChart({
    colors: chartColors,
    stroke: { width: [3, 2], curve: 'smooth', dashArray: [0, 6] },
    fill: { type: 'solid', opacity: [0.32, 0] },
    xaxis: { categories },
    yaxis: { labels: { formatter: (value) => fNumber(value) } },
    tooltip: { y: { formatter: (value) => fNumber(value) } },
  });

  const chartSeries = [
    { name: 'Completed trades', data: completed },
    { name: 'New drops', data: newDrops },
  ];

  const hasChartData = categories.length > 0;

  return (
    <Card sx={{ height: 1, display: 'flex', flexDirection: 'column', ...sx }} {...other}>
      <CardHeader title={title} subheader={subheader} />

      <Box
        sx={{
          mx: 3,
          mt: 3,
          p: 2.5,
          rowGap: 2,
          columnGap: 3,
          display: 'grid',
          borderRadius: 2,
          bgcolor: 'background.neutral',
          gridTemplateColumns: { xs: 'repeat(2, 1fr)', sm: 'repeat(4, 1fr)' },
        }}
      >
        {STATS.map((item) => (
          <Stack key={item.key} spacing={0.5}>
            <Typography variant="h5">
              {item.isPercent ? fPercent(stats[item.key] || 0) : fNumber(stats[item.key] || 0)}
            </Typography>

            <Typography
              variant="caption"
              sx={{
                fontWeight: 600,
                letterSpacing: 0.4,
                color: 'text.secondary',
                textTransform: 'uppercase',
              }}
            >
              {item.label}
            </Typography>
          </Stack>
        ))}
      </Box>

      {hasChartData ? (
        <>
          <Chart
            type="area"
            series={chartSeries}
            options={chartOptions}
            height={300}
            sx={{ flexGrow: 1, py: 2.5, pl: 1, pr: 2.5 }}
          />

          <ChartLegends
            labels={['Completed trades', 'New drops']}
            colors={chartColors}
            sx={{ px: 3, pb: 3 }}
          />
        </>
      ) : (
        <DashboardNoData />
      )}
    </Card>
  );
}
