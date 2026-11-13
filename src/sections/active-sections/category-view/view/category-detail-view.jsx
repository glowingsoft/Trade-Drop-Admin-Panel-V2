import { useEffect, useMemo, useRef, useState } from 'react';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import Chip from '@mui/material/Chip';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TextField from '@mui/material/TextField';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';

import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
import { EmptyContent } from 'src/components/empty-content';
import { Iconify } from 'src/components/iconify';
import { Label } from 'src/components/label';
import { LoadingScreen } from 'src/components/loading-screen';
import { toast } from 'src/components/snackbar';
import { DashboardContent } from 'src/layouts/dashboard';
import { useParams } from 'src/routes/hooks';
import { paths } from 'src/routes/paths';
import {
  useGetCategoriesQuery,
  useUpdateCategoryMutation,
} from 'src/store/Reducer/categories-api';
import { varAlpha } from 'src/theme/styles';
import { handleApiError } from 'src/utils/errorHandler';

import { useLocation } from 'react-router-dom';

import { getCategoryInterests } from '../map-category';

const toTagSlug = (value) =>
  String(value || '')
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

const parseTagInput = (value) =>
  String(value || '')
    .split(/,|\n/)
    .map((item) => item.trim())
    .filter(Boolean);

const chipSx = {
  height: 32,
  borderRadius: 1,
  bgcolor: (theme) => varAlpha(theme.vars.palette.primary.mainChannel, 0.16),
  color: 'text.primary',
  fontWeight: 600,
  transition: 'background-color 120ms ease, color 120ms ease',
  '&:hover': {
    bgcolor: 'grey.700',
    color: 'common.white',
    '& .MuiChip-deleteIcon': {
      color: 'common.white',
      opacity: 1,
    },
  },
  '& .MuiChip-deleteIcon': {
    color: 'text.primary',
    opacity: 0.72,
    fontSize: 18,
    transition: 'opacity 120ms ease, color 120ms ease',
    '&:hover': {
      opacity: 1,
      color: 'error.light',
    },
  },
};

const previewChipSx = {
  height: 30,
  borderRadius: 100,
  bgcolor: (theme) => varAlpha(theme.vars.palette.grey['500Channel'], 0.12),
  color: 'text.primary',
  fontWeight: 600,
};

function TagsComposer({
  categoryName,
  items,
  draft,
  setDraft,
  onAdd,
  onRemove,
  onCancelEdit,
  editingValue,
  inputRef,
  saving,
}) {
  const isEditing = Boolean(editingValue);

  return (
    <Card sx={{ p: { xs: 2, md: 2.5 }, mb: 3 }}>
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        alignItems={{ sm: 'center' }}
        justifyContent="space-between"
        spacing={1}
        sx={{ mb: 2 }}
      >
        <Typography variant="h6">
          {isEditing ? `Edit tag in ${categoryName}` : `Add tags to ${categoryName}`}
        </Typography>
        {isEditing ? (
          <Stack direction="row" alignItems="center" spacing={1} flexWrap="wrap" useFlexGap>
            <Label variant="soft" color="warning">
              {`Editing: ${editingValue}`}
            </Label>
            <Button size="small" color="inherit" disabled={saving} onClick={onCancelEdit}>
              Cancel
            </Button>
          </Stack>
        ) : null}
      </Stack>

      <Box
        sx={{
          minHeight: 64,
          px: 1.5,
          py: 1.25,
          borderRadius: 1.5,
          border: (theme) =>
            `1px solid ${isEditing ? theme.vars.palette.warning.main : theme.vars.palette.divider}`,
          boxShadow: (theme) =>
            isEditing ? `inset 0 0 0 1px ${varAlpha(theme.vars.palette.warning.mainChannel, 0.24)}` : 'none',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          gap: 1,
          bgcolor: (theme) =>
            isEditing ? varAlpha(theme.vars.palette.warning.mainChannel, 0.04) : 'background.paper',
        }}
        onClick={() => inputRef.current?.focus()}
      >
        {items.map((item) => {
          const isActiveEdit = isEditing && item === editingValue;
          return (
            <Chip
              key={item}
              label={item}
              deleteIcon={<Iconify icon="mingcute:close-line" width={16} />}
              onDelete={
                saving
                  ? undefined
                  : (event) => {
                      event?.stopPropagation?.();
                      onRemove(item);
                    }
              }
              onClick={(event) => event.stopPropagation()}
              sx={{
                ...chipSx,
                ...(isActiveEdit && {
                  bgcolor: (theme) => varAlpha(theme.vars.palette.warning.mainChannel, 0.2),
                  outline: (theme) => `1px solid ${theme.vars.palette.warning.main}`,
                }),
              }}
            />
          );
        })}
        <TextField
          inputRef={inputRef}
          value={draft}
          disabled={saving}
          onChange={(event) => setDraft(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === 'Escape' && isEditing) {
              event.preventDefault();
              onCancelEdit();
              return;
            }
            if (event.key === 'Enter' || (!isEditing && event.key === ',')) {
              event.preventDefault();
              onAdd(draft);
            }
          }}
          onPaste={(event) => {
            if (isEditing) return;
            const text = event.clipboardData.getData('text');
            if (text.includes(',') || text.includes('\n')) {
              event.preventDefault();
              onAdd(text);
            }
          }}
          placeholder={
            isEditing
              ? 'Update tag name, press Enter to save...'
              : items.length
                ? 'Type another tag, press Enter...'
                : 'Type a tag, press Enter...'
          }
          variant="standard"
          InputProps={{ disableUnderline: true }}
          sx={{
            flex: 1,
            minWidth: 180,
            '& .MuiInputBase-input': { py: 0.75, typography: 'body2', fontWeight: isEditing ? 600 : 400 },
          }}
        />
      </Box>

      <Typography variant="caption" sx={{ display: 'block', mt: 1.5, color: 'text.secondary' }}>
        {isEditing
          ? 'Change the name above and press Enter to save. Press Esc or Cancel to stop editing.'
          : 'Press Enter or type a comma to add. Paste several tags at once. Duplicates are ignored.'}
      </Typography>
    </Card>
  );
}

function TagsTable({ categoryName, items, categoryActive, editingValue, onEdit, onRemove, saving }) {
  return (
    <Card sx={{ p: { xs: 2, md: 2.5 }, height: 1 }}>
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        alignItems={{ sm: 'center' }}
        justifyContent="space-between"
        spacing={1}
        sx={{ mb: 2 }}
      >
        <Typography variant="h6">{`Tags · ${items.length}`}</Typography>
        <Label variant="soft" color="info">
          {`Shown as “Within ${categoryName}”`}
        </Label>
      </Stack>

      {items.length ? (
        <Box
          sx={{
            maxHeight: 360,
            overflowY: 'auto',
            overflowX: 'auto',
          }}
        >
          <Table size="medium" stickyHeader sx={{ minWidth: 520 }}>
            <TableHead>
              <TableRow>
                <TableCell>Tag</TableCell>
                <TableCell width={120}>Status</TableCell>
                <TableCell align="right" width={120}>
                  Actions
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {items.map((item) => {
                const isActiveEdit = Boolean(editingValue) && item === editingValue;
                return (
                  <TableRow
                    key={item}
                    hover
                    selected={isActiveEdit}
                    sx={
                      isActiveEdit
                        ? {
                            bgcolor: (theme) => varAlpha(theme.vars.palette.warning.mainChannel, 0.08),
                          }
                        : undefined
                    }
                  >
                    <TableCell>
                      <Stack direction="row" alignItems="center" spacing={1}>
                        <Box>
                          <Typography variant="subtitle2">{item}</Typography>
                          <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                            {toTagSlug(item) || '—'}
                          </Typography>
                        </Box>
                        {isActiveEdit ? (
                          <Label variant="soft" color="warning">
                            Editing
                          </Label>
                        ) : null}
                      </Stack>
                    </TableCell>
                    <TableCell>
                      <Label variant="soft" color={categoryActive ? 'success' : 'error'}>
                        {categoryActive ? 'Active' : 'Inactive'}
                      </Label>
                    </TableCell>
                    <TableCell align="right">
                      <Stack direction="row" spacing={0.5} justifyContent="flex-end">
                        <Tooltip title="Edit">
                          <span>
                            <IconButton
                              size="small"
                              color={isActiveEdit ? 'warning' : 'default'}
                              disabled={saving}
                              onClick={() => onEdit(item)}
                            >
                              <Iconify icon="solar:pen-bold" width={18} />
                            </IconButton>
                          </span>
                        </Tooltip>
                        <Tooltip title="Delete">
                          <span>
                            <IconButton
                              size="small"
                              color="error"
                              disabled={saving}
                              onClick={(event) => {
                                event.stopPropagation();
                                onRemove(item);
                              }}
                            >
                              <Iconify icon="solar:trash-bin-trash-bold" width={18} />
                            </IconButton>
                          </span>
                        </Tooltip>
                      </Stack>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </Box>
      ) : (
        <EmptyContent filled title="No tags" sx={{ py: 6 }} />
      )}
    </Card>
  );
}

function AppPreviewCard({ categoryName, items }) {
  return (
    <Card sx={{ p: { xs: 2, md: 2.5 }, height: 1 }}>
      <Typography variant="h6" sx={{ mb: 2 }}>
        How it shows in the app
      </Typography>

      <Box
        sx={{
          p: 2,
          borderRadius: 1.5,
          border: (theme) => `1px solid ${theme.vars.palette.divider}`,
          bgcolor: (theme) => varAlpha(theme.vars.palette.grey['500Channel'], 0.04),
        }}
      >
        <Typography
          variant="caption"
          sx={{
            display: 'block',
            mb: 1.5,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            color: 'text.secondary',
            fontWeight: 700,
          }}
        >
          {`Within ${categoryName}`}
        </Typography>

        <Stack direction="row" flexWrap="wrap" useFlexGap spacing={1}>
          {items.length ? (
            items.map((item) => <Chip key={item} label={item} sx={previewChipSx} />)
          ) : (
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              —
            </Typography>
          )}
        </Stack>
      </Box>

      <Typography variant="caption" sx={{ display: 'block', mt: 1.5, color: 'text.secondary' }}>
        {`Only users in ${categoryName} see this group.`}
      </Typography>
    </Card>
  );
}

export function CategoryDetailView() {
  const { id } = useParams();
  const location = useLocation();
  const categoryPreview = location.state?.categoryPreview;
  const inputRef = useRef(null);
  const lastSavedRef = useRef(null);

  const [updateCategory, { isLoading: saving }] = useUpdateCategoryMutation();
  const [items, setItems] = useState([]);
  const [draft, setDraft] = useState('');
  const [editingValue, setEditingValue] = useState(null);

  const {
    data: categoriesData,
    isLoading,
    isFetching,
    error,
  } = useGetCategoriesQuery(
    { page: 0, limit: 200 },
    { skip: !id, refetchOnMountOrArgChange: true }
  );

  useEffect(() => {
    if (error && !categoryPreview) handleApiError(error);
  }, [error, categoryPreview]);

  const category = useMemo(() => {
    const fromList = (categoriesData?.data || []).find(
      (item) => String(item._id || item.id) === String(id)
    );
    return fromList || categoryPreview || null;
  }, [categoriesData?.data, categoryPreview, id]);

  const interests = useMemo(() => getCategoryInterests(category), [category]);
  const categoryId = category?._id || category?.id || id;
  const categoryName = category?.name || 'Category';
  const categoryActive = category?.active !== false;

  useEffect(() => {
    if (saving) return;

    if (lastSavedRef.current) {
      const saved = lastSavedRef.current.map((item) => item.toLowerCase()).sort();
      const server = interests.map((item) => item.toLowerCase()).sort();
      const matched =
        saved.length === server.length && saved.every((item, index) => item === server[index]);

      if (matched) {
        lastSavedRef.current = null;
        setItems(interests);
      }
      return;
    }

    setItems(interests);
  }, [interests, saving]);

  const saveInterests = async (nextItems) => {
    const previousItems = items;
    lastSavedRef.current = nextItems;
    setItems(nextItems);

    try {
      const response = await updateCategory({
        id: categoryId,
        interests: nextItems,
        intrests: nextItems,
      }).unwrap();

      if (response.message) toast.success(response.message);
      return response;
    } catch (apiError) {
      lastSavedRef.current = null;
      setItems(previousItems);
      throw apiError;
    }
  };

  const mergeTags = (rawValue) => {
    const incoming = parseTagInput(rawValue);
    if (!incoming.length) return null;

    let nextItems = [...items];

    if (editingValue) {
      const [first, ...rest] = incoming;
      nextItems = nextItems.map((item) => (item === editingValue ? first : item));
      rest.forEach((tag) => {
        if (!nextItems.some((item) => item.toLowerCase() === tag.toLowerCase())) {
          nextItems.push(tag);
        }
      });
    } else {
      incoming.forEach((tag) => {
        if (!nextItems.some((item) => item.toLowerCase() === tag.toLowerCase())) {
          nextItems.push(tag);
        }
      });
    }

    return nextItems;
  };

  const handleAdd = async (rawValue) => {
    const nextItems = mergeTags(rawValue);
    if (!nextItems) return;

    try {
      await saveInterests(nextItems);
      setDraft('');
      setEditingValue(null);
    } catch (apiError) {
      handleApiError(apiError);
    }
  };

  const handleEdit = (item) => {
    setEditingValue(item);
    setDraft(item);
    requestAnimationFrame(() => {
      inputRef.current?.focus();
      inputRef.current?.select?.();
    });
  };

  const handleCancelEdit = () => {
    setEditingValue(null);
    setDraft('');
  };

  const handleRemove = async (item) => {
    const nextItems = items.filter(
      (value) => value.toLowerCase() !== String(item || '').toLowerCase()
    );
    if (nextItems.length === items.length) return;

    try {
      await saveInterests(nextItems);
      if (editingValue && editingValue.toLowerCase() === String(item || '').toLowerCase()) {
        setEditingValue(null);
        setDraft('');
      }
    } catch (apiError) {
      handleApiError(apiError);
    }
  };

  if ((isLoading || isFetching) && !category) {
    return <LoadingScreen />;
  }

  if (!category) {
    return (
      <DashboardContent maxWidth={false}>
        <CustomBreadcrumbs
          heading="Category"
          links={[
            { name: 'Dashboard', href: paths.adminDashboard.root },
            { name: 'Categories', href: paths.adminDashboard.categories },
            { name: 'Category' },
          ]}
          sx={{ mb: { xs: 3, md: 5 } }}
        />
        <EmptyContent filled title="Category not found" sx={{ py: 10 }} />
      </DashboardContent>
    );
  }

  return (
    <DashboardContent maxWidth={false}>
      <CustomBreadcrumbs
        heading={categoryName}
        links={[
          { name: 'Dashboard', href: paths.adminDashboard.root },
          { name: 'Categories', href: paths.adminDashboard.categories },
          { name: categoryName },
        ]}
        sx={{ mb: { xs: 3, md: 3 } }}
      />

      <TagsComposer
        categoryName={categoryName}
        items={items}
        draft={draft}
        setDraft={setDraft}
        onAdd={handleAdd}
        onRemove={handleRemove}
        onCancelEdit={handleCancelEdit}
        editingValue={editingValue}
        inputRef={inputRef}
        saving={saving}
      />

      <Box
        sx={{
          display: 'grid',
          gap: 2.5,
          gridTemplateColumns: { xs: '1fr', md: 'minmax(0, 1.5fr) minmax(280px, 0.9fr)' },
          alignItems: 'start',
        }}
      >
        <TagsTable
          categoryName={categoryName}
          items={items}
          categoryActive={categoryActive}
          editingValue={editingValue}
          onEdit={handleEdit}
          onRemove={handleRemove}
          saving={saving}
        />
        <AppPreviewCard categoryName={categoryName} items={items} />
      </Box>
    </DashboardContent>
  );
}
