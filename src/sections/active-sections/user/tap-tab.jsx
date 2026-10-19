import { useCallback, useEffect, useMemo, useState } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';

import { createFilterField } from 'src/components/generic-table/table-filter-fields';
import { FlexibleTableToolbar } from 'src/components/generic-table/table-toolbar';
import { StatusTabsFilterWrapper } from 'src/components/generic-table/tabs-filter-wrapper';
import { Scrollbar } from 'src/components/scrollbar';
import {
  TableHeadCustom,
  TableNoData,
  TablePaginationCustom,
  useTable,
} from 'src/components/table';
import { getDisplayImage } from 'src/constants/upload';
import { useDebounce } from 'src/hooks/use-debounce';
import { useSetState } from 'src/hooks/use-set-state';
import { useGetTapInsQuery } from 'src/store/Reducer/tapins-api';
import { handleApiError } from 'src/utils/errorHandler';

import { TAP_STATUS_OPTIONS } from './tap-status';
import { TapTableRow } from './tap-table-row';
import UserLoadingSkeleton from './user-loading-skeleton';
import { UserTableFiltersResult } from './user-table-filters-result';

const STATUS_OPTIONS = [{ value: 'all', label: 'All', color: 'default' }, ...TAP_STATUS_OPTIONS];

const TABLE_HEAD = [
  { id: 'sr#', label: 'Sr#', width: 60 },
  { id: 'with', label: 'With', minWidth: 200 },
  { id: 'drop', label: 'Drop', minWidth: 220 },
  { id: 'category', label: 'Category', minWidth: 180 },
  { id: 'city', label: 'City', minWidth: 140 },
  { id: 'urgency', label: 'Urgency', width: 120, align: 'center' },
  { id: 'status', label: 'Status', width: 120, align: 'center' },
  // { id: 'actions', label: 'Actions', width: 100, align: 'center' },
];

const DEFAULT_FILTERS = {
  name: '',
  status: 'all',
  categories: 'all',
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

const mapTapRow = (tap, categoryNameById, timingLabelById) => {
  const need = categoryNameById[tap?.drop?.needCategoryId];
  const offer = categoryNameById[tap?.drop?.offerCategoryId];

  return {
    id: tap?._id,
    title: [tap?.drop?.needText, tap?.drop?.offerText].filter(Boolean).join(' → '),
    name: tap?.owner?.name || tap?.ownerHandle || '',
    email: tap?.owner?.email || '',
    image: getDisplayImage(tap?.owner?.profileIcon),
    category: [need, offer].filter(Boolean).join(' → '),
    city: tap?.drop?.areaLabel || '',
    urgency: timingLabelById[tap?.drop?.timingChip] || tap?.availability || '',
    status: tap?.status || '',
    ownerId: tap?.ownerId || tap?.owner?._id,
  };
};

export function TapTab({ applicantId }) {
  const table = useTable({ defaultRowsPerPage: PAGE_LIMIT, defaultDense: true });
  const filters = useSetState(DEFAULT_FILTERS);
  const keyword = useDebounce(filters.state.name, 500);

  const { data, isLoading, isFetching, error } = useGetTapInsQuery(
    {
      page: table.page,
      limit: PAGE_LIMIT,
      applicantId,
      category: filters.state.categories === 'all' ? undefined : filters.state.categories,
      timingChip: filters.state.urgency === 'all' ? undefined : filters.state.urgency,
      status: filters.state.status === 'all' ? undefined : filters.state.status,
      keyword: keyword.trim() || undefined,
    },
    { skip: !applicantId }
  );

  useEffect(() => {
    if (error) handleApiError(error);
  }, [error]);

  const tableData = useMemo(() => {
    const categories = data?.meta?.categories || [];
    const timingChips = data?.meta?.timingChips || [];
    const categoryNameById = Object.fromEntries(
      categories.filter((item) => item?._id).map((item) => [item._id, item.name])
    );
    const timingLabelById = Object.fromEntries(
      timingChips.filter((item) => item?._id).map((item) => [item._id, item.label])
    );

    return (data?.data || []).map((tap) => mapTapRow(tap, categoryNameById, timingLabelById));
  }, [data]);

  const totalRecords = data?.total_length || 0;
  const statusCounts = data?.meta?.counts || {};
  const meta = data?.meta || {};

  const [catalogFilters, setCatalogFilters] = useState({
    categories: [ALL_OPTION],
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
      timingChips: mergeSelectOptions(
        previous.timingChips,
        meta.timingChips,
        (item) => item._id,
        (item) => item.label
      ),
    }));
  }, [meta.categories, meta.timingChips]);

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
        key: 'urgency',
        label: 'Urgency',
        options: catalogFilters.timingChips,
        defaultValue: 'all',
      }),
    ],
    [catalogFilters]
  );

  const statusFilterField = useMemo(
    () => filterFields.find((field) => field.type === 'status'),
    [filterFields]
  );

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
    filters.state.urgency !== 'all';

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

  return (
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
                  <TapTableRow
                    key={row.id}
                    row={row}
                    serialNumber={index + 1 + table.page * PAGE_LIMIT}
                    selected={table.selected.includes(row.id)}
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
  );
}
