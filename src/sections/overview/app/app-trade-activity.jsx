import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';
import { useTheme } from '@mui/material/styles';
import CardHeader from '@mui/material/CardHeader';
import Typography from '@mui/material/Typography';

import { fNumber, fPercent } from 'src/utils/format-number';

import { Iconify } from 'src/components/iconify';
import { Chart, useChart } from 'src/components/chart';

import { DashboardNoData } from './dashboard-no-data';

// ----------------------------------------------------------------------

export function AppTradeActivity({ title, chart, mostTraded, sx, ...other }) {
  const theme = useTheme();

  const chartColors = chart.colors ?? [
    theme.palette.primary.main,
    theme.palette.info.main,
    '#B7665F',
    theme.palette.grey[500],
  ];

  const chartSeries = chart.series.map((item) => item.value);
  const total = chart.series.reduce((sum, item) => sum + item.value, 0);
  const hasData = chart.series.some((item) => item.value > 0);

  const chartOptions = useChart({
    chart: { sparkline: { enabled: true } },
    colors: chartColors,
    labels: chart.series.map((item) => item.label),
    stroke: { width: 0 },
    tooltip: {
      y: {
        formatter: (value) => fNumber(value),
        title: { formatter: (seriesName) => `${seriesName}` },
      },
    },
    plotOptions: {
      pie: {
        donut: {
          size: '74%',
          labels: {
            value: { formatter: (value) => fNumber(value) },
            total: { label: 'Trades', formatter: () => fNumber(total) },
          },
        },
      },
    },
  });

  return (
    <Card sx={{ height: 1, display: 'flex', flexDirection: 'column', ...sx }} {...other}>
      <CardHeader title={title} />

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
        {chart.series.map((item, index) => (
          <Stack key={item.label} spacing={0.5}>
            <Stack direction="row" alignItems="center" spacing={0.75}>
              <Box
                sx={{
                  width: 8,
                  height: 8,
                  flexShrink: 0,
                  borderRadius: '50%',
                  bgcolor: chartColors[index],
                }}
              />

              <Typography variant="h5">
                {fPercent(total ? (item.value / total) * 100 : 0, { maximumFractionDigits: 0 })}
              </Typography>
            </Stack>

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

      <Box
        sx={{
          flexGrow: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: 300,
        }}
      >
        {hasData ? (
          <Chart type="donut" series={chartSeries} options={chartOptions} width={240} height={240} />
        ) : (
          <DashboardNoData sx={{ minHeight: 240, py: 4 }} />
        )}
      </Box>

      {!!mostTraded && (
        <>
          <Divider sx={{ borderStyle: 'dashed', mx: 3 }} />

          <Stack direction="row" alignItems="center" spacing={1} sx={{ p: 3 }}>
            <Iconify icon="solar:cup-star-bold" width={18} sx={{ color: 'warning.main', flexShrink: 0 }} />

            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              Most traded:{' '}
              <Box component="span" sx={{ color: 'text.primary', fontWeight: 600 }}>
                {mostTraded}
              </Box>
            </Typography>
          </Stack>
        </>
      )}
    </Card>
  );
}
