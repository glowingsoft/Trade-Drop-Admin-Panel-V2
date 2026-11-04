import { useCallback, useEffect, useMemo, useState } from 'react';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import MenuItem from '@mui/material/MenuItem';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableContainer from '@mui/material/TableContainer';
import TextField from '@mui/material/TextField';

import { useNavigate } from 'react-router-dom';

import { paths } from 'src/routes/paths';

import { useDebounce } from 'src/hooks/use-debounce';
import { useSetState } from 'src/hooks/use-set-state';

import { DashboardContent } from 'src/layouts/dashboard';

import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
import { createFilterField } from 'src/components/generic-table/table-filter-fields';
import { FlexibleTableFiltersResult } from 'src/components/generic-table/table-filters-result';
import { FlexibleTableToolbar } from 'src/components/generic-table/table-toolbar';
import { Iconify } from 'src/components/iconify';
import { TableHeadCustom, TableNoData, TablePaginationCustom, useTable } from 'src/components/table';
import { useGetEventsQuery } from 'src/store/Reducer/events-api';
import { varAlpha } from 'src/theme/styles';
import { exportToCsv } from 'src/utils/export-to-csv';
import { handleApiError } from 'src/utils/errorHandler';

import UserLoadingSkeleton from '../../user/user-loading-skeleton';
import { EVENT_STATUS_OPTIONS, getEventStatusOption } from '../event-status';
import { EventStatCard } from '../event-stat-card';
import { EventTableRow } from '../event-table-row';
import { mapEventListRow } from '../map-event-list';
import { EventsCalendarPanel } from './events-calendar-view';

const TABLE_HEAD = [
  { id: 'sr', label: 'Sr#', width: 70, align: 'center' },
  { id: 'name', label: 'Event', minWidth: 240 },
  { id: 'purpose', label: 'Purpose', minWidth: 220 },
  { id: 'circleName', label: 'Hosting Circle', minWidth: 180 },
  { id: 'organizer', label: 'Organizer', minWidth: 160 },
  { id: 'date', label: 'Date', minWidth: 120 },
  { id: 'time', label: 'Time', minWidth: 140 },
  { id: 'publicArea', label: 'Public area', minWidth: 160 },
  { id: 'exactMeetingPoint', label: 'Meeting point', minWidth: 180 },
  { id: 'locationType', label: 'Location type', width: 120 },
  { id: 'audience', label: 'Audience', width: 120 },
  { id: 'joining', label: 'Joining', width: 120 },
  { id: 'rsvpCount', label: 'RSVP', width: 90, align: 'center' },
  { id: 'capacity', label: 'Capacity', width: 100, align: 'center' },
  { id: 'status', label: 'Status', width: 120 },
  { id: 'createdAt', label: 'Created At', width: 140 },
  { id: 'updatedAt', label: 'Updated At', width: 140 },
  { id: 'actions', label: '', width: 140 },
];

const DEFAULT_FILTERS = {
  name: '',
  status: 'all',
};

const PAGE_LIMIT = 20;

const ALL_OPTION = { value: 'all', label: 'All' };

const LIST_STATUS_OPTIONS = [
  ALL_OPTION,
  ...EVENT_STATUS_OPTIONS.filter((option) =>
    ['published', 'upcoming', 'ongoing', 'cancelled', 'reported'].includes(option.value)
  ),
];

const EXPORT_HEADERS = [
  { key: 'name', label: 'Event' },
  { key: 'purpose', label: 'Purpose' },
  { key: 'circleName', label: 'Hosting Circle' },
  { key: 'organizer', label: 'Organizer' },
  { key: 'organizerHandle', label: 'Organizer handle' },
  { key: 'date', label: 'Date' },
  { key: 'time', label: 'Time' },
  { key: 'publicArea', label: 'Public area' },
  { key: 'exactMeetingPoint', label: 'Meeting point' },
  { key: 'locationType', label: 'Location type' },
  { key: 'audienceLabel', label: 'Audience' },
  { key: 'joiningLabel', label: 'Joining' },
  { key: 'rsvpCount', label: 'RSVP' },
  { key: 'capacity', label: 'Capacity' },
  { key: 'statusLabel', label: 'Status' },
  { key: 'createdAt', label: 'Created At' },
  { key: 'updatedAt', label: 'Updated At' },
];

export function EventsListView() {
  const navigate = useNavigate();
  const table = useTable({ defaultRowsPerPage: PAGE_LIMIT, defaultDense: true });
  const filters = useSetState(DEFAULT_FILTERS);
  const [activeStat, setActiveStat] = useState(null);
  const [viewMode, setViewMode] = useState('list');
  const keyword = useDebounce(filters.state.name, 500);

  const { data, isLoading, isFetching, error } = useGetEventsQuery({
    page: table.page + 1,
    limit: PAGE_LIMIT,
    keyword: String(keyword || '').trim() || undefined,
    status: filters.state.status === 'all' ? undefined : filters.state.status,
  });

  useEffect(() => {
    if (error) handleApiError(error);
  }, [error]);

  const tableData = useMemo(() => {
    const list = Array.isArray(data?.data) ? data.data : [];
    return list.map(mapEventListRow);
  }, [data?.data]);

  const totalRecords = data?.total_length || 0;

  useEffect(() => {
    table.onResetPage();
  }, [keyword]);

  useEffect(() => {
    const maxPage = Math.max(0, Math.ceil(totalRecords / PAGE_LIMIT) - 1);
    if (table.page > maxPage) {
      table.setPage(maxPage);
    }
  }, [totalRecords, table.page, table.setPage]);
  const count = data?.count || {};

  const displayStats = useMemo(
    () => [
      {
        key: 'total',
        title: 'Total Events',
        value: String(count.total ?? totalRecords ?? 0),
        icon: 'solar:calendar-bold',
      },
      {
        key: 'upcoming',
        title: 'Upcoming',
        value: String(count.upcoming ?? 0),
        icon: 'solar:calendar-mark-bold',
      },
      {
        key: 'ongoing',
        title: 'Ongoing',
        value: String(count.ongoing ?? 0),
        icon: 'solar:play-circle-bold',
      },
      {
        key: 'cancelled',
        title: 'Cancelled',
        value: String(count.cancelled ?? 0),
        icon: 'solar:close-circle-bold',
      },
      {
        key: 'reports',
        title: 'Reports',
        value: String(count.reports ?? 0),
        tone: Number(count.reports) > 0 ? 'error' : undefined,
        icon: 'solar:danger-triangle-bold',
      },
    ],
    [count, totalRecords]
  );

  const filterFields = useMemo(
    () => [
      createFilterField.search({
        key: 'name',
        label: 'Keyword',
        placeholder: 'Search by event, circle or organizer',
      }),
    ],
    []
  );

  const activeFilters = useMemo(() => {
    const items = [];
    if (filters.state.name) {
      items.push({
        key: 'name',
        type: 'search',
        label: 'Keyword',
        value: filters.state.name,
      });
    }
    if (filters.state.status && filters.state.status !== 'all') {
      items.push({
        key: 'status',
        type: 'select',
        label: 'Status',
        value: filters.state.status,
        options: LIST_STATUS_OPTIONS,
        defaultValue: 'all',
      });
    }
    return items;
  }, [filters.state.name, filters.state.status]);

  const handleFilterChange = useCallback(
    (key, value) => {
      filters.setState({ [key]: value });
      if (key === 'status') {
        setActiveStat((prev) => {
          if (!value || value === 'all') return null;
          if (['upcoming', 'ongoing', 'cancelled', 'reported'].includes(value)) return value;
          return prev === value ? prev : null;
        });
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
      if (key === 'status') {
        filters.setState({ status: 'all' });
        setActiveStat(null);
      } else if (key === 'name') {
        filters.setState({ name: '' });
      }
      table.onResetPage();
    },
    [filters, table]
  );

  const handleStatClick = useCallback(
    (key) => {
      const next = activeStat === key ? null : key;
      setActiveStat(next);

      if (next === 'upcoming' || next === 'ongoing' || next === 'cancelled') {
        filters.setState({ status: next });
      } else if (next === 'reports') {
        filters.setState({ status: 'reported' });
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
      rows: tableData.map((row) => ({
        ...row,
        statusLabel: getEventStatusOption(row.status)?.label || row.statusLabel || row.status,
      })),
    });
  }, [tableData]);

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
        {displayStats.map((stat) => (
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
          events={tableData}
          onEventClick={(id) => {
            const row = tableData.find((item) => item.id === id);
            navigate(paths.adminDashboard.eventDetails(id), {
              state: row ? { eventPreview: row } : undefined,
            });
          }}
        />
      ) : (
        <Card sx={{ minWidth: 0, overflow: 'hidden' }}>
          <FlexibleTableToolbar
            size="small"
            filterFields={filterFields}
            filterValues={filters.state}
            onFilterChange={handleFilterChange}
            onSearchChange={handleSearchChange}
            slots={{
              afterFilters: (
                <TextField
                  select
                  size="small"
                  label="Status"
                  value={filters.state.status}
                  onChange={(event) => handleFilterChange('status', event.target.value)}
                  sx={{
                    width: { xs: 1, md: 220 },
                    minWidth: { md: 200 },
                    flexShrink: 0,
                  }}
                >
                  {LIST_STATUS_OPTIONS.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </TextField>
              ),
            }}
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
              sx={{ minWidth: 2100, '& .MuiTableCell-head': { whiteSpace: 'nowrap' } }}
            >
              <TableHeadCustom order={table.order} orderBy={table.orderBy} headLabel={TABLE_HEAD} />

              <TableBody>
                {isLoading || isFetching ? (
                  <UserLoadingSkeleton />
                ) : tableData.length > 0 ? (
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
            count={totalRecords}
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
