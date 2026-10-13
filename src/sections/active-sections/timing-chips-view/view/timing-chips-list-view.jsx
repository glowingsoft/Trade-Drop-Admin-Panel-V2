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

import {
  useDeleteTimingChipMutation,
  useGetTimingChipsQuery,
} from 'src/store/Reducer/categories-api';
import { handleApiError } from 'src/utils/errorHandler';
import QuickAddTimingChipModal from '../quick-add-timing-chip-modal';
import { TimingChipTableRow } from '../timing-chip-table-row';
import { DashboardContent } from 'src/layouts/dashboard';

const TABLE_HEAD = [
  { id: 'sr', label: 'Sr#', width: 80 },
  { id: 'label', label: 'Label' },
  { id: 'value', label: 'Value' },
  { id: 'sortOrder', label: 'Sort Order' },
  { id: 'status', label: 'Status' },
  { id: 'actions', label: 'Actions', width: 100 },
];

const ROWS_PER_PAGE_OPTIONS = [5, 10, 25, 50];
const DEFAULT_ROWS_PER_PAGE = 10;

export function TimingChipsListView() {
  const table = useTable({ defaultDense: true });
  const open = useBoolean();
  const confirm = useBoolean();

  const [itemToDelete, setItemToDelete] = useState(null);
  const [currentChip, setCurrentChip] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(DEFAULT_ROWS_PER_PAGE);

  const { data: responseData, isLoading, isFetching, error } = useGetTimingChipsQuery({
    page: currentPage,
    limit: itemsPerPage,
  });
  const [deleteTimingChip, { isLoading: isDeleting }] = useDeleteTimingChipMutation();

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

  const allChips = useMemo(() => responseData?.data || [], [responseData?.data]);
  const totalRecords = responseData?.total_length || 0;
  const notFound = !isLoading && !isFetching && allChips.length === 0;

  const handleAddNew = useCallback(() => {
    setCurrentChip(null);
    open.onTrue();
  }, [open]);

  const handleEditRow = (row) => {
    setCurrentChip(row);
    open.onTrue();
  };

  const handleCloseModal = useCallback(() => {
    open.onFalse();
    setCurrentChip(null);
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
      const response = await deleteTimingChip(itemToDelete._id).unwrap();
      if (response.message) toast.success(response.message);
      handleCancelDelete();
    } catch (err) {
      handleApiError(err);
    }
  };

  return (
    <>
      <DashboardContent maxWidth={false}>
        <CustomBreadcrumbs
          heading="Timing chips"
          links={[
            { name: 'Dashboard', href: paths.adminDashboard.root },
            { name: 'Timing chips', href: paths.adminDashboard.timingChips },
            { name: 'List' },
          ]}
          action={
            <Button
              onClick={handleAddNew}
              variant="contained"
              color="primary"
              startIcon={<Iconify icon="mingcute:add-line" />}
            >
              New Timing Chip
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
                <TableHeadCustom headLabel={TABLE_HEAD} rowCount={allChips.length} />

                <TableBody>
                  {!isLoading &&
                    !isFetching &&
                    allChips.map((row, index) => (
                      <TimingChipTableRow
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
      </DashboardContent>

      <QuickAddTimingChipModal
        currentChip={currentChip}
        open={open.value}
        onClose={handleCloseModal}
      />

      <ConfirmDialog
        open={confirm.value}
        onClose={handleCancelDelete}
        title="Delete Timing Chip"
        content="Are you sure you want to delete this timing chip?"
        action={
          <Button variant="contained" color="error" onClick={handleConfirmDelete} disabled={isDeleting}>
            Delete
          </Button>
        }
      />
    </>
  );
}
