export const DISPUTE_STATUS_OPTIONS = [
  { value: 'open', label: 'Open', color: 'warning' },
  { value: 'under_review', label: 'Under review', color: 'info' },
  { value: 'resolved', label: 'Resolved', color: 'success' },
  { value: 'closed', label: 'Closed', color: 'default' },
];

export const DISPUTE_PRIORITY_OPTIONS = [
  { value: 'urgent', label: 'Urgent', color: 'error' },
  { value: 'high', label: 'High', color: 'warning' },
  { value: 'medium', label: 'Medium', color: 'default' },
  { value: 'low', label: 'Low', color: 'info' },
];

export const DISPUTE_ASSIGNEE_OPTIONS = [
  { value: 'all', label: 'All' },
  { value: 'Unassigned', label: 'Unassigned' },
  { value: 'Hira Naveed', label: 'Hira Naveed' },
  { value: 'Omer Saeed', label: 'Omer Saeed' },
];

export const DISPUTE_ASSIGNEE_EDIT_OPTIONS = DISPUTE_ASSIGNEE_OPTIONS.filter(
  (option) => option.value !== 'all'
);

export const DISPUTE_PENALTY_OPTIONS = [
  { value: 'formal_warning', label: 'Formal warning' },
  { value: 'temporary_suspend', label: 'Temporary suspension' },
  { value: 'permanent_ban', label: 'Permanent ban' },
];

export const TRADE_STATUS_LABEL = {
  in_progress: 'In Progress',
  completed: 'Completed',
  cancelled: 'Cancelled',
};

export const getDisputeStatusOption = (status) =>
  DISPUTE_STATUS_OPTIONS.find((option) => option.value === status);

export const getDisputePriorityOption = (priority) =>
  DISPUTE_PRIORITY_OPTIONS.find((option) => option.value === priority);
