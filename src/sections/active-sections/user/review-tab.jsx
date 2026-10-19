import { useCallback, useEffect, useMemo } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';

import { createFilterField } from 'src/components/generic-table/table-filter-fields';
import { FlexibleTableToolbar } from 'src/components/generic-table/table-toolbar';
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
import { useGetUserReviewsQuery } from 'src/store/Reducer/users-api';
import { handleApiError } from 'src/utils/errorHandler';

import { ReviewTableRow } from './review-table-row';
import UserLoadingSkeleton from './user-loading-skeleton';
import { UserTableFiltersResult } from './user-table-filters-result';

const TABLE_HEAD = [
  { id: 'sr#', label: 'Sr#', width: 60 },
  { id: 'reviewer', label: 'Reviewer', minWidth: 300 },
  { id: 'review', label: 'Review', minWidth: 400 },
  { id: 'rating', label: 'Rating', minWidth: 220 },
];

const FILTER_FIELDS = [
  createFilterField.search({
    key: 'name',
    placeholder: 'Search...',
  }),
];

const DEFAULT_FILTERS = FILTER_FIELDS.reduce((acc, field) => {
  acc[field.key] = field.defaultValue;
  return acc;
}, {});

const PAGE_LIMIT = 10;

const mapReviewRow = (review) => ({
  id: review?._id,
  name: review?.fromUser?.name || review?.fromHandle || '',
  handle: review?.fromHandle || review?.fromUser?.handle || '',
  image: getDisplayImage(review?.fromUser?.profileIcon),
  review: review?.body || '',
  rating: review?.stars ?? 0,
  fromUserId: review?.fromUserId || review?.fromUser?._id,
});

export function ReviewTab({ toUserId }) {
  const table = useTable({ defaultRowsPerPage: PAGE_LIMIT, defaultDense: true });
  const filters = useSetState(DEFAULT_FILTERS);
  const keyword = useDebounce(filters.state.name, 500);

  const { data, isLoading, isFetching, error } = useGetUserReviewsQuery(
    {
      page: table.page,
      limit: PAGE_LIMIT,
      keyword: keyword.trim() || undefined,
      toUserId,
    },
    { skip: !toUserId }
  );

  useEffect(() => {
    if (error) handleApiError(error);
  }, [error]);

  const toolbarFilterFields = useMemo(
    () => FILTER_FIELDS.filter((field) => field.type !== 'status'),
    []
  );

  const tableData = useMemo(() => (data?.data || []).map(mapReviewRow), [data?.data]);
  const totalRecords = data?.total_length || 0;
  const canReset = !!filters.state.name;

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
                  <ReviewTableRow
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
