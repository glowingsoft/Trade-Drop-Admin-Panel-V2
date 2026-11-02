import Avatar from '@mui/material/Avatar';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';

import { GenericTableRowActions } from 'src/components/generic-table/table-row-actions';
import { Label } from 'src/components/label';
import { getDisplayImage } from 'src/constants/upload';
import { useRouter } from 'src/routes/hooks';
import { paths } from 'src/routes/paths';

import { getCircleJoiningOption, getCircleStatusOption } from './circle-status';

export function CircleTableRow({ row, serialNumber }) {
  const router = useRouter();
  const detailsPath = paths.adminDashboard.circleDetails(row.id);
  const statusOption = getCircleStatusOption(row.status);
  const joiningOption = getCircleJoiningOption(row.joining);

  const actions = [
    {
      key: 'view',
      icon: 'solar:eye-bold',
      tooltip: 'View',
      onClick: (event) => {
        event.stopPropagation();
        router.push(detailsPath);
      },
    },
    {
      key: 'edit',
      icon: 'solar:pen-bold',
      tooltip: 'Edit',
      onClick: (event) => {
        event.stopPropagation();
        router.push(detailsPath);
      },
    },
    {
      key: 'more',
      icon: 'eva:more-horizontal-fill',
      tooltip: 'More',
      onClick: (event) => {
        event.stopPropagation();
      },
    },
  ];

  return (
    <TableRow hover tabIndex={-1} onClick={() => router.push(detailsPath)} sx={{ cursor: 'pointer' }}>
      <TableCell align="center">{serialNumber}</TableCell>

      <TableCell>
        <Stack spacing={2} direction="row" alignItems="center">
          <Avatar alt={row.name} src={getDisplayImage(row.image)} sx={{ width: 32, height: 32, fontSize: 16 }}>
            {row.name?.charAt(0)}
          </Avatar>

          <Stack sx={{ typography: 'body2', flex: '1 1 auto', alignItems: 'flex-start', minWidth: 0 }}>
            <Link color="inherit" underline="hover" sx={{ cursor: 'default' }} noWrap>
              {row.name || '—'}
            </Link>
            <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: '13px' }}>
              {row.code || '—'}
            </Typography>
          </Stack>
        </Stack>
      </TableCell>

      <TableCell sx={{ whiteSpace: 'nowrap' }}>{row.category}</TableCell>

      <TableCell sx={{ whiteSpace: 'nowrap' }}>{row.location}</TableCell>

      <TableCell sx={{ whiteSpace: 'nowrap' }}>
        <Label variant="soft" color={joiningOption?.color || 'default'}>
          {joiningOption?.label || row.joining}
        </Label>
      </TableCell>

      <TableCell align="center">{row.members?.toLocaleString()}</TableCell>

      <TableCell sx={{ whiteSpace: 'nowrap' }}>{row.organizer || '—'}</TableCell>

      <TableCell align="center">{row.events ?? 0}</TableCell>

      <TableCell align="center">
        {row.reports > 0 ? (
          <Label variant="soft" color="error" sx={{ minWidth: 28 }}>
            {row.reports}
          </Label>
        ) : (
          0
        )}
      </TableCell>

      <TableCell sx={{ whiteSpace: 'nowrap' }}>{row.createdAt || '—'}</TableCell>

      <TableCell sx={{ whiteSpace: 'nowrap' }}>
        <Label variant="soft" color={statusOption?.color || 'default'}>
          {statusOption?.label || row.status}
        </Label>
      </TableCell>

      <TableCell align="right" onClick={(event) => event.stopPropagation()}>
        <GenericTableRowActions actions={actions} />
      </TableCell>
    </TableRow>
  );
}
