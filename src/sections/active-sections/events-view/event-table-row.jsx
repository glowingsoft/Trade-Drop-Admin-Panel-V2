import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';

import { Label } from 'src/components/label';

import { getEventStatusOption, getEventVisibilityOption } from './event-status';

export function EventTableRow({ row, serialNumber }) {
  const statusOption = getEventStatusOption(row.status);
  const visibilityOption = getEventVisibilityOption(row.visibility);

  return (
    <TableRow hover tabIndex={-1}>
      <TableCell>{serialNumber}</TableCell>

      <TableCell>
        <Typography variant="subtitle2">{row.name}</Typography>
      </TableCell>

      <TableCell sx={{ whiteSpace: 'nowrap' }}>{row.host}</TableCell>

      <TableCell sx={{ whiteSpace: 'nowrap' }}>{row.date}</TableCell>

      <TableCell sx={{ whiteSpace: 'nowrap' }}>{row.location}</TableCell>

      <TableCell align="center">{row.attendees}</TableCell>

      <TableCell sx={{ whiteSpace: 'nowrap' }}>{visibilityOption?.label || row.visibility}</TableCell>

      <TableCell align="center">
        <Label variant="soft" color={statusOption?.color || 'default'}>
          {statusOption?.label || row.status}
        </Label>
      </TableCell>
    </TableRow>
  );
}
