import Stack from '@mui/material/Stack';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';

import { GenericTableRowActions } from 'src/components/generic-table/table-row-actions';
import { Label } from 'src/components/label';

const formatMetric = (metric) =>
  (metric || '')
    .split('_')
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ') || '—';

export function BadgeTableRow({ row, serialNumber, onEditRow, onDeleteRow }) {
  const isActive = row.isActive !== false;

  const actions = [
    {
      key: 'edit',
      icon: 'solar:pen-bold',
      tooltip: 'Edit Badge',
      onClick: onEditRow,
    },
    {
      key: 'delete',
      icon: 'solar:trash-bin-trash-bold',
      tooltip: 'Delete Badge',
      color: 'error',
      onClick: onDeleteRow,
    },
  ];

  return (
    <TableRow hover tabIndex={-1}>
      <TableCell sx={{ whiteSpace: 'nowrap' }}>{serialNumber}</TableCell>
      <TableCell>
        <Typography variant="h6" component="span">
          {row.icon || '—'}
        </Typography>
      </TableCell>
      <TableCell sx={{ whiteSpace: 'nowrap' }}>{row.name || '—'}</TableCell>
      <TableCell sx={{ whiteSpace: 'nowrap' }}>{row.slug || '—'}</TableCell>
      <TableCell sx={{ whiteSpace: 'nowrap' }}>{formatMetric(row.metric)}</TableCell>
      <TableCell sx={{ whiteSpace: 'nowrap' }}>{row.operator || '—'}</TableCell>
      <TableCell sx={{ whiteSpace: 'nowrap' }}>{row.threshold ?? '—'}</TableCell>
      <TableCell sx={{ whiteSpace: 'nowrap' }}>{row.sortOrder ?? '—'}</TableCell>
      <TableCell>
        <Label color={isActive ? 'success' : 'default'}>{isActive ? 'Active' : 'Inactive'}</Label>
      </TableCell>
      <TableCell>
        <Stack direction="row" alignItems="center" spacing={0.5}>
          <GenericTableRowActions actions={actions} />
        </Stack>
      </TableCell>
    </TableRow>
  );
}
