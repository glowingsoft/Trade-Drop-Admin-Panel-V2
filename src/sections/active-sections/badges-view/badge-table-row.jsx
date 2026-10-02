import Avatar from '@mui/material/Avatar';
import Stack from '@mui/material/Stack';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';

import { GenericTableRowActions } from 'src/components/generic-table/table-row-actions';
import { Label } from 'src/components/label';
import { getDisplayImage } from 'src/constants/upload';

const formatMetric = (metric) => (metric || '')
  .split('_')
  .filter(Boolean)
  .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
  .join(' ') || '—';

export function BadgeTableRow({ row, serialNumber, onEditRow, onDeleteRow }) {
  const status = row.status === 'inactive' || row.isActive === false ? 'inactive' : 'active';

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
        <Avatar alt={row.name} src={getDisplayImage(row.icon)} />
      </TableCell>
      <TableCell sx={{ whiteSpace: 'nowrap', textTransform: 'capitalize' }}>{row.name || '—'}</TableCell>
      <TableCell sx={{ whiteSpace: 'nowrap' }}>{row.slug || '—'}</TableCell>
      <TableCell sx={{ whiteSpace: 'nowrap' }}>{formatMetric(row.metric)}</TableCell>
      <TableCell sx={{ whiteSpace: 'nowrap' }}>{row.operator || '—'}</TableCell>
      <TableCell sx={{ whiteSpace: 'nowrap' }}>{row.threshold ?? '—'}</TableCell>
      <TableCell sx={{ whiteSpace: 'nowrap' }}>{row.sortOrder ?? '—'}</TableCell>
      <TableCell>
        <Label color={status === 'active' ? 'success' : 'default'}>
          {status === 'active' ? 'Active' : 'Inactive'}
        </Label>
      </TableCell>
      <TableCell>
        <Stack direction="row" alignItems="center" spacing={0.5}>
          <GenericTableRowActions actions={actions} />
        </Stack>
      </TableCell>
    </TableRow>
  );
}
