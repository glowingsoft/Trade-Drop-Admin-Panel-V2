import { fDate, fDateTime } from 'src/utils/format-time';

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

export function mapEventListRow(event) {
  const id = event?._id || event?.id || '';
  const organizer = mapOrganizer(event?.organizer);
  const dateRaw = event?.date || '';
  const timeRaw = event?.time || '';
  const parsedDate = dateRaw ? new Date(dateRaw) : null;
  const validDate = parsedDate && !Number.isNaN(parsedDate.getTime()) ? parsedDate : null;
  const audience = event?.audience ?? '—';
  const joining = event?.joining ?? '—';
  const status = event?.status ?? '—';
  const rsvpCount = event?.rsvpCount ?? 0;
  const capacity = event?.capacity ?? 0;
  const lat = event?.lat ?? event?.location?.coordinates?.[1];
  const lng = event?.lng ?? event?.location?.coordinates?.[0];
  const myRsvp = event?.myRsvp ?? null;
  const myRsvpStatus = myRsvp?.status || null;

  return {
    id,
    _id: id,
    circleId: event?.circleId || '',
    creatorId: event?.creatorId || '',
    suggestedBy: event?.suggestedBy ?? null,
    suggestedByLabel: formatNullable(event?.suggestedBy),
    approvedBy: event?.approvedBy ?? null,
    approvedByLabel: formatNullable(event?.approvedBy),
    name: event?.name || '—',
    purpose: event?.purpose || '',
    date: dateRaw ? fDate(dateRaw) : '—',
    dateRaw,
    time: timeRaw || '—',
    dateTime: [dateRaw ? fDate(dateRaw) : null, timeRaw || null].filter(Boolean).join(' · ') || '—',
    publicArea: event?.publicArea || '—',
    exactMeetingPoint: event?.exactMeetingPoint || '—',
    locationRaw: event?.location || null,
    locationType: event?.location?.type || '—',
    coordinatesLabel: formatCoordinates(event?.location, lat, lng),
    lat: lat ?? '—',
    lng: lng ?? '—',
    latLabel: lat == null || lat === '' ? '—' : String(lat),
    lngLabel: lng == null || lng === '' ? '—' : String(lng),
    location: event?.publicArea || '—',
    audience,
    audienceLabel: audience === '—' ? '—' : titleCase(String(audience)),
    joining,
    joiningLabel: joining === '—' ? '—' : titleCase(String(joining)),
    capacity,
    rsvpCount,
    going: rsvpCount,
    goingCap: `${rsvpCount} / ${capacity}`,
    status,
    statusLabel: status === '—' ? '—' : titleCase(String(status)),
    suggestionStatus: event?.suggestionStatus ?? null,
    suggestionStatusLabel: formatNullable(event?.suggestionStatus),
    myRsvp,
    myRsvpStatus,
    myRsvpLabel: myRsvp == null ? 'null' : myRsvpStatus ? titleCase(myRsvpStatus) : '—',
    myRsvpShowToParticipants:
      myRsvp == null
        ? 'null'
        : typeof myRsvp.showToParticipants === 'boolean'
          ? String(myRsvp.showToParticipants)
          : '—',
    circleName: event?.circleName || '—',
    host: event?.circleName || '—',
    organizer: organizer.name,
    organizerHandle: organizer.handle,
    organizerImage: organizer.profileIcon,
    image: organizer.profileIcon || event?.coverImage || event?.image || '',
    createdAt: event?.createdAt ? fDate(event.createdAt) : '—',
    updatedAt: event?.updatedAt ? fDate(event.updatedAt) : '—',
    createdAtRaw: event?.createdAt || '',
    updatedAtRaw: event?.updatedAt || '',
    createdAtFull: event?.createdAt ? fDateTime(event.createdAt) : '—',
    updatedAtFull: event?.updatedAt ? fDateTime(event.updatedAt) : '—',
    dateSort: dateRaw || '',
    start: dateRaw || undefined,
    end: dateRaw || undefined,
    dateMonth: validDate ? validDate.toLocaleString('en-US', { month: 'short' }).toUpperCase() : '—',
    dateDay: validDate ? String(validDate.getDate()) : '—',
  };
}
