import { Rating } from '@mui/material';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';

import EllipsisCellWithTooltip from 'src/components/table/ellipsis-cell-with-tooltip';
import { useRouter } from 'src/routes/hooks';
import { paths } from 'src/routes/paths';

export function ReviewTableRow({ row, selected, serialNumber }) {
  const router = useRouter();
  const detailsPath = row.fromUserId ? paths.adminDashboard.users.details(row.fromUserId) : '';

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
            <Link color="inherit" underline="none">
              {row.name || '—'}
            </Link>

            <Box
              sx={{
                color: 'text.secondary',
                typography: 'caption',
              }}
            >
              {row.handle || '—'}
            </Box>
          </Stack>
        </Stack>
      </TableCell>

      <EllipsisCellWithTooltip maxWidth="300px">{row?.review}</EllipsisCellWithTooltip>

      <TableCell>
        <Rating name="read-only" value={row?.rating} readOnly />
      </TableCell>
    </TableRow>
  );
}
