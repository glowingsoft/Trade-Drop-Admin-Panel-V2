import { useCallback } from 'react';

import Chip from '@mui/material/Chip';

import { chipProps, FiltersBlock, FiltersResult } from 'src/components/filters-result';

// ----------------------------------------------------------------------

export function UserTableFiltersResult({ filters, onResetPage, totalResults, sx, filterFields }) {
  const getFilterLabel = (key, value) => {
    const field = filterFields?.find((item) => item.key === key);
    const option = field?.options?.find((item) => item.value === value);
    if (option?.label) return option.label;
    return typeof value === 'string' ? value.replace(/-/g, ' ') : value;
  };
  const handleRemoveKeyword = useCallback(() => {
    onResetPage();
    filters.setState({ name: '' });
  }, [filters, onResetPage]);

  const handleRemoveStatus = useCallback(() => {
    onResetPage();
    filters.setState({ status: 'all' });
  }, [filters, onResetPage]);

  const handleRemoveCategory = useCallback(() => {
    onResetPage();
    filters.setState({ categories: 'all' });
  }, [filters, onResetPage]);

  const handleRemoveCity = useCallback(() => {
    onResetPage();
    filters.setState({ cities: 'all' });
  }, [filters, onResetPage]);

  const handleRemoveArea = useCallback(() => {
    onResetPage();
    filters.setState({ areas: 'all' });
  }, [filters, onResetPage]);

  const handleRemoveUrgency = useCallback(() => {
    onResetPage();
    filters.setState({ urgency: 'all' });
  }, [filters, onResetPage]);

  const handleRemoveRole = useCallback(
    (inputValue) => {
      const newValue = filters.state.role.filter((item) => item !== inputValue);

      onResetPage();
      filters.setState({ role: newValue });
    },
    [filters, onResetPage]
  );

  const handleReset = useCallback(() => {
    onResetPage();
    filters.onResetState();
  }, [filters, onResetPage]);

  return (
    <FiltersResult totalResults={totalResults} onReset={handleReset} sx={sx}>
      <FiltersBlock label="Status:" isShow={filters.state.status !== 'all'}>
        <Chip
          {...chipProps}
          label={getFilterLabel('status', filters.state.status)}
          onDelete={handleRemoveStatus}
          sx={{ textTransform: 'capitalize' }}
        />
      </FiltersBlock>

      <FiltersBlock label="Role:" isShow={!!filters?.state?.role?.length}>
        { filters?.state?.role?.length >0 && filters.state.role.map((item) => (
          <Chip {...chipProps} key={item} label={item} onDelete={() => handleRemoveRole(item)} />
        ))}
      </FiltersBlock>

      <FiltersBlock
        label="Category:"
        isShow={!!filters.state.categories && filters.state.categories !== 'all'}
      >
        <Chip
          {...chipProps}
          label={getFilterLabel('categories', filters.state.categories)}
          onDelete={handleRemoveCategory}
          sx={{ textTransform: 'capitalize' }}
        />
      </FiltersBlock>

      <FiltersBlock
        label="City:"
        isShow={!!filters.state.cities && filters.state.cities !== 'all'}
      >
        <Chip
          {...chipProps}
          label={getFilterLabel('cities', filters.state.cities)}
          onDelete={handleRemoveCity}
          sx={{ textTransform: 'capitalize' }}
        />
      </FiltersBlock>

      <FiltersBlock
        label="Area:"
        isShow={!!filters.state.areas && filters.state.areas !== 'all'}
      >
        <Chip
          {...chipProps}
          label={getFilterLabel('areas', filters.state.areas)}
          onDelete={handleRemoveArea}
          sx={{ textTransform: 'capitalize' }}
        />
      </FiltersBlock>

      <FiltersBlock
        label="Urgency:"
        isShow={!!filters.state.urgency && filters.state.urgency !== 'all'}
      >
        <Chip
          {...chipProps}
          label={getFilterLabel('urgency', filters.state.urgency)}
          onDelete={handleRemoveUrgency}
          sx={{ textTransform: 'capitalize' }}
        />
      </FiltersBlock>

      <FiltersBlock label="Keyword:" isShow={!!filters.state.name}>
        <Chip {...chipProps} label={filters.state.name} onDelete={handleRemoveKeyword} />
      </FiltersBlock>
    </FiltersResult>
  );
}
