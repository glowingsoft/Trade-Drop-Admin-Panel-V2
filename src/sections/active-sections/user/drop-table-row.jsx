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

export function DropTableRow({ row, selected, onEditRow, serialNumber }) {

    const router = useRouter();

    const actions = [
        {
            key: 'details',
            icon: 'solar:eye-bold',
            tooltip: 'Details',
            onClick: () => router.push(paths.adminDashboard.users.details(1)),
        },
        // {
        //   key: 'edit',
        //   icon: 'solar:pen-bold',
        //   tooltip: 'Edit',
        //   onClick: (e) => {
        //     e.stopPropagation();
        //     onEditRow();
        //   },
        // },
    ]

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

            <EllipsisCellWithTooltip maxWidth="200px">{row?.title}</EllipsisCellWithTooltip>

            <TableCell sx={{ whiteSpace: 'nowrap' }}>
                {row.category || '—'}
            </TableCell>

            <TableCell sx={{ whiteSpace: 'nowrap' }}>
                {row.city || '—'}
            </TableCell>

            <TableCell align="center" sx={{ whiteSpace: 'nowrap' }}>
                <Label color="primary">
                    {row.urgency || '—'}
                </Label>
            </TableCell>

            {/* Status */}
            <TableCell align="center">
                <Label variant="soft" color={STATUS_OPTION[row.status]}>
                    {row.status || '—'}
                </Label>
            </TableCell>
            {/* Actions */}
            <TableCell align="center">
                <Box onClick={(event) => event.stopPropagation()} sx={{ display: 'flex', justifyContent: 'center' }}>
                    <GenericTableRowActions actions={actions} />
                </Box>
            </TableCell>
        </TableRow>
    );
}
