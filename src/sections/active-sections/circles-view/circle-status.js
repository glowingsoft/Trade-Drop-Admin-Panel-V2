export const CIRCLE_STATUS_OPTIONS = [
  { value: 'active', label: 'Active', color: 'success' },
  { value: 'reviewing', label: 'Reviewing', color: 'warning' },
];

export const CIRCLE_VISIBILITY_OPTIONS = [
  { value: 'public', label: 'Public' },
  { value: 'private', label: 'Private' },
];

export const getCircleStatusOption = (status) =>
  CIRCLE_STATUS_OPTIONS.find((option) => option.value === status);

export const getCircleVisibilityOption = (visibility) =>
  CIRCLE_VISIBILITY_OPTIONS.find((option) => option.value === visibility);
