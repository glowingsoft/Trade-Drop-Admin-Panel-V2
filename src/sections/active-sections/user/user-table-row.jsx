import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';

import { CustomPopover, usePopover } from 'src/components/custom-popover';
import { GenericTableRowActions } from 'src/components/generic-table/table-row-actions';
import { Label } from 'src/components/label';
import { useRouter } from 'src/routes/hooks';
import { paths } from 'src/routes/paths';

import { getUserStatusOption } from './user-status';

const MAX_VISIBLE_CRAFTS = 3;

export function UserTableRow({ row, selected, onEditRow, serialNumber }) {
  const router = useRouter();
  const detailsPath = paths.adminDashboard.users.details(row.id);
  const craftsPopover = usePopover();
  const crafts = (row.crafts || []).filter((craft) => craft?.name);
  const visibleCrafts = crafts.slice(0, MAX_VISIBLE_CRAFTS);
  const extraCrafts = crafts.slice(MAX_VISIBLE_CRAFTS);

  const actions = [
    {
      key: 'details',
      icon: 'solar:eye-bold',
      tooltip: 'Details',
      onClick: () => router.push(detailsPath),
    },
    {
      key: 'edit',
      icon: 'solar:pen-bold',
      tooltip: 'Edit',
      onClick: (e) => {
        e.stopPropagation();
        onEditRow();
      },
    },
  ];

  return (
    <TableRow
      hover
      selected={selected}
      aria-checked={selected}
      tabIndex={-1}
      sx={{ cursor: 'pointer' }}
      onClick={() => router.push(detailsPath)}
    >
      <TableCell>{serialNumber}</TableCell>

      <TableCell>
        <Stack spacing={2} direction="row" alignItems="center">
          <Avatar alt={row.name} src={row.image} sx={{ width: 32, height: 32 }}>
            {row.name?.charAt(0)}
          </Avatar>

          <Stack
            sx={{
              typography: 'body2',
              flex: '1 1 auto',
              alignItems: 'flex-start',
            }}
          >
            <Link color="inherit" sx={{ cursor: 'pointer' }}>
              {row.name || '—'}
            </Link>

            <Box
              sx={{
                color: 'text.secondary',
                // typography: 'caption',
                fontSize: '13px',
              }}
            >
              {row.email || '—'}
            </Box>
          </Stack>
        </Stack>
      </TableCell>

      <TableCell>
        {visibleCrafts.length ? (
          <Stack direction="row" spacing={0.5} flexWrap="wrap" useFlexGap>
            {visibleCrafts.map((craft) => (
              <Label key={craft._id || craft.name} variant="soft" color="primary">
                {craft.name}
              </Label>
            ))}
            {extraCrafts.length ? (
              <Label
                variant="soft"
                color="default"
                onClick={(event) => {
                  event.stopPropagation();
                  craftsPopover.onOpen(event);
                }}
                sx={{ cursor: 'pointer' }}
              >
                +{extraCrafts.length}
              </Label>
            ) : null}
            <CustomPopover
              open={craftsPopover.open}
              anchorEl={craftsPopover.anchorEl}
              onClose={craftsPopover.onClose}
              slotProps={{ arrow: { placement: 'top-left' }, paper: { sx: { p: 1.5, maxWidth: 280 } } }}
            >
              <Stack spacing={0.75} onClick={(event) => event.stopPropagation()}>
                {extraCrafts.map((craft) => (
                  <Label key={craft._id || craft.name} variant="soft" color="primary">
                    {craft.name}
                  </Label>
                ))}
              </Stack>
            </CustomPopover>
          </Stack>
        ) : (
          '—'
        )}
      </TableCell>

      <TableCell sx={{ whiteSpace: 'nowrap' }}>{row.profile?.areaLabel || '—'}</TableCell>

      <TableCell sx={{ whiteSpace: 'nowrap' }}>{row.signedUp || '—'}</TableCell>

      <TableCell align="center">
        <Label variant="soft" color={getUserStatusOption(row.status)?.color || 'default'}>
          {getUserStatusOption(row.status)?.label || row.status || '—'}
        </Label>
      </TableCell>

      <TableCell align="center">
        <Box onClick={(event) => event.stopPropagation()}>
          <GenericTableRowActions actions={actions} />
        </Box>
      </TableCell>
    </TableRow>
  );
}
