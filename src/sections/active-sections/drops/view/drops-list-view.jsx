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
import { useGetDropsQuery } from 'src/store/Reducer/drops-api';
import { handleApiError } from 'src/utils/errorHandler';
import { exportToCsv } from 'src/utils/export-to-csv';
import { exportToPdf } from 'src/utils/export-to-pdf';

import UserLoadingSkeleton from '../../user/user-loading-skeleton';
import { UserTableFiltersResult } from '../../user/user-table-filters-result';
import { DROP_STATUS_OPTIONS } from '../drop-status';
import QuickStatusChangeModal from '../drop-status-dialog';
import { DropTableRow } from '../drop-table-row';

const STATUS_OPTIONS = [{ value: 'all', label: 'All', color: 'default' }, ...DROP_STATUS_OPTIONS];

const EXPORT_HEADERS = [
  { key: 'title', label: 'Drop' },
  { key: 'name', label: 'Owner' },
  { key: 'email', label: 'Email' },
  { key: 'category', label: 'Category' },
  { key: 'city', label: 'Area' },
  { key: 'urgency', label: 'Urgency' },
  { key: 'status', label: 'Status' },
];

const TABLE_HEAD = [
  { id: 'sr#', label: 'Sr#', width: 60 },
  { id: 'owner', label: 'Owner', minWidth: 200 },
  { id: 'drop', label: 'Drop', minWidth: 220 },
  { id: 'category', label: 'Category', minWidth: 180 },
  { id: 'areas', label: 'Area', minWidth: 160 },
  { id: 'urgency', label: 'Urgency', width: 120, align: 'center' },
  { id: 'status', label: 'Status', width: 120, align: 'center' },
  // { id: 'actions', label: 'Actions', width: 100, align: 'center' },
];

const DEFAULT_FILTERS = {
  name: '',
  status: 'all',
  categories: 'all',
  areas: 'all',
  urgency: 'all',
};

const PAGE_LIMIT = 10;

const ALL_OPTION = { value: 'all', label: 'All' };

const mapSelectOptions = (items, getValue, getLabel) => {
  const options = [ALL_OPTION];
  (items || []).forEach((item) => {
    const value = getValue(item);
    if (value == null || value === '') return;
    options.push({ value, label: getLabel(item) || value });
  });
  return options;
};

const mergeSelectOptions = (previous, nextItems, getValue, getLabel) => {
  const next = mapSelectOptions(nextItems, getValue, getLabel);
  if (next.length <= 1) return previous.length ? previous : next;

  const byValue = new Map();
  [...previous, ...next].forEach((option) => {
    if (option?.value == null) return;
    byValue.set(option.value, option);
  });

  const rest = [...byValue.values()].filter((option) => option.value !== ALL_OPTION.value);
  return [ALL_OPTION, ...rest];
};

const mapDropRow = (drop) => ({
  id: drop?._id,
  title: [drop?.needText, drop?.offerText].filter(Boolean).join(' → '),
  name: drop?.owner?.name || drop?.ownerHandle || '',
  email: drop?.owner?.email || '',
  image: getDisplayImage(drop?.owner?.profileIcon),
  category: [drop?.needCategory?.name, drop?.offerCategory?.name].filter(Boolean).join(' → '),
  city: drop?.areaLabel || '',
  urgency: drop?.timingChip?.label || '',
  status: drop?.status || '',
});

export function DropsListView({ ownerId, embedded = false }) {
  const table = useTable({ defaultRowsPerPage: PAGE_LIMIT, defaultDense: true });
  const filters = useSetState(DEFAULT_FILTERS);
  const [currentDrop, setCurrentDrop] = useState(null);
  const openStatusChangeModal = useBoolean();
  const keyword = useDebounce(filters.state.name, 500);

  const { data, isLoading, isFetching, error } = useGetDropsQuery(
    {
      page: table.page,
      limit: PAGE_LIMIT,
      category: filters.state.categories === 'all' ? undefined : filters.state.categories,
      area: filters.state.areas === 'all' ? undefined : filters.state.areas,
      timingChip: filters.state.urgency === 'all' ? undefined : filters.state.urgency,
      status: filters.state.status === 'all' ? undefined : filters.state.status,
      keyword: keyword.trim() || undefined,
      ownerId: ownerId || undefined,
    },
    { skip: embedded && !ownerId }
  );

  useEffect(() => {
    if (error) handleApiError(error);
  }, [error]);

  const tableData = useMemo(() => (data?.data || []).map(mapDropRow), [data?.data]);
  const totalRecords = data?.total_length || 0;
  const statusCounts = data?.meta?.counts || {};
  const meta = data?.meta || {};

  const [catalogFilters, setCatalogFilters] = useState({
    categories: [ALL_OPTION],
    areas: [ALL_OPTION],
    timingChips: [ALL_OPTION],
  });

  useEffect(() => {
    setCatalogFilters((previous) => ({
      categories: mergeSelectOptions(
        previous.categories,
        meta.categories,
        (item) => item._id,
        (item) => item.name
      ),
      areas: mergeSelectOptions(
        previous.areas,
        meta.areas,
        (item) => item.value,
        (item) => item.label
      ),
      timingChips: mergeSelectOptions(
        previous.timingChips,
        meta.timingChips,
        (item) => item._id,
        (item) => item.label
      ),
    }));
  }, [meta.areas, meta.categories, meta.timingChips]);

  const filterFields = useMemo(
    () => [
      createFilterField.status({
        options: STATUS_OPTIONS,
        showCounts: true,
      }),
      createFilterField.search({
        key: 'name',
        placeholder: 'Search...',
      }),
      createFilterField.select({
        key: 'categories',
        label: 'Categories',
        options: catalogFilters.categories,
        defaultValue: 'all',
      }),
      createFilterField.select({
        key: 'areas',
        label: 'Areas',
        options: catalogFilters.areas,
        defaultValue: 'all',
      }),
      createFilterField.select({
        key: 'urgency',
        label: 'Urgency',
        options: catalogFilters.timingChips,
        defaultValue: 'all',
      }),
    ],
    [catalogFilters]
  );

  const statusFilterField = useMemo(() => filterFields.find((field) => field.type === 'status'), [filterFields]);

  const toolbarFilterFields = useMemo(
    () => filterFields.filter((field) => field.type !== 'status'),
    [filterFields]
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

  const canReset =
    !!filters.state.name ||
    filters.state.status !== 'all' ||
    filters.state.categories !== 'all' ||
    filters.state.areas !== 'all' ||
    filters.state.urgency !== 'all';

  const handleEditRow = useCallback(
    (drop) => {
      setCurrentDrop(drop);
      openStatusChangeModal.onTrue();
    },
    [openStatusChangeModal]
  );

  const handleCloseStatusChangeModal = useCallback(() => {
    openStatusChangeModal.onFalse();
    setCurrentDrop(null);
  }, [openStatusChangeModal]);

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

  const handleExportCsv = useCallback(() => {
    exportToCsv({
      filename: 'drops',
      headers: EXPORT_HEADERS,
      rows: tableData,
    });
    toast.success('Drops exported to CSV');
  }, [tableData]);

  const handleExportPdf = useCallback(async () => {
    await exportToPdf({
      filename: 'drops',
      pdfDocument: (
        <TablePdfDocument
          title="Drops"
          subheader={`${tableData.length} drops`}
          headers={EXPORT_HEADERS}
          rows={tableData}
        />
      ),
    });
    toast.success('Drops exported to PDF');
  }, [tableData]);

  const tableCard = (
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
            filterFields={filterFields}
            totalResults={totalRecords}
            onResetPage={table.onResetPage}
            sx={{ p: 2.5, pt: 0 }}
          />
        )}

        <Box sx={{ position: 'relative' }}>
          <Scrollbar>
            <Table size={table.dense ? 'small' : 'medium'}>
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
                    <DropTableRow
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

        <TablePaginationCustom
          page={table.page}
          dense={table.dense}
          count={totalRecords}
          rowsPerPage={PAGE_LIMIT}
          rowsPerPageOptions={[]}
          onPageChange={table.onChangePage}
          onChangeDense={table.onChangeDense}
        />

        <QuickStatusChangeModal
          open={openStatusChangeModal.value}
          onClose={handleCloseStatusChangeModal}
          currentUser={currentDrop}
        />
      </Card>
  );

  if (embedded) {
    return tableCard;
  }

  return (
    <DashboardContent maxWidth={false}>
      <CustomBreadcrumbs
        heading="Drops"
        links={[{ name: 'Dashboard', href: paths.adminDashboard.root }, { name: 'Drops' }]}
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

      {tableCard}
    </DashboardContent>
  );
}
