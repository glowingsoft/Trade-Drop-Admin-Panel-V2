import { fDate, fDateTime } from 'src/utils/format-time';

import { getEventDetail } from './mocks/detail';

const titleCase = (value) => {
  if (!value || typeof value !== 'string') return '';
  return value
    .split(/[-_\s]+/)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
    .join(' ');
};

const formatNullable = (value) => {
  if (value === null) return 'null';
  if (value === undefined || value === '') return '—';
  if (typeof value === 'object') {
    return value.name || value.handle || value._id || value.id || JSON.stringify(value);
  }
  return String(value);
};

const formatDistance = (meters) => {
  if (meters === undefined || meters === null || meters === '') return '—';
  const value = Number(meters);
  if (Number.isNaN(value)) return '—';
  if (value < 1000) return `${Math.round(value)} m`;
  return `${(value / 1000).toFixed(1)} km`;
};

const formatCoordinates = (location, lat, lng) => {
  const coords = location?.coordinates;
  if (Array.isArray(coords) && coords.length >= 2) {
    return `${coords[1]}, ${coords[0]}`;
  }
  if (lat != null && lng != null && lat !== '' && lng !== '') {
    return `${lat}, ${lng}`;
  }
  return '—';
};

const mapOrganizer = (organizer) => {
  if (!organizer) return { id: '', name: '—', handle: '', profileIcon: '' };
  if (typeof organizer === 'string') {
    return { id: organizer, name: organizer, handle: '', profileIcon: '' };
  }
  return {
    id: organizer._id || organizer.id || '',
    name: organizer.name || '—',
    handle: organizer.handle || '',
    profileIcon: organizer.profileIcon || '',
  };
};

const normalizeRsvpStatus = (value) => {
  const raw = String(value || '').trim().toLowerCase();
  if (!raw) return '';
  if (raw === 'going' || raw === 'approved' || raw === 'confirmed') return 'Going';
  if (raw === 'waitlist' || raw === 'waiting' || raw === 'waitlisted') return 'Waitlist';
  if (raw === 'cancelled' || raw === 'canceled' || raw === 'declined') return 'Cancelled';
  if (raw === 'pending' || raw === 'requested' || raw === 'approval') return 'Pending';
  return titleCase(raw);
};

const pickAttendeesArray = (api) => {
  if (Array.isArray(api?.attendees)) return api.attendees;
  if (Array.isArray(api?.attendeesList)) return api.attendeesList;
  if (Array.isArray(api?.rsvps)) return api.rsvps;
  if (Array.isArray(api?.participants)) return api.participants;
  if (Array.isArray(api?.rsvpList)) return api.rsvpList;
  return [];
};

const mapAttendee = (item, index = 0) => {
  if (item == null || item === '') return null;

  if (typeof item === 'string') {
    return {
      id: item,
      name: '—',
      handle: '',
      craft: '—',
      status: '—',
      visible: false,
      circleMember: false,
      waitlistPosition: null,
      rsvpDate: '—',
      rsvpAt: '',
      image: '',
      raw: item,
    };
  }

  if (typeof item !== 'object') return null;

  const user = item.user || item.attendee || item.member || item.profile || {};
  const id =
    item._id ||
    item.id ||
    user._id ||
    user.id ||
    item.userId ||
    item.attendeeId ||
    `attendee-${index}`;
  const name = user.name || item.name || user.handle || item.handle || '—';
  const handle = user.handle || item.handle || '';
  const craft =
    item.craft ||
    item.discipline ||
    item.category ||
    user.craft ||
    user.discipline ||
    (handle ? `@${handle}` : '') ||
    '—';
  const status = normalizeRsvpStatus(
    item.status || item.rsvpStatus || item.rsvp || item.myRsvp?.status || user.status
  );
  const visible =
    typeof item.showToParticipants === 'boolean'
      ? item.showToParticipants
      : typeof item.visible === 'boolean'
        ? item.visible
        : typeof item.showOnList === 'boolean'
          ? item.showOnList
          : status === 'Going';
  const circleMember = Boolean(
    item.circleMember ?? item.isCircleMember ?? item.isMember ?? item.memberOfCircle
  );
  const rsvpAt = item.rsvpDate || item.rsvpAt || item.joinedAt || item.createdAt || item.updatedAt || '';
  const waitlistPosition = item.waitlistPosition ?? item.waitlistNo ?? item.position ?? null;

  return {
    id,
    name,
    handle,
    craft,
    status: status || '—',
    visible,
    circleMember,
    waitlistPosition,
    rsvpDate: rsvpAt ? fDate(rsvpAt) : '—',
    rsvpAt,
    image: user.profileIcon || item.profileIcon || item.image || '',
    raw: item,
  };
};

const mapAttendeesList = (api) =>
  pickAttendeesArray(api).map(mapAttendee).filter(Boolean);

const buildRsvpBreakdown = (attendeesList, rsvpCount) => {
  const going = attendeesList.filter((item) => item.status === 'Going').length;
  const pending = attendeesList.filter((item) => item.status === 'Pending').length;
  const waitlist = attendeesList.filter((item) => item.status === 'Waitlist').length;
  const cancelled = attendeesList.filter((item) => item.status === 'Cancelled').length;

  if (!attendeesList.length) {
    return {
      going: rsvpCount || 0,
      pending: 0,
      waitlist: 0,
      cancelled: 0,
    };
  }

  return {
    going,
    pending,
    waitlist,
    cancelled,
  };
};

export function mapApiEventToDetail(api, preview) {
  if (!api || Array.isArray(api)) return null;

  const id = api._id || api.id || '';
  const organizer = mapOrganizer(api.organizer || (preview?.organizer
    ? {
      name: preview.organizer,
      handle: preview.organizerHandle,
      profileIcon: preview.organizerImage,
    }
    : null));
  const dateRaw = api.date || '';
  const timeRaw = api.time || '';
  const capacity = api.capacity ?? 0;
  const rsvpCount = api.rsvpCount ?? 0;
  const placesLeft = Math.max(0, capacity - rsvpCount);
  const lat = api.lat ?? api.location?.coordinates?.[1];
  const lng = api.lng ?? api.location?.coordinates?.[0];
  const audience = api.audience || '—';
  const joining = api.joining || '—';
  const status = api.status || '—';
  const myRsvp = api.myRsvp ?? null;
  const circleName = api.circleName || preview?.circleName || preview?.host || '—';
  const circleOpenDrops = (Array.isArray(api.circleOpenDrops) ? api.circleOpenDrops : []).map((drop) => ({
    id: drop?._id || drop?.id || '',
    ownerId: drop?.ownerId || '',
    title: drop?.title || '—',
    date: drop?.date ? fDate(drop.date) : drop?.date === null ? 'null' : '—',
    dateRaw: drop?.date ?? null,
    raw: drop,
  }));
  const attendeesList = mapAttendeesList(api);
  const rsvp = buildRsvpBreakdown(attendeesList, rsvpCount);
  const visibilityList = {
    shown: attendeesList.filter((item) => item.status === 'Going' && item.visible).length,
    hidden: attendeesList.filter((item) => item.status === 'Going' && !item.visible).length,
  };

  return {
    id,
    _id: id,
    circleId: api.circleId || preview?.circleId || '',
    creatorId: api.creatorId || '',
    suggestedBy: api.suggestedBy ?? null,
    suggestedByLabel: formatNullable(api.suggestedBy),
    approvedBy: api.approvedBy ?? null,
    approvedByLabel: formatNullable(api.approvedBy),
    name: api.name || '—',
    purpose: api.purpose || '',
    description: api.purpose || api.description || '',
    date: dateRaw ? fDate(dateRaw) : '—',
    dateRaw,
    dateLabel: dateRaw ? fDate(dateRaw) : '—',
    time: timeRaw || '—',
    timeLabel: timeRaw || '—',
    dateTime: [dateRaw ? fDate(dateRaw) : null, timeRaw || null].filter(Boolean).join(' · ') || '—',
    publicArea: api.publicArea || '—',
    exactMeetingPoint: api.exactMeetingPoint || '—',
    meetingPoint: api.exactMeetingPoint || '—',
    meetingPointNote: '',
    locationRaw: api.location || null,
    locationType: api.location?.type || '—',
    coordinatesLabel: formatCoordinates(api.location, lat, lng),
    lat: lat ?? '—',
    lng: lng ?? '—',
    latLabel: lat == null || lat === '' ? '—' : String(lat),
    lngLabel: lng == null || lng === '' ? '—' : String(lng),
    location: api.publicArea || '—',
    audience,
    audienceLabel: audience === '—' ? '—' : titleCase(String(audience)),
    joining,
    joiningLabel: joining === '—' ? '—' : titleCase(String(joining)),
    capacity,
    rsvpCount,
    going: rsvpCount,
    status,
    statusLabel: status === '—' ? '—' : titleCase(String(status)),
    publishLabel: status === '—' ? 'Published' : titleCase(String(status)),
    suggestionStatus: api.suggestionStatus ?? null,
    suggestionStatusLabel: formatNullable(api.suggestionStatus),
    myRsvp,
    myRsvpLabel: myRsvp == null ? 'null' : myRsvp?.status ? titleCase(myRsvp.status) : '—',
    myRsvpShowToParticipants:
      myRsvp == null
        ? 'null'
        : typeof myRsvp.showToParticipants === 'boolean'
          ? String(myRsvp.showToParticipants)
          : '—',
    distanceMeters: api.distanceMeters,
    distanceLabel: formatDistance(api.distanceMeters),
    circleOpenDrops,
    createdAt: api.createdAt ? fDate(api.createdAt) : '—',
    updatedAt: api.updatedAt ? fDate(api.updatedAt) : '—',
    createdAtFull: api.createdAt ? fDateTime(api.createdAt) : '—',
    updatedAtFull: api.updatedAt ? fDateTime(api.updatedAt) : '—',
    host: circleName,
    circleName,
    organizer: organizer.name,
    organizerHandle: organizer.handle,
    organizerImage: organizer.profileIcon,
    image: organizer.profileIcon || preview?.image || '',
    placesLeft,
    rsvp,
    visibilityList,
    attendeesList,
    reports: [],
    activity: [],
  };
}

export function mapListPreviewToEventDetail(preview) {
  if (!preview?.id) return null;

  return mapApiEventToDetail(
    {
      _id: preview.id,
      circleId: preview.circleId,
      creatorId: preview.creatorId,
      suggestedBy: preview.suggestedBy,
      approvedBy: preview.approvedBy,
      name: preview.name,
      purpose: preview.purpose,
      date: preview.dateRaw || undefined,
      time: preview.time,
      publicArea: preview.publicArea,
      exactMeetingPoint: preview.exactMeetingPoint,
      location: preview.locationRaw,
      lat: preview.lat,
      lng: preview.lng,
      audience: preview.audience,
      joining: preview.joining,
      capacity: preview.capacity,
      status: preview.status,
      suggestionStatus: preview.suggestionStatus,
      rsvpCount: preview.rsvpCount ?? preview.going,
      createdAt: preview.createdAtRaw || undefined,
      updatedAt: preview.updatedAtRaw || undefined,
      myRsvp: preview.myRsvp,
      distanceMeters: preview.distanceMeters,
      circleOpenDrops: preview.circleOpenDrops,
      circleName: preview.circleName || preview.host,
      organizer: preview.organizer
        ? {
          name: preview.organizer,
          handle: preview.organizerHandle,
          profileIcon: preview.organizerImage,
        }
        : undefined,
    },
    preview
  );
}

export function resolveEventDetail(id, apiData, preview) {
  const mapped = mapApiEventToDetail(apiData, preview);
  if (mapped) return mapped;

  const previewMapped = mapListPreviewToEventDetail(preview);
  if (previewMapped) return previewMapped;

  return getEventDetail(id);
}
