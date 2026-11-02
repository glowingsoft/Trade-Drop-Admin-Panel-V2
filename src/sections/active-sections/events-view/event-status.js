export const EVENT_STATUS_OPTIONS = [
  { value: 'published', label: 'Published', color: 'success' },
  { value: 'full', label: 'Full', color: 'warning' },
  { value: 'reported', label: 'Reported', color: 'error' },
  { value: 'cancelled', label: 'Cancelled', color: 'default' },
  { value: 'active', label: 'Active', color: 'success' },
  { value: 'reviewing', label: 'Reviewing', color: 'warning' },
  { value: 'closed', label: 'Closed', color: 'default' },
];

export const EVENT_AUDIENCE_OPTIONS = [
  { value: 'Public', label: 'Public' },
  { value: 'Private', label: 'Private' },
];

export const EVENT_VISIBILITY_OPTIONS = [
  { value: 'public', label: 'Public' },
  { value: 'private', label: 'Private' },
];

export const getEventStatusOption = (status) =>
  EVENT_STATUS_OPTIONS.find((option) => option.value === status);

export const getEventVisibilityOption = (visibility) =>
  EVENT_VISIBILITY_OPTIONS.find((option) => option.value === visibility);
