import { useCallback, useEffect, useMemo, useState } from 'react';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import LinearProgress from '@mui/material/LinearProgress';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';

import { paths } from 'src/routes/paths';

import { useBoolean } from 'src/hooks/use-boolean';
import { useDebounce } from 'src/hooks/use-debounce';
import { useSetState } from 'src/hooks/use-set-state';

import { WALLET_STATUS_OPTIONS } from 'src/_mock';

import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';
import {
  TableEmptyRows,
  TableHeadCustom,
  TableNoData,
  TablePaginationCustom,
  useTable,
} from 'src/components/table';

import { createFilterField } from 'src/components/generic-table/table-filter-fields';
import { FlexibleTableToolbar } from 'src/components/generic-table/table-toolbar';
import { StatusTabsFilterWrapper } from 'src/components/generic-table/tabs-filter-wrapper';
import { useGetCategoriesQuery } from 'src/store/Reducer/categories-api';
import { handleApiError } from 'src/utils/errorHandler';
import { UserTableFiltersResult } from '../../user/user-table-filters-result';
import { CategoryTableRow } from '../category-table-row';
import QuickAddEditCategoryModal from '../quick-add-edit-category-modal';
import { DashboardContent } from 'src/layouts/dashboard';

const STATUS_OPTIONS = [
  { value: 'all', label: 'All', color: 'default' },
  ...WALLET_STATUS_OPTIONS.map((option) => ({
    ...option,
    color:
      (option.value === 'active' && 'success') ||
      (option.value === 'inactive' && 'error') ||
      'default',
  })),
];

const TABLE_HEAD = [
  { id: 'sr', label: 'Sr#', width: 80 },
  { id: 'icon', label: 'Icon' },
  { id: 'name', label: 'Name' },
  { id: 'slug', label: 'Slug' },
  { id: 'chipGroup', label: 'Chip Group' },
  { id: 'sortOrder', label: 'Sort Order' },
  { id: 'status', label: 'Status' },
  { id: 'actions', label: 'Actions', width: 100 },
];

const ROWS_PER_PAGE_OPTIONS = [5, 10, 25, 50];
const DEFAULT_ROWS_PER_PAGE = 10;

const FILTER_FIELDS = [
  createFilterField.status({
    options: STATUS_OPTIONS,
    showCounts: true,
  }),
  createFilterField.search({
    key: 'name',
    placeholder: 'Search ...',
  }),
];

export function CategoryListView() {
  const table = useTable({ defaultDense: true });
  const open = useBoolean();

  const [currentCategory, setCurrentCategory] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(DEFAULT_ROWS_PER_PAGE);

  const filters = useSetState({ name: '', status: 'all' });
  const searchQuery = useDebounce(filters.state.name, 500);

  const { data: responseData, isLoading, isFetching, error } = useGetCategoriesQuery({
    page: currentPage,
    search: searchQuery,
    limit: itemsPerPage,
    status: filters.state.status === 'all' ? '' : filters.state.status,
  });

  useEffect(() => {
    if (error) handleApiError(error);
  }, [error]);

  const handleSearchChange = useCallback(
    (event) => {
      filters.setState({ name: event.target.value });
      setCurrentPage(0);
    },
    [filters]
  );

  const handlePageChange = useCallback((event, newPage) => {
    setCurrentPage(newPage);
  }, []);

  const handleRowsPerPageChange = useCallback((event) => {
    setItemsPerPage(parseInt(event.target.value, 10));
    setCurrentPage(0);
  }, []);

  const handleResetPage = useCallback(() => {
    setCurrentPage(0);
    table.onResetPage();
  }, [table]);

  const allCategories = useMemo(() => responseData?.data || [], [responseData?.data]);

  const totalRecords = responseData?.total_length || 0;
  const statusCounts = responseData?.meta?.stats || {};

  const notFound = !isLoading && !isFetching && allCategories.length === 0;

  const getStatusCount = useCallback(
    (status) => {
      if (status === 'all') {
        return Object.values(statusCounts).reduce((sum, count) => sum + count, 0);
      }
      return statusCounts[status] || 0;
    },
    [statusCounts]
  );

  const statusFilterField = useMemo(() => FILTER_FIELDS.find((f) => f.type === 'status'), []);

  const toolbarFilterFields = useMemo(() => FILTER_FIELDS.filter((f) => f.type !== 'status'), []);

  const handleFilterChange = useCallback(
    (key, value) => {
      filters.setState({ [key]: value });
      setCurrentPage(0);
      table.onResetPage();
    },
    [filters, table]
  );

  const handleEditRow = (row) => {
    setCurrentCategory(row);
    open.onTrue();
  };

  const handleAddNew = useCallback(() => {
    setCurrentCategory(null);
    open.onTrue();
  }, [open]);

  const handleCloseAddEditModal = useCallback(() => {
    open.onFalse();
    setCurrentCategory(null);
  }, [open]);

  return (
    <>
      <DashboardContent maxWidth={false}>
        <CustomBreadcrumbs
          heading={` Categories`}
          links={[
            { name: 'Dashboard', href: paths.adminDashboard.root },
            { name: ` Categories`, href: paths.adminDashboard.categories },
            { name: 'List' },
          ]}
          action={
            <Button
              onClick={handleAddNew}
              variant="contained"
              color="primary"
              startIcon={<Iconify icon="mingcute:add-line" />}
            >
              New Category
            </Button>
          }
          sx={{ mb: { xs: 3, md: 5 } }}
        />

        <Card>
          <StatusTabsFilterWrapper
            filterField={statusFilterField}
            value={filters.state.status}
            onChange={handleFilterChange}
            getCount={getStatusCount}
          />

          <FlexibleTableToolbar
            size="small"
            filterFields={toolbarFilterFields}
            filterValues={filters.state}
            onFilterChange={handleFilterChange}
            onSearchChange={handleSearchChange}
          />

          {filters.canReset && (
            <UserTableFiltersResult
              filters={filters}
              totalResults={totalRecords}
              onResetPage={handleResetPage}
              sx={{ p: 2.5, pt: 0 }}
            />
          )}

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
                <TableHeadCustom headLabel={TABLE_HEAD} rowCount={allCategories.length} />

                <TableBody>
                  {!isLoading &&
                    !isFetching &&
                    allCategories.map((row, index) => (
                      <CategoryTableRow
                        key={row._id}
                        row={row}
                        serialNumber={currentPage * itemsPerPage + index + 1}
                        onEditRow={() => handleEditRow(row)}
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

      <QuickAddEditCategoryModal
        currentCategory={currentCategory}
        open={open.value}
        onClose={handleCloseAddEditModal}
      />
    </>
  );
}
