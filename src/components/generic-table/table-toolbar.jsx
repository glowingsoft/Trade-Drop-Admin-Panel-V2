import { memo } from 'react';
import PropTypes from 'prop-types';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import MenuItem from '@mui/material/MenuItem';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { Iconify } from 'src/components/iconify';
import { FILTER_FIELD_TYPES } from './table-filter-fields';

const FilterField = memo(({ field, value, onChange, onSearchChange, size = 'medium' }) => {
    const compact = size === 'small';

    switch (field.type) {
        case FILTER_FIELD_TYPES.SEARCH:
            return (
                <TextField
                    fullWidth
                    size={size}
                    value={value}
                    onChange={onSearchChange || ((e) => onChange(field.key, e.target.value))}
                    placeholder={field.placeholder}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <Iconify
                                    icon="eva:search-fill"
                                    sx={{
                                        color: 'text.disabled',
                                        ...(compact && { width: 18, height: 18 }),
                                    }}
                                />
                            </InputAdornment>
                        ),
                    }}
                />
            );

        case FILTER_FIELD_TYPES.DATE:
            return (
                <DatePicker
                    label={field.label}
                    value={value}
                    onChange={(newValue) => onChange(field.key, newValue)}
                    format={field.pickerFormat || 'DD/MM/YYYY'}
                    slotProps={{
                        textField: {
                            fullWidth: true,
                            size,
                            placeholder: field.placeholder,
                        },
                    }}
                />
            );

        case FILTER_FIELD_TYPES.DATE_RANGE:
            return (
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={compact ? 1.5 : 2} sx={{ width: 1 }}>
                    <DatePicker
                        label={field.startLabel}
                        value={value?.startDate || null}
                        onChange={(newValue) =>
                            onChange(field.key, { ...value, startDate: newValue })
                        }
                        format={field.pickerFormat || 'DD/MM/YYYY'}
                        slotProps={{
                            textField: {
                                fullWidth: true,
                                size,
                            },
                        }}
                    />
                    <DatePicker
                        label={field.endLabel}
                        value={value?.endDate || null}
                        onChange={(newValue) =>
                            onChange(field.key, { ...value, endDate: newValue })
                        }
                        format={field.pickerFormat || 'DD/MM/YYYY'}
                        slotProps={{
                            textField: {
                                fullWidth: true,
                                size,
                            },
                        }}
                    />
                </Stack>
            );

        case FILTER_FIELD_TYPES.SELECT:
            return (
                <TextField
                    select
                    fullWidth
                    size={size}
                    label={field.label}
                    value={value ?? field.defaultValue ?? ''}
                    onChange={(e) => onChange(field.key, e.target.value)}
                    placeholder={field.placeholder}
                >
                    {field.options.map((option) => (
                        <MenuItem key={option.value} value={option.value}>
                            {option.label}
                        </MenuItem>
                    ))}
                </TextField>
            );

        case FILTER_FIELD_TYPES.CUSTOM:
            const CustomComponent = field.component;
            return (
                <CustomComponent
                    value={value}
                    onChange={(newValue) => onChange(field.key, newValue)}
                    {...field.componentProps}
                />
            );

        default:
            return null;
    }
});

FilterField.displayName = 'FilterField';

FilterField.propTypes = {
    field: PropTypes.object.isRequired,
    value: PropTypes.any,
    onChange: PropTypes.func.isRequired,
    onSearchChange: PropTypes.func,
    size: PropTypes.oneOf(['small', 'medium']),
};


export const FlexibleTableToolbar = memo(({
    filterFields = [],
    filterValues = {},
    onFilterChange,
    onSearchChange,
    slots = {},
    size = 'medium',
}) => {
    const searchField = filterFields.find((f) => f.type === FILTER_FIELD_TYPES.SEARCH);
    const otherFields = filterFields.filter((f) => f.type !== FILTER_FIELD_TYPES.SEARCH);
    const compact = size === 'small';
    const gap = compact ? 1.5 : 2;

    return (
        <Stack spacing={gap} sx={{ p: compact ? 1.5 : 2.5 }}>
            {(searchField || slots.beforeFilters || slots.afterFilters) && (
                <Stack
                    direction={{ xs: 'column', md: 'row' }}
                    spacing={gap}
                    alignItems={{ xs: 'stretch', md: 'center' }}
                >
                    {slots.beforeFilters}

                    {searchField && (
                        <Box sx={{ flexGrow: 1 }}>
                            <FilterField
                                field={searchField}
                                value={filterValues[searchField.key]}
                                onChange={onFilterChange}
                                onSearchChange={onSearchChange}
                                size={size}
                            />
                        </Box>
                    )}

                    {slots.afterFilters}
                </Stack>
            )}

            {otherFields.length > 0 && (
                <Stack
                    direction={{ xs: 'column', sm: 'row' }}
                    spacing={gap}
                    alignItems={{ xs: 'stretch', sm: 'center' }}
                    flexWrap="wrap"
                >
                    {otherFields.map((field) => (
                        <Box
                            key={field.key}
                            sx={{
                                width: { xs: 1, sm: 'auto' },
                                minWidth: { xs: 0, sm: field.minWidth || 200 },
                                maxWidth: 1,
                                flexGrow: field.flexGrow || 0,
                                flexBasis: field.flexBasis || 'auto',
                            }}
                        >
                            <FilterField
                                field={field}
                                value={filterValues[field.key]}
                                onChange={onFilterChange}
                                size={size}
                            />
                        </Box>
                    ))}
                </Stack>
            )}
        </Stack>
    );
});

FlexibleTableToolbar.propTypes = {
    filterFields: PropTypes.arrayOf(PropTypes.object),
    filterValues: PropTypes.object,
    onFilterChange: PropTypes.func.isRequired,
    onSearchChange: PropTypes.func,
    slots: PropTypes.shape({
        beforeFilters: PropTypes.node,
        afterFilters: PropTypes.node,
    }),
    size: PropTypes.oneOf(['small', 'medium']),
};

FlexibleTableToolbar.displayName = 'FlexibleTableToolbar';