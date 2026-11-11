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
import { LoadingScreen } from 'src/components/loading-screen';
import { TableHeadCustom } from 'src/components/table';
import { toast } from 'src/components/snackbar';
import { getDisplayImage } from 'src/constants/upload';
import { useBoolean } from 'src/hooks/use-boolean';
import { useTabs } from 'src/hooks/use-tabs';
import { useParams, useRouter } from 'src/routes/hooks';
import { paths } from 'src/routes/paths';
import {
  useGetCircleByIdQuery,
  useLazyGetCircleMembersQuery,
  useSuspendCircleMutation,
  useUpdateCircleMutation,
} from 'src/store/Reducer/circles-api';
import { useGetReportsQuery } from 'src/store/Reducer/reports-api';
import { varAlpha } from 'src/theme/styles';
import { exportToCsv } from 'src/utils/export-to-csv';
import { handleApiError } from 'src/utils/errorHandler';
import { getGoogleMapsApiKey } from 'src/utils/google-maps';

import { useLocation } from 'react-router-dom';

import { mapApiReports } from '../../events-view/map-event-reports';
import {
  getCirclePrivacyOption,
  getCircleStatusOption,
  isCircleSuspended,
  resolveCircleLifecycleStatus,
} from '../circle-status';
import { mapCircleMemberApi, resolveCircleDetail } from '../map-circle-detail';

import 'src/components/map/styles.css';

const AVATAR_COLORS = ['#E6D5E8', '#D5DDEA', '#E8D5DE', '#E4DDD4', '#E7E3D4'];
const ROLE_COLOR = { Owner: 'warning', Organizer: 'warning', Member: 'default' };
const STATUS_COLOR = { Active: 'success', Muted: 'warning', Published: 'success', Draft: 'default', Completed: 'default' };

const initials = (name) =>
  (name || '')
    .split(' ')
    .map((part) => part.charAt(0))
    .join('')
    .slice(0, 2)
    .toUpperCase();

function CircleCover({ name, avatarUrl, homeArea, statusLabel, joiningLabel, featured, suspended }) {
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
              <Typography variant="body2">{homeArea || '—'}</Typography>
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
              <Iconify icon="solar:users-group-rounded-bold" width={14} />
              <Typography variant="caption" sx={{ fontWeight: 700 }}>
                {statusLabel}
              </Typography>
            </Stack>

            {joiningLabel ? (
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
                  {joiningLabel}
                </Typography>
              </Stack>
            ) : null}

            {suspended ? (
              <Stack
                direction="row"
                spacing={0.5}
                alignItems="center"
                sx={{
                  py: 0.25,
                  px: 1,
                  borderRadius: 100,
                  bgcolor: varAlpha(theme.vars.palette.error.mainChannel, 0.28),
                  border: `1px solid ${varAlpha(theme.vars.palette.error.mainChannel, 0.5)}`,
                }}
              >
                <Iconify icon="solar:danger-triangle-bold" width={14} />
                <Typography variant="caption" sx={{ fontWeight: 700 }}>
                  Suspended
                </Typography>
              </Stack>
            ) : null}

            {featured ? (
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
                <Iconify icon="solar:star-bold" width={14} />
                <Typography variant="caption" sx={{ fontWeight: 700 }}>
                  Featured
                </Typography>
              </Stack>
            ) : null}
          </Stack>
        </Box>
      </Stack>
    </Box>
  );
}

function googleMapEmbedSrc(latitude, longitude) {
  const apiKey = getGoogleMapsApiKey();
  const lat = Number(latitude);
  const lng = Number(longitude);
  if (!apiKey || !Number.isFinite(lat) || !Number.isFinite(lng)) return '';
  return `https://www.google.com/maps/embed/v1/place?key=${encodeURIComponent(apiKey)}&q=${lat},${lng}&zoom=14`;
}

function CircleMapCanvas({ latitude, longitude, height = 160 }) {
  const src = googleMapEmbedSrc(latitude, longitude);

  if (!src) {
    return (
      <Box
        sx={{
          height,
          borderRadius: 1.5,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          bgcolor: 'background.neutral',
        }}
      >
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          Google Maps key missing
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ height, borderRadius: 1.5, overflow: 'hidden', position: 'relative' }}>
      <Box
        component="iframe"
        title="Circle map location"
        src={src}
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        allowFullScreen
        sx={{
          border: 0,
          width: 1,
          height: 1,
          display: 'block',
        }}
      />
    </Box>
  );
}

function OverviewFact({ label, value }) {
  const theme = useTheme();
  const primary = theme.vars.palette.primary;

  return (
    <Box
      sx={{
        p: 1.5,
        minWidth: 0,
        borderRadius: 1.5,
        border: `1px solid ${varAlpha(theme.vars.palette.grey['500Channel'], 0.08)}`,
        background: `linear-gradient(135deg, ${varAlpha(primary.mainChannel, 0.12)} 0%, ${varAlpha(primary.darkChannel, 0.03)} 100%)`,
      }}
    >
      <Typography variant="overline" sx={{ color: 'text.disabled' }}>
        {label}
      </Typography>
      <Typography variant="subtitle2" sx={{ wordBreak: 'break-word' }}>
        {value}
      </Typography>
    </Box>
  );
}

function DetailSectionCard({ title, subtitle, icon, children }) {
  const theme = useTheme();
  const primary = theme.vars.palette.primary;

  return (
    <Card
      sx={{
        height: 1,
        overflow: 'hidden',
        position: 'relative',
        border: `1px solid ${varAlpha(theme.vars.palette.grey['500Channel'], 0.08)}`,
        background: `linear-gradient(135deg, ${varAlpha(primary.mainChannel, 0.16)} 0%, ${varAlpha(primary.darkChannel, 0.04)} 100%)`,
      }}
    >
      <Stack
        direction="row"
        spacing={1.5}
        alignItems="center"
        sx={{ px: { xs: 2, md: 2.5 }, pt: { xs: 2, md: 2.5 }, pb: 1.5 }}
      >
        <Box
          sx={{
            width: 40,
            height: 40,
            flexShrink: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: 1,
            color: primary.contrastText,
            background: `linear-gradient(135deg, ${primary.light} 0%, ${primary.main} 100%)`,
          }}
        >
          <Iconify icon={icon || 'solar:info-circle-bold'} width={20} />
        </Box>
        <Box sx={{ minWidth: 0 }}>
          <Typography variant="subtitle1" noWrap>
            {title}
          </Typography>
          {subtitle ? (
            <Typography variant="caption" color="text.secondary" noWrap sx={{ display: 'block' }}>
              {subtitle}
            </Typography>
          ) : null}
        </Box>
      </Stack>

      <Box sx={{ px: { xs: 2, md: 2.5 }, pb: { xs: 2, md: 2.5 }, position: 'relative', zIndex: 1 }}>
        {children}
      </Box>

      <Box
        sx={{
          top: -28,
          right: -32,
          width: 88,
          height: 88,
          opacity: 0.2,
          borderRadius: '50%',
          position: 'absolute',
          background: `linear-gradient(135deg, ${primary.main} 0%, ${varAlpha(primary.mainChannel, 0)} 100%)`,
        }}
      />
    </Card>
  );
}

function MapLocationCard({ circle, area }) {
  const facts = [
    { label: 'City', value: area.homeArea || circle.city || '—' },
    { label: 'Coordinates', value: circle.coordinatesLabel || '—' },
    { label: 'Distance', value: circle.distanceLabel || '—' },
  ];

  return (
    <DetailSectionCard
      title="Map location"
      subtitle={area.homeArea || circle.city || '—'}
      icon="solar:map-point-bold"
    >
      <Box sx={{ borderRadius: 1.5, overflow: 'hidden' }}>
        <CircleMapCanvas latitude={area.latitude} longitude={area.longitude} height={180} />
      </Box>
      <Box
        sx={{
          mt: 2,
          display: 'grid',
          gap: 1.5,
          gridTemplateColumns: { xs: '1fr', sm: 'repeat(3, minmax(0, 1fr))' },
        }}
      >
        {facts.map((fact) => (
          <OverviewFact key={fact.label} label={fact.label} value={fact.value} />
        ))}
      </Box>
    </DetailSectionCard>
  );
}

function OverviewPanel({ circle, area }) {
  const privacyOption = getCirclePrivacyOption(circle.privacy);
  const statusOption = getCircleStatusOption(String(circle.status || 'active').toLowerCase());
  const facts = [
    { label: 'Name', value: circle.name || '—' },
    { label: 'Purpose', value: circle.purpose || circle.description || '—' },
    { label: 'Category', value: circle.category || '—' },
    {
      label: 'Status',
      value: isCircleSuspended(circle.status)
        ? 'Suspended'
        : statusOption?.label || circle.status || 'Active',
    },
    { label: 'Cover image', value: circle.coverImage || circle.image || '—' },
    { label: 'City', value: circle.city || area?.homeArea || '—' },
    { label: 'Privacy', value: privacyOption?.label || circle.privacy || '—' },
    { label: 'Location type', value: circle.locationRaw?.type || '—' },
    { label: 'Coordinates', value: circle.coordinatesLabel || '—' },
    { label: 'Member count', value: String(circle.memberCount ?? circle.members ?? 0) },
    { label: 'Pending requests', value: String(circle.pendingRequestCount ?? 0) },
    { label: 'Joined invitations', value: String(circle.joinedInvitationCount ?? 0) },
    { label: 'Pending invitations', value: String(circle.pendingInvitationCount ?? 0) },
    { label: 'Open drops', value: String(circle.openDrops?.length ?? circle.drops?.length ?? 0) },
    { label: 'Polls', value: String(circle.polls?.length ?? 0) },
    { label: 'Poll', value: circle.poll == null ? 'null' : String(circle.poll) },
    { label: 'Created At', value: circle.createdAtFull || circle.createdAt || '—' },
    { label: 'Updated At', value: circle.updatedAtFull || circle.updatedAt || '—' },
  ];

  return (
    <Stack spacing={2}>
      <Card sx={{ p: { xs: 2, md: 2.5 } }}>
        <Typography variant="subtitle1" sx={{ mb: 1 }}>
          About
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2.5, maxWidth: 720 }}>
          {circle.purpose || circle.description || '—'}
        </Typography>
        <Box
          sx={{
            display: 'grid',
            gap: 2,
            gridTemplateColumns: { xs: '1fr 1fr', md: 'repeat(3, minmax(0, 1fr))' },
          }}
        >
          {facts.map((fact) => (
            <Box key={fact.label}>
              <Typography variant="overline" sx={{ color: 'text.disabled' }}>
                {fact.label}
              </Typography>
              <Typography variant="subtitle2" sx={{ wordBreak: 'break-word' }}>
                {fact.value}
              </Typography>
            </Box>
          ))}
        </Box>
      </Card>

      <Box
        sx={{
          display: 'grid',
          gap: 2,
          gridTemplateColumns: { xs: '1fr', md: 'minmax(0, 0.95fr) minmax(0, 1.05fr)' },
          alignItems: 'stretch',
        }}
      >
        <OrganizerCard organizers={circle.organizers || []} />
        <MapLocationCard circle={circle} area={area} />
      </Box>
    </Stack>
  );
}

function OrganizerCard({ organizers = [] }) {
  const person = organizers[0];

  if (!person) {
    return (
      <DetailSectionCard title="Organizer" subtitle="—" icon="solar:user-bold">
        <Typography variant="body2" color="text.secondary">
          —
        </Typography>
      </DetailSectionCard>
    );
  }

  const facts = [
    { label: 'Name', value: person.name || '—' },
    { label: 'Handle', value: person.craft || person.handle || '—' },
    { label: 'Role', value: person.role || 'Owner' },
    { label: 'Since', value: person.since || '—' },
  ];

  return (
    <DetailSectionCard
      title="Organizer"
      subtitle={person.craft || person.handle || person.name || '—'}
      icon="solar:user-bold"
    >
      <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 2 }}>
        <Avatar
          alt={person.name}
          src={person.image ? getDisplayImage(person.image) : undefined}
          sx={{
            width: 48,
            height: 48,
            fontSize: 14,
            fontWeight: 700,
            color: 'common.white',
            bgcolor: 'primary.main',
          }}
        >
          {initials(person.name)}
        </Avatar>
        <Box sx={{ minWidth: 0, flex: '1 1 auto' }}>
          <Typography variant="subtitle1" noWrap>
            {person.name}
          </Typography>
          <Typography variant="caption" color="text.secondary" noWrap sx={{ display: 'block' }}>
            {person.craft || person.handle || '—'}
          </Typography>
        </Box>
        <Label variant="soft" color={ROLE_COLOR[person.role] || 'warning'} sx={{ flexShrink: 0 }}>
          {person.role || 'Owner'}
        </Label>
      </Stack>

      <Box
        sx={{
          display: 'grid',
          gap: 1.5,
          gridTemplateColumns: { xs: '1fr 1fr', md: 'repeat(2, minmax(0, 1fr))' },
        }}
      >
        {facts.map((fact) => (
          <OverviewFact key={fact.label} label={fact.label} value={fact.value} />
        ))}
      </Box>
    </DetailSectionCard>
  );
}

const isActiveMemberStatus = (status) => {
  const value = String(status || 'active').trim().toLowerCase();
  return value === 'active';
};

const isPendingRequestStatus = (status) => {
  const value = String(status || 'pending').trim().toLowerCase();
  return value === 'pending';
};

const MEMBER_HEAD = [
  { id: 'member', label: 'Member', minWidth: 220 },
  { id: 'handle', label: 'Handle', minWidth: 150 },
  { id: 'role', label: 'Role', width: 140 },
  { id: 'joined', label: 'Joined', width: 160 },
  { id: 'status', label: 'Status', width: 130 },
  { id: 'connection', label: 'Connection status', minWidth: 160 },
  { id: 'canConnect', label: 'Can send request', width: 160, align: 'center' },
  { id: 'actions', label: '', width: 140 },
];

const EVENT_HEAD = [
  { id: 'event', label: 'Event', minWidth: 260 },
  { id: 'date', label: 'Date', minWidth: 180 },
  { id: 'status', label: 'Status', width: 140 },
  { id: 'open', label: '', width: 56 },
];

const DROP_HEAD = [
  { id: 'title', label: 'Drop', minWidth: 280 },
  { id: 'status', label: 'Status', width: 140 },
  { id: 'date', label: 'Date', width: 160 },
];

function MembersPanel({ circleId, people, memberCount = 0 }) {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [role, setRole] = useState('all');
  const [joined, setJoined] = useState('any');
  const [members, setMembers] = useState(people || []);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [expanded, setExpanded] = useState(false);
  const [fetchMembers, { isFetching }] = useLazyGetCircleMembersQuery();

  useEffect(() => {
    if (!expanded) {
      setMembers((people || []).filter((person) => isActiveMemberStatus(person?.status)));
      setPage(0);
      setTotalPages(1);
    }
  }, [people, expanded]);

  const rows = useMemo(() => {
    const needle = query.trim().toLowerCase();
    const cutoff = new Date('2026-10-03').getTime();

    return members.filter((person) => {
      if (!isActiveMemberStatus(person?.status)) return false;
      const matchesQuery =
        !needle ||
        (person.name || '').toLowerCase().includes(needle) ||
        (person.handle || '').toLowerCase().includes(needle) ||
        (person.craft || '').toLowerCase().includes(needle);
      const matchesRole = role === 'all' || person.role === role;
      const joinedTime = person.joinedAt ? new Date(person.joinedAt).getTime() : 0;
      const matchesJoined =
        joined === 'any' ||
        (joined === 'year' && person.joinedAt?.startsWith('2026')) ||
        (joined === '30' && joinedTime >= cutoff);
      return matchesQuery && matchesRole && matchesJoined;
    });
  }, [members, query, role, joined]);

  const previewCount = people?.length ?? 0;
  const totalMemberCount = Number(memberCount) || 0;
  const hasMoreThanPreview = totalMemberCount > previewCount;
  const canViewMore =
    Boolean(circleId) &&
    ((!expanded && hasMoreThanPreview) || (expanded && page < totalPages));

  const handleViewMore = async () => {
    if (!circleId || isFetching) return;

    const nextPage = expanded ? page + 1 : 1;

    try {
      const response = await fetchMembers({ id: circleId, page: nextPage, limit: 20 }).unwrap();
      const mapped = (response.data || [])
        .map(mapCircleMemberApi)
        .filter((person) => isActiveMemberStatus(person?.status));

      setMembers((prev) => {
        if (!expanded || nextPage === 1) return mapped;
        const existingIds = new Set(prev.map((item) => item.id));
        return [...prev, ...mapped.filter((item) => !existingIds.has(item.id))];
      });
      setExpanded(true);
      setPage(response.meta?.currentPage || nextPage);
      setTotalPages(response.meta?.totalPages || 1);
      if (response.message) toast.success(response.message);
    } catch (error) {
      handleApiError(error);
    }
  };

  const handleExport = () => {
    exportToCsv({
      filename: 'circle-members',
      headers: [
        { key: 'name', label: 'Member' },
        { key: 'handle', label: 'Handle' },
        { key: 'role', label: 'Role' },
        { key: 'joined', label: 'Joined' },
        { key: 'status', label: 'Status' },
        { key: 'connectionStatusLabel', label: 'Connection status' },
        { key: 'canSendConnectionRequestLabel', label: 'Can send request' },
      ],
      rows,
    });
    toast.success('Members exported');
  };

  return (
    <Card>
      <Stack direction={{ xs: 'column', md: 'row' }} spacing={1.5} sx={{ p: 2 }}>
        <TextField
          fullWidth
          size="small"
          value={query}
          placeholder="Search members"
          onChange={(event) => setQuery(event.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Iconify icon="eva:search-fill" width={18} sx={{ color: 'text.disabled' }} />
              </InputAdornment>
            ),
          }}
        />
        <TextField select size="small" label="Role" value={role} onChange={(event) => setRole(event.target.value)} sx={{ minWidth: 140 }}>
          <MenuItem value="all">All</MenuItem>
          <MenuItem value="Owner">Owner</MenuItem>
          <MenuItem value="Organizer">Organizer</MenuItem>
          <MenuItem value="Member">Member</MenuItem>
        </TextField>
        <TextField select size="small" label="Joined" value={joined} onChange={(event) => setJoined(event.target.value)} sx={{ minWidth: 160 }}>
          <MenuItem value="any">Any time</MenuItem>
          <MenuItem value="30">Last 30 days</MenuItem>
          <MenuItem value="year">This year</MenuItem>
        </TextField>
        <Button variant="outlined" color="inherit" sx={{ flexShrink: 0 }} onClick={handleExport}>
          Export
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
        <Table size="medium" sx={{ minWidth: 1200, '& .MuiTableCell-head': { whiteSpace: 'nowrap' } }}>
          <TableHeadCustom headLabel={MEMBER_HEAD} />
          <TableBody>
            {rows.length ? (
              rows.map((person) => (
                <TableRow key={person.id} hover>
                  <TableCell>
                    <Stack direction="row" spacing={1.5} alignItems="center">
                      <Avatar
                        alt={person.name}
                        src={person.image ? getDisplayImage(person.image) : undefined}
                        sx={{ width: 36, height: 36, fontSize: 12, fontWeight: 700, color: 'text.primary', bgcolor: AVATAR_COLORS[person.name.length % AVATAR_COLORS.length] }}
                      >
                        {person.name.startsWith('user') ? '??' : initials(person.name)}
                      </Avatar>
                      <Typography variant="subtitle2">{person.name}</Typography>
                    </Stack>
                  </TableCell>
                  <TableCell>{person.handle ? `@${person.handle}` : '—'}</TableCell>
                  <TableCell sx={{ whiteSpace: 'nowrap' }}>
                    <Label variant="soft" color={ROLE_COLOR[person.role] || 'default'} sx={{ px: 1.25, height: 28 }}>
                      {person.role}
                    </Label>
                  </TableCell>
                  <TableCell>{person.joined || '—'}</TableCell>
                  <TableCell sx={{ whiteSpace: 'nowrap' }}>
                    <Label variant="soft" color={STATUS_COLOR[person.status] || 'success'} sx={{ px: 1.25, height: 28 }}>
                      {person.status || 'Active'}
                    </Label>
                  </TableCell>
                  <TableCell sx={{ whiteSpace: 'nowrap' }}>
                    {person.connectionStatusLabel || '—'}
                  </TableCell>
                  <TableCell align="center" sx={{ whiteSpace: 'nowrap' }}>
                    {person.canSendConnectionRequestLabel || '—'}
                  </TableCell>
                  <TableCell align="right" sx={{ whiteSpace: 'nowrap' }}>
                    <Button
                      size="small"
                      variant="outlined"
                      color="inherit"
                      sx={{ whiteSpace: 'nowrap', flexShrink: 0, px: 1.5 }}
                      onClick={() => {
                        toast.success(`Opening profile for ${person.name}`);
                        router.push(paths.adminDashboard.users.root);
                      }}
                    >
                      View profile
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={8}>
                  <EmptyContent filled title="No members" sx={{ py: 6 }} />
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Box>

      {canViewMore ? (
        <Stack alignItems="center" sx={{ p: 2, pt: 0 }}>
          <Button variant="outlined" color="inherit" disabled={isFetching} onClick={handleViewMore}>
            {isFetching ? 'Loading...' : 'View more'}
          </Button>
        </Stack>
      ) : null}
    </Card>
  );
}

function RequestsPanel({ requests }) {
  const pendingRequests = useMemo(
    () => (requests || []).filter((request) => isPendingRequestStatus(request?.status)),
    [requests]
  );

  return (
    <Card sx={{ p: { xs: 2, md: 2.5 } }}>
      <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" spacing={1} sx={{ mb: 2 }}>
        <Typography variant="subtitle1">Pending join requests</Typography>
        <Typography variant="caption" sx={{ color: 'text.secondary' }}>
          View only. Organizers handle approve and decline in the app.
        </Typography>
      </Stack>

      {pendingRequests.length ? (
        <Stack divider={<Box sx={{ borderBottom: (theme) => `dashed 1px ${theme.vars.palette.divider}` }} />}>
          {pendingRequests.map((request) => (
            <Stack key={request.id} direction={{ xs: 'column', md: 'row' }} alignItems={{ md: 'center' }} spacing={2} sx={{ py: 1.75 }}>
              <Avatar sx={{ width: 40, height: 40, fontSize: 13, fontWeight: 700, color: 'text.primary', bgcolor: AVATAR_COLORS[request.name.length % AVATAR_COLORS.length] }}>
                {initials(request.name)}
              </Avatar>
              <Box sx={{ flex: '1 1 auto', minWidth: 0 }}>
                <Typography variant="subtitle2">{request.name}</Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  {`${request.craft} · ${request.when}${request.note ? ` · “${request.note}”` : ''}`}
                </Typography>
              </Box>
              {request.stuck ? (
                <Label variant="soft" color="warning">
                  {request.stuck}
                </Label>
              ) : null}
            </Stack>
          ))}
        </Stack>
      ) : (
        <EmptyContent filled title="No join requests" sx={{ py: 8 }} />
      )}
    </Card>
  );
}

function EventsPanel({ events }) {
  if (!events.length) return <EmptyContent filled title="No events in this circle" sx={{ py: 10 }} />;

  return (
    <Card>
      <Box
        sx={{
          width: 1,
          overflowX: 'auto',
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
          '&::-webkit-scrollbar': { display: 'none' },
        }}
      >
        <Table size="small" sx={{ minWidth: 720, '& .MuiTableCell-head': { whiteSpace: 'nowrap' } }}>
          <TableHeadCustom headLabel={EVENT_HEAD} />
          <TableBody>
            {events.map((event) => (
              <TableRow
                key={event.id}
                hover
                sx={{ cursor: 'pointer' }}
                onClick={() => toast.success(`Opened ${event.title}`)}
              >
                <TableCell>
                  <Stack direction="row" spacing={1.5} alignItems="center">
                    <Box
                      sx={{
                        width: 48,
                        height: 48,
                        flexShrink: 0,
                        borderRadius: 1,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexDirection: 'column',
                        bgcolor: (theme) => varAlpha(theme.vars.palette.warning.mainChannel, 0.16),
                      }}
                    >
                      <Typography variant="caption" sx={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.06em', lineHeight: 1.1 }}>
                        {String(event.month || '—').toUpperCase()}
                      </Typography>
                      <Typography variant="subtitle2" sx={{ lineHeight: 1.1 }}>
                        {event.day || '—'}
                      </Typography>
                    </Box>
                    <Typography variant="subtitle2">{event.title}</Typography>
                  </Stack>
                </TableCell>
                <TableCell>{event.dateLabel || event.time || '—'}</TableCell>
                <TableCell>
                  <Label variant="soft" color={STATUS_COLOR[event.status] || 'success'}>
                    {event.status || 'Published'}
                  </Label>
                </TableCell>
                <TableCell align="right">
                  <IconButton
                    size="small"
                    onClick={(clickEvent) => {
                      clickEvent.stopPropagation();
                      toast.success(`Opened ${event.title}`);
                    }}
                  >
                    <Iconify icon="eva:arrow-ios-forward-fill" width={18} />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Box>
    </Card>
  );
}

function DropsPanel({ drops }) {
  if (!drops.length) return <EmptyContent filled title="No open drops" sx={{ py: 10 }} />;

  return (
    <Card>
      <Box
        sx={{
          width: 1,
          overflowX: 'auto',
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
          '&::-webkit-scrollbar': { display: 'none' },
        }}
      >
        <Table size="small" sx={{ minWidth: 640, '& .MuiTableCell-head': { whiteSpace: 'nowrap' } }}>
          <TableHeadCustom headLabel={DROP_HEAD} />
          <TableBody>
            {drops.map((drop) => (
              <TableRow key={drop.id} hover>
                <TableCell>
                  <Typography variant="subtitle2">{drop.title}</Typography>
                </TableCell>
                <TableCell>
                  <Label variant="soft" color={String(drop.status).toLowerCase() === 'open' ? 'success' : 'default'}>
                    {drop.status || '—'}
                  </Label>
                </TableCell>
                <TableCell>{drop.date || '—'}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Box>
    </Card>
  );
}

function PollsPanel({ polls, onUpdateCircle }) {
  if (!polls.length) return <EmptyContent filled title="No polls" sx={{ py: 10 }} />;

  return (
    <Stack spacing={2}>
      {polls.map((poll) => (
        <Card key={poll.id} sx={{ p: { xs: 2, md: 2.5 } }}>
          <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" spacing={1}>
            <Typography variant="subtitle1">{poll.title}</Typography>
            {poll.status ? (
              <Label variant="soft" color={String(poll.status).toLowerCase().includes('closed') ? 'default' : 'success'}>
                {poll.status}
              </Label>
            ) : null}
          </Stack>

          <Stack spacing={1.5} sx={{ mt: 2 }}>
            {(poll.options || []).length ? (
              poll.options.map((option) => (
                <Stack key={option.label} direction="row" alignItems="center" spacing={2}>
                  <Typography variant="body2" sx={{ width: { xs: 120, sm: 200 }, flexShrink: 0 }}>
                    {option.label}
                  </Typography>
                  <LinearProgress
                    variant="determinate"
                    value={option.percent || 0}
                    sx={{ flex: '1 1 auto', height: 8, borderRadius: 99, bgcolor: 'background.neutral' }}
                  />
                  <Typography variant="caption" sx={{ width: 36, textAlign: 'right', color: 'text.secondary' }}>
                    {`${option.percent || 0}%`}
                  </Typography>
                </Stack>
              ))
            ) : (
              <Typography variant="body2" color="text.secondary">
                —
              </Typography>
            )}
          </Stack>

          <Stack direction={{ xs: 'column', sm: 'row' }} alignItems={{ sm: 'center' }} justifyContent="space-between" spacing={1} sx={{ mt: 2.5 }}>
            <Typography variant="caption" sx={{ color: 'text.secondary' }}>
              {poll.createdBy ? `Created by ${poll.createdBy} · ${poll.votes || 0} votes` : poll.meta || null}
            </Typography>
            <Stack direction="row" spacing={1}>
              <Button
                size="small"
                variant="outlined"
                color="inherit"
                onClick={() => {
                  onUpdateCircle((prev) => ({
                    ...prev,
                    polls: prev.polls.map((item) =>
                      item.id === poll.id ? { ...item, status: 'Closed' } : item
                    ),
                  }));
                  toast.success('Poll closed');
                }}
              >
                Close poll
              </Button>
              <Button
                size="small"
                variant="outlined"
                color="error"
                onClick={() => {
                  onUpdateCircle((prev) => ({
                    ...prev,
                    polls: prev.polls.filter((item) => item.id !== poll.id),
                  }));
                  toast.success('Poll removed');
                }}
              >
                Remove
              </Button>
            </Stack>
          </Stack>
        </Card>
      ))}
    </Stack>
  );
}

function ReportsPanel({ resourceID, resourceType = 'circle' }) {
  const {
    data,
    isLoading,
    isFetching,
    error,
  } = useGetReportsQuery(
    { resourceID, resourceType },
    { skip: !resourceID }
  );

  useEffect(() => {
    if (error) handleApiError(error);
  }, [error]);

  const reports = useMemo(() => mapApiReports(data?.data || []), [data?.data]);

  if ((isLoading || isFetching) && !reports.length) {
    return <LoadingScreen />;
  }

  if (!reports.length) return <EmptyContent filled title="No reports" sx={{ py: 10 }} />;

  return (
    <Stack spacing={2}>
      {reports.map((report) => (
        <Card key={report.id} sx={{ p: { xs: 2, md: 2.5 } }}>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems={{ sm: 'center' }}>
            <Box sx={{ flex: '1 1 auto', minWidth: 0 }}>
              <Typography variant="subtitle2">{report.title}</Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                {report.description
                  ? `${report.description}${report.meta ? ` · ${report.meta}` : ''}`
                  : report.meta || [report.reason, report.when].filter(Boolean).join(' · ') || '—'}
              </Typography>
            </Box>
            {report.status ? (
              <Label variant="soft" color="warning" sx={{ px: 1.25, height: 28, flexShrink: 0 }}>
                {report.status}
              </Label>
            ) : null}
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

export function CircleDetailView() {
  const { id } = useParams();
  const location = useLocation();
  const circlePreview = location.state?.circlePreview;
  const { value, onChange } = useTabs('overview');
  const {
    data: apiCircle,
    isLoading,
    isFetching,
    error,
  } = useGetCircleByIdQuery(id, { skip: !id });
  const { data: reportsData } = useGetReportsQuery(
    { resourceID: id, resourceType: 'circle' },
    { skip: !id }
  );
  const reportsCount = reportsData?.total_length ?? mapApiReports(reportsData?.data || []).length;
  const [updateCircleApi, { isLoading: isUpdatingCircle }] = useUpdateCircleMutation();
  const [suspendCircleApi, { isLoading: isSuspendingCircle }] = useSuspendCircleMutation();

  const [circle, setCircle] = useState(() => resolveCircleDetail(id, null, circlePreview));
  const editDetails = useBoolean();
  const suspend = useBoolean();
  const [editName, setEditName] = useState('');
  const [area, setArea] = useState({
    homeArea: '',
    latitude: 40.7233,
    longitude: -74.003,
  });

  useEffect(() => {
    if (error && !circlePreview) handleApiError(error);
  }, [error, circlePreview]);

  useEffect(() => {
    const detail = resolveCircleDetail(id, apiCircle, circlePreview);
    setCircle(detail);
    if (!detail) return;
    setArea({
      homeArea: detail.city || detail.homeArea || detail.location,
      latitude: detail.latitude || 40.7233,
      longitude: detail.longitude || -74.003,
    });
  }, [id, apiCircle, circlePreview]);

  const updateCircle = (updater) => {
    setCircle((prev) => (typeof updater === 'function' ? updater(prev) : updater));
  };

  if ((isLoading || isFetching) && !circle) {
    return <LoadingScreen />;
  }

  if (!circle) {
    return (
      <Box sx={{ px: { xs: 2, md: 6 }, pb: 5, pt: 3 }}>
        <CustomBreadcrumbs
          heading="Circle"
          links={[
            { name: 'Dashboard', href: paths.adminDashboard.root },
            { name: 'Circles', href: paths.adminDashboard.circles },
            { name: 'Circle' },
          ]}
          sx={{ mb: { xs: 3, md: 3 } }}
        />
        <EmptyContent filled sx={{ py: 10 }} />
      </Box>
    );
  }

  const privacyOption = getCirclePrivacyOption(circle.privacy);
  const circleIsSuspended = isCircleSuspended(circle.status);
  const tabs = [
    { value: 'overview', label: 'Overview' },
    { value: 'members', label: `Members · ${circle.memberCount ?? circle.members ?? circle.people?.length ?? 0}` },
    { value: 'requests', label: `Join requests · ${circle.pendingRequestCount ?? circle.joinRequests?.length ?? 0}` },
    { value: 'events', label: `Events · ${circle.events?.length ?? 0}` },
    { value: 'drops', label: `Open drops · ${circle.openDrops?.length ?? circle.drops?.length ?? 0}` },
    { value: 'polls', label: `Polls · ${circle.polls?.length ?? 0}` },
    { value: 'reports', label: `Reports · ${reportsCount}` },
  ];

  return (
    <Box sx={{ px: { xs: 2, md: 5 }, pb: 5, pt: 1 }}>
      <CustomBreadcrumbs
        heading={circle.name}
        links={[
          { name: 'Dashboard', href: paths.adminDashboard.root },
          { name: 'Circles', href: paths.adminDashboard.circles },
          { name: circle.name },
        ]}
        action={
          <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap justifyContent="flex-end">
            <Button
              variant="outlined"
              color="inherit"
              size="small"
              onClick={() => {
                setEditName(circle.name);
                editDetails.onTrue();
              }}
            >
              Edit details
            </Button>
            <Button
              variant="outlined"
              color={circleIsSuspended ? 'success' : 'error'}
              size="small"
              onClick={suspend.onTrue}
            >
              {circleIsSuspended ? 'Unsuspend Circle' : 'Suspend Circle'}
            </Button>
          </Stack>
        }
        sx={{ mb: 1 }}
      />

      <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap" useFlexGap sx={{ mb: 3 }}>
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          {`Created ${circle.createdAtFull || circle.createdAt} · Updated ${circle.updatedAtFull || circle.updatedAt}`}
        </Typography>
        <Label variant="soft" color={circleIsSuspended ? 'error' : 'success'}>
          {circleIsSuspended ? 'Suspended' : 'Active'}
        </Label>
      </Stack>

      <Card sx={{ mb: 3, height: { xs: 'auto', md: 320 }, position: 'relative' }}>
        <CircleCover
          name={circle.name}
          avatarUrl={getDisplayImage(circle.coverImage || circle.image)}
          homeArea={area?.homeArea || circle.city || circle.homeArea}
          statusLabel={privacyOption?.label || circle.privacy || '—'}
          joiningLabel={circle.category || null}
          featured={circle.featured}
          suspended={circleIsSuspended}
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
                setEditName(circle.name);
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

      {value === 'overview' && <OverviewPanel circle={circle} area={area} />}
      {value === 'members' && (
        <MembersPanel
          circleId={circle._id || circle.id}
          people={circle.latestMembers || circle.people || []}
          memberCount={circle.memberCount ?? circle.members ?? 0}
        />
      )}
      {value === 'requests' && (
        <RequestsPanel requests={circle.joinRequests || []} />
      )}
      {value === 'events' && <EventsPanel events={circle.events || []} />}
      {value === 'drops' && <DropsPanel drops={circle.openDrops || circle.drops || []} />}
      {value === 'polls' && <PollsPanel polls={circle.polls || []} onUpdateCircle={updateCircle} />}
      {value === 'reports' && <ReportsPanel resourceID={id} resourceType="circle" />}
      {/* {value === 'activity' && <ActivityPanel items={circle.activity || []} />} */}

      <Dialog fullWidth maxWidth="sm" open={editDetails.value} onClose={editDetails.onFalse}>
        <DialogTitle>Edit circle details</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ pt: 1 }}>
            <TextField
              fullWidth
              label="Name"
              value={editName}
              onChange={(event) => setEditName(event.target.value)}
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button variant="outlined" color="inherit" onClick={editDetails.onFalse} disabled={isUpdatingCircle}>
            Cancel
          </Button>
          <Button
            variant="contained"
            disabled={isUpdatingCircle}
            onClick={async () => {
              if (!editName.trim()) {
                toast.error('Name is required');
                return;
              }

              try {
                const response = await updateCircleApi({
                  id,
                  name: editName.trim(),
                }).unwrap();

                updateCircle((prev) => ({
                  ...prev,
                  name: editName.trim(),
                }));
                if (response.message) toast.success(response.message);
                editDetails.onFalse();
              } catch (apiError) {
                handleApiError(apiError);
              }
            }}
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>

      <ConfirmDialog
        open={suspend.value}
        onClose={suspend.onFalse}
        title={circleIsSuspended ? 'Unsuspend Circle' : 'Suspend Circle'}
        content={
          circleIsSuspended
            ? 'Unsuspending makes this Circle visible again in search and map, and resumes discussion and events.'
            : 'Suspending hides this Circle from search and map, and pauses discussion and events.'
        }
        action={
          <Button
            variant="contained"
            color={circleIsSuspended ? 'success' : 'error'}
            disabled={isSuspendingCircle}
            onClick={async () => {
              try {
                const response = await suspendCircleApi(id).unwrap();
                const nextStatus = resolveCircleLifecycleStatus(response?.data || {});
                if (nextStatus) {
                  updateCircle((prev) => ({
                    ...prev,
                    status: nextStatus,
                  }));
                }
                if (response.message) toast.success(response.message);
                suspend.onFalse();
              } catch (apiError) {
                handleApiError(apiError);
              }
            }}
          >
            {circleIsSuspended ? 'Unsuspend' : 'Suspend'}
          </Button>
        }
      />
    </Box>
  );
}
