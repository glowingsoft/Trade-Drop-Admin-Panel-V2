import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';

import { GenericTableRowActions } from 'src/components/generic-table/table-row-actions';
import { Label } from 'src/components/label';

import { getDisputePriorityOption, getDisputeStatusOption } from './dispute-status';

export function DisputeTableRow({ row, serialNumber, onViewRow }) {
  const statusOption = getDisputeStatusOption(row.status);
  const priorityOption = getDisputePriorityOption(row.priority);

  const actions = [
    {
      key: 'view',
      icon: 'solar:eye-bold',
      tooltip: 'View dispute',
      onClick: (event) => {
        event.stopPropagation();
        onViewRow();
      },
    },
  ];

  return (
    <TableRow hover tabIndex={-1} sx={{ cursor: 'pointer' }} onClick={onViewRow}>
      <TableCell>{serialNumber}</TableCell>
      <TableCell sx={{ whiteSpace: 'nowrap' }}>{row.id}</TableCell>
      <TableCell>{row.title}</TableCell>
      <TableCell sx={{ whiteSpace: 'nowrap' }}>
        {row.partyA.name} vs {row.partyB.name}
      </TableCell>
      <TableCell sx={{ whiteSpace: 'nowrap' }}>{row.tradeId}</TableCell>
      <TableCell align="center">
        <Label variant="soft" color={priorityOption?.color || 'default'}>
          {priorityOption?.label || row.priority}
        </Label>
      </TableCell>
      <TableCell align="center">
        <Label
          variant={row.status === 'resolved' ? 'filled' : 'soft'}
          color={statusOption?.color || 'default'}
        >
          {statusOption?.label || row.status}
        </Label>
      </TableCell>
      {/* <TableCell>
        {row.assignee === 'Unassigned' ? (
          <Typography variant="body2" color="text.secondary">
            Unassigned
          </Typography>
        ) : (
          <Stack direction="row" spacing={1} alignItems="center">
            <Avatar sx={{ width: 24, height: 24, typography: 'caption' }}>
              {row.assignee
                .split(' ')
                .map((part) => part[0])
                .join('')}
            </Avatar>
            <Typography variant="body2">{row.assignee}</Typography>
          </Stack>
        )}
      </TableCell>
      <TableCell align="center">
        {row.slaOverdue ? (
          <Label variant="filled" color="error">
            Overdue
          </Label>
        ) : (
          <Typography variant="body2">{row.slaLabel}</Typography>
        )}
      </TableCell> */}
      <TableCell sx={{ whiteSpace: 'nowrap' }}>{row.openedLabel}</TableCell>
      <TableCell align="center" onClick={(event) => event.stopPropagation()}>
        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
          <GenericTableRowActions actions={actions} />
        </Box>
      </TableCell>
    </TableRow>
  );
}
