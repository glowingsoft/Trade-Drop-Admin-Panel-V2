import { EmptyContent } from 'src/components/empty-content';

export function DashboardNoData({ sx, ...other }) {
  return (
    <EmptyContent
      filled
      title="No data available"
      sx={{ py: 8, minHeight: 280, ...sx }}
      {...other}
    />
  );
}
