import Stack from '@mui/material/Stack';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import { Avatar } from '@mui/material';

import { Label } from 'src/components/label';
import { GenericTableRowActions } from 'src/components/generic-table/table-row-actions';
import { getDisplayImage } from 'src/constants/upload';

export function CategoryTableRow({ row, serialNumber, onEditRow }) {
  const status = row.active === false ? 'inactive' : 'active';

  const actions = [
    {
      key: 'edit',
      icon: 'solar:pen-bold',
      tooltip: 'Edit Category',
      onClick: onEditRow,
    },
  ];

  return (
    <TableRow hover tabIndex={-1}>
      <TableCell sx={{ whiteSpace: 'nowrap' }}>{serialNumber}</TableCell>

      <TableCell>
        <Avatar alt={row?.name} src={getDisplayImage(row?.image)} />
      </TableCell>

      <TableCell sx={{ whiteSpace: 'nowrap' }}>{row?.name || 'N/A'}</TableCell>

      <TableCell sx={{ whiteSpace: 'nowrap' }}>{row?.slug || 'N/A'}</TableCell>

      <TableCell sx={{ whiteSpace: 'nowrap' }}>{row?.chipGroup || 'N/A'}</TableCell>

      <TableCell sx={{ whiteSpace: 'nowrap' }}>{row?.sortOrder ?? 'N/A'}</TableCell>

      <TableCell>
        <Label color={(status === 'active' && 'success') || (status === 'inactive' && 'error') || 'default'}>
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
