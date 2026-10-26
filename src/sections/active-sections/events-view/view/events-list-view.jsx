import { useCallback, useMemo } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';

import { paths } from 'src/routes/paths';

import { useSetState } from 'src/hooks/use-set-state';

import { DashboardContent } from 'src/layouts/dashboard';

import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
import { createFilterField } from 'src/components/generic-table/table-filter-fields';
import { FlexibleTableFiltersResult } from 'src/components/generic-table/table-filters-result';
import { FlexibleTableToolbar } from 'src/components/generic-table/table-toolbar';
import { StatusTabsFilterWrapper } from 'src/components/generic-table/tabs-filter-wrapper';
import { Scrollbar } from 'src/components/scrollbar';
import { TableHeadCustom, TableNoData, TablePaginationCustom, useTable } from 'src/components/table';

import { EventTableRow } from '../event-table-row';
import { EVENT_STATUS_OPTIONS, EVENT_VISIBILITY_OPTIONS } from '../event-status';
import { EVENTS } from '../mocks/data';

const STATUS_OPTIONS = [{ value: 'all', label: 'All', color: 'default' }, ...EVENT_STATUS_OPTIONS];

const TABLE_HEAD = [
  { id: 'sr', label: 'Sr#', width: 70 },
  { id: 'name', label: 'Event', minWidth: 240 },
  { id: 'host', label: 'Host', minWidth: 220 },
  { id: 'date', label: 'Date', width: 120 },
  { id: 'location', label: 'Location', minWidth: 160 },
  { id: 'attendees', label: 'Attendees', width: 120, align: 'center' },
  { id: 'visibility', label: 'Visibility', width: 140 },
  { id: 'status', label: 'Status', width: 140, align: 'center' },
];

const DEFAULT_FILTERS = {
  name: '',
  status: 'all',
  host: 'all',
  visibility: 'all',
  location: 'all',
};

const PAGE_LIMIT = 10;

const ALL_OPTION = { value: 'all', label: 'All' };

const FILTER_WIDTH = {
  flexGrow: 1,
  flexBasis: 0,
  minWidth: 180,
};

const uniqueOptions = (rows, key) => [
  ALL_OPTION,
  ...[...new Set(rows.map((row) => row[key]))].map((value) => ({ value, label: value })),
];

export function EventsListView() {
  const table = useTable({ defaultRowsPerPage: PAGE_LIMIT, defaultDense: true });
  const filters = useSetState(DEFAULT_FILTERS);

  const hostOptions = useMemo(() => uniqueOptions(EVENTS, 'host'), []);
  const locationOptions = useMemo(() => uniqueOptions(EVENTS, 'location'), []);

  const filterFields = useMemo(
    () => [
      createFilterField.status({
        options: STATUS_OPTIONS,
        showCounts: true,
      }),
      createFilterField.search({
        key: 'name',
        label: 'Keyword',
        placeholder: 'Search...',
      }),
      createFilterField.select({
        key: 'host',
        label: 'Host',
        options: hostOptions,
        defaultValue: 'all',
        ...FILTER_WIDTH,
      }),
      createFilterField.select({
        key: 'visibility',
        label: 'Visibility',
        options: [ALL_OPTION, ...EVENT_VISIBILITY_OPTIONS],
        defaultValue: 'all',
        ...FILTER_WIDTH,
      }),
      createFilterField.select({
        key: 'location',
        label: 'Location',
        options: locationOptions,
        defaultValue: 'all',
        ...FILTER_WIDTH,
      }),
    ],
    [hostOptions, locationOptions]
  );

  const statusFilterField = useMemo(
    () => filterFields.find((field) => field.type === 'status'),
    [filterFields]
  );

  const toolbarFilterFields = useMemo(
    () => filterFields.filter((field) => field.type !== 'status'),
    [filterFields]
  );

  const searchedRows = useMemo(() => {
    const keyword = filters.state.name.trim().toLowerCase();

    return EVENTS.filter((row) => {
      const matchesKeyword = !keyword || row.name.toLowerCase().includes(keyword);
      const matchesHost = filters.state.host === 'all' || row.host === filters.state.host;
      const matchesVisibility =
        filters.state.visibility === 'all' || row.visibility === filters.state.visibility;
      const matchesLocation = filters.state.location === 'all' || row.location === filters.state.location;

      return matchesKeyword && matchesHost && matchesVisibility && matchesLocation;
    });
  }, [filters.state.host, filters.state.location, filters.state.name, filters.state.visibility]);

  const statusCounts = useMemo(
    () =>
      searchedRows.reduce((counts, row) => {
        counts[row.status] = (counts[row.status] || 0) + 1;
        return counts;
      }, {}),
    [searchedRows]
  );

  const filteredRows = useMemo(() => {
    if (filters.state.status === 'all') return searchedRows;
    return searchedRows.filter((row) => row.status === filters.state.status);
  }, [filters.state.status, searchedRows]);

  const tableData = useMemo(
    () => filteredRows.slice(table.page * PAGE_LIMIT, table.page * PAGE_LIMIT + PAGE_LIMIT),
    [filteredRows, table.page]
  );

  const getStatusCount = useCallback(
    (status) => {
      if (status === 'all') return searchedRows.length;
      return statusCounts[status] || 0;
    },
    [searchedRows.length, statusCounts]
  );

  const activeFilters = useMemo(
    () =>
      filterFields
        .filter((field) => {
          const value = filters.state[field.key];
          if (field.type === 'search') return Boolean(value);
          return value && value !== (field.defaultValue ?? 'all');
        })
        .map((field) => ({
          ...field,
          value: filters.state[field.key],
        })),
    [filterFields, filters.state]
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
      filters.setState({ name: event.target.value });
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
      const field = filterFields.find((item) => item.key === key);
      filters.setState({ [key]: field?.defaultValue ?? '' });
      table.onResetPage();
    },
    [filterFields, filters, table]
  );

  return (
    <DashboardContent maxWidth={false}>
      <CustomBreadcrumbs
        heading="Events"
        links={[{ name: 'Dashboard', href: paths.adminDashboard.root }, { name: 'Events' }]}
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
              <TableHeadCustom order={table.order} orderBy={table.orderBy} headLabel={TABLE_HEAD} />

              <TableBody>
                {tableData.length > 0 ? (
                  tableData.map((row, index) => (
                    <EventTableRow
                      key={row.id}
                      row={row}
                      serialNumber={index + 1 + table.page * PAGE_LIMIT}
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
          rowsPerPage={PAGE_LIMIT}
          rowsPerPageOptions={[]}
          onPageChange={table.onChangePage}
          onChangeDense={table.onChangeDense}
        />
      </Card>
    </DashboardContent>
  );
}
