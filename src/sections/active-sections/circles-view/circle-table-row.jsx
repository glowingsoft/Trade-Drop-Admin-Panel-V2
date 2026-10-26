import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';

import { Label } from 'src/components/label';

import { getCircleStatusOption, getCircleVisibilityOption } from './circle-status';

export function CircleTableRow({ row, serialNumber }) {
  const statusOption = getCircleStatusOption(row.status);
  const visibilityOption = getCircleVisibilityOption(row.visibility);

  return (
    <TableRow hover tabIndex={-1}>
      <TableCell>{serialNumber}</TableCell>

      <TableCell>
        <Typography variant="subtitle2">{row.name}</Typography>
      </TableCell>

      <TableCell sx={{ whiteSpace: 'nowrap' }}>{row.category}</TableCell>

      <TableCell sx={{ whiteSpace: 'nowrap' }}>{visibilityOption?.label || row.visibility}</TableCell>

      <TableCell sx={{ whiteSpace: 'nowrap' }}>{row.location}</TableCell>

      <TableCell align="center">{row.members.toLocaleString()}</TableCell>

      <TableCell align="center">
        <Label variant="soft" color={statusOption?.color || 'default'}>
          {statusOption?.label || row.status}
        </Label>
      </TableCell>
    </TableRow>
  );
}
