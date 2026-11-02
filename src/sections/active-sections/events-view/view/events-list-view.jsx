import { useCallback, useMemo, useState } from 'react';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableContainer from '@mui/material/TableContainer';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { useSetState } from 'src/hooks/use-set-state';

import { DashboardContent } from 'src/layouts/dashboard';

import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
import { createFilterField } from 'src/components/generic-table/table-filter-fields';
import { FlexibleTableFiltersResult } from 'src/components/generic-table/table-filters-result';
import { FlexibleTableToolbar } from 'src/components/generic-table/table-toolbar';
import { Iconify } from 'src/components/iconify';
import { TableHeadCustom, TableNoData, TablePaginationCustom, useTable } from 'src/components/table';
import { varAlpha } from 'src/theme/styles';
import { exportToCsv } from 'src/utils/export-to-csv';

import { EVENT_AUDIENCE_OPTIONS, EVENT_STATUS_OPTIONS, getEventStatusOption } from '../event-status';
import { EventStatCard } from '../event-stat-card';
import { EventTableRow } from '../event-table-row';
import { EVENT_STATS, EVENTS } from '../mocks/data';
import { EventsCalendarPanel } from './events-calendar-view';

const TABLE_HEAD = [
  { id: 'sr', label: 'Sr#', width: 70, align: 'center' },
  { id: 'name', label: 'Event', minWidth: 240 },
  { id: 'host', label: 'Hosting Circle', minWidth: 180 },
  { id: 'organizer', label: 'Organizer', minWidth: 140 },
  { id: 'dateTime', label: 'Date & time', minWidth: 200 },
  { id: 'location', label: 'Public area', minWidth: 160 },
  { id: 'audience', label: 'Audience · Joining', minWidth: 160 },
  { id: 'going', label: 'Going / cap', width: 130, minWidth: 130, align: 'center' },
  { id: 'waitlist', label: 'Waitlist', width: 100, align: 'center' },
  { id: 'reports', label: 'Reports', width: 100, align: 'center' },
  { id: 'status', label: 'Status', width: 120 },
  { id: 'actions', label: '', width: 140 },
];

const DEFAULT_FILTERS = {
  name: '',
  host: 'all',
  location: 'all',
  audience: 'all',
  status: 'all',
};

const PAGE_LIMIT = 10;

const ALL_OPTION = { value: 'all', label: 'All' };

const FILTER_WIDTH = {
  flexGrow: 1,
  flexBasis: 0,
  minWidth: 150,
};

const LIST_STATUS_OPTIONS = EVENT_STATUS_OPTIONS.filter((option) =>
  ['published', 'full', 'reported', 'cancelled'].includes(option.value)
);

const uniqueOptions = (rows, key) => [
  ALL_OPTION,
  ...[...new Set(rows.map((row) => row[key]))].map((value) => ({ value, label: value })),
];

const EXPORT_HEADERS = [
  { key: 'code', label: 'Code' },
  { key: 'name', label: 'Event' },
  { key: 'host', label: 'Hosting Circle' },
  { key: 'organizer', label: 'Organizer' },
  { key: 'dateTime', label: 'Date & time' },
  { key: 'location', label: 'Public area' },
  { key: 'audience', label: 'Audience' },
  { key: 'joining', label: 'Joining' },
  { key: 'goingCap', label: 'Going / cap' },
  { key: 'waitlist', label: 'Waitlist' },
  { key: 'reports', label: 'Reports' },
  { key: 'status', label: 'Status' },
];

export function EventsListView() {
  const router = useRouter();
  const table = useTable({ defaultRowsPerPage: PAGE_LIMIT, defaultDense: true });
  const filters = useSetState(DEFAULT_FILTERS);
  const [activeStat, setActiveStat] = useState(null);
  const [viewMode, setViewMode] = useState('list');

  const hostOptions = useMemo(() => uniqueOptions(EVENTS, 'host'), []);
  const locationOptions = useMemo(() => uniqueOptions(EVENTS, 'location'), []);

  const filterFields = useMemo(
    () => [
      createFilterField.search({
        key: 'name',
        label: 'Keyword',
        placeholder: 'Search by event, Circle or organizer',
      }),
      createFilterField.select({
        key: 'host',
        label: 'Hosting Circle',
        options: hostOptions,
        defaultValue: 'all',
        ...FILTER_WIDTH,
      }),
      createFilterField.select({
        key: 'location',
        label: 'City',
        options: locationOptions,
        defaultValue: 'all',
        ...FILTER_WIDTH,
      }),
      createFilterField.select({
        key: 'audience',
        label: 'Audience',
        options: [ALL_OPTION, ...EVENT_AUDIENCE_OPTIONS],
        defaultValue: 'all',
        ...FILTER_WIDTH,
      }),
      createFilterField.select({
        key: 'status',
        label: 'Status',
        options: [ALL_OPTION, ...LIST_STATUS_OPTIONS],
        defaultValue: 'all',
        ...FILTER_WIDTH,
      }),
    ],
    [hostOptions, locationOptions]
  );

  const filteredRows = useMemo(() => {
    const keyword = filters.state.name.trim().toLowerCase();

    return EVENTS.filter((row) => {
      const matchesKeyword =
        !keyword ||
        row.name.toLowerCase().includes(keyword) ||
        row.code.toLowerCase().includes(keyword) ||
        (row.host || '').toLowerCase().includes(keyword) ||
        (row.organizer || '').toLowerCase().includes(keyword);
      const matchesHost = filters.state.host === 'all' || row.host === filters.state.host;
      const matchesLocation = filters.state.location === 'all' || row.location === filters.state.location;
      const matchesAudience = filters.state.audience === 'all' || row.audience === filters.state.audience;
      const matchesStatus = filters.state.status === 'all' || row.status === filters.state.status;
      const matchesReportedStat = activeStat !== 'reported' || row.reports > 0 || row.status === 'reported';
      const matchesFullStat = activeStat !== 'thisWeek' || row.status === 'full' || row.going >= row.capacity;
      const matchesCancelledStat = activeStat !== 'cancelled' || row.status === 'cancelled';

      return (
        matchesKeyword &&
        matchesHost &&
        matchesLocation &&
        matchesAudience &&
        matchesStatus &&
        matchesReportedStat &&
        matchesFullStat &&
        matchesCancelledStat
      );
    }).sort((a, b) => b.dateSort.localeCompare(a.dateSort));
  }, [activeStat, filters.state]);

  const tableData = useMemo(
    () => filteredRows.slice(table.page * PAGE_LIMIT, table.page * PAGE_LIMIT + PAGE_LIMIT),
    [filteredRows, table.page]
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
      if (key === 'status' && value !== 'reported') {
        setActiveStat((prev) => (prev === 'reported' ? null : prev));
      }
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
    setActiveStat(null);
    table.onResetPage();
  }, [filters, table]);

  const handleRemoveFilter = useCallback(
    (key) => {
      const field = filterFields.find((item) => item.key === key);
      filters.setState({ [key]: field?.defaultValue ?? '' });
      if (key === 'status') setActiveStat((prev) => (prev === 'reported' ? null : prev));
      table.onResetPage();
    },
    [filterFields, filters, table]
  );

  const handleStatClick = useCallback(
    (key) => {
      const next = activeStat === key ? null : key;
      setActiveStat(next);

      if (next === 'reported') {
        filters.setState({ status: 'reported' });
      } else if (next === 'cancelled') {
        filters.setState({ status: 'cancelled' });
      } else if (next === 'thisWeek') {
        filters.setState({ status: 'full' });
      } else {
        filters.setState({ status: 'all' });
      }

      table.onResetPage();
    },
    [activeStat, filters, table]
  );

  const handleExportCsv = useCallback(() => {
    exportToCsv({
      filename: 'events',
      headers: EXPORT_HEADERS,
      rows: filteredRows.map((row) => ({
        ...row,
        goingCap: `${row.going ?? 0} / ${row.capacity ?? 0}`,
        status: getEventStatusOption(row.status)?.label || row.status,
      })),
    });
  }, [filteredRows]);

  return (
    <DashboardContent maxWidth={false}>
      <CustomBreadcrumbs
        heading="Events"
        links={[{ name: 'Dashboard', href: paths.adminDashboard.root }, { name: 'Events' }]}
        action={
          <Stack direction="row" spacing={1.5}>
            <Button
              variant={viewMode === 'calendar' ? 'contained' : 'outlined'}
              color="inherit"
              startIcon={<Iconify icon={viewMode === 'calendar' ? 'solar:list-bold' : 'solar:calendar-bold'} />}
              onClick={() => setViewMode((prev) => (prev === 'list' ? 'calendar' : 'list'))}
            >
              {viewMode === 'calendar' ? 'List view' : 'Calendar view'}
            </Button>
            <Button
              variant="outlined"
              color="inherit"
              startIcon={<Iconify icon="solar:export-bold" />}
              onClick={handleExportCsv}
            >
              Export CSV
            </Button>
          </Stack>
        }
        sx={{ mb: 3 }}
      />

      <Box
        sx={{
          mb: 3,
          display: 'grid',
          gap: 2,
          gridTemplateColumns: {
            xs: '1fr',
            sm: 'repeat(2, minmax(0, 1fr))',
            md: 'repeat(5, minmax(0, 1fr))',
          },
        }}
      >
        {EVENT_STATS.map((stat) => (
          <EventStatCard
            key={stat.key}
            title={stat.title}
            value={stat.value}
            helper={stat.helper}
            tone={stat.tone}
            icon={stat.icon}
            selected={activeStat === stat.key}
            onClick={() => handleStatClick(stat.key)}
          />
        ))}
      </Box>

      {viewMode === 'calendar' ? (
        <EventsCalendarPanel
          events={filteredRows}
          onEventClick={(id) => router.push(paths.adminDashboard.eventDetails(id))}
        />
      ) : (
        <Card sx={{ minWidth: 0, overflow: 'hidden' }}>
          <FlexibleTableToolbar
            size="small"
            filterFields={filterFields}
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

          <TableContainer
            sx={{
              width: 1,
              minWidth: 0,
              overflowX: 'auto',
              scrollbarWidth: 'thin',
              scrollbarColor: (theme) =>
                `${varAlpha(theme.vars.palette.text.disabledChannel, 0.4)} ${varAlpha(theme.vars.palette.text.disabledChannel, 0.08)}`,
              '&::-webkit-scrollbar': {
                height: 8,
              },
              '&::-webkit-scrollbar-thumb': {
                borderRadius: 8,
                backgroundColor: (theme) => varAlpha(theme.vars.palette.text.disabledChannel, 0.4),
              },
              '&::-webkit-scrollbar-track': {
                borderRadius: 8,
                backgroundColor: (theme) => varAlpha(theme.vars.palette.text.disabledChannel, 0.08),
              },
            }}
          >
            <Table
              size={table.dense ? 'small' : 'medium'}
              sx={{ minWidth: 1400, '& .MuiTableCell-head': { whiteSpace: 'nowrap' } }}
            >
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
          </TableContainer>

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
      )}
    </DashboardContent>
  );
}
