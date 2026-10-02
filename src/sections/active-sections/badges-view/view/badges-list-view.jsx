import { useCallback, useEffect, useMemo, useState } from 'react';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import LinearProgress from '@mui/material/LinearProgress';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';

import { paths } from 'src/routes/paths';

import { useBoolean } from 'src/hooks/use-boolean';

import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';
import { toast } from 'src/components/snackbar';
import {
  TableEmptyRows,
  TableHeadCustom,
  TableNoData,
  TablePaginationCustom,
  useTable,
} from 'src/components/table';

import { useDeleteBadgeMutation, useGetBadgesQuery } from 'src/store/Reducer/badges-api';
import { handleApiError } from 'src/utils/errorHandler';

import { BadgeTableRow } from '../badge-table-row';
import QuickAddEditBadgeModal from '../quick-add-edit-badge-modal';

const TABLE_HEAD = [
  { id: 'sr', label: 'Sr#', width: 80 },
  { id: 'icon', label: 'Icon', width: 80 },
  { id: 'name', label: 'Name' },
  { id: 'slug', label: 'Slug' },
  { id: 'metric', label: 'Metric' },
  { id: 'operator', label: 'Operator', width: 100 },
  { id: 'threshold', label: 'Threshold', width: 120 },
  { id: 'sortOrder', label: 'Sort Order', width: 150 },
  { id: 'status', label: 'Status' },
  { id: 'actions', label: 'Actions', width: 100 },
];

const ROWS_PER_PAGE_OPTIONS = [5, 10, 25, 50];
const DEFAULT_ROWS_PER_PAGE = 10;

export function BadgesListView() {
  const table = useTable({ defaultDense: true });
  const open = useBoolean();
  const confirm = useBoolean();

  const [itemToDelete, setItemToDelete] = useState(null);
  const [currentBadge, setCurrentBadge] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(DEFAULT_ROWS_PER_PAGE);

  const { data: responseData, isLoading, isFetching, error } = useGetBadgesQuery();
  const [deleteBadge, { isLoading: isDeleting }] = useDeleteBadgeMutation();

  useEffect(() => {
    if (error) handleApiError(error);
  }, [error]);

  const handlePageChange = useCallback((event, newPage) => {
    setCurrentPage(newPage);
  }, []);

  const handleRowsPerPageChange = useCallback((event) => {
    setItemsPerPage(parseInt(event.target.value, 10));
    setCurrentPage(0);
  }, []);

  const allBadges = useMemo(() => responseData?.data || [], [responseData?.data]);

  const paginatedBadges = useMemo(
    () => allBadges.slice(currentPage * itemsPerPage, currentPage * itemsPerPage + itemsPerPage),
    [allBadges, currentPage, itemsPerPage]
  );

  const totalRecords = allBadges.length;
  const notFound = !isLoading && !isFetching && allBadges.length === 0;

  const handleAddNew = useCallback(() => {
    setCurrentBadge(null);
    open.onTrue();
  }, [open]);

  const handleEditRow = (row) => {
    setCurrentBadge(row);
    open.onTrue();
  };

  const handleCloseModal = useCallback(() => {
    open.onFalse();
    setCurrentBadge(null);
  }, [open]);

  const handleDeleteRow = (row) => {
    setItemToDelete(row);
    confirm.onTrue();
  };

  const handleCancelDelete = () => {
    confirm.onFalse();
    setItemToDelete(null);
  };

  const handleConfirmDelete = async () => {
    if (!itemToDelete?._id) return;

    try {
      const response = await deleteBadge(itemToDelete._id).unwrap();
      if (response.message) toast.success(response.message);
      handleCancelDelete();
    } catch (err) {
      handleApiError(err);
    }
  };

  return (
    <>
      <Box sx={{ px: { xs: 2, md: 6 }, pb: 5, pt: 3, display: 'flex', flexDirection: 'column' }}>
        <CustomBreadcrumbs
          heading="Badges"
          links={[
            { name: 'Dashboard', href: paths.adminDashboard.root },
            { name: 'Badges', href: paths.adminDashboard.badges },
            { name: 'List' },
          ]}
          action={
            <Button
              onClick={handleAddNew}
              variant="contained"
              color="primary"
              startIcon={<Iconify icon="mingcute:add-line" />}
            >
              New Badge
            </Button>
          }
          sx={{ mb: { xs: 3, md: 5 } }}
        />

        <Card>
          <Box sx={{ position: 'relative' }}>
            {isFetching && (
              <LinearProgress
                sx={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  zIndex: 9,
                }}
              />
            )}

            <Scrollbar>
              <Table size={table.dense ? 'small' : 'medium'} sx={{ minWidth: 960 }}>
                <TableHeadCustom headLabel={TABLE_HEAD} rowCount={paginatedBadges.length} />

                <TableBody>
                  {!isLoading &&
                    !isFetching &&
                    paginatedBadges.map((row, index) => (
                      <BadgeTableRow
                        key={row._id}
                        row={row}
                        serialNumber={currentPage * itemsPerPage + index + 1}
                        onEditRow={() => handleEditRow(row)}
                        onDeleteRow={() => handleDeleteRow(row)}
                      />
                    ))}

                  {(isLoading || isFetching) && (
                    <TableEmptyRows height={table.dense ? 56 : 76} emptyRows={itemsPerPage} />
                  )}

                  <TableNoData notFound={notFound} />
                </TableBody>
              </Table>
            </Scrollbar>
          </Box>

          <TablePaginationCustom
            page={currentPage}
            dense={table.dense}
            count={totalRecords}
            rowsPerPage={itemsPerPage}
            onPageChange={handlePageChange}
            onChangeDense={table.onChangeDense}
            onRowsPerPageChange={handleRowsPerPageChange}
            rowsPerPageOptions={ROWS_PER_PAGE_OPTIONS}
          />
        </Card>
      </Box>

      <QuickAddEditBadgeModal
        currentBadge={currentBadge}
        open={open.value}
        onClose={handleCloseModal}
      />

      <ConfirmDialog
        open={confirm.value}
        onClose={handleCancelDelete}
        title="Delete Badge"
        content="Are you sure you want to delete this badge?"
        action={
          <Button variant="contained" color="error" onClick={handleConfirmDelete} disabled={isDeleting}>
            Delete
          </Button>
        }
      />
    </>
  );
}
