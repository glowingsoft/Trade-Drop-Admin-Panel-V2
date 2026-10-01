import { useCallback, useMemo } from 'react';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

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

import { exportToCsv } from 'src/utils/export-to-csv';

import {
  DISPUTE_ASSIGNEE_OPTIONS,
  DISPUTE_PRIORITY_OPTIONS,
  DISPUTE_STATUS_OPTIONS,
} from '../dispute-status';
import { DisputeStatCard } from '../dispute-stat-card';
import { DisputeTableRow } from '../dispute-table-row';
import { DISPUTE_STATS, DISPUTES } from '../mocks/data';

const TABLE_HEAD = [
  { id: 'sr', label: 'Sr#', width: 60 },
  { id: 'id', label: 'ID', width: 100 },
  { id: 'title', label: 'Title', minWidth: 240 },
  { id: 'parties', label: 'Parties', minWidth: 200 },
  { id: 'trade', label: 'Trade', width: 120 },
  { id: 'priority', label: 'Priority', width: 120, align: 'center' },
  { id: 'status', label: 'Status', width: 140, align: 'center' },
  { id: 'assignee', label: 'Assigned to', minWidth: 160 },
  { id: 'sla', label: 'SLA', width: 120, align: 'center' },
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
  createFilterField.select({
    key: 'assignee',
    label: 'Assignee',
    options: DISPUTE_ASSIGNEE_OPTIONS,
  }),
];

const DEFAULT_FILTERS = {
  search: '',
  status: 'all',
  priority: 'all',
  assignee: 'all',
};

const EXPORT_HEADERS = [
  { key: 'id', label: 'Dispute' },
  { key: 'title', label: 'Title' },
  { key: 'parties', label: 'Parties' },
  { key: 'tradeId', label: 'Trade' },
  { key: 'priority', label: 'Priority' },
  { key: 'status', label: 'Status' },
  { key: 'assignee', label: 'Assigned to' },
  { key: 'slaLabel', label: 'SLA' },
  { key: 'openedLabel', label: 'Opened' },
];

export function DisputesListView() {
  const router = useRouter();
  const table = useTable({ defaultRowsPerPage: 25, defaultDense: true });
  const filters = useSetState(DEFAULT_FILTERS);

  const filteredRows = useMemo(() => {
    const keyword = filters.state.search.trim().toLowerCase();

    return DISPUTES.filter((row) => {
      const matchesSearch =
        !keyword ||
        row.id.toLowerCase().includes(keyword) ||
        row.title.toLowerCase().includes(keyword) ||
        row.tradeId.toLowerCase().includes(keyword) ||
        row.partyA.name.toLowerCase().includes(keyword) ||
        row.partyB.name.toLowerCase().includes(keyword);

      const matchesStatus = filters.state.status === 'all' || row.status === filters.state.status;
      const matchesPriority =
        filters.state.priority === 'all' || row.priority === filters.state.priority;
      const matchesAssignee =
        filters.state.assignee === 'all' || row.assignee === filters.state.assignee;

      return matchesSearch && matchesStatus && matchesPriority && matchesAssignee;
    });
  }, [filters.state]);

  const paginatedRows = useMemo(
    () =>
      filteredRows.slice(
        table.page * table.rowsPerPage,
        table.page * table.rowsPerPage + table.rowsPerPage
      ),
    [filteredRows, table.page, table.rowsPerPage]
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
      rows: filteredRows.map((row) => ({
        ...row,
        parties: `${row.partyA.name} vs ${row.partyB.name}`,
      })),
    });
  }, [filteredRows]);

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
        {DISPUTE_STATS.map((stat) => (
          <Grid key={stat.key} item xs={12} sm={6} md={3}>
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
            totalResults={filteredRows.length}
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
                {paginatedRows.length > 0 ? (
                  paginatedRows.map((row, index) => (
                    <DisputeTableRow
                      key={row.id}
                      row={row}
                      serialNumber={index + 1 + table.page * table.rowsPerPage}
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
          count={filteredRows.length}
          rowsPerPage={table.rowsPerPage}
          onPageChange={table.onChangePage}
          onChangeDense={table.onChangeDense}
          onRowsPerPageChange={table.onChangeRowsPerPage}
        />
      </Card>
    </DashboardContent>
  );
}
