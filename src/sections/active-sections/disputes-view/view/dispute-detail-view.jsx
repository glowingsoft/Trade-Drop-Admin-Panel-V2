import { useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';

import LoadingButton from '@mui/lab/LoadingButton';
import Avatar from '@mui/material/Avatar';
import AvatarGroup from '@mui/material/AvatarGroup';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Divider from '@mui/material/Divider';
import FormControlLabel from '@mui/material/FormControlLabel';
import Grid from '@mui/material/Grid';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import Stack from '@mui/material/Stack';
import { useTheme } from '@mui/material/styles';
import Typography from '@mui/material/Typography';

import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
import { Field, Form } from 'src/components/hook-form';
import { Iconify } from 'src/components/iconify';
import { Label } from 'src/components/label';
import { LoadingScreen } from 'src/components/loading-screen';
import { toast } from 'src/components/snackbar';
import { getDisplayImage } from 'src/constants/upload';
import { DashboardContent } from 'src/layouts/dashboard';
import { useParams, useRouter } from 'src/routes/hooks';
import { paths } from 'src/routes/paths';
import { useGetDisputeByIdQuery, useResolveDisputeMutation } from 'src/store/Reducer/disputes-api';
import { varAlpha } from 'src/theme/styles';
import { handleApiError } from 'src/utils/errorHandler';

import {
  DISPUTE_OUTCOME_OPTIONS,
  TRADE_STATUS_LABEL,
  getDisputePriorityOption,
  getDisputeStatusOption,
} from '../dispute-status';
import { mapDisputeDetail } from '../map-dispute-detail';

const OUTCOME_META = {
  complete: { icon: 'solar:check-circle-bold', color: 'success' },
  cancel: { icon: 'solar:close-circle-bold', color: 'warning' },
  dismissed: { icon: 'solar:forbidden-circle-bold', color: 'info' },
};

const SectionHeading = ({ icon, title, action }) => (
  <Stack
    direction="row"
    alignItems="center"
    justifyContent="space-between"
    spacing={1}
    flexWrap="wrap"
    useFlexGap
    sx={{ px: 2.5, py: 1.75 }}
  >
    <Stack direction="row" alignItems="center" spacing={1} sx={{ minWidth: 0 }}>
      <Iconify icon={icon} width={20} sx={{ flexShrink: 0 }} />
      <Typography variant="subtitle1">{title}</Typography>
    </Stack>
    {action}
  </Stack>
);

const Fact = ({ label, value }) => (
  <Box sx={{ minWidth: 0, flex: 1 }}>
    <Typography variant="caption" color="text.secondary">
      {label}
    </Typography>
    <Typography variant="body2" sx={{ mt: 0.25, wordBreak: 'break-word' }}>
      {value || '—'}
    </Typography>
  </Box>
);

const PartyCard = ({ party, statement, evidence, tone = 'primary' }) => {
  const theme = useTheme();
  const palette = theme.vars.palette[tone] || theme.vars.palette.primary;

  return (
    <Card sx={{ height: 1, overflow: 'hidden' }}>
      <Box sx={{ height: 3, bgcolor: palette.main }} />
      <CardContent sx={{ pt: 2.5 }}>
        <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 2 }}>
          <Avatar src={party.image} alt={party.name} sx={{ width: 48, height: 48, fontSize: 16 }}>
            {party.initials}
          </Avatar>
          <Box sx={{ minWidth: 0 }}>
            <Typography variant="subtitle1" noWrap sx={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {party.name}
            </Typography>
            <Stack direction="row" spacing={0.75} alignItems="center" flexWrap="wrap" useFlexGap>
              <Label variant="soft" color={tone === 'warning' ? 'warning' : 'info'}>
                {party.role}
              </Label>
              {party.email ? (
                <Typography variant="caption" color="text.secondary" sx={{ wordBreak: 'break-all' }}>
                  {party.email}
                </Typography>
              ) : null}
            </Stack>
          </Box>
        </Stack>

        <Box
          sx={{
            p: 1.5,
            borderRadius: 1.5,
            bgcolor: varAlpha(theme.vars.palette.grey['500Channel'], 0.08),
          }}
        >
          <Typography variant="body2" color="text.secondary">
            {statement || '—'}
          </Typography>
        </Box>

        <Typography variant="subtitle2" sx={{ mt: 2, mb: 1 }}>
          Evidence
          <Box component="span" sx={{ color: 'text.disabled', ml: 0.5 }}>
            ({evidence.length})
          </Box>
        </Typography>
        <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
          {evidence.length === 0 ? (
            <Typography variant="caption" color="text.disabled">
              No evidence
            </Typography>
          ) : (
            evidence.map((item) => (
              <Box
                key={item}
                component="a"
                href={item}
                target="_blank"
                rel="noopener noreferrer"
                sx={{
                  display: 'block',
                  overflow: 'hidden',
                  borderRadius: 1.5,
                  border: '1px solid',
                  borderColor: 'divider',
                }}
              >
                <Box
                  component="img"
                  src={getDisplayImage(item)}
                  alt="Evidence"
                  sx={{ width: 72, height: 72, objectFit: 'cover', display: 'block' }}
                />
              </Box>
            ))
          )}
        </Stack>
      </CardContent>
    </Card>
  );
};

export function DisputeDetailView() {
  const theme = useTheme();
  const router = useRouter();
  const { id } = useParams();
  const { data, isLoading, error } = useGetDisputeByIdQuery(id, { skip: !id });
  const [resolveDispute, { isLoading: isResolving }] = useResolveDisputeMutation();
  const dispute = useMemo(() => mapDisputeDetail(data), [data]);

  const methods = useForm({
    defaultValues: {
      outcome: 'dismissed',
      faultUserId: '',
      resolutionNote: '',
      internalNote: '',
    },
  });

  const { reset, watch, setValue, handleSubmit } = methods;
  const outcome = watch('outcome');
  const faultUserId = watch('faultUserId');

  useEffect(() => {
    if (error) handleApiError(error);
  }, [error]);

  useEffect(() => {
    if (!dispute) return;
    reset({
      outcome: dispute.outcome || 'dismissed',
      faultUserId: dispute.faultUserId || '',
      resolutionNote: dispute.resolutionNote || '',
      internalNote: dispute.internalNote || '',
    });
  }, [dispute, reset]);

  const onSubmit = handleSubmit(async (formData) => {
    try {
      const response = await resolveDispute({
        id,
        outcome: formData.outcome,
        faultUserId: formData.faultUserId,
        resolutionNote: formData.resolutionNote || '',
        internalNote: formData.internalNote || '',
      }).unwrap();
      if (response.message) toast.success(response.message);
      router.push(paths.adminDashboard.disputes);
    } catch (err) {
      handleApiError(err);
    }
  });

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (error || !dispute) {
    return (
      <DashboardContent maxWidth={false}>
        <Box sx={{ mb: 2 }}>
          <Button onClick={router.back} startIcon={<Iconify icon="eva:arrow-ios-back-fill" />}>
            Back
          </Button>
        </Box>
        <Typography>Dispute not found.</Typography>
      </DashboardContent>
    );
  }

  const statusOption = getDisputeStatusOption(dispute.status);
  const priorityOption = getDisputePriorityOption(dispute.priority);

  return (
    <DashboardContent maxWidth={false}>
      <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
        <Button onClick={router.back} startIcon={<Iconify icon="eva:arrow-ios-back-fill" />}>
          Back
        </Button>
      </Stack>

      <CustomBreadcrumbs
        heading="Dispute Detail"
        links={[
          { name: 'Dashboard', href: paths.adminDashboard.root },
          { name: 'Disputes', href: paths.adminDashboard.disputes },
          { name: dispute.tradeCode },
        ]}
        sx={{ mb: { xs: 3, md: 4 } }}
      />

      <Form methods={methods} onSubmit={onSubmit}>
        <Card sx={{ mb: 3, overflow: 'hidden' }}>
          <Stack direction={{ xs: 'column', md: 'row' }} spacing={2.5} sx={{ p: 3 }}>
            <AvatarGroup
              max={2}
              sx={{
                '& .MuiAvatar-root': { width: 56, height: 56, fontSize: 18, borderWidth: 2 },
              }}
            >
              <Avatar src={dispute.partyA.image} alt={dispute.partyA.name}>
                {dispute.partyA.initials}
              </Avatar>
              <Avatar src={dispute.partyB.image} alt={dispute.partyB.name}>
                {dispute.partyB.initials}
              </Avatar>
            </AvatarGroup>

            <Box sx={{ minWidth: 0, flex: 1 }}>
              <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap" useFlexGap>
                <Typography variant="overline" color="text.secondary">
                  {dispute.tradeCode}
                </Typography>
                {dispute.reasonLabel ? (
                  <Label variant="soft">{dispute.reasonLabel}</Label>
                ) : null}
                <Label variant="soft" color={priorityOption?.color || 'default'}>
                  {priorityOption?.label || dispute.priority}
                </Label>
                <Label variant="soft" color={statusOption?.color || 'default'}>
                  {statusOption?.label || dispute.status}
                </Label>
              </Stack>

              <Typography variant="h4" sx={{ mt: 0.75, letterSpacing: '-0.02em' }}>
                {dispute.title}
              </Typography>

              <Stack
                direction="row"
                spacing={2}
                flexWrap="wrap"
                useFlexGap
                sx={{ mt: 1.25, color: 'text.secondary', typography: 'body2' }}
              >
                <Stack direction="row" spacing={0.5} alignItems="center">
                  <Iconify icon="solar:user-bold" width={16} />
                  {dispute.raisedBy}
                  <Box component="span" sx={{ mx: 0.5, color: 'text.disabled' }}>
                    vs
                  </Box>
                  {dispute.against}
                </Stack>
                <Stack direction="row" spacing={0.5} alignItems="center">
                  <Iconify icon="solar:clock-circle-bold" width={16} />
                  {dispute.openedLabel}
                </Stack>
              </Stack>
            </Box>
          </Stack>
        </Card>

        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <PartyCard
                  party={dispute.partyA}
                  statement={dispute.claimantStatement}
                  evidence={dispute.evidenceA}
                  tone="warning"
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <PartyCard
                  party={dispute.partyB}
                  statement={dispute.respondentStatement}
                  evidence={dispute.evidenceB}
                  tone="info"
                />
              </Grid>
            </Grid>

            <Card sx={{ mt: 2 }}>
              <SectionHeading
                icon="solar:bag-4-bold-duotone"
                title={`Linked trade ${dispute.tradeCode}`}
                action={
                  <Label variant="soft" color="info">
                    {TRADE_STATUS_LABEL[dispute.tradeStatus] || dispute.tradeStatus}
                  </Label>
                }
              />
              <Divider />
              <CardContent>
                <Stack
                  direction={{ xs: 'column', sm: 'row' }}
                  spacing={2}
                  divider={<Divider orientation="vertical" flexItem sx={{ display: { xs: 'none', sm: 'block' } }} />}
                >
                  <Fact label="Need" value={dispute.tradeNeed} />
                  <Fact label="Offer" value={dispute.tradeOffer} />
                  <Fact label="Drop-in" value={dispute.tradeTapIn} />
                  <Fact label="Area" value={dispute.tradeArea} />
                </Stack>
              </CardContent>
            </Card>

            <Card sx={{ mt: 2 }}>
              <SectionHeading icon="solar:notes-bold-duotone" title="Internal notes" />
              <Divider />
              <CardContent>
                <Field.Text
                  name="internalNote"
                  placeholder="Add an internal note"
                  multiline
                  rows={3}
                />
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={4}>
            <Card
              sx={{
                position: { md: 'sticky' },
                top: { md: 88 },
              }}
            >
              <SectionHeading icon="solar:shield-check-bold-duotone" title="Resolution" />
              <Divider />
              <CardContent>
                <RadioGroup
                  value={outcome}
                  onChange={(event) => setValue('outcome', event.target.value)}
                >
                  <Stack spacing={1.25}>
                    {DISPUTE_OUTCOME_OPTIONS.map((option) => {
                      const selected = outcome === option.value;
                      const meta = OUTCOME_META[option.value] || OUTCOME_META.dismissed;
                      const color = theme.vars.palette[meta.color] || theme.vars.palette.primary;

                      return (
                        <Box
                          key={option.value}
                          onClick={() => setValue('outcome', option.value)}
                          sx={{
                            px: 1.5,
                            py: 1.25,
                            cursor: 'pointer',
                            borderRadius: 1.5,
                            border: '1px solid',
                            borderColor: selected ? color.main : 'divider',
                            bgcolor: selected
                              ? varAlpha(color.mainChannel, 0.12)
                              : 'transparent',
                            transition: theme.transitions.create(['border-color', 'background-color']),
                            '&:hover': {
                              borderColor: selected ? color.main : 'text.disabled',
                            },
                          }}
                        >
                          <FormControlLabel
                            value={option.value}
                            control={<Radio color={meta.color} sx={{ display: 'none' }} />}
                            sx={{ m: 0, width: 1, pointerEvents: 'none' }}
                            label={
                              <Stack direction="row" spacing={1.25} alignItems="center" sx={{ width: 1 }}>
                                <Box
                                  sx={{
                                    width: 36,
                                    height: 36,
                                    display: 'flex',
                                    flexShrink: 0,
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    borderRadius: 1,
                                    color: selected ? color.contrastText : color.main,
                                    bgcolor: selected
                                      ? color.main
                                      : varAlpha(color.mainChannel, 0.12),
                                  }}
                                >
                                  <Iconify icon={meta.icon} width={20} />
                                </Box>
                                <Typography variant="subtitle2">{option.label}</Typography>
                                {selected ? (
                                  <Iconify
                                    icon="eva:checkmark-fill"
                                    width={18}
                                    sx={{ ml: 'auto', color: color.main }}
                                  />
                                ) : null}
                              </Stack>
                            }
                          />
                        </Box>
                      );
                    })}
                  </Stack>
                </RadioGroup>

                <Typography variant="subtitle2" sx={{ mt: 2.5, mb: 1.25 }}>
                  Fault user
                </Typography>
                <Stack spacing={1.25}>
                  {[dispute.partyA, dispute.partyB].filter((party) => party.id).map((party) => {
                    const selected = faultUserId === party.id;
                    return (
                      <Box
                        key={party.id}
                        onClick={() => setValue('faultUserId', party.id)}
                        sx={{
                          px: 1.5,
                          py: 1.25,
                          cursor: 'pointer',
                          borderRadius: 1.5,
                          border: '1px solid',
                          borderColor: selected ? 'primary.main' : 'divider',
                          bgcolor: selected
                            ? varAlpha(theme.vars.palette.primary.mainChannel, 0.12)
                            : 'transparent',
                          transition: theme.transitions.create(['border-color', 'background-color']),
                          '&:hover': {
                            borderColor: selected ? 'primary.main' : 'text.disabled',
                          },
                        }}
                      >
                        <Stack direction="row" spacing={1.25} alignItems="center">
                          <Avatar src={party.image} alt={party.name} sx={{ width: 36, height: 36 }}>
                            {party.initials}
                          </Avatar>
                          <Box sx={{ minWidth: 0, flex: 1 }}>
                            <Typography variant="subtitle2" noWrap>
                              {party.name}
                            </Typography>
                            <Typography variant="caption" color="text.secondary" noWrap>
                              {party.role}
                              {party.email ? ` · ${party.email}` : ''}
                            </Typography>
                          </Box>
                          {selected ? (
                            <Iconify icon="eva:checkmark-fill" width={18} sx={{ color: 'primary.main' }} />
                          ) : null}
                        </Stack>
                      </Box>
                    );
                  })}
                </Stack>

                <Box sx={{ mt: 2.5 }}>
                  <Field.Text
                    name="resolutionNote"
                    label="Outcome message to both parties"
                    multiline
                    rows={4}
                  />
                </Box>

                <LoadingButton
                  type="submit"
                  variant="contained"
                  color="primary"
                  size="large"
                  fullWidth
                  sx={{ mt: 2.5 }}
                  loading={isResolving}
                  disabled={!faultUserId}
                >
                  Apply resolution
                </LoadingButton>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Form>
    </DashboardContent>
  );
}
