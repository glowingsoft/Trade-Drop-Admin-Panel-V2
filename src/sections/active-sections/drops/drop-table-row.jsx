import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';


import { GenericTableRowActions } from 'src/components/generic-table/table-row-actions';
import { Label } from 'src/components/label';
import EllipsisCellWithTooltip from 'src/components/table/ellipsis-cell-with-tooltip';

import { getDropStatusOption } from './drop-status';

export function DropTableRow({ row, selected, onEditRow, serialNumber }) {

    const actions = [
        {
            key: 'edit',
            icon: 'solar:pen-bold',
            tooltip: 'Edit Drop',
            onClick: (e) => {
                e.stopPropagation();
                onEditRow();
            },
        }
    ]

    return (
        <TableRow
            hover
            selected={selected}
            aria-checked={selected}
            tabIndex={-1}
        >
            {/* Sr# */}
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
                        <Link color="inherit" underline="none" sx={{ cursor: 'default' }}>
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
                <Label variant="soft" color={getDropStatusOption(row.status)?.color || 'default'}>
                    {getDropStatusOption(row.status)?.label || row.status || '—'}
                </Label>
            </TableCell>
            {/* Actions */}
            {/* <TableCell align="center">
                <Box onClick={(event) => event.stopPropagation()} sx={{ display: 'flex', justifyContent: 'center' }}>
                    <GenericTableRowActions actions={actions} />
                </Box>
            </TableCell> */}
        </TableRow>
    );
}
