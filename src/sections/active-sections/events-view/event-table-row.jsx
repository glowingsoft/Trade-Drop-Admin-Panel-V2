import Avatar from '@mui/material/Avatar';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';

import { useNavigate } from 'react-router-dom';

import { GenericTableRowActions } from 'src/components/generic-table/table-row-actions';
import { Label } from 'src/components/label';
import { getDisplayImage } from 'src/constants/upload';
import { paths } from 'src/routes/paths';

import {
  getEventAudienceOption,
  getEventJoiningOption,
  getEventStatusOption,
} from './event-status';

function CellText({ value, maxWidth, variant = 'body2' }) {
  const text = value || '—';
  const showTip = Boolean(value) && value !== '—' && value !== 'null';

  const content = (
    <Typography
      variant={variant}
      noWrap
      sx={{
        maxWidth: maxWidth || 220,
        display: 'block',
        color: variant === 'caption' ? 'text.secondary' : 'inherit',
      }}
    >
      {text}
    </Typography>
  );

  if (!showTip) return content;

  return (
    <Tooltip title={text} arrow placement="top">
      {content}
    </Tooltip>
  );
}

export function EventTableRow({ row, serialNumber }) {
  const navigate = useNavigate();
  const detailsPath = paths.adminDashboard.eventDetails(row.id);
  const statusOption = getEventStatusOption(row.status);
  const audienceOption = getEventAudienceOption(row.audience);
  const joiningOption = getEventJoiningOption(row.joining);

  const openDetails = (event) => {
    event?.stopPropagation?.();
    navigate(detailsPath, { state: { eventPreview: row } });
  };

  const actions = [
    {
      key: 'view',
      icon: 'solar:eye-bold',
      tooltip: 'View',
      onClick: openDetails,
    },
    {
      key: 'edit',
      icon: 'solar:pen-bold',
      tooltip: 'Edit',
      onClick: openDetails,
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
    <TableRow hover tabIndex={-1} onClick={openDetails} sx={{ cursor: 'pointer' }}>
      <TableCell align="center">{serialNumber}</TableCell>

      <TableCell>
        <Stack spacing={1.5} direction="row" alignItems="center">
          <Avatar alt={row.name} src={getDisplayImage(row.image)} sx={{ width: 32, height: 32, fontSize: 16 }}>
            {row.name?.charAt(0)}
          </Avatar>
          {row.name ? (
            <Tooltip title={row.name} arrow placement="top">
              <Link
                color="inherit"
                underline="hover"
                sx={{ cursor: 'default', maxWidth: 200, display: 'block' }}
                noWrap
              >
                {row.name}
              </Link>
            </Tooltip>
          ) : (
            <Link color="inherit" underline="hover" sx={{ cursor: 'default' }} noWrap>
              —
            </Link>
          )}
        </Stack>
      </TableCell>

      <TableCell>
        <CellText value={row.purpose} maxWidth={260} />
      </TableCell>

      <TableCell>
        <CellText value={row.circleName || row.host} maxWidth={180} />
      </TableCell>

      <TableCell>
        <Stack spacing={0.25} sx={{ minWidth: 0 }}>
          <CellText value={row.organizer} maxWidth={150} />
          {row.organizerHandle ? (
            <CellText value={`@${row.organizerHandle}`} maxWidth={150} variant="caption" />
          ) : null}
        </Stack>
      </TableCell>

      <TableCell sx={{ whiteSpace: 'nowrap' }}>{row.date || '—'}</TableCell>

      <TableCell>
        <CellText value={row.time} maxWidth={150} />
      </TableCell>

      <TableCell>
        <CellText value={row.publicArea} maxWidth={170} />
      </TableCell>

      <TableCell>
        <CellText value={row.exactMeetingPoint} maxWidth={220} />
      </TableCell>

      <TableCell sx={{ whiteSpace: 'nowrap' }}>{row.locationType || '—'}</TableCell>

      <TableCell sx={{ whiteSpace: 'nowrap' }}>
        {audienceOption?.label || row.audienceLabel || row.audience || '—'}
      </TableCell>

      <TableCell sx={{ whiteSpace: 'nowrap' }}>
        {joiningOption?.label || row.joiningLabel || row.joining || '—'}
      </TableCell>

      <TableCell align="center" sx={{ whiteSpace: 'nowrap' }}>
        {row.rsvpCount ?? 0}
      </TableCell>

      <TableCell align="center" sx={{ whiteSpace: 'nowrap' }}>
        {row.capacity ?? 0}
      </TableCell>

      <TableCell sx={{ whiteSpace: 'nowrap' }}>
        <Label variant="soft" color={statusOption?.color || 'default'}>
          {statusOption?.label || row.statusLabel || row.status}
        </Label>
      </TableCell>

      <TableCell sx={{ whiteSpace: 'nowrap' }}>{row.createdAt || '—'}</TableCell>

      <TableCell sx={{ whiteSpace: 'nowrap' }}>{row.updatedAt || '—'}</TableCell>

      <TableCell align="right" onClick={(event) => event.stopPropagation()}>
        <GenericTableRowActions actions={actions} />
      </TableCell>
    </TableRow>
  );
}
