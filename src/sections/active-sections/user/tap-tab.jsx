import { useCallback, useMemo, useState } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';


import { useBoolean } from 'src/hooks/use-boolean';
import { useSetState } from 'src/hooks/use-set-state';

import { DROPS_STATUS_OPTIONS } from 'src/_mock';

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
import { StatusTabsFilterWrapper } from 'src/components/generic-table/tabs-filter-wrapper';
import { CATEGORIES_OPTIONS, URGENT_OPTIONS } from './mocks/data';
import { TapTableRow } from './tap-table-row';
import UserLoadingSkeleton from './user-loading-skeleton';
import { UserTableFiltersResult } from './user-table-filters-result';
import { useDebounce } from 'src/hooks/use-debounce';
import { slugify } from 'src/utils/helper';

// ----------------------------------------------------------------------


const STATUS_OPTIONS = [{ value: 'all', label: 'All' }, ...DROPS_STATUS_OPTIONS];

const TABLE_HEAD = [
    { id: 'sr#', label: 'Sr#', width: 60 },
    { id: "with", label: "With", minWidth: 200 },
    { id: 'drop', label: 'Drop', minWidth: 220 },
    { id: 'category', label: 'Category', minWidth: 180 },
    { id: 'city', label: 'City', minWidth: 160 },
    { id: 'urgency', label: 'Urgency', width: 120, align: 'center' },
    { id: 'status', label: 'Status', width: 120, align: 'center' },
    { id: 'actions', label: 'Actions', width: 100, align: 'center' },
];

const FILTER_FIELDS = [
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
        options: CATEGORIES_OPTIONS,
        defaultValue: 'all',
    }),

    createFilterField.select({
        key: 'urgency',
        label: 'Urgency',
        options: URGENT_OPTIONS,
        defaultValue: 'all',
    }),
];

const DEFAULT_FILTERS = FILTER_FIELDS.reduce((acc, field) => {
    acc[field.key] = field.defaultValue;
    return acc;
}, {})
// ----------------------------------------------------------------------

export function TapTab({ droplist }) {

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
    const allDrops = droplist || [];

    const searchKeyword = keyword.trim().toLowerCase();

    const apiUsers = allDrops.filter((drop) => {
        const matchesStatus =
            filters.state.status === 'all' ||
            (drop.status || 'live').toLowerCase() === filters.state.status;

        const matchesCategory =
            !filters.state.categories ||
            filters.state.categories === 'all' ||
            slugify(drop.category) === filters.state.categories;

        const matchesUrgency =
            !filters.state.urgency ||
            filters.state.urgency === 'all' ||
            slugify(drop.urgency) === filters.state.urgency;

        const matchesSearch =
            !searchKeyword ||
            drop.title?.toLowerCase().includes(searchKeyword) ||
            drop.name?.toLowerCase().includes(searchKeyword) ||
            drop.email?.toLowerCase().includes(searchKeyword) ||
            drop.category?.toLowerCase().includes(searchKeyword) ||
            drop.area?.toLowerCase().includes(searchKeyword);

        return matchesStatus && matchesCategory && matchesUrgency && matchesSearch;
    });

    // const meta = data?.meta||{};
    const meta = {};

    const tableData = apiUsers.map((user) => ({
        id: user.id,
        title: user.title,
        name:user.name,
        email: user.email,
        image: user.image,
        category: user.category,
        status: user.status || 'Active',
        city: user.area,
        urgency: user.urgency || '—',
    }));

    const paginatedData = tableData.slice(
        table.page * table.rowsPerPage,
        table.page * table.rowsPerPage + table.rowsPerPage
    );

    const getStatusCount = useCallback((status) => {
        if (status === 'all') {
            return allDrops.length;
        }

        return allDrops.filter((drop) => (drop.status || 'live').toLowerCase() === status).length;
    },
        [allDrops]
    );


    const canReset =
        !!filters.state.name ||
        filters.state.status !== 'all' ||
        filters.state.categories !== 'all' ||
        filters.state.urgency !== 'all';

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

            <StatusTabsFilterWrapper
                filterField={statusFilterField}
                value={filters.state.status}
                onChange={handleFilterChange}
                getCount={getStatusCount}
            />


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
                                    <TapTableRow
                                        key={row.id}
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
