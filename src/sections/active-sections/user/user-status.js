export const USER_ACCOUNT_STATUS_OPTIONS = [
  { value: 'pending', label: 'Pending', color: 'warning' },
  { value: 'active', label: 'Active', color: 'success' },
  { value: 'inactive', label: 'Inactive', color: 'default' },
  { value: 'restricted', label: 'Rejected', color: 'error' },
  { value: 'suspended', label: 'Suspended', color: 'error' },
];

export const USER_ACCOUNT_STATUS_VALUES = USER_ACCOUNT_STATUS_OPTIONS.map((option) => option.value);

export const getUserStatusOption = (status) =>
  USER_ACCOUNT_STATUS_OPTIONS.find((option) => option.value === status);
