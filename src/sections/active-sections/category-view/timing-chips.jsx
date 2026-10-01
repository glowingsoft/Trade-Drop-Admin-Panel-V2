import { Box, Button, Card, CardContent, CardHeader, TextField } from '@mui/material';
import { useEffect, useState } from 'react';

import { ConfirmDialog } from 'src/components/custom-dialog';
import { Iconify } from 'src/components/iconify';
import { Label } from 'src/components/label';
import { toast } from 'src/components/snackbar';
import { useBoolean } from 'src/hooks/use-boolean';
import { handleApiError } from 'src/utils/errorHandler';
import {
  useAddTimingChipMutation,
  useDeleteTimingChipMutation,
  useGetTimingChipsQuery,
} from 'src/store/Reducer/categories-api';

const toChipValue = (label) =>
  label
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_|_$/g, '');

const TimingChips = ({ title, icon }) => {
  const [timingChip, setTimingChip] = useState('');
  const [selectedChip, setSelectedChip] = useState(null);
  const confirm = useBoolean();

  const { data, error } = useGetTimingChipsQuery();
  const [addTimingChip, { isLoading: isAdding }] = useAddTimingChipMutation();
  const [deleteTimingChip, { isLoading: isDeleting }] = useDeleteTimingChipMutation();

  const chips = data?.data || [];

  useEffect(() => {
    if (error) handleApiError(error);
  }, [error]);

  const handleClick = (item) => {
    setSelectedChip(item);
    confirm.onTrue();
  };

  const handleAdd = async () => {
    const label = timingChip.trim();
    if (!label) return;

    try {
      const maxSort = chips.reduce((max, item) => Math.max(max, item.sortOrder || 0), 0);
      const response = await addTimingChip({
        value: toChipValue(label),
        label,
        sortOrder: maxSort + 1,
      }).unwrap();

      if (response.message) toast.success(response.message);
      setTimingChip('');
    } catch (err) {
      handleApiError(err);
    }
  };

  const handleConfirmDelete = async () => {
    if (!selectedChip?._id) return;

    try {
      const response = await deleteTimingChip(selectedChip._id).unwrap();
      if (response.message) toast.success(response.message);
      confirm.onFalse();
      setSelectedChip(null);
    } catch (err) {
      handleApiError(err);
    }
  };

  const handleCancelDelete = () => {
    confirm.onFalse();
    setSelectedChip(null);
  };

  return (
    <Card>
      <CardHeader title={title} avatar={<Iconify icon={icon} />} />

      <CardContent>
        {chips.map((item) => (
          <Label
            key={item._id}
            variant="outlined"
            color="primary"
            sx={{ m: 0.5, p: 1 }}
            endIcon={
              <Iconify
                icon="eva:close-fill"
                onClick={() => handleClick(item)}
                sx={{ ml: 0.5, cursor: 'pointer' }}
              />
            }
          >
            {item.label}
          </Label>
        ))}

        <Box sx={{ display: 'flex', alignItems: 'end', gap: 2, mt: 2 }}>
          <TextField
            value={timingChip}
            size="small"
            onChange={(e) => setTimingChip(e.target.value)}
            placeholder="e.g Next Weekend"
            sx={{ flex: 1, width: 1 }}
          />
          <Button variant="outlined" color="primary" onClick={handleAdd} disabled={isAdding}>
            Add
          </Button>
        </Box>
      </CardContent>

      <ConfirmDialog
        open={confirm.value}
        onClose={handleCancelDelete}
        title="Delete Timing Chip"
        content="Are you sure you want to delete this timing chip?"
        action={
          <Button variant="contained" color="error" onClick={handleConfirmDelete} disabled={isDeleting}>
            Delete
          </Button>
        }
      />
    </Card>
  );
};

export default TimingChips;
