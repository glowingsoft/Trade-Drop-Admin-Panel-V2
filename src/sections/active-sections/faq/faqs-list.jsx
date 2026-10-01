import { useState } from 'react';

import { LoadingButton } from '@mui/lab';
import { Grid, IconButton, Tooltip } from '@mui/material';
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import Typography from '@mui/material/Typography';

import { ConfirmDialog } from 'src/components/custom-dialog';
import { Iconify } from 'src/components/iconify';
import { toast } from 'src/components/snackbar';
import { useBoolean } from 'src/hooks/use-boolean';
import { handleApiError } from 'src/utils/errorHandler';
import { useDeleteFaqMutation } from 'src/store/Reducer/faqs-api';

import EditFaqForm from './edit-faq-modal';

export default function FaqsList({ allFaqs }) {
  const quickEdit = useBoolean();
  const confirm = useBoolean();
  const [selectedFaq, setSelectedFaq] = useState(null);
  const [selectedDeleteFaq, setSelectedDeleteFaq] = useState(null);
  const [deleteFaq, { isLoading: isDeleting }] = useDeleteFaqMutation();

  const handleEdit = (faq) => {
    setSelectedFaq(faq);
    quickEdit.onTrue();
  };

  const openDeleteModal = (faqId) => {
    setSelectedDeleteFaq(faqId);
    confirm.onTrue();
  };

  const handleDelete = async (_id) => {
    try {
      const response = await deleteFaq(_id).unwrap();
      if (response.message) toast.success(response.message);
      confirm.onFalse();
      setSelectedDeleteFaq(null);
    } catch (error) {
      handleApiError(error);
    }
  };

  return (
    <>
      {allFaqs?.map((faq) => (
        <Accordion key={faq._id}>
          <AccordionSummary sx={{ pr: 2 }} expandIcon={<Iconify icon="eva:arrow-ios-downward-fill" />}>
            <Typography
              variant="subtitle1"
              sx={{
                py: 1,
                pr: 2,
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                textTransform: 'capitalize',
              }}
            >
              {faq.question}
            </Typography>
          </AccordionSummary>
          <AccordionDetails
            sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
          >
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} md={11}>
                <Typography>{faq.answer}</Typography>
              </Grid>
              <Grid item xs={12} md={1}>
                <Tooltip title="Edit" placement="top" arrow>
                  <IconButton color="default" onClick={() => handleEdit(faq)}>
                    <Iconify icon="solar:pen-bold" />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Delete" placement="top" arrow>
                  <IconButton color="error" onClick={() => openDeleteModal(faq._id)}>
                    <Iconify icon="solar:trash-bin-trash-bold" />
                  </IconButton>
                </Tooltip>
              </Grid>
            </Grid>
          </AccordionDetails>
        </Accordion>
      ))}

      <EditFaqForm row={selectedFaq} open={quickEdit.value} onClose={quickEdit.onFalse} />

      <ConfirmDialog
        open={confirm.value}
        onClose={confirm.onFalse}
        title="Confirm Delete"
        content="Are you sure you want to delete this faq?"
        action={
          <LoadingButton
            variant="contained"
            color="error"
            loading={isDeleting}
            sx={{ px: 2 }}
            onClick={() => handleDelete(selectedDeleteFaq)}
          >
            Delete
          </LoadingButton>
        }
      />
    </>
  );
}
