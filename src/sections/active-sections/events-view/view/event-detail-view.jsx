import { useEffect, useMemo, useState } from 'react';

import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import LinearProgress from '@mui/material/LinearProgress';
import Link from '@mui/material/Link';
import MenuItem from '@mui/material/MenuItem';
import Stack from '@mui/material/Stack';
import Tab from '@mui/material/Tab';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import Tabs from '@mui/material/Tabs';
import TextField from '@mui/material/TextField';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import { useTheme } from '@mui/material/styles';

import { ConfirmDialog } from 'src/components/custom-dialog';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
import { EmptyContent } from 'src/components/empty-content';
import { Iconify } from 'src/components/iconify';
import { Label } from 'src/components/label';
import { TableHeadCustom } from 'src/components/table';
import { toast } from 'src/components/snackbar';
import { getDisplayImage } from 'src/constants/upload';
import { useBoolean } from 'src/hooks/use-boolean';
import { useTabs } from 'src/hooks/use-tabs';
import { RouterLink } from 'src/routes/components';
import { useParams, useRouter } from 'src/routes/hooks';
import { paths } from 'src/routes/paths';
import { varAlpha } from 'src/theme/styles';
import { exportToCsv } from 'src/utils/export-to-csv';

import { getEventDetail } from '../mocks/detail';

const AVATAR_COLORS = ['#E6D5E8', '#D5DDEA', '#E8D5DE', '#E4DDD4', '#E7E3D4'];

const ATTENDEE_HEAD = [
  { id: 'person', label: 'Person', minWidth: 220 },
  { id: 'discipline', label: 'Discipline', minWidth: 140 },
  { id: 'rsvp', label: 'RSVP', width: 150 },
  { id: 'shown', label: 'Shown on list', width: 140 },
  { id: 'circleMember', label: 'Circle member', width: 140 },
  { id: 'rsvpDate', label: 'RSVP date', width: 120 },
  { id: 'actions', label: '', width: 280 },
];

const RSVP_COLOR = { Going: 'success', Waitlist: 'warning', Cancelled: 'default' };

const initials = (name) =>
  (name || '')
    .split(' ')
    .map((part) => part.charAt(0))
    .join('')
    .slice(0, 2)
    .toUpperCase();

const rsvpLabel = (person) => {
  if (person.status === 'Waitlist') {
    return person.waitlistPosition ? `Waitlist · #${person.waitlistPosition}` : 'Waitlist';
  }
  return person.status || '—';
};

const shownOnListLabel = (person) => {
  if (person.status !== 'Going') return '—';
  return person.visible ? 'Yes' : 'Hidden';
};

function Fact({ label, children }) {
  return (
    <Box>
      <Typography variant="overline" sx={{ color: 'text.disabled' }}>
        {label}
      </Typography>
      <Box sx={{ mt: 0.5 }}>{children}</Box>
    </Box>
  );
}

function SectionCard({ title, children }) {
  return (
    <Card sx={{ p: 2.5, height: 1 }}>
      <Typography variant="subtitle1" sx={{ mb: 2 }}>
        {title}
      </Typography>
      {children}
    </Card>
  );
}

function EventCover({ name, avatarUrl, location, statusLabel, metaLabel }) {
  const theme = useTheme();
  const primaryDark = theme.vars?.palette?.primary?.dark || theme.palette.primary.dark;
  const primaryMain = theme.vars?.palette?.primary?.main || theme.palette.primary.main;
  const primaryLight = theme.vars?.palette?.primary?.light || theme.palette.primary.light;

  return (
    <Box
      sx={{
        height: { xs: 'auto', md: 1 },
        minHeight: { xs: 220, md: 0 },
        pb: { xs: 3, md: 0 },
        position: 'relative',
        overflow: 'hidden',
        color: 'common.white',
        bgcolor: primaryMain,
        backgroundImage: `linear-gradient(145deg, ${primaryDark} 0%, ${primaryMain} 55%, ${primaryLight} 100%)`,
      }}
    >
      <Box
        sx={{
          top: -100,
          left: -60,
          width: 320,
          height: 320,
          borderRadius: '50%',
          position: 'absolute',
          border: `1px solid ${varAlpha(theme.vars.palette.common.whiteChannel, 0.16)}`,
        }}
      />
      <Box
        sx={{
          right: -140,
          bottom: -170,
          width: 440,
          height: 440,
          borderRadius: '50%',
          position: 'absolute',
          border: `1px solid ${varAlpha(theme.vars.palette.common.whiteChannel, 0.12)}`,
        }}
      />

      <Stack
        direction={{ xs: 'column', md: 'row' }}
        alignItems={{ md: 'center' }}
        sx={{
          left: { md: 24 },
          bottom: { md: 40 },
          zIndex: 10,
          pt: { xs: 6, md: 0 },
          position: { md: 'absolute' },
        }}
      >
        <Avatar
          alt={name}
          src={avatarUrl}
          sx={{
            mx: 'auto',
            width: { xs: 64, md: 128 },
            height: { xs: 64, md: 128 },
            border: `solid 3px ${varAlpha(theme.vars.palette.common.whiteChannel, 0.8)}`,
            boxShadow: `0 8px 24px ${varAlpha(theme.vars.palette.common.blackChannel, 0.24)}`,
            fontSize: { xs: 24, md: 40 },
          }}
        >
          {name?.charAt(0).toUpperCase()}
        </Avatar>

        <Box sx={{ mt: 3, ml: { md: 3 }, textAlign: { xs: 'center', md: 'unset' } }}>
          <Typography variant="h4" sx={{ fontWeight: 800 }}>
            {name}
          </Typography>

          <Stack
            direction="row"
            spacing={1}
            flexWrap="wrap"
            useFlexGap
            alignItems="center"
            justifyContent={{ xs: 'center', md: 'flex-start' }}
            sx={{ mt: 1 }}
          >
            <Stack direction="row" spacing={0.5} alignItems="center" sx={{ opacity: 0.86 }}>
              <Iconify icon="solar:map-point-bold" width={16} />
              <Typography variant="body2">{location || '—'}</Typography>
            </Stack>

            <Stack
              direction="row"
              spacing={0.5}
              alignItems="center"
              sx={{
                py: 0.25,
                px: 1,
                borderRadius: 100,
                bgcolor: varAlpha(theme.vars.palette.common.whiteChannel, 0.16),
                border: `1px solid ${varAlpha(theme.vars.palette.common.whiteChannel, 0.24)}`,
              }}
            >
              <Iconify icon="solar:calendar-bold" width={14} />
              <Typography variant="caption" sx={{ fontWeight: 700 }}>
                {statusLabel}
              </Typography>
            </Stack>

            {metaLabel ? (
              <Stack
                direction="row"
                spacing={0.5}
                alignItems="center"
                sx={{
                  py: 0.25,
                  px: 1,
                  borderRadius: 100,
                  bgcolor: varAlpha(theme.vars.palette.common.whiteChannel, 0.16),
                  border: `1px solid ${varAlpha(theme.vars.palette.common.whiteChannel, 0.24)}`,
                }}
              >
                <Typography variant="caption" sx={{ fontWeight: 700 }}>
                  {metaLabel}
                </Typography>
              </Stack>
            ) : null}
          </Stack>
        </Box>
      </Stack>
    </Box>
  );
}

function EventAboutCard({ event }) {
  return (
    <Card sx={{ p: { xs: 2, md: 2.5 }, mb: 2 }}>
      <Typography variant="subtitle1" sx={{ mb: 1 }}>
        About
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2.5, maxWidth: 720 }}>
        {event.description}
      </Typography>
      <Box
        sx={{
          display: 'grid',
          gap: 2,
          gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: 'repeat(3, minmax(0, 1fr))' },
        }}
      >
        <Fact label="Date">
          <Typography variant="subtitle2">{event.dateLabel}</Typography>
        </Fact>
        <Fact label="Time">
          <Typography variant="subtitle2">{event.timeLabel}</Typography>
        </Fact>
        <Fact label="Public area">
          <Typography variant="subtitle2">{event.publicArea || event.location}</Typography>
        </Fact>
        <Fact label="Exact meeting point">
          <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap" useFlexGap>
            <Typography variant="subtitle2">{event.meetingPoint}</Typography>
            {event.meetingPointNote ? (
              <Label variant="soft" color="default">
                {event.meetingPointNote}
              </Label>
            ) : null}
          </Stack>
        </Fact>
        <Fact label="Capacity">
          <Typography variant="subtitle2">{event.capacity}</Typography>
        </Fact>
        <Fact label="Created">
          <Typography variant="subtitle2">{event.createdAt}</Typography>
        </Fact>
      </Box>
    </Card>
  );
}

function RsvpPanel({ event }) {
  const rsvp = event.rsvp || { going: 0, pending: 0, waitlist: 0, cancelled: 0 };
  const capacity = event.capacity || 0;
  const taken = rsvp.going || 0;
  const percent = capacity ? Math.min(100, Math.round((taken / capacity) * 100)) : 0;
  const stats = [
    { label: 'Going', value: rsvp.going },
    { label: 'Pending approval', value: rsvp.pending },
    { label: 'Waitlist', value: rsvp.waitlist },
    { label: 'Cancelled', value: rsvp.cancelled },
  ];

  return (
    <Box sx={{ display: 'grid', gap: 2, gridTemplateColumns: { xs: '1fr', lg: '1.2fr 0.8fr' } }}>
      <SectionCard title="RSVP breakdown">
        <Box sx={{ display: 'grid', gap: 1.5, gridTemplateColumns: { xs: '1fr 1fr', sm: 'repeat(4, 1fr)' } }}>
          {stats.map((item) => (
            <Box key={item.label} sx={{ p: 1.5, borderRadius: 1.5, bgcolor: 'background.neutral' }}>
              <Typography variant="h5">{item.value}</Typography>
              <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                {item.label}
              </Typography>
            </Box>
          ))}
        </Box>

        <LinearProgress
          variant="determinate"
          value={percent}
          sx={{ mt: 2.5, height: 8, borderRadius: 99, bgcolor: 'background.neutral' }}
        />
        <Typography variant="caption" sx={{ mt: 1.25, display: 'block', color: 'text.secondary' }}>
          {`${taken} of ${capacity} places taken. When someone cancels, the first person on the waitlist gets an offer to accept the place.`}
        </Typography>
      </SectionCard>

      <SectionCard title="Visibility on attendee list">
        <Stack spacing={1.5}>
          <Stack direction="row" justifyContent="space-between">
            <Typography variant="body2">Shown publicly</Typography>
            <Typography variant="subtitle2">{event.visibilityList?.shown || 0}</Typography>
          </Stack>
          <Stack direction="row" justifyContent="space-between">
            <Typography variant="body2">Going but hidden</Typography>
            <Typography variant="subtitle2">{event.visibilityList?.hidden || 0}</Typography>
          </Stack>
        </Stack>
        <Typography variant="caption" sx={{ mt: 2, display: 'block', color: 'text.secondary' }}>
          Attendees choose whether they appear on the list. Admins see everyone.
        </Typography>
      </SectionCard>
    </Box>
  );
}

function AttendeesPanel({ attendees, onRemove }) {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState('all');
  const [pendingRemove, setPendingRemove] = useState(null);

  const rows = useMemo(() => {
    const needle = query.trim().toLowerCase();

    return attendees.filter((person) => {
      const matchesQuery =
        !needle ||
        person.name.toLowerCase().includes(needle) ||
        (person.craft || '').toLowerCase().includes(needle);
      const matchesStatus = status === 'all' || person.status === status;
      return matchesQuery && matchesStatus;
    });
  }, [attendees, query, status]);

  const handleExport = () => {
    exportToCsv({
      filename: 'event-attendees',
      headers: [
        { key: 'name', label: 'Person' },
        { key: 'craft', label: 'Discipline' },
        { key: 'status', label: 'RSVP' },
        { key: 'shown', label: 'Shown on list' },
        { key: 'circleMember', label: 'Circle member' },
        { key: 'rsvpDate', label: 'RSVP date' },
      ],
      rows: rows.map((person) => ({
        name: person.name,
        craft: person.craft,
        status: rsvpLabel(person),
        shown: shownOnListLabel(person),
        circleMember: person.circleMember ? 'Yes' : 'No',
        rsvpDate: person.rsvpDate || '—',
      })),
    });
  };

  return (
    <Card>
      <Stack direction={{ xs: 'column', md: 'row' }} spacing={1.5} sx={{ p: 2 }}>
        <TextField
          fullWidth
          size="small"
          value={query}
          placeholder="Search attendees"
          onChange={(event) => setQuery(event.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Iconify icon="eva:search-fill" width={18} sx={{ color: 'text.disabled' }} />
              </InputAdornment>
            ),
          }}
        />
        <TextField
          select
          size="small"
          label="Status"
          value={status}
          onChange={(event) => setStatus(event.target.value)}
          sx={{ minWidth: 160 }}
        >
          <MenuItem value="all">All</MenuItem>
          <MenuItem value="Going">Going</MenuItem>
          <MenuItem value="Waitlist">Waitlist</MenuItem>
          <MenuItem value="Cancelled">Cancelled</MenuItem>
        </TextField>
        <Button variant="outlined" color="inherit" sx={{ flexShrink: 0 }} onClick={handleExport}>
          Export list
        </Button>
      </Stack>

      <Box
        sx={{
          width: 1,
          overflowX: 'auto',
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
          '&::-webkit-scrollbar': { display: 'none' },
        }}
      >
        <Table size="medium" sx={{ minWidth: 1100, '& .MuiTableCell-head': { whiteSpace: 'nowrap' } }}>
          <TableHeadCustom headLabel={ATTENDEE_HEAD} />
          <TableBody>
            {rows.length ? (
              rows.map((person) => (
                <TableRow key={person.id} hover>
                  <TableCell>
                    <Stack direction="row" spacing={1.5} alignItems="center">
                      <Avatar
                        alt={person.name}
                        sx={{
                          width: 36,
                          height: 36,
                          fontSize: 12,
                          fontWeight: 700,
                          color: 'text.primary',
                          bgcolor: AVATAR_COLORS[person.name.length % AVATAR_COLORS.length],
                        }}
                      >
                        {initials(person.name)}
                      </Avatar>
                      <Typography variant="subtitle2">{person.name}</Typography>
                    </Stack>
                  </TableCell>
                  <TableCell>{person.craft || '—'}</TableCell>
                  <TableCell sx={{ whiteSpace: 'nowrap' }}>
                    <Label variant="soft" color={RSVP_COLOR[person.status] || 'default'} sx={{ px: 1.25, height: 28 }}>
                      {rsvpLabel(person)}
                    </Label>
                  </TableCell>
                  <TableCell>{shownOnListLabel(person)}</TableCell>
                  <TableCell>{person.circleMember ? 'Yes' : 'No'}</TableCell>
                  <TableCell sx={{ whiteSpace: 'nowrap' }}>{person.rsvpDate || '—'}</TableCell>
                  <TableCell align="right" sx={{ whiteSpace: 'nowrap' }}>
                    <Stack direction="row" spacing={1} justifyContent="flex-end" sx={{ flexWrap: 'nowrap' }}>
                      <Button
                        size="small"
                        variant="outlined"
                        color="inherit"
                        sx={{ whiteSpace: 'nowrap', flexShrink: 0, px: 1.5 }}
                        onClick={() => router.push(paths.adminDashboard.users.root)}
                      >
                        View profile
                      </Button>
                      <Button
                        size="small"
                        variant="outlined"
                        color="inherit"
                        sx={{ whiteSpace: 'nowrap', flexShrink: 0, px: 1.5 }}
                        onClick={() => setPendingRemove(person)}
                      >
                        Remove RSVP
                      </Button>
                    </Stack>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7}>
                  <EmptyContent filled title="No attendees" sx={{ py: 6 }} />
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Box>

      <ConfirmDialog
        open={Boolean(pendingRemove)}
        onClose={() => setPendingRemove(null)}
        title="Remove RSVP"
        content={pendingRemove ? `Remove RSVP for ${pendingRemove.name}?` : null}
        action={
          <Button
            variant="contained"
            color="error"
            onClick={() => {
              if (!pendingRemove) return;
              onRemove(pendingRemove);
              setPendingRemove(null);
            }}
          >
            Remove RSVP
          </Button>
        }
      />
    </Card>
  );
}

function ReportsPanel({ reports, onClear }) {
  if (!reports.length) return <EmptyContent filled title="No reports" sx={{ py: 10 }} />;

  return (
    <Stack spacing={2}>
      {reports.map((report) => (
        <Card key={report.id} sx={{ p: 2.5 }}>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems={{ sm: 'center' }}>
            <Box sx={{ flex: '1 1 auto', minWidth: 0 }}>
              <Typography variant="subtitle2">{report.title}</Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                {`${report.reason} · ${report.when}`}
              </Typography>
            </Box>
            <Button size="small" variant="outlined" color="inherit" onClick={() => onClear(report)}>
              Dismiss
            </Button>
          </Stack>
        </Card>
      ))}
    </Stack>
  );
}

function ActivityPanel({ items }) {
  if (!items.length) return <EmptyContent filled title="No activity" sx={{ py: 10 }} />;

  return (
    <Card sx={{ p: { xs: 2, md: 2.5 } }}>
      <Typography variant="subtitle1" sx={{ mb: 1 }}>
        Activity log
      </Typography>
      <Stack divider={<Box sx={{ borderBottom: (theme) => `dashed 1px ${theme.vars.palette.divider}` }} />}>
        {items.map((item) => (
          <Stack key={item.id} direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 0.25, sm: 3 }} sx={{ py: 1.5 }}>
            <Typography variant="caption" sx={{ width: { sm: 120 }, flexShrink: 0, color: 'text.secondary' }}>
              {item.when}
            </Typography>
            <Typography variant="body2">{item.text}</Typography>
          </Stack>
        ))}
      </Stack>
    </Card>
  );
}

export function EventDetailView() {
  const { id } = useParams();
  const router = useRouter();
  const { value, onChange } = useTabs('rsvps');
  const [event, setEvent] = useState(() => getEventDetail(id));
  const editDetails = useBoolean();
  const cancelEvent = useBoolean();
  const [editName, setEditName] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [cancelReason, setCancelReason] = useState('');

  useEffect(() => {
    setEvent(getEventDetail(id));
  }, [id]);

  if (!event) {
    return (
      <Box sx={{ px: { xs: 2, md: 6 }, pb: 5, pt: 3 }}>
        <CustomBreadcrumbs
          heading="Event"
          links={[
            { name: 'Dashboard', href: paths.adminDashboard.root },
            { name: 'Events', href: paths.adminDashboard.events },
            { name: 'Event' },
          ]}
          sx={{ mb: { xs: 3, md: 3 } }}
        />
        <EmptyContent filled sx={{ py: 10 }} />
      </Box>
    );
  }

  const tabs = [
    { value: 'rsvps', label: 'RSVPs' },
    { value: 'attendees', label: `Attendees · ${event.rsvp?.going || event.attendeesList.length}` },
    { value: 'reports', label: `Reports · ${event.reports.length}` },
    { value: 'activity', label: 'Activity log' },
  ];

  return (
    <Box sx={{ px: { xs: 2, md: 5 }, pb: 5, pt: 1 }}>
      <CustomBreadcrumbs
        heading={event.name}
        links={[
          { name: 'Dashboard', href: paths.adminDashboard.root },
          { name: 'Events', href: paths.adminDashboard.events },
          { name: event.name },
        ]}
        action={
          <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap justifyContent="flex-end">
            <Button
              variant="outlined"
              color="inherit"
              size="small"
              onClick={() => toast.success(`Message started with ${event.organizer}`)}
            >
              Message organizer
            </Button>
            <Button
              variant="outlined"
              color="inherit"
              size="small"
              onClick={() => {
                setEditName(event.name);
                setEditDescription(event.description || '');
                editDetails.onTrue();
              }}
            >
              Edit event
            </Button>
            <Button variant="outlined" color="error" size="small" onClick={cancelEvent.onTrue}>
              Cancel event
            </Button>
          </Stack>
        }
        sx={{ mb: 1 }}
      />

      <Typography variant="body2" sx={{ mb: 3, color: 'text.secondary' }}>
        Hosted by{' '}
        <Link
          component={RouterLink}
          href={event.circleId ? paths.adminDashboard.circleDetails(event.circleId) : paths.adminDashboard.circles}
          underline="hover"
        >
          {event.host}
        </Link>
        {` · organized by ${event.organizer} · ID ${event.code}`}
      </Typography>

      <Card sx={{ mb: 3, height: { xs: 'auto', md: 320 }, position: 'relative' }}>
        <EventCover
          name={event.name}
          avatarUrl={getDisplayImage(event.image)}
          location={event.publicArea || event.location}
          statusLabel={event.publishLabel || 'Published'}
          metaLabel={`${event.placesLeft} places left`}
        />

        <Box
          sx={{
            display: 'flex',
            justifyContent: 'flex-end',
            gap: 1,
            width: 1,
            top: 20,
            zIndex: 9,
            px: { xs: 2, md: 3 },
            position: 'absolute',
          }}
        >
          <Tooltip title="Edit" arrow placement="top">
            <IconButton
              onClick={() => {
                setEditName(event.name);
                setEditDescription(event.description || '');
                editDetails.onTrue();
              }}
              sx={{
                color: 'common.white',
                bgcolor: (theme) => varAlpha(theme.vars.palette.common.whiteChannel, 0.16),
                border: (theme) => `1px solid ${varAlpha(theme.vars.palette.common.whiteChannel, 0.24)}`,
                '&:hover': {
                  bgcolor: (theme) => varAlpha(theme.vars.palette.common.whiteChannel, 0.24),
                },
              }}
            >
              <Iconify icon="solar:pen-bold" />
            </IconButton>
          </Tooltip>
        </Box>

        <Box
          display="flex"
          justifyContent={{ xs: 'center', md: 'flex-end' }}
          sx={{
            width: 1,
            bottom: 0,
            zIndex: 9,
            px: { xs: 0, md: 3 },
            position: { xs: 'relative', md: 'absolute' },
            bgcolor: 'background.paper',
          }}
        >
          <Tabs
            value={value}
            onChange={onChange}
            variant="scrollable"
            scrollButtons="auto"
            allowScrollButtonsMobile
            sx={{ maxWidth: 1 }}
          >
            {tabs.map((tab) => (
              <Tab key={tab.value} value={tab.value} label={tab.label} />
            ))}
          </Tabs>
        </Box>
      </Card>

      {value === 'rsvps' && (
        <>
          <EventAboutCard event={event} />
          <RsvpPanel event={event} />
        </>
      )}
      {value === 'attendees' && (
        <AttendeesPanel
          attendees={event.attendeesList}
          onRemove={(person) => {
            setEvent((prev) => {
              const nextList = prev.attendeesList.filter((item) => item.id !== person.id);
              const rsvp = { ...(prev.rsvp || { going: 0, pending: 0, waitlist: 0, cancelled: 0 }) };
              if (person.status === 'Going') rsvp.going = Math.max(0, (rsvp.going || 0) - 1);
              if (person.status === 'Waitlist') rsvp.waitlist = Math.max(0, (rsvp.waitlist || 0) - 1);
              if (person.status === 'Cancelled') rsvp.cancelled = Math.max(0, (rsvp.cancelled || 0) - 1);
              return { ...prev, attendeesList: nextList, rsvp };
            });
          }}
        />
      )}
      {value === 'reports' && (
        <ReportsPanel
          reports={event.reports}
          onClear={(report) => {
            setEvent((prev) => ({
              ...prev,
              reports: prev.reports.filter((item) => item.id !== report.id),
            }));
            toast.success('Report dismissed');
          }}
        />
      )}
      {value === 'activity' && <ActivityPanel items={event.activity} />}

      <Dialog fullWidth maxWidth="sm" open={editDetails.value} onClose={editDetails.onFalse}>
        <DialogTitle>Edit event</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ pt: 1 }}>
            <TextField fullWidth label="Name" value={editName} onChange={(eventInput) => setEditName(eventInput.target.value)} />
            <TextField
              fullWidth
              multiline
              minRows={3}
              label="Description"
              value={editDescription}
              onChange={(eventInput) => setEditDescription(eventInput.target.value)}
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button variant="outlined" color="inherit" onClick={editDetails.onFalse}>
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={() => {
              if (!editName.trim()) {
                toast.error('Name is required');
                return;
              }
              setEvent((prev) => ({
                ...prev,
                name: editName.trim(),
                description: editDescription.trim(),
              }));
              editDetails.onFalse();
              toast.success('Event updated');
            }}
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>

      <ConfirmDialog
        open={cancelEvent.value}
        onClose={cancelEvent.onFalse}
        title="Cancel event"
        content={
          <Stack spacing={2} sx={{ pt: 1 }}>
            <Typography variant="body2">
              Everyone who RSVP&apos;d will get an automatic notice. The event stays visible as Cancelled for 7 days.
            </Typography>
            <TextField
              fullWidth
              label="Reason"
              value={cancelReason}
              onChange={(eventInput) => setCancelReason(eventInput.target.value)}
            />
          </Stack>
        }
        action={
          <Button
            variant="contained"
            color="error"
            onClick={() => {
              if (!cancelReason.trim()) {
                toast.error('Cancellation reason is required');
                return;
              }
              setEvent((prev) => ({ ...prev, publishLabel: 'Cancelled', status: 'closed' }));
              cancelEvent.onFalse();
              setCancelReason('');
              toast.success('Event cancelled');
              router.push(paths.adminDashboard.events);
            }}
          >
            Cancel event
          </Button>
        }
      />
    </Box>
  );
}
