export const CIRCLE_STATUS_OPTIONS = [
  { value: 'active', label: 'Active', color: 'success' },
  { value: 'reported', label: 'Reported', color: 'error' },
  { value: 'reviewing', label: 'Reviewing', color: 'warning' },
];

export const CIRCLE_JOINING_OPTIONS = [
  { value: 'open', label: 'Open', color: 'default' },
  { value: 'approval', label: 'Approval', color: 'warning' },
];

export const CIRCLE_VISIBILITY_OPTIONS = [
  { value: 'public', label: 'Public' },
  { value: 'private', label: 'Private' },
];

export const getCircleStatusOption = (status) =>
  CIRCLE_STATUS_OPTIONS.find((option) => option.value === status);

export const getCircleJoiningOption = (joining) =>
  CIRCLE_JOINING_OPTIONS.find((option) => option.value === joining);

export const getCircleVisibilityOption = (visibility) =>
  CIRCLE_VISIBILITY_OPTIONS.find((option) => option.value === visibility);
