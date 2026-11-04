export const EVENT_STATUS_OPTIONS = [
  { value: 'published', label: 'Published', color: 'success' },
  { value: 'full', label: 'Full', color: 'warning' },
  { value: 'ongoing', label: 'Ongoing', color: 'info' },
  { value: 'upcoming', label: 'Upcoming', color: 'primary' },
  { value: 'reported', label: 'Reported', color: 'error' },
  { value: 'cancelled', label: 'Cancelled', color: 'default' },
  { value: 'active', label: 'Active', color: 'success' },
  { value: 'reviewing', label: 'Reviewing', color: 'warning' },
  { value: 'closed', label: 'Closed', color: 'default' },
];

export const EVENT_AUDIENCE_OPTIONS = [
  { value: 'public', label: 'Public' },
  { value: 'private', label: 'Private' },
];

export const EVENT_JOINING_OPTIONS = [
  { value: 'approval', label: 'Approval' },
  { value: 'immediate', label: 'Immediate' },
  { value: 'invite', label: 'Invite' },
];

export const EVENT_VISIBILITY_OPTIONS = [
  { value: 'public', label: 'Public' },
  { value: 'private', label: 'Private' },
];

export const getEventStatusOption = (status) =>
  EVENT_STATUS_OPTIONS.find((option) => option.value === String(status || '').toLowerCase());

export const getEventAudienceOption = (audience) =>
  EVENT_AUDIENCE_OPTIONS.find((option) => option.value === String(audience || '').toLowerCase());

export const getEventJoiningOption = (joining) =>
  EVENT_JOINING_OPTIONS.find((option) => option.value === String(joining || '').toLowerCase());

export const getEventVisibilityOption = (visibility) =>
  EVENT_VISIBILITY_OPTIONS.find((option) => option.value === String(visibility || '').toLowerCase());
