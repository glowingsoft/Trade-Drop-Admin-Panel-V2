import { useEffect, useMemo, useState } from 'react';

import Autocomplete from '@mui/material/Autocomplete';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CircularProgress from '@mui/material/CircularProgress';
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
import { Map, MapControl, MapMarker } from 'src/components/map';
import { TableHeadCustom } from 'src/components/table';
import { toast } from 'src/components/snackbar';
import { CONFIG } from 'src/config-global';
import { getDisplayImage } from 'src/constants/upload';
import { useBoolean } from 'src/hooks/use-boolean';
import { useTabs } from 'src/hooks/use-tabs';
import { useParams, useRouter } from 'src/routes/hooks';
import { paths } from 'src/routes/paths';
import { varAlpha } from 'src/theme/styles';
import { exportToCsv } from 'src/utils/export-to-csv';
import {
  getGoogleMapsApiKey,
  getGooglePlaceDetails,
  searchGooglePlaces,
} from 'src/utils/google-maps';

import { getCircleJoiningOption, getCircleStatusOption } from '../circle-status';
import { getCircleDetail } from '../mocks/detail';

import 'src/components/map/styles.css';

const AVATAR_COLORS = ['#E6D5E8', '#D5DDEA', '#E8D5DE', '#E4DDD4', '#E7E3D4'];

const initials = (name) =>
  (name || '')
    .split(' ')
    .map((part) => part.charAt(0))
    .join('')
    .slice(0, 2)
    .toUpperCase();

function SectionCard({ title, action, children }) {
  return (
    <Card sx={{ p: 2.5, height: 1 }}>
      <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={1} sx={{ mb: 2 }}>
        <Typography variant="subtitle1">{title}</Typography>
        {action}
      </Stack>
      {children}
    </Card>
  );
}

function PersonRow({ person, action }) {
  return (
    <Stack direction="row" alignItems="center" spacing={1.5} sx={{ py: 1.25 }}>
      <Avatar
        alt={person.name}
        sx={{
          width: 40,
          height: 40,
          fontSize: 13,
          fontWeight: 700,
          color: 'text.primary',
          bgcolor: AVATAR_COLORS[person.name.length % AVATAR_COLORS.length],
        }}
      >
        {initials(person.name)}
      </Avatar>
      <Box sx={{ flex: '1 1 auto', minWidth: 0 }}>
        <Typography variant="subtitle2" noWrap>
          {person.name}
        </Typography>
        <Typography variant="caption" sx={{ color: 'text.secondary' }} noWrap>
          {person.since || person.craft}
        </Typography>
      </Box>
      {action}
    </Stack>
  );
}

function CircleCover({ name, avatarUrl, homeArea, statusLabel, joiningLabel, featured }) {
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

function osmEmbedSrc(latitude, longitude, zoomDelta = 0.03) {
  const west = longitude - zoomDelta;
  const south = latitude - zoomDelta;
  const east = longitude + zoomDelta;
  const north = latitude + zoomDelta;
  return `https://www.openstreetmap.org/export/embed.html?bbox=${west}%2C${south}%2C${east}%2C${north}&layer=mapnik`;
}

function ApproximateAreaOverlay({ size = 72 }) {
  return (
    <Box
      sx={{
        width: size,
        height: size,
        borderRadius: '50%',
        position: 'absolute',
        top: '50%',
        left: '50%',
        zIndex: 2,
        pointerEvents: 'none',
        transform: 'translate(-50%, -50%)',
        border: (theme) => `dashed 2px ${theme.vars.palette.primary.main}`,
        bgcolor: (theme) => varAlpha(theme.vars.palette.primary.mainChannel, 0.12),
      }}
    />
  );
}

function MapZoomControls({ onZoomIn, onZoomOut }) {
  return (
    <Stack
      spacing={0.5}
      sx={{
        position: 'absolute',
        top: 10,
        right: 10,
        zIndex: 3,
        bgcolor: 'background.paper',
        borderRadius: 1,
        border: (theme) => `1px solid ${theme.vars.palette.divider}`,
        boxShadow: (theme) => theme.customShadows?.z8 || theme.shadows[2],
      }}
    >
      <IconButton size="small" onClick={onZoomIn} aria-label="Zoom in">
        <Iconify icon="mingcute:add-line" width={18} />
      </IconButton>
      <Box sx={{ borderTop: (theme) => `1px solid ${theme.vars.palette.divider}` }} />
      <IconButton size="small" onClick={onZoomOut} aria-label="Zoom out">
        <Iconify icon="mingcute:minimize-line" width={18} />
      </IconButton>
    </Stack>
  );
}

function CircleMapCanvas({ latitude, longitude, height = 160, interactive = false, onMapClick }) {
  const hasMapbox = Boolean(CONFIG.mapbox.apiKey);
  const [viewState, setViewState] = useState({
    latitude,
    longitude,
    zoom: interactive ? 12.5 : 12,
  });
  const [zoomDelta, setZoomDelta] = useState(0.03);

  useEffect(() => {
    setViewState((prev) => ({
      ...prev,
      latitude,
      longitude,
    }));
  }, [latitude, longitude]);

  if (hasMapbox) {
    return (
      <Box sx={{ height, borderRadius: 1.5, overflow: 'hidden', position: 'relative' }}>
        <Map
          {...viewState}
          onMove={(event) => setViewState(event.viewState)}
          mapStyle="mapbox://styles/mapbox/light-v10"
          onClick={
            interactive
              ? (event) => onMapClick?.({ latitude: event.lngLat.lat, longitude: event.lngLat.lng })
              : undefined
          }
          style={{ width: '100%', height: '100%' }}
        >
          <MapControl hideGeolocate={!interactive} hideScale />
          <MapMarker
            latitude={latitude}
            longitude={longitude}
            draggable={interactive}
            onDragEnd={
              interactive
                ? (event) => onMapClick?.({ latitude: event.lngLat.lat, longitude: event.lngLat.lng })
                : undefined
            }
          />
        </Map>
        <ApproximateAreaOverlay size={interactive ? 110 : 72} />
      </Box>
    );
  }

  return (
    <Box sx={{ height, borderRadius: 1.5, overflow: 'hidden', position: 'relative', bgcolor: 'background.neutral' }}>
      <Box
        component="iframe"
        title="Circle map area"
        src={osmEmbedSrc(latitude, longitude, zoomDelta)}
        sx={{
          border: 0,
          width: 1,
          height: 'calc(100% + 56px)',
          position: 'absolute',
          top: 0,
          left: 0,
          pointerEvents: interactive ? 'auto' : 'none',
        }}
      />
      <ApproximateAreaOverlay size={interactive ? 110 : 72} />
      <MapZoomControls
        onZoomIn={() => setZoomDelta((value) => Math.max(0.005, Number((value * 0.65).toFixed(4))))}
        onZoomOut={() => setZoomDelta((value) => Math.min(0.2, Number((value / 0.65).toFixed(4))))}
      />
    </Box>
  );
}

function MapLocationCard({ circle, area }) {
  return (
    <SectionCard title="Map location">
      <CircleMapCanvas latitude={area.latitude} longitude={area.longitude} />
      <Typography variant="subtitle2" sx={{ mt: 1.5 }}>
        {`Approximate area · ${area.homeArea || circle.location}`}
      </Typography>
      <Typography variant="caption" sx={{ color: 'text.secondary' }}>
        Shown as an area, never an exact address. Global Circles have no map pin.
      </Typography>
    </SectionCard>
  );
}

function OverviewPanel({ circle, area, onUpdateCircle }) {
  const addOrganizer = useBoolean();
  const [organizerName, setOrganizerName] = useState('');
  const health = circle.health || { messages: 0, newMembers: 0, eventsHeld: 0, openReports: 0 };
  const stats = [
    { label: 'Messages', value: health.messages },
    { label: 'New members', value: `+${health.newMembers}` },
    { label: 'Events held', value: health.eventsHeld },
    { label: 'Open report', value: health.openReports },
  ];
  const settings = [
    { key: 'joining', label: 'Joining', value: circle.settings?.joining },
    { key: 'suggestEvents', label: 'Members can suggest events', value: circle.settings?.suggestEvents },
    { key: 'discussion', label: 'Discussion', value: circle.settings?.discussion },
  ];

  const handleAddOrganizer = () => {
    const name = organizerName.trim();
    if (!name) {
      toast.error('Organizer name is required');
      return;
    }
    onUpdateCircle((prev) => ({
      ...prev,
      organizers: [
        ...prev.organizers,
        {
          id: `o-${Date.now()}`,
          name,
          craft: 'Member',
          role: 'Organizer',
          since: `Organizer since ${new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}`,
        },
      ],
    }));
    setOrganizerName('');
    addOrganizer.onFalse();
    toast.success('Organizer added');
  };

  const handleOrganizerAction = (person) => {
    if (person.role === 'Owner') {
      const nextOwner = circle.organizers.find((item) => item.id !== person.id);
      if (!nextOwner) {
        toast.error('Add another organizer before transferring ownership');
        return;
      }
      onUpdateCircle((prev) => ({
        ...prev,
        organizers: prev.organizers.map((item) => {
          if (item.id === nextOwner.id) return { ...item, role: 'Owner', since: `Owner since transfer` };
          if (item.id === person.id) return { ...item, role: 'Organizer', since: `Organizer after transfer` };
          return item;
        }),
      }));
      toast.success(`Ownership transferred to ${nextOwner.name}`);
      return;
    }

    onUpdateCircle((prev) => ({
      ...prev,
      organizers: prev.organizers.filter((item) => item.id !== person.id),
    }));
    toast.success(`${person.name} removed as organizer`);
  };

  const handleSettingChange = (key) => {
    const nextValues = {
      joining:
        circle.settings?.joining === 'Open · anyone can join'
          ? 'Request · organizers approve'
          : 'Open · anyone can join',
      suggestEvents: circle.settings?.suggestEvents === 'On' ? 'Off' : 'On',
      discussion:
        circle.settings?.discussion?.includes('threaded replies on')
          ? 'Members only · threaded replies off'
          : 'Members only · threaded replies on',
    };

    onUpdateCircle((prev) => ({
      ...prev,
      settings: { ...prev.settings, [key]: nextValues[key] },
    }));
    toast.success('Setting updated');
  };

  const facts = [
    { label: 'Category', value: circle.category },
    { label: 'Home area', value: area?.homeArea || circle.homeArea || circle.location },
    { label: 'Visibility', value: circle.visibilityDetail },
    { label: 'Members', value: circle.members.toLocaleString() },
    { label: 'Upcoming events', value: String(circle.upcomingEvents || 0) },
    { label: 'Last activity', value: circle.lastActivity || '—' },
  ];

  return (
    <Stack spacing={2}>
      <Card sx={{ p: { xs: 2, md: 2.5 } }}>
        <Typography variant="subtitle1" sx={{ mb: 1 }}>
          About
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2.5, maxWidth: 720 }}>
          {circle.description}
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
              <Typography variant="subtitle2">{fact.value}</Typography>
            </Box>
          ))}
        </Box>
      </Card>

      <Box sx={{ display: 'grid', gap: 2, gridTemplateColumns: { xs: '1fr', lg: '1.2fr 0.8fr' } }}>
        <SectionCard
          title="Organizers"
          action={
            <Button size="small" variant="outlined" color="inherit" startIcon={<Iconify icon="mingcute:add-line" />} onClick={addOrganizer.onTrue}>
              Add organizer
            </Button>
          }
        >
          <Stack divider={<Box sx={{ borderBottom: (theme) => `dashed 1px ${theme.vars.palette.divider}` }} />}>
            {circle.organizers.map((person) => (
              <PersonRow
                key={person.id}
                person={person}
                action={
                  <Stack direction="row" spacing={1} alignItems="center">
                    <Label variant="soft" color={person.role === 'Owner' ? 'warning' : 'default'}>
                      {person.role}
                    </Label>
                    <Button size="small" variant="outlined" color="inherit" onClick={() => handleOrganizerAction(person)}>
                      {person.role === 'Owner' ? 'Transfer ownership' : 'Remove role'}
                    </Button>
                  </Stack>
                }
              />
            ))}
          </Stack>
          <Box
            sx={{
              mt: 1.5,
              px: 1.5,
              py: 1.25,
              borderRadius: 1,
              bgcolor: (theme) => varAlpha(theme.vars.palette.warning.mainChannel, 0.08),
            }}
          >
            <Typography variant="caption" sx={{ color: 'text.secondary' }}>
              A Circle must always have at least one organizer. If the owner leaves or is banned, ownership moves to the longest-serving organizer, or the Circle is archived.
            </Typography>
          </Box>
        </SectionCard>

        <MapLocationCard circle={circle} area={area} />
      </Box>

      <Box sx={{ display: 'grid', gap: 2, gridTemplateColumns: { xs: '1fr', lg: '1.2fr 0.8fr' } }}>
        <SectionCard title="Health (last 30 days)">
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
        </SectionCard>

        <SectionCard title="Settings">
          <Stack spacing={1.5}>
            {settings.map((item) => (
              <Stack key={item.key} direction="row" alignItems="center" spacing={2}>
                <Box sx={{ flex: '1 1 auto', minWidth: 0 }}>
                  <Typography variant="subtitle2">{item.label}</Typography>
                  <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                    {item.value}
                  </Typography>
                </Box>
                <Button size="small" variant="outlined" color="inherit" onClick={() => handleSettingChange(item.key)}>
                  Change
                </Button>
              </Stack>
            ))}
          </Stack>
        </SectionCard>
      </Box>

      <Dialog fullWidth maxWidth="xs" open={addOrganizer.value} onClose={addOrganizer.onFalse}>
        <DialogTitle>Add organizer</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            autoFocus
            label="Name"
            value={organizerName}
            onChange={(event) => setOrganizerName(event.target.value)}
            sx={{ mt: 1 }}
          />
        </DialogContent>
        <DialogActions>
          <Button variant="outlined" color="inherit" onClick={addOrganizer.onFalse}>
            Cancel
          </Button>
          <Button variant="contained" onClick={handleAddOrganizer}>
            Add
          </Button>
        </DialogActions>
      </Dialog>
    </Stack>
  );
}

const ROLE_COLOR = { Owner: 'warning', Organizer: 'warning', Member: 'default' };
const STATUS_COLOR = { Active: 'success', Muted: 'warning', Published: 'success', Draft: 'default', Completed: 'default' };

const MEMBER_HEAD = [
  { id: 'member', label: 'Member', minWidth: 220 },
  { id: 'discipline', label: 'Discipline', minWidth: 150 },
  { id: 'role', label: 'Role', width: 140 },
  { id: 'joined', label: 'Joined', width: 140 },
  { id: 'messages', label: 'Messages (30d)', width: 150, align: 'center' },
  { id: 'reports', label: 'Reports against', width: 160, align: 'center' },
  { id: 'status', label: 'Status', width: 130 },
  { id: 'actions', label: '', width: 280 },
];

const EVENT_HEAD = [
  { id: 'event', label: 'Event', minWidth: 260 },
  { id: 'date', label: 'Date', minWidth: 180 },
  { id: 'going', label: 'Going / capacity', width: 160 },
  { id: 'audience', label: 'Audience', width: 150 },
  { id: 'status', label: 'Status', width: 140 },
  { id: 'open', label: '', width: 56 },
];

function MembersPanel({ people, onUpdateCircle }) {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [role, setRole] = useState('all');
  const [joined, setJoined] = useState('any');
  const [pendingRemove, setPendingRemove] = useState(null);

  const rows = useMemo(() => {
    const needle = query.trim().toLowerCase();
    const cutoff = new Date('2026-10-03').getTime();

    return people.filter((person) => {
      const matchesQuery = !needle || person.name.toLowerCase().includes(needle) || (person.craft || '').toLowerCase().includes(needle);
      const matchesRole = role === 'all' || person.role === role;
      const joinedTime = person.joinedAt ? new Date(person.joinedAt).getTime() : 0;
      const matchesJoined = joined === 'any' || (joined === 'year' && person.joinedAt?.startsWith('2026')) || (joined === '30' && joinedTime >= cutoff);
      return matchesQuery && matchesRole && matchesJoined;
    });
  }, [people, query, role, joined]);

  const handleExport = () => {
    exportToCsv({
      filename: 'circle-members',
      headers: [
        { key: 'name', label: 'Member' },
        { key: 'craft', label: 'Discipline' },
        { key: 'role', label: 'Role' },
        { key: 'joined', label: 'Joined' },
        { key: 'messages', label: 'Messages (30d)' },
        { key: 'reportsAgainst', label: 'Reports against' },
        { key: 'status', label: 'Status' },
      ],
      rows,
    });
    toast.success('Members exported');
  };

  const handleRemove = () => {
    if (!pendingRemove) return;
    onUpdateCircle((prev) => ({
      ...prev,
      people: prev.people.filter((item) => item.id !== pendingRemove.id),
      members: Math.max(0, (prev.members || 0) - 1),
    }));
    toast.success(`${pendingRemove.name} removed`);
    setPendingRemove(null);
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
        <Table size="medium" sx={{ minWidth: 1320, '& .MuiTableCell-head': { whiteSpace: 'nowrap' } }}>
          <TableHeadCustom headLabel={MEMBER_HEAD} />
          <TableBody>
            {rows.length ? (
              rows.map((person) => (
                <TableRow key={person.id} hover>
                  <TableCell>
                    <Stack direction="row" spacing={1.5} alignItems="center">
                      <Avatar
                        alt={person.name}
                        sx={{ width: 36, height: 36, fontSize: 12, fontWeight: 700, color: 'text.primary', bgcolor: AVATAR_COLORS[person.name.length % AVATAR_COLORS.length] }}
                      >
                        {person.name.startsWith('user') ? '??' : initials(person.name)}
                      </Avatar>
                      <Typography variant="subtitle2">{person.name}</Typography>
                    </Stack>
                  </TableCell>
                  <TableCell>{person.craft || '—'}</TableCell>
                  <TableCell sx={{ whiteSpace: 'nowrap' }}>
                    <Label variant="soft" color={ROLE_COLOR[person.role] || 'default'} sx={{ px: 1.25, height: 28 }}>
                      {person.role}
                    </Label>
                  </TableCell>
                  <TableCell>{person.joined || '—'}</TableCell>
                  <TableCell align="center">{person.messages ?? '—'}</TableCell>
                  <TableCell align="center" sx={{ whiteSpace: 'nowrap' }}>
                    {person.reportsAgainst ? (
                      <Label variant="soft" color="error" sx={{ px: 1.25, height: 28, minWidth: 28 }}>
                        {person.reportsAgainst}
                      </Label>
                    ) : (
                      0
                    )}
                  </TableCell>
                  <TableCell sx={{ whiteSpace: 'nowrap' }}>
                    <Label variant="soft" color={STATUS_COLOR[person.status] || 'default'} sx={{ px: 1.25, height: 28 }}>
                      {person.status || 'Active'}
                    </Label>
                  </TableCell>
                  <TableCell align="right" sx={{ whiteSpace: 'nowrap' }}>
                    <Stack direction="row" spacing={1} justifyContent="flex-end" sx={{ flexWrap: 'nowrap' }}>
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
                      <Button
                        size="small"
                        variant="outlined"
                        color="inherit"
                        sx={{ whiteSpace: 'nowrap', flexShrink: 0, px: 1.5 }}
                        onClick={() => setPendingRemove(person)}
                      >
                        Remove
                      </Button>
                    </Stack>
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

      <ConfirmDialog
        open={Boolean(pendingRemove)}
        onClose={() => setPendingRemove(null)}
        title="Remove member"
        content={pendingRemove ? `Remove ${pendingRemove.name} from this circle?` : null}
        action={
          <Button variant="contained" color="error" onClick={handleRemove}>
            Remove
          </Button>
        }
      />
    </Card>
  );
}

function RequestsPanel({ requests, onUpdateCircle }) {
  const resolveRequest = (request, approved) => {
    onUpdateCircle((prev) => {
      const next = {
        ...prev,
        joinRequests: prev.joinRequests.filter((item) => item.id !== request.id),
      };

      if (approved) {
        next.people = [
          ...prev.people,
          {
            id: `m-${Date.now()}`,
            name: request.name,
            craft: request.craft,
            role: 'Member',
            joined: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
            joinedAt: new Date().toISOString().slice(0, 10),
            messages: 0,
            reportsAgainst: 0,
            status: 'Active',
          },
        ];
        next.members = (prev.members || 0) + 1;
      }

      return next;
    });
    toast.success(approved ? `${request.name} approved` : `${request.name} declined`);
  };

  return (
    <Card sx={{ p: { xs: 2, md: 2.5 } }}>
      <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" spacing={1} sx={{ mb: 2 }}>
        <Typography variant="subtitle1">Pending join requests</Typography>
        <Typography variant="caption" sx={{ color: 'text.secondary' }}>
          Organizers normally handle these. Admins can act if a request is stuck more than 7 days.
        </Typography>
      </Stack>

      {requests.length ? (
        <Stack divider={<Box sx={{ borderBottom: (theme) => `dashed 1px ${theme.vars.palette.divider}` }} />}>
          {requests.map((request) => (
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
              <Stack direction="row" spacing={1} alignItems="center">
                {request.stuck ? (
                  <Label variant="soft" color="warning">
                    {request.stuck}
                  </Label>
                ) : null}
                <Button size="small" variant="outlined" color="inherit" onClick={() => resolveRequest(request, true)}>
                  Approve
                </Button>
                <Button size="small" variant="outlined" color="inherit" onClick={() => resolveRequest(request, false)}>
                  Decline
                </Button>
              </Stack>
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
        <Table size="small" sx={{ minWidth: 980, '& .MuiTableCell-head': { whiteSpace: 'nowrap' } }}>
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
                        {event.month.toUpperCase()}
                      </Typography>
                      <Typography variant="subtitle2" sx={{ lineHeight: 1.1 }}>
                        {event.day}
                      </Typography>
                    </Box>
                    <Box sx={{ minWidth: 0 }}>
                      <Typography variant="subtitle2">{event.title}</Typography>
                      <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                        {event.place}
                      </Typography>
                    </Box>
                  </Stack>
                </TableCell>
                <TableCell>{event.dateLabel || event.time || '—'}</TableCell>
                <TableCell>{event.going || '—'}</TableCell>
                <TableCell>{event.audience || 'Public'}</TableCell>
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
            {(poll.options || []).map((option) => (
              <Stack key={option.label} direction="row" alignItems="center" spacing={2}>
                <Typography variant="body2" sx={{ width: { xs: 120, sm: 200 }, flexShrink: 0 }}>
                  {option.label}
                </Typography>
                <LinearProgress
                  variant="determinate"
                  value={option.percent}
                  sx={{ flex: '1 1 auto', height: 8, borderRadius: 99, bgcolor: 'background.neutral' }}
                />
                <Typography variant="caption" sx={{ width: 36, textAlign: 'right', color: 'text.secondary' }}>
                  {`${option.percent}%`}
                </Typography>
              </Stack>
            ))}
          </Stack>

          <Stack direction={{ xs: 'column', sm: 'row' }} alignItems={{ sm: 'center' }} justifyContent="space-between" spacing={1} sx={{ mt: 2.5 }}>
            <Typography variant="caption" sx={{ color: 'text.secondary' }}>
              {poll.createdBy ? `Created by ${poll.createdBy} · ${poll.votes} votes` : poll.meta}
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

function ReportsPanel({ reports, onUpdateCircle }) {
  if (!reports.length) return <EmptyContent filled title="No reports" sx={{ py: 10 }} />;

  const clearReport = (report, message) => {
    onUpdateCircle((prev) => ({
      ...prev,
      reports: prev.reports.filter((item) => item.id !== report.id),
      health: {
        ...prev.health,
        openReports: Math.max(0, (prev.health?.openReports || 0) - 1),
      },
    }));
    toast.success(message);
  };

  return (
    <Stack spacing={2}>
      {reports.map((report) => (
        <Card key={report.id} sx={{ p: { xs: 2, md: 2.5 } }}>
          <Typography variant="overline" sx={{ color: 'text.disabled' }}>
            Reported content
          </Typography>
          <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} alignItems={{ md: 'center' }} sx={{ mt: 1.5 }}>
            <Avatar sx={{ width: 40, height: 40, bgcolor: 'background.neutral', color: 'text.primary', fontWeight: 700 }}>??</Avatar>
            <Box sx={{ flex: '1 1 auto', minWidth: 0 }}>
              <Typography variant="subtitle2">
                {report.title || report.reason}
                {report.reason && report.title ? ` · reported for ${report.reason}` : ''}
              </Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                {report.quote ? `“${report.quote}” · by ${report.by} · reported by ${report.reportedBy} · ${report.when}` : report.meta}
              </Typography>
            </Box>
            <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
              <Button size="small" variant="outlined" color="inherit" onClick={() => toast.success('Opened report context')}>
                View in context
              </Button>
              <Button size="small" variant="outlined" color="inherit" onClick={() => clearReport(report, 'Report dismissed')}>
                Dismiss
              </Button>
              <Button size="small" variant="outlined" color="error" onClick={() => clearReport(report, 'Message removed')}>
                Remove message
              </Button>
              <Button size="small" variant="outlined" color="error" onClick={() => clearReport(report, 'User banned from circle')}>
                Ban from Circle
              </Button>
            </Stack>
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
  const router = useRouter();
  const { value, onChange } = useTabs('overview');
  const [circle, setCircle] = useState(() => getCircleDetail(id));
  const editDetails = useBoolean();
  const suspend = useBoolean();
  const [editName, setEditName] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [area, setArea] = useState({
    homeArea: '',
    latitude: 40.7233,
    longitude: -74.003,
  });

  useEffect(() => {
    const detail = getCircleDetail(id);
    setCircle(detail);
    if (!detail) return;
    setArea({
      homeArea: detail.homeArea || detail.location,
      latitude: detail.latitude || 40.7233,
      longitude: detail.longitude || -74.003,
    });
  }, [id]);

  const updateCircle = (updater) => {
    setCircle((prev) => (typeof updater === 'function' ? updater(prev) : updater));
  };

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

  const tabs = [
    { value: 'overview', label: 'Overview' },
    { value: 'members', label: `Members · ${circle.members}` },
    { value: 'requests', label: `Join requests · ${circle.joinRequests.length}` },
    { value: 'events', label: `Events · ${circle.events.length}` },
    { value: 'polls', label: `Polls · ${circle.polls.length}` },
    { value: 'reports', label: `Reports · ${circle.reports.length}` },
    { value: 'activity', label: 'Activity log' },
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
              onClick={() => toast.success(`Message started with ${circle.organizers.map((item) => item.name).join(', ')}`)}
            >
              Message organizers
            </Button>
            <Button
              variant="outlined"
              color="inherit"
              size="small"
              onClick={() => {
                setEditName(circle.name);
                setEditDescription(circle.description || '');
                editDetails.onTrue();
              }}
            >
              Edit details
            </Button>
            <Button
              variant="outlined"
              color="inherit"
              size="small"
              onClick={() => {
                updateCircle((prev) => ({ ...prev, featured: !prev.featured }));
                toast.success(circle.featured ? 'Removed from Radar' : 'Featured on Radar');
              }}
            >
              {circle.featured ? 'Unfeature on Radar' : 'Feature on Radar'}
            </Button>
            <Button variant="outlined" color="error" size="small" onClick={suspend.onTrue}>
              Suspend Circle
            </Button>
          </Stack>
        }
        sx={{ mb: 1 }}
      />

      <Typography variant="body2" sx={{ mb: 3, color: 'text.secondary' }}>
        {`Created ${circle.createdAt} by ${circle.createdBy} · ID ${circle.code}`}
      </Typography>

      <Card sx={{ mb: 3, height: { xs: 'auto', md: 320 }, position: 'relative' }}>
        <CircleCover
          name={circle.name}
          avatarUrl={getDisplayImage(circle.image)}
          homeArea={area?.homeArea || circle.homeArea || circle.location}
          statusLabel={getCircleStatusOption(circle.status)?.label || circle.status}
          joiningLabel={getCircleJoiningOption(circle.joining)?.label || circle.joining}
          featured={circle.featured}
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
                setEditDescription(circle.description || '');
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

      {value === 'overview' && (
        <OverviewPanel
          circle={circle}
          area={area}
          onUpdateCircle={updateCircle}
        />
      )}
      {value === 'members' && <MembersPanel people={circle.people} onUpdateCircle={updateCircle} />}
      {value === 'requests' && <RequestsPanel requests={circle.joinRequests} onUpdateCircle={updateCircle} />}
      {value === 'events' && <EventsPanel events={circle.events} />}
      {value === 'polls' && <PollsPanel polls={circle.polls} onUpdateCircle={updateCircle} />}
      {value === 'reports' && <ReportsPanel reports={circle.reports} onUpdateCircle={updateCircle} />}
      {value === 'activity' && <ActivityPanel items={circle.activity} />}

      <Dialog fullWidth maxWidth="sm" open={editDetails.value} onClose={editDetails.onFalse}>
        <DialogTitle>Edit circle details</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ pt: 1 }}>
            <TextField fullWidth label="Name" value={editName} onChange={(event) => setEditName(event.target.value)} />
            <TextField
              fullWidth
              multiline
              minRows={3}
              label="Description"
              value={editDescription}
              onChange={(event) => setEditDescription(event.target.value)}
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
              updateCircle((prev) => ({
                ...prev,
                name: editName.trim(),
                description: editDescription.trim(),
              }));
              editDetails.onFalse();
              toast.success('Circle details updated');
            }}
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>

      <ConfirmDialog
        open={suspend.value}
        onClose={suspend.onFalse}
        title="Suspend Circle"
        content="Suspending hides this Circle from search and map, and pauses discussion and events."
        action={
          <Button
            variant="contained"
            color="error"
            onClick={() => {
              updateCircle((prev) => ({ ...prev, status: 'reviewing' }));
              suspend.onFalse();
              toast.success('Circle suspended');
              router.push(paths.adminDashboard.circles);
            }}
          >
            Suspend
          </Button>
        }
      />
    </Box>
  );
}
