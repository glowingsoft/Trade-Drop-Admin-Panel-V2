import { useCallback, useMemo, useState } from 'react';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableContainer from '@mui/material/TableContainer';

import { paths } from 'src/routes/paths';

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

import { CircleStatCard } from '../circle-stat-card';
import { CircleTableRow } from '../circle-table-row';
import {
  CIRCLE_JOINING_OPTIONS,
  CIRCLE_STATUS_OPTIONS,
  getCircleJoiningOption,
  getCircleStatusOption,
} from '../circle-status';
import { CIRCLE_STATS, CIRCLES } from '../mocks/data';

const TABLE_HEAD = [
  { id: 'sr', label: 'Sr#', width: 70, align: 'center' },
  { id: 'name', label: 'Circle', minWidth: 240 },
  { id: 'category', label: 'Category', minWidth: 150 },
  { id: 'location', label: 'Home area', minWidth: 180 },
  { id: 'joining', label: 'Joining', width: 120 },
  { id: 'members', label: 'Members', width: 110, align: 'center' },
  { id: 'organizer', label: 'Organizers', minWidth: 160 },
  { id: 'events', label: 'Events', width: 100, align: 'center' },
  { id: 'reports', label: 'Reports', width: 100, align: 'center' },
  { id: 'createdAt', label: 'Created', width: 140 },
  { id: 'status', label: 'Status', width: 120 },
  { id: 'actions', label: '', width: 140 },
];

const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest' },
  { value: 'oldest', label: 'Oldest' },
  { value: 'members', label: 'Most members' },
  { value: 'reports', label: 'Most reports' },
];

const DEFAULT_FILTERS = {
  name: '',
  category: 'all',
  joining: 'all',
  location: 'all',
  status: 'all',
  sort: 'newest',
};

const PAGE_LIMIT = 10;

const ALL_OPTION = { value: 'all', label: 'All' };

const FILTER_WIDTH = {
  flexGrow: 1,
  flexBasis: 0,
  minWidth: 150,
};

const uniqueOptions = (rows, key) => [
  ALL_OPTION,
  ...[...new Set(rows.map((row) => row[key]))].map((value) => ({ value, label: value })),
];

const EXPORT_HEADERS = [
  { key: 'code', label: 'Code' },
  { key: 'name', label: 'Circle' },
  { key: 'category', label: 'Category' },
  { key: 'location', label: 'Home area' },
  { key: 'joining', label: 'Joining' },
  { key: 'members', label: 'Members' },
  { key: 'organizer', label: 'Organizers' },
  { key: 'events', label: 'Events' },
  { key: 'reports', label: 'Reports' },
  { key: 'createdAt', label: 'Created' },
  { key: 'status', label: 'Status' },
];

export function CirclesListView() {
  const table = useTable({ defaultRowsPerPage: PAGE_LIMIT, defaultDense: true });
  const filters = useSetState(DEFAULT_FILTERS);
  const [activeStat, setActiveStat] = useState(null);

  const categoryOptions = useMemo(() => uniqueOptions(CIRCLES, 'category'), []);
  const locationOptions = useMemo(() => uniqueOptions(CIRCLES, 'location'), []);

  const filterFields = useMemo(
    () => [
      createFilterField.search({
        key: 'name',
        label: 'Keyword',
        placeholder: 'Search by Circle name, organizer or city',
      }),
      createFilterField.select({
        key: 'category',
        label: 'Category',
        options: categoryOptions,
        defaultValue: 'all',
        ...FILTER_WIDTH,
      }),
      createFilterField.select({
        key: 'joining',
        label: 'Joining',
        options: [ALL_OPTION, ...CIRCLE_JOINING_OPTIONS],
        defaultValue: 'all',
        ...FILTER_WIDTH,
      }),
      createFilterField.select({
        key: 'location',
        label: 'City / country',
        options: locationOptions,
        defaultValue: 'all',
        ...FILTER_WIDTH,
      }),
      createFilterField.select({
        key: 'status',
        label: 'Status',
        options: [ALL_OPTION, ...CIRCLE_STATUS_OPTIONS.filter((option) => option.value !== 'reviewing')],
        defaultValue: 'all',
        ...FILTER_WIDTH,
      }),
      createFilterField.select({
        key: 'sort',
        label: 'Sort',
        options: SORT_OPTIONS,
        defaultValue: 'newest',
        ...FILTER_WIDTH,
      }),
    ],
    [categoryOptions, locationOptions]
  );

  const filteredRows = useMemo(() => {
    const keyword = filters.state.name.trim().toLowerCase();

    const rows = CIRCLES.filter((row) => {
      const matchesKeyword =
        !keyword ||
        row.name.toLowerCase().includes(keyword) ||
        row.code.toLowerCase().includes(keyword) ||
        (row.organizer || '').toLowerCase().includes(keyword) ||
        (row.location || '').toLowerCase().includes(keyword);
      const matchesCategory = filters.state.category === 'all' || row.category === filters.state.category;
      const matchesJoining = filters.state.joining === 'all' || row.joining === filters.state.joining;
      const matchesLocation = filters.state.location === 'all' || row.location === filters.state.location;
      const matchesStatus = filters.state.status === 'all' || row.status === filters.state.status;

      return matchesKeyword && matchesCategory && matchesJoining && matchesLocation && matchesStatus;
    });

    const sorted = [...rows];
    switch (filters.state.sort) {
      case 'oldest':
        sorted.sort((a, b) => a.createdAtSort.localeCompare(b.createdAtSort));
        break;
      case 'members':
        sorted.sort((a, b) => b.members - a.members);
        break;
      case 'reports':
        sorted.sort((a, b) => b.reports - a.reports);
        break;
      default:
        sorted.sort((a, b) => b.createdAtSort.localeCompare(a.createdAtSort));
        break;
    }

    return sorted;
  }, [filters.state]);

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
      if (key === 'status' && value !== 'reported') setActiveStat((prev) => (prev === 'reported' ? null : prev));
      if (key === 'joining' && value !== 'approval') setActiveStat((prev) => (prev === 'inviteOnly' ? null : prev));
      if (key === 'sort' && value !== 'members') setActiveStat((prev) => (prev === 'members' ? null : prev));
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
      if (key === 'joining') setActiveStat((prev) => (prev === 'inviteOnly' ? null : prev));
      if (key === 'sort') setActiveStat((prev) => (prev === 'members' ? null : prev));
      table.onResetPage();
    },
    [filterFields, filters, table]
  );

  const handleStatClick = useCallback(
    (key) => {
      const next = activeStat === key ? null : key;
      setActiveStat(next);

      if (next === 'reported') {
        filters.setState({ status: 'reported', joining: 'all', sort: 'newest' });
      } else if (next === 'inviteOnly') {
        filters.setState({ joining: 'approval', status: 'all', sort: 'newest' });
      } else if (next === 'members') {
        filters.setState({ sort: 'members', status: 'all', joining: 'all' });
      } else if (next === 'inactive') {
        filters.setState({ status: 'all', joining: 'all', sort: 'oldest' });
      } else {
        filters.setState({ status: 'all', joining: 'all', sort: 'newest' });
      }

      table.onResetPage();
    },
    [activeStat, filters, table]
  );

  const handleExportCsv = useCallback(() => {
    exportToCsv({
      filename: 'circles',
      headers: EXPORT_HEADERS,
      rows: filteredRows.map((row) => ({
        ...row,
        joining: getCircleJoiningOption(row.joining)?.label || row.joining,
        organizer: row.organizer,
        status: getCircleStatusOption(row.status)?.label || row.status,
      })),
    });
  }, [filteredRows]);

  return (
    <DashboardContent maxWidth={false}>
      <CustomBreadcrumbs
        heading="Circles"
        links={[{ name: 'Dashboard', href: paths.adminDashboard.root }, { name: 'Circles' }]}
        action={
          <Button variant="outlined" color="inherit" startIcon={<Iconify icon="solar:export-bold" />} onClick={handleExportCsv}>
            Export CSV
          </Button>
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
        {CIRCLE_STATS.map((stat) => (
          <CircleStatCard
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
          <Table size={table.dense ? 'small' : 'medium'} sx={{ minWidth: 1280 }}>
            <TableHeadCustom order={table.order} orderBy={table.orderBy} headLabel={TABLE_HEAD} />

            <TableBody>
              {tableData.length > 0 ? (
                tableData.map((row, index) => (
                  <CircleTableRow
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
    </DashboardContent>
  );
}
