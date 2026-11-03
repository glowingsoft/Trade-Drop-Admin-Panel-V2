import { fDate, fDateTime } from 'src/utils/format-time';

import { getCircleDetail } from './mocks/detail';

const formatDistance = (meters) => {
  if (meters === undefined || meters === null || meters === '') return '—';
  const value = Number(meters);
  if (Number.isNaN(value)) return '—';
  if (value < 1000) return `${Math.round(value)} m`;
  return `${(value / 1000).toFixed(1)} km`;
};

const formatCoordinates = (location) => {
  const coords = location?.coordinates;
  if (!Array.isArray(coords) || coords.length < 2) return '—';
  const [lng, lat] = coords;
  return `${lat}, ${lng}`;
};

const titleCase = (value) => {
  if (!value || typeof value !== 'string') return '';
  return value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
};

const mapRole = (roleRaw) => {
  const role = titleCase(roleRaw || 'member') || 'Member';
  if (role === 'Organizer') return 'Organizer';
  if (role === 'Owner') return 'Owner';
  return 'Member';
};

const mapLatestMember = (member) => {
  const roleRaw = member?.role || 'member';
  const joinedAt = member?.joinedAt || '';

  return {
    id: member?.userId || member?._id || member?.id || '',
    userId: member?.userId || '',
    name: member?.name || '—',
    handle: member?.handle || '',
    craft: member?.handle ? `@${member.handle}` : '—',
    role: mapRole(roleRaw),
    roleRaw,
    joined: joinedAt ? fDate(joinedAt) : '—',
    joinedAt,
    image: member?.profileIcon || '',
    messages: member?.messages ?? '—',
    reportsAgainst: member?.reportsAgainst ?? 0,
    status: member?.status ? titleCase(member.status) : 'Active',
    connectionStatus: member?.connectionStatus ?? null,
    connectionStatusLabel: member?.connectionStatus
      ? String(member.connectionStatus).replace(/_/g, ' ')
      : '—',
    canSendConnectionRequest: Boolean(member?.canSendConnectionRequest),
    canSendConnectionRequestLabel:
      member?.canSendConnectionRequest === true
        ? 'true'
        : member?.canSendConnectionRequest === false
          ? 'false'
          : '—',
  };
};

export const mapCircleMemberApi = (member) => {
  const user = member?.user || {};
  const roleRaw = member?.role || 'member';
  const joinedAt = member?.joinedAt || '';
  const userId = user._id || user.id || member?.userId || '';

  return {
    id: userId,
    userId,
    name: user.name || member?.name || '—',
    handle: user.handle || member?.handle || '',
    craft: user.handle || member?.handle ? `@${user.handle || member?.handle}` : '—',
    role: mapRole(roleRaw),
    roleRaw,
    joined: joinedAt ? fDate(joinedAt) : '—',
    joinedAt,
    image: user.profileIcon || member?.profileIcon || '',
    status: member?.status ? titleCase(member.status) : 'Active',
    connectionStatus: member?.connectionStatus ?? null,
    connectionStatusLabel: member?.connectionStatus
      ? String(member.connectionStatus).replace(/_/g, ' ')
      : '—',
    canSendConnectionRequest: member?.canSendConnectionRequest,
    canSendConnectionRequestLabel:
      member?.canSendConnectionRequest === true
        ? 'true'
        : member?.canSendConnectionRequest === false
          ? 'false'
          : '—',
  };
};

const mapLatestEvent = (event) => {
  if (!event || typeof event !== 'object') return null;

  const rawDate = event.date || event.startDate || event.startsAt || '';
  const parsed = rawDate ? new Date(rawDate) : null;
  const validDate = parsed && !Number.isNaN(parsed.getTime()) ? parsed : null;

  return {
    id: event._id || event.id || '',
    title: event.name || event.title || '—',
    place: event.place || event.location || event.city || '—',
    dateLabel: validDate ? fDateTime(rawDate) : rawDate || '—',
    time: validDate ? fDateTime(rawDate) : '—',
    month: validDate ? validDate.toLocaleString('en-US', { month: 'short' }) : '—',
    day: validDate ? String(validDate.getDate()) : '—',
    going: event.going || event.capacityLabel || '—',
    audience: event.audience || '—',
    status: titleCase(event.status) || 'Published',
    raw: event,
  };
};

const mapPollOption = (option, index, totalVotes) => {
  if (option == null) return null;
  if (typeof option === 'string') {
    return { label: option, percent: 0 };
  }

  const votes = Number(option.votes ?? option.count ?? 0);
  const percentFromApi = option.percent ?? option.percentage;
  const percent =
    percentFromApi != null
      ? Number(percentFromApi)
      : totalVotes > 0
        ? Math.round((votes / totalVotes) * 100)
        : 0;

  return {
    label: option.label || option.text || option.option || `Option ${index + 1}`,
    percent: Number.isFinite(percent) ? percent : 0,
    votes,
  };
};

const mapPoll = (poll, index) => {
  if (!poll || typeof poll !== 'object') return null;

  const rawOptions = Array.isArray(poll.options) ? poll.options : [];
  const totalVotes =
    Number(poll.votes) ||
    rawOptions.reduce((sum, option) => sum + Number(option?.votes ?? option?.count ?? 0), 0);

  return {
    id: poll._id || poll.id || `poll-${index}`,
    title: poll.title || poll.question || poll.name || 'Poll',
    status: poll.status ? titleCase(poll.status) : '',
    votes: totalVotes,
    createdBy: poll.createdBy?.name || poll.createdBy || poll.creatorName || '',
    meta: poll.meta || '',
    options: rawOptions.map((option, optionIndex) => mapPollOption(option, optionIndex, totalVotes)).filter(Boolean),
    raw: poll,
  };
};

const mapOpenDrop = (drop) => {
  if (!drop || typeof drop !== 'object') return null;
  const rawDate = drop.date || null;

  return {
    id: drop._id || drop.id || '',
    ownerId: drop.ownerId || '',
    title: drop.title || '—',
    status: drop.status ? titleCase(drop.status) : '—',
    date: rawDate ? fDate(rawDate) : '—',
    dateRaw: rawDate,
    raw: drop,
  };
};

export function mapApiCircleToDetail(api) {
  if (!api || Array.isArray(api)) return null;

  const id = api._id || api.id || '';
  const coords = api.location?.coordinates || [];
  const longitude = Number(coords[0]);
  const latitude = Number(coords[1]);
  const categoryObj = typeof api.category === 'object' && api.category ? api.category : null;
  const categoryId = categoryObj?._id || categoryObj?.id || (typeof api.category === 'string' ? api.category : '');
  const categoryName =
    categoryObj?.name ||
    (typeof api.category === 'string' ? api.category : '') ||
    '—';
  const privacy = api.privacy || '—';
  const polls = (Array.isArray(api.polls) ? api.polls : []).map(mapPoll).filter(Boolean);
  const organizer = api.organizer;
  const latestMembers = Array.isArray(api.latestMembers) ? api.latestMembers.map(mapLatestMember) : [];
  const latestEventMapped = mapLatestEvent(api.latestEvent);
  const events = latestEventMapped ? [latestEventMapped] : [];
  const openDrops = (Array.isArray(api.openDrops) ? api.openDrops : []).map(mapOpenDrop).filter(Boolean);
  const memberCount = api.memberCount ?? api.membersCount ?? api.members ?? latestMembers.length;

  return {
    id,
    _id: id,
    creatorId: api.creatorId || '—',
    name: api.name || '—',
    purpose: api.purpose || '',
    description: api.purpose || api.description || '',
    category: categoryName || '—',
    categoryId: categoryId || '—',
    categoryRaw: api.category ?? null,
    coverImage: api.coverImage || '',
    image: api.coverImage || api.image || '',
    city: api.city || '—',
    privacy,
    joining: privacy,
    status: privacy,
    locationRaw: api.location || null,
    location: api.city || '—',
    homeArea: api.city || '—',
    coordinatesLabel: formatCoordinates(api.location),
    latitude: Number.isFinite(latitude) ? latitude : 40.7128,
    longitude: Number.isFinite(longitude) ? longitude : -74.006,
    conversationId: api.conversationId || '—',
    polls,
    poll: api.poll ?? null,
    latestMembers,
    latestEvent: api.latestEvent ?? null,
    openDrops,
    memberCount,
    pendingRequestCount: api.pendingRequestCount ?? 0,
    joinedInvitationCount: api.joinedInvitationCount ?? 0,
    pendingInvitationCount: api.pendingInvitationCount ?? 0,
    createdAt: api.createdAt ? fDate(api.createdAt) : '—',
    createdAtRaw: api.createdAt || '',
    updatedAt: api.updatedAt ? fDate(api.updatedAt) : '—',
    updatedAtRaw: api.updatedAt || '',
    createdAtFull: api.createdAt ? fDateTime(api.createdAt) : '—',
    updatedAtFull: api.updatedAt ? fDateTime(api.updatedAt) : '—',
    distanceMeters: api.distanceMeters,
    distanceLabel: formatDistance(api.distanceMeters),
    code: id ? String(id) : '—',
    createdBy: organizer?.name || api.creatorId || '—',
    featured: Boolean(api.featured),
    visibilityDetail: privacy,
    members: memberCount,
    lastActivity: api.updatedAt ? fDateTime(api.updatedAt) : '—',
    upcomingEvents: events.length,
    health: { messages: 0, newMembers: 0, eventsHeld: 0, openReports: 0 },
    settings: {
      privacy,
      conversationId: api.conversationId || '—',
      creatorId: api.creatorId || '—',
    },
    organizers: organizer
      ? [
          {
            id: organizer._id || organizer.id || api.creatorId || 'owner',
            name: organizer.name || '—',
            craft: organizer.handle ? `@${organizer.handle}` : '—',
            role: 'Owner',
            since: 'Creator',
            image: organizer.profileIcon || '',
          },
        ]
      : [],
    people: latestMembers,
    drops: openDrops,
    events,
    joinRequests: [],
    reports: [],
    activity: [],
  };
}

export function mapListPreviewToDetail(preview) {
  if (!preview?.id) return null;

  const mapped = mapApiCircleToDetail({
    _id: preview.id,
    creatorId: preview.creatorId,
    name: preview.name,
    purpose: preview.purpose,
    category: preview.categoryId
      ? { _id: preview.categoryId, name: preview.category }
      : preview.category,
    coverImage: preview.coverImage || preview.image,
    city: preview.city,
    privacy: preview.privacy,
    location: preview.location,
    conversationId: preview.conversationId,
    polls: preview.polls,
    poll: preview.poll,
    createdAt: preview.createdAtRaw || undefined,
    updatedAt: preview.updatedAtRaw || undefined,
    distanceMeters: preview.distanceMeters,
    memberCount: preview.members,
    latestMembers: preview.latestMembers,
    latestEvent: preview.latestEvent,
    openDrops: preview.openDrops,
    organizer: preview.organizer
      ? {
          name: preview.organizer,
          handle: preview.organizerHandle,
          profileIcon: preview.organizerImage,
        }
      : undefined,
  });

  if (!mapped) return null;
  if (!preview.createdAtRaw && preview.createdAt) mapped.createdAt = preview.createdAt;
  if (!preview.updatedAtRaw && preview.updatedAt) mapped.updatedAt = preview.updatedAt;
  return mapped;
}

export function resolveCircleDetail(id, apiData, preview) {
  const mapped = mapApiCircleToDetail(apiData);
  if (mapped) return mapped;

  const previewMapped = mapListPreviewToDetail(preview);
  if (previewMapped) return previewMapped;

  return getCircleDetail(id);
}
