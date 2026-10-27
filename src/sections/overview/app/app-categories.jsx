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


const CATEGORY_STYLES = {
  photography: { icon: 'solar:camera-bold', color: 'info' },
  music: { icon: 'solar:music-note-bold', color: 'secondary' },
  art: { icon: 'solar:palette-bold', color: 'warning' },
  video: { icon: 'solar:videocamera-record-bold', color: 'error' },
  design: { icon: 'solar:pen-bold', color: 'primary' },
  writing: { icon: 'solar:pen-new-square-bold', color: 'success' },
};

const FALLBACK_COLORS = ['primary', 'info', 'success', 'warning', 'error', 'secondary'];

function getCategoryStyle(name, index) {
  return (
    CATEGORY_STYLES[name?.toLowerCase()] || {
      icon: 'solar:tag-bold',
      color: FALLBACK_COLORS[index % FALLBACK_COLORS.length],
    }
  );
}

export function AppCategories({ title, subheader, tableData, headLabel, onClick, ...other }) {
  const isEmpty = !tableData?.length;

  const handleExport = () => {
    exportToCsv({
      filename: (title || 'categories').toLowerCase().replace(/\s+/g, '-'),
      headers: headLabel.map((column) => ({ key: column.id, label: column.label })),
      rows: tableData,
    });
    toast.success('Categories exported');
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
        sx={{
          mb: 1,
          alignItems: { xs: 'flex-start', sm: 'center' },
          flexDirection: { xs: 'column', sm: 'row' },
          '& .MuiCardHeader-action': { m: 0, alignSelf: { xs: 'flex-start', sm: 'center' } },
        }}
      />

      {isEmpty ? (
        <DashboardNoData />
      ) : (
        <Scrollbar sx={{ minHeight: 360 }}>
          <Table>
            <TableHeadCustom headLabel={headLabel} />

            <TableBody>
              {tableData.map((row, index) => (
                <RowItem key={row.category} row={row} index={index} />
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
  const style = getCategoryStyle(row.category, index);
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
              color: `${style.color}.main`,
              bgcolor: alpha(theme.palette[style.color].main, 0.12),
            }}
          >
            <Iconify icon={style.icon} width={18} />
          </Box>

          <Typography variant="body2" sx={{ fontWeight: 600 }}>
            {row.category}
          </Typography>
        </Box>
      </TableCell>

      <TableCell align="center">{fNumber(row.activeDrops)}</TableCell>

      <TableCell align="center">
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, justifyContent: 'center' }}>
          <LinearProgress
            variant="determinate"
            value={Math.min(sharePercent, 100)}
            color={style.color}
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
