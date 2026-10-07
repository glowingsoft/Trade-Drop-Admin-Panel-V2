import { useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';

import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import Checkbox from '@mui/material/Checkbox';
import Divider from '@mui/material/Divider';
import FormControlLabel from '@mui/material/FormControlLabel';
import Grid from '@mui/material/Grid';
import MenuItem from '@mui/material/MenuItem';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
import { Field, Form } from 'src/components/hook-form';
import { Iconify } from 'src/components/iconify';
import { Label } from 'src/components/label';
import { DashboardContent } from 'src/layouts/dashboard';
import { useParams, useRouter } from 'src/routes/hooks';
import { paths } from 'src/routes/paths';

import {
  DISPUTE_ASSIGNEE_EDIT_OPTIONS,
  DISPUTE_PENALTY_OPTIONS,
  DISPUTE_PRIORITY_OPTIONS,
  DISPUTE_STATUS_OPTIONS,
  TRADE_STATUS_LABEL,
  getDisputePriorityOption,
  getDisputeStatusOption,
} from '../dispute-status';
import { getDisputeById } from '../mocks/data';

const PartyCard = ({ party, statement, evidence }) => (
  <Card sx={{ height: 1 }}>
    <CardContent>
      <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 2 }}>
        <Avatar sx={{ width: 40, height: 40, fontSize: 16 }}>{party.initials}</Avatar>
        <Box>
          <Typography variant="subtitle1">{party.name}</Typography>
          <Typography variant="caption" color="text.secondary">
            {party.role}
          </Typography>
        </Box>
      </Stack>
      <Typography variant="body2" color="text.secondary">
        {statement}
      </Typography>
      <Typography variant="subtitle2" sx={{ mt: 2, mb: 1 }}>
        Evidence ({evidence.length})
      </Typography>
      <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
        {evidence.length === 0 ? (
          <Typography variant="caption" color="text.disabled">
            No evidence
          </Typography>
        ) : (
          evidence.map((item) => (
            <Button key={item} size="small" variant="outlined" color="inherit">
              {item}
            </Button>
          ))
        )}
      </Stack>
    </CardContent>
  </Card>
);

export function DisputeDetailView() {
  const router = useRouter();
  const { id } = useParams();
  const dispute = useMemo(() => getDisputeById(id), [id]);

  const methods = useForm({
    defaultValues: {
      status: 'open',
      priority: 'medium',
      assignee: 'Unassigned',
      resolution: 'party_a',
      penalise: false,
      penaliseUser: '',
      penalty: 'formal_warning',
      outcome: '',
      internalNote: '',
    },
  });

  const { reset, watch, setValue } = methods;
  const penalise = watch('penalise');
  const resolution = watch('resolution');

  useEffect(() => {
    if (!dispute) return;
    reset({
      status: dispute.status,
      priority: dispute.priority,
      assignee: dispute.assignee,
      resolution: 'party_a',
      penalise: false,
      penaliseUser: dispute.partyB.name,
      penalty: 'formal_warning',
      outcome: `After reviewing the statements and evidence, we've resolved this dispute in favour of ${dispute.partyA.name}.`,
      internalNote: '',
    });
  }, [dispute, reset]);

  if (!dispute) {
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

  const statusOption = getDisputeStatusOption(watch('status') || dispute.status);
  const priorityOption = getDisputePriorityOption(watch('priority') || dispute.priority);

  const resolutionOptions = [
    {
      value: 'party_a',
      title: `Resolve in favour of ${dispute.partyA.name}`,
      description: "Trade marked unfair for the other party; claimant's review protected.",
    },
    {
      value: 'party_b',
      title: `Resolve in favour of ${dispute.partyB.name}`,
      description: 'Claim rejected; trade stands as recorded.',
    },
    {
      value: 'mutual',
      title: 'Mutual close',
      description: 'No fault; trade cancelled, no rating impact.',
    },
  ];

  return (
    <DashboardContent maxWidth={false}>
      <Box sx={{ mb: 2 }}>
        <Button onClick={router.back} startIcon={<Iconify icon="eva:arrow-ios-back-fill" />}>
          Back
        </Button>
      </Box>

      <CustomBreadcrumbs
        heading="Dispute Detail"
        links={[
          { name: 'Dashboard', href: paths.adminDashboard.root },
          { name: 'Disputes', href: paths.adminDashboard.disputes },
          { name: dispute.id },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <Form methods={methods} onSubmit={methods.handleSubmit(() => { })}>
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Stack
              direction={{ xs: 'column', md: 'row' }}
              spacing={2}
              justifyContent="space-between"
              alignItems={{ md: 'flex-start' }}
            >
              <Box sx={{ minWidth: 0 }}>
                <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap" useFlexGap>
                  <Typography variant="subtitle2">{dispute.id}</Typography>
                  <Label variant="soft" color={priorityOption?.color || 'default'}>
                    {priorityOption?.label}
                  </Label>
                  <Label variant="soft" color={statusOption?.color || 'default'}>
                    {statusOption?.label}
                  </Label>
                </Stack>
                <Typography variant="h5" sx={{ mt: 1 }}>
                  {dispute.title}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                  Raised by {dispute.raisedBy} against {dispute.against} · {dispute.openedLabel} ·
                  SLA {dispute.slaLabel}
                </Typography>
              </Box>

              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ minWidth: { md: 480 } }}>
                <Field.Select size="small" name="status" label="Status">
                  {DISPUTE_STATUS_OPTIONS.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Field.Select>
                <Field.Select size="small" name="priority" label="Priority">
                  {DISPUTE_PRIORITY_OPTIONS.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Field.Select>
                <Field.Select size="small" name="assignee" label="Assigned to">
                  {DISPUTE_ASSIGNEE_EDIT_OPTIONS.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Field.Select>
              </Stack>
            </Stack>
          </CardContent>
        </Card>

        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <PartyCard
                  party={dispute.partyA}
                  statement={dispute.claimantStatement}
                  evidence={dispute.evidenceA}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <PartyCard
                  party={dispute.partyB}
                  statement={dispute.respondentStatement}
                  evidence={dispute.evidenceB}
                />
              </Grid>
            </Grid>

            <Card sx={{ mt: 2 }}>
              <CardHeader
                title={
                  <Stack direction="row" spacing={1} alignItems="center">
                    <Typography variant="h6">Linked trade {dispute.tradeId}</Typography>
                    <Label variant="soft" color="info">
                      {TRADE_STATUS_LABEL[dispute.tradeStatus] || dispute.tradeStatus}
                    </Label>
                  </Stack>
                }
              />
              <CardContent>
                <Typography variant="body2" color="text.secondary">
                  {dispute.tradeSummary}
                </Typography>
              </CardContent>
            </Card>

            <Card sx={{ mt: 2 }}>
              <CardHeader
                title="Internal notes"
                subheader="Admins only"
                subheaderTypographyProps={{ variant: 'caption' }}
              />
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
            <Card>
              <CardHeader title="Resolution" />
              <CardContent>
                <RadioGroup
                  value={resolution}
                  onChange={(event) => setValue('resolution', event.target.value)}
                >
                  <Stack spacing={1.5}>
                    {resolutionOptions.map((option) => {
                      const selected = resolution === option.value;
                      return (
                        <Box
                          key={option.value}
                          sx={{
                            p: 1.5,
                            borderRadius: 1,
                            border: '1px solid',
                            borderColor: selected ? 'primary.main' : 'divider',
                          }}
                        >
                          <FormControlLabel
                            value={option.value}
                            control={<Radio />}
                            sx={{ alignItems: 'flex-start', m: 0 }}
                            label={
                              <Box sx={{ ml: 0.5 }}>
                                <Typography variant="subtitle2">{option.title}</Typography>
                                <Typography variant="caption" color="text.secondary">
                                  {option.description}
                                </Typography>
                              </Box>
                            }
                          />
                        </Box>
                      );
                    })}
                  </Stack>
                </RadioGroup>

                <Divider sx={{ my: 2 }} />

                <FormControlLabel
                  control={
                    <Checkbox
                      checked={penalise}
                      onChange={(event) => setValue('penalise', event.target.checked)}
                    />
                  }
                  label="Penalise a user"
                />

                {penalise ? (
                  <Stack spacing={2} sx={{ mt: 2 }}>
                    <Field.Select name="penaliseUser" label="User">
                      <MenuItem value={dispute.partyA.name}>{dispute.partyA.name}</MenuItem>
                      <MenuItem value={dispute.partyB.name}>{dispute.partyB.name}</MenuItem>
                    </Field.Select>
                    <Field.Select name="penalty" label="Penalty">
                      {DISPUTE_PENALTY_OPTIONS.map((option) => (
                        <MenuItem key={option.value} value={option.value}>
                          {option.label}
                        </MenuItem>
                      ))}
                    </Field.Select>
                  </Stack>
                ) : null}

                <Box sx={{ mt: 2 }}>
                  <Field.Text
                    name="outcome"
                    label="Outcome message to both parties"
                    multiline
                    rows={4}
                  />
                </Box>

                <Stack spacing={1.5} sx={{ mt: 2 }}>
                  <Button type="submit" variant="contained" color="primary" fullWidth>
                    Apply resolution
                  </Button>
                  <Button variant="outlined" color="inherit" fullWidth>
                    Escalate
                  </Button>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Form>
    </DashboardContent>
  );
}
