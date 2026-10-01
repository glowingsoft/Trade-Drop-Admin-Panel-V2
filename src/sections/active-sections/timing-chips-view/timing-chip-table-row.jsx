import Stack from '@mui/material/Stack';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';

import { Label } from 'src/components/label';
import { GenericTableRowActions } from 'src/components/generic-table/table-row-actions';

export function TimingChipTableRow({ row, serialNumber, onEditRow, onDeleteRow }) {
  const status = row.status === 'inactive' ? 'inactive' : 'active';

  const actions = [
    {
      key: 'edit',
      icon: 'solar:pen-bold',
      tooltip: 'Edit Timing Chip',
      onClick: onEditRow,
    },
    {
      key: 'delete',
      icon: 'solar:trash-bin-trash-bold',
      tooltip: 'Delete Timing Chip',
      color: 'error',
      onClick: onDeleteRow,
    },
  ];

  return (
    <TableRow hover tabIndex={-1}>
      <TableCell sx={{ whiteSpace: 'nowrap' }}>{serialNumber}</TableCell>
      <TableCell sx={{ whiteSpace: 'nowrap' }}>{row?.label || 'N/A'}</TableCell>
      <TableCell sx={{ whiteSpace: 'nowrap' }}>{row?.value || 'N/A'}</TableCell>
      <TableCell sx={{ whiteSpace: 'nowrap' }}>{row?.sortOrder ?? 'N/A'}</TableCell>
      <TableCell>
        <Label
          color={
            (status === 'active' && 'success') || (status === 'inactive' && 'error') || 'default'
          }
        >
          {status}
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
