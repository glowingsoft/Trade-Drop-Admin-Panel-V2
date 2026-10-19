export const DISPUTE_STATUS_OPTIONS = [
  { value: 'open', label: 'Open', color: 'warning' },
  { value: 'closed', label: 'Closed', color: 'default' },
];

export const DISPUTE_PRIORITY_OPTIONS = [
  { value: 'high', label: 'High', color: 'warning' },
  { value: 'medium', label: 'Medium', color: 'default' },
  { value: 'low', label: 'Low', color: 'info' },
];

export const DISPUTE_REASON_OPTIONS = [
  { value: 'not_fulfilled', label: 'Not fulfilled' },
  { value: 'fraud', label: 'Fraud' },
  { value: 'other', label: 'Other' },
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

export const DISPUTE_OUTCOME_OPTIONS = [
  { value: 'complete', label: 'Complete' },
  { value: 'cancel', label: 'Cancel' },
  { value: 'dismissed', label: 'Dismissed' },
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

export const getDisputeReasonOption = (reason) =>
  DISPUTE_REASON_OPTIONS.find((option) => option.value === reason);
