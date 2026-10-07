import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';

import { GenericTableRowActions } from 'src/components/generic-table/table-row-actions';
import { Label } from 'src/components/label';
import EllipsisCellWithTooltip from 'src/components/table/ellipsis-cell-with-tooltip';
import { useRouter } from 'src/routes/hooks';
import { paths } from 'src/routes/paths';

import { getTapStatusOption } from './tap-status';

export function TapTableRow({ row, selected, serialNumber }) {
  console.log("row", row);
  const router = useRouter();
  const detailsPath = row.ownerId ? paths.adminDashboard.users.details(row.ownerId) : '';
  const statusOption = getTapStatusOption(row.status);

  const actions = detailsPath
    ? [
      {
        key: 'details',
        icon: 'solar:eye-bold',
        tooltip: 'Details',
        onClick: () => router.push(detailsPath),
      },
    ]
    : [];

  return (
    <TableRow
      hover
      selected={selected}
      aria-checked={selected}
      tabIndex={-1}
      // sx={{ cursor: detailsPath ? 'pointer' : 'default' }}
      // onClick={() => {
      //   if (detailsPath) router.push(detailsPath);
      // }}
    >
      <TableCell>{serialNumber}</TableCell>

      <TableCell>
        <Stack spacing={2} direction="row" alignItems="center">
          <Avatar alt={row.name} src={row.image} sx={{ width: 32, height: 32, fontSize: 16 }}>
            {row.name?.charAt(0)}
          </Avatar>

          <Stack
            sx={{
              typography: 'body2',
              flex: '1 1 auto',
              alignItems: 'flex-start',
            }}
          >
            <Link color="inherit" underline="none">
              {row.name || '—'}
            </Link>

            <Box
              sx={{
                color: 'text.secondary',
                typography: 'caption',
              }}
            >
              {row.email || '—'}
            </Box>
          </Stack>
        </Stack>
      </TableCell>

      <EllipsisCellWithTooltip maxWidth="200px">{row?.title}</EllipsisCellWithTooltip>

      <TableCell sx={{ whiteSpace: 'nowrap' }}>{row.category || '—'}</TableCell>

      <TableCell sx={{ whiteSpace: 'nowrap' }}>{row.city || '—'}</TableCell>

      <TableCell align="center" sx={{ whiteSpace: 'nowrap' }}>
        <Label color="primary">{row.urgency || '—'}</Label>
      </TableCell>

      <TableCell align="center">
        <Label variant="soft" color={statusOption?.color || 'default'}>
          {statusOption?.label || row.status || '—'}
        </Label>
      </TableCell>

      {/* <TableCell align="center">
        <Box
          onClick={(event) => event.stopPropagation()}
          sx={{ display: 'flex', justifyContent: 'center' }}
        >
          <GenericTableRowActions actions={actions} />
        </Box>
      </TableCell> */}
    </TableRow>
  );
}
