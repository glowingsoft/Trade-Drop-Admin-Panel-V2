import { useCallback, useEffect, useMemo, useState } from 'react';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableContainer from '@mui/material/TableContainer';

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
import { useGetCirclesQuery } from 'src/store/Reducer/circles-api';
import { varAlpha } from 'src/theme/styles';
import { handleApiError } from 'src/utils/errorHandler';
import { exportToCsv } from 'src/utils/export-to-csv';

import UserLoadingSkeleton from '../../user/user-loading-skeleton';
import { CircleStatCard } from '../circle-stat-card';
import { CircleTableRow } from '../circle-table-row';
import { CIRCLE_PRIVACY_OPTIONS, getCirclePrivacyOption } from '../circle-status';
import { mapCircleListRow } from '../map-circle-list';

const TABLE_HEAD = [
  { id: 'sr', label: 'Sr#', width: 70, align: 'center' },
  { id: 'name', label: 'Name', minWidth: 220 },
  { id: 'purpose', label: 'Purpose', minWidth: 220 },
  { id: 'category', label: 'Category', minWidth: 140 },
  { id: 'city', label: 'City', minWidth: 120 },
  { id: 'privacy', label: 'Privacy', width: 140 },
  { id: 'organizer', label: 'Organizer', minWidth: 180 },
  { id: 'createdAt', label: 'Created At', width: 140 },
  { id: 'updatedAt', label: 'Updated At', width: 140 },
  { id: 'actions', label: '', width: 100 },
];

const DEFAULT_FILTERS = {
  name: '',
  privacy: 'all',
  category: 'all',
};

const PAGE_LIMIT = 20;

const ALL_OPTION = { value: 'all', label: 'All' };

const FILTER_WIDTH = {
  flexGrow: 1,
  flexBasis: 0,
  minWidth: 150,
};

const EXPORT_HEADERS = [
  { key: 'id', label: 'ID' },
  { key: 'name', label: 'Name' },
  { key: 'purpose', label: 'Purpose' },
  { key: 'category', label: 'Category' },
  { key: 'city', label: 'City' },
  { key: 'privacy', label: 'Privacy' },
  { key: 'organizer', label: 'Organizer' },
  { key: 'createdAt', label: 'Created At' },
  { key: 'updatedAt', label: 'Updated At' },
];

const formatPrivacyLabel = (value) =>
  getCirclePrivacyOption(value)?.label ||
  String(value || '')
    .split('-')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join('-');

export function CirclesListView() {
  const table = useTable({ defaultRowsPerPage: PAGE_LIMIT, defaultDense: true });
  const filters = useSetState(DEFAULT_FILTERS);
  const [activeStat, setActiveStat] = useState(null);
  const keyword = useDebounce(filters.state.name, 500);

  const { data, isLoading, isFetching, error } = useGetCirclesQuery({
    page: table.page + 1,
    limit: PAGE_LIMIT,
    keyword: String(keyword || '').trim() || undefined,
    privacy: filters.state.privacy === 'all' ? undefined : filters.state.privacy,
    category: filters.state.category === 'all' ? undefined : filters.state.category,
  });

  useEffect(() => {
    if (error) handleApiError(error);
  }, [error]);

  const tableData = useMemo(() => {
    const list = Array.isArray(data?.data) ? data.data : [];
    return list.map(mapCircleListRow);
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
        title: 'Total Circles',
        value: String(count.total ?? totalRecords ?? 0),
        helper: data?.meta?.totalPages ? `${data.meta.totalPages} pages` : undefined,
        icon: 'solar:users-group-rounded-bold',
      },
      {
        key: 'members',
        title: 'Members',
        value: String(count.members ?? 0),
        icon: 'solar:user-bold',
      },
      {
        key: 'reports',
        title: 'Reports',
        value: String(count.reports ?? 0),
        tone: count.reports > 0 ? 'error' : undefined,
        icon: 'solar:danger-triangle-bold',
      },
      {
        key: 'activePools',
        title: 'Active pools',
        value: String(count.activePools ?? 0),
        icon: 'solar:chart-bold',
      },
    ],
    [count, totalRecords, data?.meta?.totalPages]
  );

  const privacyOptions = useMemo(() => {
    const fromApi = Array.isArray(data?.privacyOptions) ? data.privacyOptions : [];
    const source = fromApi.length
      ? fromApi
      : CIRCLE_PRIVACY_OPTIONS.map((item) => item.value);

    return [
      ALL_OPTION,
      ...source.map((item) => {
        const value = typeof item === 'string' ? item : item?.value || item?.privacy || '';
        const option = CIRCLE_PRIVACY_OPTIONS.find(
          (entry) => entry.value === String(value || '').toLowerCase()
        );
        return {
          value,
          label:
            (typeof item === 'object' && (item.label || item.name)) ||
            option?.label ||
            formatPrivacyLabel(value),
        };
      }).filter((item) => item.value),
    ];
  }, [data?.privacyOptions]);

  const categoryOptions = useMemo(() => {
    const fromApi = Array.isArray(data?.categories) ? data.categories : [];
    return [
      ALL_OPTION,
      ...fromApi
        .map((item) => {
          if (typeof item === 'string') {
            return { value: item, label: formatPrivacyLabel(item) };
          }
          return {
            value: item._id || item.id || item.value || item.name || '',
            label: item.name || item.label || item._id || '—',
          };
        })
        .filter((item) => item.value),
    ];
  }, [data?.categories]);

  const filterFields = useMemo(
    () => [
      createFilterField.search({
        key: 'name',
        label: 'Keyword',
        placeholder: 'Search by Circle name',
      }),
      createFilterField.select({
        key: 'category',
        label: 'Category',
        options: categoryOptions,
        defaultValue: 'all',
        ...FILTER_WIDTH,
      }),
      createFilterField.select({
        key: 'privacy',
        label: 'Privacy',
        options: privacyOptions,
        defaultValue: 'all',
        ...FILTER_WIDTH,
      }),
    ],
    [categoryOptions, privacyOptions]
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
      if (key === 'privacy' && value !== 'invite-only') {
        setActiveStat((prev) => (prev === 'inviteOnly' ? null : prev));
      }
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
      if (key === 'privacy') setActiveStat((prev) => (prev === 'inviteOnly' ? null : prev));
      table.onResetPage();
    },
    [filterFields, filters, table]
  );

  const handleStatClick = useCallback(
    (key) => {
      const next = activeStat === key ? null : key;
      setActiveStat(next);

      if (next === 'reports') {
        filters.setState({ privacy: 'all', category: 'all' });
      } else {
        filters.setState({ privacy: 'all' });
      }

      table.onResetPage();
    },
    [activeStat, filters, table]
  );

  const handleExportCsv = useCallback(() => {
    exportToCsv({
      filename: 'circles',
      headers: EXPORT_HEADERS,
      rows: tableData.map((row) => ({
        ...row,
        privacy: getCirclePrivacyOption(row.privacy)?.label || row.privacy,
      })),
    });
  }, [tableData]);

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
            md: 'repeat(4, minmax(0, 1fr))',
          },
        }}
      >
        {displayStats.map((stat) => (
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
          <Table size={table.dense ? 'small' : 'medium'} sx={{ minWidth: 1280 }}>
            <TableHeadCustom order={table.order} orderBy={table.orderBy} headLabel={TABLE_HEAD} />

            <TableBody>
              {isLoading || isFetching ? (
                <UserLoadingSkeleton />
              ) : tableData.length > 0 ? (
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
