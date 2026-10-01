export const DROP_STATUS_OPTIONS = [
  { value: 'active', label: 'Active', color: 'success' },
  { value: 'inprogress', label: 'In Progress', color: 'info' },
  { value: 'paused', label: 'Paused', color: 'warning' },
  { value: 'completed', label: 'Completed', color: 'secondary' },
  { value: 'expired', label: 'Expired', color: 'default' },
];

export const DROP_STATUS_VALUES = DROP_STATUS_OPTIONS.map((option) => option.value);

export const getDropStatusOption = (status) =>
  DROP_STATUS_OPTIONS.find((option) => option.value === status);
