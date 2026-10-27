import { useCallback, useEffect, useMemo, useState } from 'react';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';

import { paths } from 'src/routes/paths';

import { useBoolean } from 'src/hooks/use-boolean';
import { useDebounce } from 'src/hooks/use-debounce';
import { useSetState } from 'src/hooks/use-set-state';

import { DashboardContent } from 'src/layouts/dashboard';

import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
import { createFilterField } from 'src/components/generic-table/table-filter-fields';
import { TablePdfDocument } from 'src/components/generic-table/table-pdf-document';
import { FlexibleTableToolbar } from 'src/components/generic-table/table-toolbar';
import { StatusTabsFilterWrapper } from 'src/components/generic-table/tabs-filter-wrapper';
import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';
import { toast } from 'src/components/snackbar';
import {
  TableHeadCustom,
  TableNoData,
  TablePaginationCustom,
  useTable,
} from 'src/components/table';

import { getDisplayImage } from 'src/constants/upload';
import { useGetUsersQuery } from 'src/store/Reducer/users-api';
import { handleApiError } from 'src/utils/errorHandler';
import { exportToCsv } from 'src/utils/export-to-csv';
import { exportToPdf } from 'src/utils/export-to-pdf';
import { fDate } from 'src/utils/format-time';

import QuickAddUserModal from '../quick-add-user-modal';
import UserLoadingSkeleton from '../user-loading-skeleton';
import { USER_ACCOUNT_STATUS_OPTIONS } from '../user-status';
import QuickStatusChangeModal from '../user-status-dialog';
import { UserTableFiltersResult } from '../user-table-filters-result';
import { UserTableRow } from '../user-table-row';

const STATUS_OPTIONS = [
  { value: 'all', label: 'All', color: 'default' },
  ...USER_ACCOUNT_STATUS_OPTIONS,
];

const EXPORT_HEADERS = [
  { key: 'name', label: 'Name' },
  { key: 'email', label: 'Email' },
  { key: 'category', label: 'Category' },
  { key: 'city', label: 'City' },
  { key: 'signedUp', label: 'Signed Up' },
  { key: 'status', label: 'Status' },
];

const TABLE_HEAD = [
  { id: 'sr#', label: 'Sr#', width: 60 },
  { id: 'name', label: 'Name', minWidth: 220 },
  { id: 'category', label: 'Craft / Category', minWidth: 180 },
  { id: 'city', label: 'City', minWidth: 160 },
  { id: 'signedup', label: 'Signed Up', width: 120, align: 'center' },
  { id: 'status', label: 'Status', width: 120, align: 'center' },
  { id: 'actions', label: 'Actions', width: 100, align: 'center' },
];

const FILTER_FIELDS = [
  createFilterField.status({
    options: STATUS_OPTIONS,
    showCounts: true,
  }),
  createFilterField.search({
    key: 'name',
    placeholder: 'Search by name, email...',
  }),
];

const DEFAULT_FILTERS = {
  name: '',
  status: 'all',
};

const PAGE_LIMIT = 10;

const mapUserRow = (user) => ({
  id: user?.basicInfo?._id,
  image: getDisplayImage(user?.basicInfo?.profileIcon),
  name: user?.basicInfo?.name || '',
  email: user?.basicInfo?.email || '',
  crafts: user?.crafts || [],
  category: (user?.crafts || []).map((craft) => craft.name).filter(Boolean).join(', '),
  city: user?.profile?.areaLabel || '',
  profile: user?.profile || {},
  signedUp: user?.metadata?.createdAt ? fDate(user.metadata.createdAt) : '',
  status: user?.accountState?.status || '',
});

export function UserListView() {
  const table = useTable({ defaultRowsPerPage: PAGE_LIMIT, defaultDense: true });
  const filters = useSetState(DEFAULT_FILTERS);
  const [currentUser, setCurrentUser] = useState(null);
  const openStatusChangeModal = useBoolean();
  const openModal = useBoolean();
  const keyword = useDebounce(filters.state.name, 500);

  const { data, isLoading, isFetching, error } = useGetUsersQuery({
    page: table.page,
    limit: PAGE_LIMIT,
    keyword: keyword.trim() || undefined,
    status: filters.state.status === 'all' ? undefined : filters.state.status,
  });

  useEffect(() => {
    if (error) handleApiError(error);
  }, [error]);

  const tableData = useMemo(() => (data?.data || []).map(mapUserRow), [data?.data]);
  const totalRecords = data?.total_length || 0;
  const statusCounts = data?.meta?.counts || {};

  const statusFilterField = useMemo(
    () => FILTER_FIELDS.find((field) => field.type === 'status'),
    []
  );

  const toolbarFilterFields = useMemo(
    () => FILTER_FIELDS.filter((field) => field.type !== 'status'),
    []
  );

  const getStatusCount = useCallback(
    (status) => {
      if (status === 'all') {
        return Object.values(statusCounts).reduce((sum, count) => sum + count, 0);
      }
      return statusCounts[status] || 0;
    },
    [statusCounts]
  );

  const canReset = !!filters.state.name || filters.state.status !== 'all';

  const handleFilterChange = useCallback(
    (key, value) => {
      filters.setState({ [key]: value });
      table.onResetPage();
    },
    [filters, table]
  );

  const handleSearchChange = useCallback(
    (event) => {
      filters.setState({ name: event.target.value });
      table.onResetPage();
    },
    [filters, table]
  );

  const handleEditRow = useCallback(
    (user) => {
      setCurrentUser(user);
      openStatusChangeModal.onTrue();
    },
    [openStatusChangeModal]
  );

  const handleCloseStatusChangeModal = useCallback(() => {
    openStatusChangeModal.onFalse();
    setCurrentUser(null);
  }, [openStatusChangeModal]);

  const handleExportCsv = useCallback(() => {
    exportToCsv({
      filename: 'users',
      headers: EXPORT_HEADERS,
      rows: tableData,
    });
    toast.success('Users exported to CSV');
  }, [tableData]);

  const handleExportPdf = useCallback(async () => {
    await exportToPdf({
      filename: 'users',
      pdfDocument: (
        <TablePdfDocument
          title="Users"
          subheader={`${tableData.length} users`}
          headers={EXPORT_HEADERS}
          rows={tableData}
        />
      ),
    });
    toast.success('Users exported to PDF');
  }, [tableData]);

  return (
    <DashboardContent maxWidth={false}>
      <CustomBreadcrumbs
        heading="Users"
        links={[
          { name: 'Dashboard', href: paths.adminDashboard.root },
          { name: 'Users', href: paths.adminDashboard.users.root },
          { name: 'List' },
        ]}
        action={
          <Stack
            direction={{ xs: 'column', md: 'row' }}
            alignItems={{ xs: 'stretch', md: 'center' }}
            spacing={1.5}
            sx={{ width: { xs: 1, md: 'auto' } }}
          >
            <Button
              variant="outlined"
              startIcon={<Iconify icon="solar:export-bold" />}
              onClick={handleExportCsv}
            >
              Export to CSV
            </Button>
            <Button
              variant="outlined"
              startIcon={<Iconify icon="solar:file-bold" />}
              onClick={handleExportPdf}
            >
              Export to PDF
            </Button>
          </Stack>
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

        {canReset && (
          <UserTableFiltersResult
            filters={filters}
            totalResults={totalRecords}
            onResetPage={table.onResetPage}
            sx={{ p: 2.5, pt: 0 }}
          />
        )}

        <Box sx={{ position: 'relative' }}>
          <Scrollbar>
            <Table size={table.dense ? 'small' : 'medium'} sx={{ minWidth: 960 }}>
              <TableHeadCustom
                order={table.order}
                orderBy={table.orderBy}
                headLabel={TABLE_HEAD}
                numSelected={table.selected.length}
              />

              <TableBody>
                {isLoading || isFetching ? (
                  <UserLoadingSkeleton />
                ) : tableData.length > 0 ? (
                  tableData.map((row, index) => (
                    <UserTableRow
                      key={row.id}
                      row={row}
                      serialNumber={index + 1 + table.page * PAGE_LIMIT}
                      selected={table.selected.includes(row.id)}
                      onEditRow={() => handleEditRow(row)}
                    />
                  ))
                ) : (
                  <TableNoData notFound />
                )}
              </TableBody>
            </Table>
          </Scrollbar>
        </Box>

        <QuickStatusChangeModal
          open={openStatusChangeModal.value}
          onClose={handleCloseStatusChangeModal}
          currentUser={currentUser}
        />

        <TablePaginationCustom
          page={table.page}
          dense={table.dense}
          count={totalRecords}
          rowsPerPage={PAGE_LIMIT}
          rowsPerPageOptions={[]}
          onPageChange={table.onChangePage}
          onChangeDense={table.onChangeDense}
        />
      </Card>

      <QuickAddUserModal open={openModal.value} onClose={openModal.onFalse} currentUser={{}} />
    </DashboardContent>
  );
}
