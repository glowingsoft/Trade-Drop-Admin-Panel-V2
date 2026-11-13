import Stack from '@mui/material/Stack';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import { Avatar } from '@mui/material';

import { Label } from 'src/components/label';
import { GenericTableRowActions } from 'src/components/generic-table/table-row-actions';
import { getDisplayImage } from 'src/constants/upload';
import { paths } from 'src/routes/paths';

import { useNavigate } from 'react-router-dom';

import { getCategoryInterests } from './map-category';

export function CategoryTableRow({ row, serialNumber, onEditRow }) {
  const navigate = useNavigate();
  const status = row.active === false ? 'inactive' : 'active';
  const interests = getCategoryInterests(row);
  const interestsLabel = interests.length ? interests.join(', ') : '—';
  const categoryId = row._id || row.id;

  const handleOpenDetails = () => {
    if (!categoryId) return;
    navigate(paths.adminDashboard.categoryDetails(categoryId), {
      state: { categoryPreview: row },
    });
  };

  const actions = [
    {
      key: 'edit',
      icon: 'solar:pen-bold',
      tooltip: 'Edit Category',
      onClick: (event) => {
        event?.stopPropagation?.();
        onEditRow?.();
      },
    },
  ];

  return (
    <TableRow hover tabIndex={-1} onClick={handleOpenDetails} sx={{ cursor: 'pointer' }}>
      <TableCell sx={{ whiteSpace: 'nowrap' }}>{serialNumber}</TableCell>

      <TableCell>
        <Avatar alt={row?.name} src={getDisplayImage(row?.image)} />
      </TableCell>

      <TableCell sx={{ whiteSpace: 'nowrap' }}>
        <Typography variant="subtitle2" sx={{ cursor: 'pointer' }}>
          {row?.name || '—'}
        </Typography>
      </TableCell>

      <TableCell sx={{ whiteSpace: 'nowrap' }}>{row?.slug || '—'}</TableCell>

      <TableCell sx={{ maxWidth: 220, width: 220 }}>
        <Tooltip title={interests.length ? interestsLabel : ''} placement="top-start">
          <Typography
            variant="body2"
            noWrap
            sx={{
              maxWidth: 220,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            {interestsLabel}
          </Typography>
        </Tooltip>
      </TableCell>

      <TableCell sx={{ whiteSpace: 'nowrap' }}>{row?.sortOrder ?? '—'}</TableCell>

      <TableCell>
        <Label
          color={
            (status === 'active' && 'success') || (status === 'inactive' && 'error') || 'default'
          }
        >
          {status}
        </Label>
      </TableCell>

      <TableCell
        onClick={(event) => {
          event.stopPropagation();
        }}
      >
        <Stack direction="row" alignItems="center" spacing={0.5}>
          <GenericTableRowActions actions={actions} />
        </Stack>
      </TableCell>
    </TableRow>
  );
}
