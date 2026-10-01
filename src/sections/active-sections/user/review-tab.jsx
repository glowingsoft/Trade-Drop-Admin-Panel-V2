import { useCallback, useMemo, useState } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';


import { useBoolean } from 'src/hooks/use-boolean';
import { useSetState } from 'src/hooks/use-set-state';


import { Scrollbar } from 'src/components/scrollbar';
import {
    TableHeadCustom,
    TableNoData,
    TablePaginationCustom,
    useTable
} from 'src/components/table';

// import { useGetUsersQuery } from 'src/store/Reducer/user-api';
import { createFilterField } from 'src/components/generic-table/table-filter-fields';
import { FlexibleTableToolbar } from 'src/components/generic-table/table-toolbar';
import { ReviewTableRow } from './review-table-row';
import UserLoadingSkeleton from './user-loading-skeleton';
import { UserTableFiltersResult } from './user-table-filters-result';
import { useDebounce } from 'src/hooks/use-debounce';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
    { id: 'sr#', label: 'Sr#', width: 60 },
    { id: "reviewer", label: "Reviewer", minWidth: 300 },
    { id: 'review', label: 'Review', minWidth: 400 },
    { id: 'rating', label: 'Rating', minWidth: 220 },
];

const FILTER_FIELDS = [
    createFilterField.search({
        key: 'name',
        placeholder: 'Search...',
    })
];

const DEFAULT_FILTERS = FILTER_FIELDS.reduce((acc, field) => {
    acc[field.key] = field.defaultValue;
    return acc;
}, {})
// ----------------------------------------------------------------------

export function ReviewTab({ reviews }) {

    const table = useTable();

    const filters = useSetState(DEFAULT_FILTERS);

    const [currentUser, setCurrentUser] = useState(null);

    const openStatusChangeModal = useBoolean();

    const keyword = useDebounce(filters.state.name, 500);

    const isLoading = false;

    const isFetching = false;

    const statusFilterField = useMemo(
        () => FILTER_FIELDS.find((f) => f.type === 'status'),
        []
    );

    // Get toolbar filter fields (exclude status as it's in tabs)
    const toolbarFilterFields = useMemo(
        () => FILTER_FIELDS.filter((f) => f.type !== 'status'),
        []
    );

    // const { data, isLoading, isFetching } = useGetUsersQuery({
    //   page: table.page + 1,
    //   limit: table.rowsPerPage,
    //   keyword: keyword.length > 0 ?
    //     keyword.startsWith('+')
    //       ? keyword.slice(1)
    //       : keyword : undefined,
    //   status: filters.state.status !== "all" ? filters.state.status : undefined,
    // });

    // const apiUsers = data?.data || [];
    const allReviews = reviews || [];

    const searchKeyword = keyword.trim().toLowerCase();

    const apiUsers = allReviews.filter((review) => {
        if (!searchKeyword) return true;

        return (
            review.name?.toLowerCase().includes(searchKeyword) ||
            review.email?.toLowerCase().includes(searchKeyword) ||
            review.review?.toLowerCase().includes(searchKeyword)
        );
    });

    // const meta = data?.meta||{};
    const meta = {};

    const tableData = apiUsers.map((user) => ({
        id: user.id,
        title: user.title,
        name: user.name,
        email: user.email,
        image: user.image,
        review: user.review,
        rating: user.rating,
    }));

    const paginatedData = tableData.slice(
        table.page * table.rowsPerPage,
        table.page * table.rowsPerPage + table.rowsPerPage
    );

    const canReset = !!filters.state.name;

    const handleEditRow = useCallback((user) => {
        setCurrentUser(user);
        openStatusChangeModal.onTrue();
    }, [openStatusChangeModal]);


    const handleCloseStatusChangeModal = useCallback(() => {
        openStatusChangeModal.onFalse();
        setCurrentUser(null);
    }, [openStatusChangeModal]);

    const handleFilterChange = useCallback((key, value) => {
        filters.setState({ [key]: value });
        table.onResetPage();
    }, [filters, table]);

    const handleSearchChange = useCallback((event) => {
        filters.setState({ name: event.target.value });
        table.onResetPage();
    }, [filters, table]);

    return (

        <Card>

            {/* Toolbar with Search */}
            <FlexibleTableToolbar
                filterFields={toolbarFilterFields}
                filterValues={filters.state}
                onFilterChange={handleFilterChange}
                onSearchChange={handleSearchChange}
            />

            {canReset && (
                <UserTableFiltersResult
                    filters={filters}
                    totalResults={tableData.length}
                    onResetPage={table.onResetPage}
                    sx={{ p: 2.5, pt: 0 }}
                />
            )}

            <Box sx={{ position: 'relative' }}>

                <Scrollbar>
                    <Table size={table.dense ? 'small' : 'medium'} >
                        <TableHeadCustom
                            order={table.order}
                            orderBy={table.orderBy}
                            headLabel={TABLE_HEAD}
                            numSelected={table.selected.length}
                        />

                        <TableBody>
                            {(isLoading || isFetching) ?
                                <UserLoadingSkeleton />
                                : paginatedData?.length > 0 ? paginatedData.map((row, index) => (
                                    <ReviewTableRow
                                        key={index}
                                        row={row}
                                        serialNumber={index + 1 + (table.page * table.rowsPerPage)}
                                        selected={table.selected.includes(row.id)}
                                        onEditRow={() => handleEditRow(row)}
                                    />
                                )) :
                                    <TableNoData notFound />
                            }

                        </TableBody>
                    </Table>
                </Scrollbar>
            </Box>

            <TablePaginationCustom
                page={table.page}
                dense={table.dense}
                count={tableData.length}
                rowsPerPage={table.rowsPerPage}
                onPageChange={table.onChangePage}
                onChangeDense={table.onChangeDense}
                onRowsPerPageChange={table.onChangeRowsPerPage}
            />
        </Card>
    )
}
