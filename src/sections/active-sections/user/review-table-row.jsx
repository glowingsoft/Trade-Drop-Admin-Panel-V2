import { Rating } from '@mui/material';
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

// ----------------------------------------------------------------------

const STATUS_OPTION = {
    live: "success",
    hidden: "default",
    paused: "warning",
    completed: "success"
}

export function ReviewTableRow({ row, selected, serialNumber }) {

    const router = useRouter();

    return (
        <TableRow
            hover
            selected={selected}
            aria-checked={selected}
            tabIndex={-1}
            sx={{ cursor: 'pointer' }}
            onClick={() => router.push(paths.adminDashboard.users.details(1))}
        >
            {/* Sr# */}
            <TableCell>{serialNumber}</TableCell>

            <TableCell>
                <Stack spacing={2} direction="row" alignItems="center">
                    <Avatar alt={row.name} src={row.image}>
                        {row.name?.charAt(0)}
                    </Avatar>

                    <Stack
                        sx={{
                            typography: 'body2',
                            flex: '1 1 auto',
                            alignItems: 'flex-start',
                        }}
                    >
                        <Link
                            color="inherit"
                            sx={{ cursor: 'pointer' }}
                        >
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

            <EllipsisCellWithTooltip maxWidth="300px">{row?.review}</EllipsisCellWithTooltip>

            <TableCell>
                <Rating name="read-only" value={row?.rating} readOnly />
            </TableCell>


        </TableRow>
    );
}
