export const EVENT_STATUS_OPTIONS = [
  { value: 'active', label: 'Active', color: 'success' },
  { value: 'reviewing', label: 'Reviewing', color: 'warning' },
  { value: 'closed', label: 'Closed', color: 'default' },
];

export const EVENT_VISIBILITY_OPTIONS = [
  { value: 'public', label: 'Public' },
  { value: 'private', label: 'Private' },
];

export const getEventStatusOption = (status) =>
  EVENT_STATUS_OPTIONS.find((option) => option.value === status);

export const getEventVisibilityOption = (visibility) =>
  EVENT_VISIBILITY_OPTIONS.find((option) => option.value === visibility);
