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

import { getCirclePrivacyOption } from './circle-status';

function CellText({ value, maxWidth }) {
  const text = value || '—';
  const showTip = Boolean(value) && value !== '—';

  const content = (
    <Typography
      variant="body2"
      noWrap
      sx={{
        maxWidth: maxWidth || 220,
        display: 'block',
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

export function CircleTableRow({ row, serialNumber }) {
  const navigate = useNavigate();
  const detailsPath = paths.adminDashboard.circleDetails(row.id);
  const privacyOption = getCirclePrivacyOption(row.privacy);

  const openDetails = (event) => {
    event?.stopPropagation?.();
    navigate(detailsPath, { state: { circlePreview: row } });
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
  ];

  return (
    <TableRow hover tabIndex={-1} onClick={openDetails} sx={{ cursor: 'pointer' }}>
      <TableCell align="center">{serialNumber}</TableCell>

      <TableCell>
        <Stack spacing={2} direction="row" alignItems="center">
          <Avatar alt={row.name} src={getDisplayImage(row.coverImage || row.image)} sx={{ width: 32, height: 32, fontSize: 16 }}>
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

      <TableCell sx={{ maxWidth: 280 }}>
        <CellText value={row.purpose} maxWidth={280} />
      </TableCell>

      <TableCell>
        <CellText value={row.category} maxWidth={160} />
      </TableCell>

      <TableCell>
        <CellText value={row.city} maxWidth={140} />
      </TableCell>

      <TableCell sx={{ whiteSpace: 'nowrap' }}>
        <Label variant="soft" color={privacyOption?.color || 'default'}>
          {privacyOption?.label || row.privacy || '—'}
        </Label>
      </TableCell>

      <TableCell>
        <Stack spacing={1.5} direction="row" alignItems="center">
          <Avatar
            alt={row.organizer}
            src={getDisplayImage(row.organizerImage)}
            sx={{ width: 28, height: 28, fontSize: 12 }}
          >
            {row.organizer?.charAt(0)}
          </Avatar>
          <Stack sx={{ minWidth: 0 }}>
            <CellText value={row.organizer} maxWidth={140} />
            {row.organizerHandle ? (
              <Tooltip title={`@${row.organizerHandle}`} arrow placement="top">
                <Typography variant="caption" color="text.secondary" noWrap sx={{ maxWidth: 140, display: 'block' }}>
                  @{row.organizerHandle}
                </Typography>
              </Tooltip>
            ) : null}
          </Stack>
        </Stack>
      </TableCell>

      <TableCell sx={{ whiteSpace: 'nowrap' }}>{row.createdAt || '—'}</TableCell>

      <TableCell sx={{ whiteSpace: 'nowrap' }}>{row.updatedAt || '—'}</TableCell>

      <TableCell align="right" onClick={(event) => event.stopPropagation()}>
        <GenericTableRowActions actions={actions} />
      </TableCell>
    </TableRow>
  );
}
