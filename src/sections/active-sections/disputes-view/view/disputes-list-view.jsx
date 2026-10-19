import { useCallback, useEffect, useMemo } from 'react';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { useDebounce } from 'src/hooks/use-debounce';
import { useSetState } from 'src/hooks/use-set-state';

import { DashboardContent } from 'src/layouts/dashboard';

import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
import { createFilterField } from 'src/components/generic-table/table-filter-fields';
import { FlexibleTableFiltersResult } from 'src/components/generic-table/table-filters-result';
import { FlexibleTableToolbar } from 'src/components/generic-table/table-toolbar';
import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';
import {
  TableHeadCustom,
  TableNoData,
  TablePaginationCustom,
  useTable,
} from 'src/components/table';

import { useGetDisputesQuery } from 'src/store/Reducer/disputes-api';
import { handleApiError } from 'src/utils/errorHandler';
import { exportToCsv } from 'src/utils/export-to-csv';
import { fToNow } from 'src/utils/format-time';

import UserLoadingSkeleton from '../../user/user-loading-skeleton';
import {
  DISPUTE_PRIORITY_OPTIONS,
  DISPUTE_STATUS_OPTIONS,
  getDisputePriorityOption,
  getDisputeReasonOption,
  getDisputeStatusOption,
} from '../dispute-status';
import { DisputeStatCard } from '../dispute-stat-card';
import { DisputeTableRow } from '../dispute-table-row';

const TABLE_HEAD = [
  { id: 'sr', label: 'Sr#', width: 60 },
  { id: 'id', label: 'ID', width: 100 },
  { id: 'title', label: 'Title', minWidth: 240 },
  { id: 'parties', label: 'Parties', minWidth: 200 },
  { id: 'trade', label: 'Trade', minWidth: 220 },
  { id: 'priority', label: 'Priority', width: 120, align: 'center' },
  { id: 'status', label: 'Status', width: 140, align: 'center' },
  { id: 'opened', label: 'Opened', width: 120 },
  { id: 'actions', label: 'Actions', width: 80, align: 'center' },
];

const FILTER_FIELDS = [
  createFilterField.search({
    key: 'search',
    label: 'Keyword',
    placeholder: 'Search dispute, trade or member',
  }),
  createFilterField.select({
    key: 'status',
    label: 'Status',
    options: [{ value: 'all', label: 'All' }, ...DISPUTE_STATUS_OPTIONS],
  }),
  createFilterField.select({
    key: 'priority',
    label: 'Priority',
    options: [{ value: 'all', label: 'All' }, ...DISPUTE_PRIORITY_OPTIONS],
  }),
];

const DEFAULT_FILTERS = {
  search: '',
  status: 'all',
  priority: 'all',
};

const EXPORT_HEADERS = [
  { key: 'tradeCode', label: 'ID' },
  { key: 'title', label: 'Title' },
  { key: 'parties', label: 'Parties' },
  { key: 'tradeSummary', label: 'Trade' },
  { key: 'priority', label: 'Priority' },
  { key: 'status', label: 'Status' },
  { key: 'openedLabel', label: 'Opened' },
];

const PAGE_LIMIT = 10;

const partyName = (party) => party?.name || '—';

const getTradeSummary = (trade) => {
  if (!trade || typeof trade === 'string') return '';

  const drop = trade.dropIdDrop;
  const tapIn = trade.tapInIdTapIn;
  const dropLabel = [drop?.needText, drop?.offerText].filter(Boolean).join(' → ');

  if (dropLabel) return dropLabel;
  return tapIn?.yourOffer || drop?.areaLabel || '';
};

const mapDisputeRow = (dispute) => {
  const reasonLabel = getDisputeReasonOption(dispute?.reason)?.label || dispute?.reason || '';
  const trade = dispute?.tradeId;
  const tradeCode =
    typeof trade === 'string' ? trade : trade?.tradeCode || trade?._id || '—';

  return {
    id: dispute?._id,
    title: dispute?.description || reasonLabel || '—',
    partyA: { name: partyName(dispute?.raisedBy) },
    partyB: { name: partyName(dispute?.against) },
    tradeId: typeof trade === 'string' ? trade : trade?._id || '—',
    tradeCode,
    tradeSummary: getTradeSummary(trade),
    priority: dispute?.priority || '',
    status: dispute?.status || '',
    openedLabel: dispute?.createdAt ? fToNow(dispute.createdAt) : '—',
  };
};

export function DisputesListView() {
  const router = useRouter();
  const table = useTable({ defaultRowsPerPage: PAGE_LIMIT, defaultDense: true });
  const filters = useSetState(DEFAULT_FILTERS);
  const keyword = useDebounce(filters.state.search, 500);

  const { data, isLoading, isFetching, error } = useGetDisputesQuery({
    page: table.page,
    limit: PAGE_LIMIT,
    scope: 'all',
    keyword: keyword.trim() || undefined,
    status: filters.state.status === 'all' ? undefined : filters.state.status,
    priority: filters.state.priority === 'all' ? undefined : filters.state.priority,
  });

  useEffect(() => {
    if (error) handleApiError(error);
  }, [error]);

  const tableData = useMemo(() => (data?.data || []).map(mapDisputeRow), [data?.data]);
  const totalRecords = data?.total_length || 0;
  const statusStats = data?.meta?.stats?.status || {};

  const disputeStats = useMemo(
    () => [
      {
        key: 'open',
        title: 'Open',
        value: statusStats.open ?? 0,
        color: 'warning',
        icon: 'solar:inbox-in-bold',
      },
      {
        key: 'closed',
        title: 'Closed',
        value: statusStats.closed ?? statusStats.resolved ?? 0,
        color: 'success',
        icon: 'solar:check-circle-bold',
      },
    ],
    [statusStats.open, statusStats.closed, statusStats.resolved]
  );

  const activeFilters = useMemo(
    () =>
      FILTER_FIELDS.filter((field) => {
        const value = filters.state[field.key];
        if (field.type === 'search') return Boolean(value);
        return value && value !== (field.defaultValue ?? 'all');
      }).map((field) => ({
        ...field,
        value: filters.state[field.key],
      })),
    [filters.state]
  );

  const handleFilterChange = useCallback(
    (key, value) => {
      filters.setState({ [key]: value });
      table.onResetPage();
    },
    [filters, table]
  );

  const handleSearchChange = useCallback(
    (event) => {
      filters.setState({ search: event.target.value });
      table.onResetPage();
    },
    [filters, table]
  );

  const handleReset = useCallback(() => {
    filters.onResetState();
    table.onResetPage();
  }, [filters, table]);

  const handleRemoveFilter = useCallback(
    (key) => {
      const field = FILTER_FIELDS.find((item) => item.key === key);
      filters.setState({ [key]: field?.defaultValue ?? '' });
      table.onResetPage();
    },
    [filters, table]
  );

  const handleViewRow = useCallback(
    (id) => {
      router.push(paths.adminDashboard.disputesDetails(id));
    },
    [router]
  );

  const handleExportCsv = useCallback(() => {
    exportToCsv({
      filename: 'disputes',
      headers: EXPORT_HEADERS,
      rows: tableData.map((row) => ({
        ...row,
        parties: `${row.partyA.name} vs ${row.partyB.name}`,
        priority: getDisputePriorityOption(row.priority)?.label || row.priority,
        status: getDisputeStatusOption(row.status)?.label || row.status,
      })),
    });
  }, [tableData]);

  return (
    <DashboardContent maxWidth={false}>
      <CustomBreadcrumbs
        heading="Disputes"
        links={[
          { name: 'Dashboard', href: paths.adminDashboard.root },
          { name: 'Disputes' },
        ]}
        action={
          <Button
            variant="outlined"
            startIcon={<Iconify icon="solar:export-bold" />}
            onClick={handleExportCsv}
          >
            Export
          </Button>
        }
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <Grid container spacing={2} sx={{ mb: 3 }}>
        {disputeStats.map((stat) => (
          <Grid key={stat.key} item xs={12} sm={6} md={4}>
            <DisputeStatCard
              title={stat.title}
              value={stat.value}
              color={stat.color}
              icon={stat.icon}
            />
          </Grid>
        ))}
      </Grid>

      <Card>
        <FlexibleTableToolbar
          size="small"
          filterFields={FILTER_FIELDS}
          filterValues={filters.state}
          onFilterChange={handleFilterChange}
          onSearchChange={handleSearchChange}
        />

        {activeFilters.length > 0 && (
          <FlexibleTableFiltersResult
            activeFilters={activeFilters}
            totalResults={totalRecords}
            onResetFilters={handleReset}
            onRemoveFilter={handleRemoveFilter}
            sx={{ p: 2.5, pt: 0 }}
          />
        )}

        <Box sx={{ position: 'relative' }}>
          <Scrollbar>
            <Table size={table.dense ? 'small' : 'medium'} sx={{ minWidth: 1100 }}>
              <TableHeadCustom
                order={table.order}
                orderBy={table.orderBy}
                headLabel={TABLE_HEAD}
              />
              <TableBody>
                {isLoading || isFetching ? (
                  <UserLoadingSkeleton />
                ) : tableData.length > 0 ? (
                  tableData.map((row, index) => (
                    <DisputeTableRow
                      key={row.id}
                      row={row}
                      serialNumber={index + 1 + table.page * PAGE_LIMIT}
                      onViewRow={() => handleViewRow(row.id)}
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
      </Card>
    </DashboardContent>
  );
}
