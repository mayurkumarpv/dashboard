export const ALL = "all";
export const COMPLETED = "completed";
export const PENDING = "pending";
export const IN_PROGRESS = "in_progress";

export const SORT_BY = {
  DUE_DATE: "dueDate",
  PRIORITY: "priority",
  CREATED_AT: "createdAt",
};

export const SORT_ORDER = {
  ASC: "asc",
  DESC: "desc",
};

export const taskStatusMap = {
  [PENDING]: "Pending",
  [IN_PROGRESS]: "In Progress",
  [COMPLETED]: "Completed",
}
