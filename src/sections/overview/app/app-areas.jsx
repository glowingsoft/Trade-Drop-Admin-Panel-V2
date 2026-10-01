import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import LinearProgress from '@mui/material/LinearProgress';
import { alpha, useTheme } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';

import { fNumber } from 'src/utils/format-number';
import { exportToCsv } from 'src/utils/export-to-csv';

import { Iconify } from 'src/components/iconify';
import { toast } from 'src/components/snackbar';
import { Scrollbar } from 'src/components/scrollbar';
import { TableHeadCustom } from 'src/components/table';

import { DashboardNoData } from './dashboard-no-data';

// ----------------------------------------------------------------------

const AREA_COLORS = ['primary', 'info', 'success', 'warning', 'error', 'secondary'];

export function AppAreas({ title, subheader, tableData, headLabel, onClick, ...other }) {
  const isEmpty = !tableData?.length;

  const handleExport = () => {
    exportToCsv({
      filename: (title || 'areas').toLowerCase().replace(/\s+/g, '-'),
      headers: headLabel.map((column) => ({ key: column.id, label: column.label })),
      rows: tableData,
    });
    toast.success('Areas exported');
  };

  return (
    <Card {...other}>
      <CardHeader
        title={title}
        subheader={subheader}
        action={
          !isEmpty && (
            <Button
              size="small"
              color="inherit"
              variant="outlined"
              onClick={handleExport}
              startIcon={<Iconify icon="solar:export-bold" width={16} />}
            >
              Export
            </Button>
          )
        }
        sx={{ mb: 1 }}
      />

      {isEmpty ? (
        <DashboardNoData />
      ) : (
        <Scrollbar sx={{ minHeight: 360 }}>
          <Table>
            <TableHeadCustom headLabel={headLabel} />

            <TableBody>
              {tableData.map((row, index) => (
                <RowItem key={row.area} row={row} index={index} />
              ))}
            </TableBody>
          </Table>
        </Scrollbar>
      )}

      <Box sx={{ p: 2, textAlign: 'right' }}>
        <Button
          size="small"
          color="inherit"
          onClick={onClick}
          endIcon={<Iconify icon="eva:arrow-ios-forward-fill" width={18} sx={{ ml: -0.5 }} />}
        >
          View all
        </Button>
      </Box>
    </Card>
  );
}

function RowItem({ row, index }) {
  const theme = useTheme();
  const color = AREA_COLORS[index % AREA_COLORS.length];
  const sharePercent = parseInt(row.share, 10) || 0;

  return (
    <TableRow>
      <TableCell>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Box
            sx={{
              width: 32,
              height: 32,
              flexShrink: 0,
              borderRadius: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: `${color}.main`,
              bgcolor: alpha(theme.palette[color].main, 0.12),
            }}
          >
            <Iconify icon="solar:map-point-bold" width={18} />
          </Box>

          <Typography variant="body2" sx={{ fontWeight: 600 }}>
            {row.area}
          </Typography>
        </Box>
      </TableCell>

      <TableCell align="center">{fNumber(row.activeUsers)}</TableCell>

      <TableCell align="center">
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, justifyContent: 'center' }}>
          <LinearProgress
            variant="determinate"
            value={Math.min(sharePercent, 100)}
            color={color}
            sx={{ width: 64, height: 6, borderRadius: 1 }}
          />

          <Typography variant="caption" sx={{ color: 'text.secondary', minWidth: 32 }}>
            {row.share}
          </Typography>
        </Box>
      </TableCell>
    </TableRow>
  );
}
