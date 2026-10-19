export const TAP_STATUS_OPTIONS = [
  { value: 'pending', label: 'Pending', color: 'warning' },
  { value: 'accepted', label: 'Accepted', color: 'success' },
  { value: 'declined', label: 'Declined', color: 'error' },
  { value: 'withdrawn', label: 'Withdrawn', color: 'default' },
  { value: 'deleted', label: 'Deleted', color: 'error' },
  { value: 'inprogress', label: 'In Progress', color: 'info' },
  { value: 'completed', label: 'Completed', color: 'secondary' },
];

export const getTapStatusOption = (status) =>
  TAP_STATUS_OPTIONS.find((option) => option.value === status);
