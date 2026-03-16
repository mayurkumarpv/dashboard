import { useState, useMemo, useCallback } from "react";
import { ALL, SORT_ORDER } from "../constants.js";

export function useTaskFiltering(
  tasks,
  initialFilter = ALL,
  initialSort = "dueDate",
  initialOrder = SORT_ORDER.ASC,
) {
  const [statusFilter, setStatusFilter] = useState(initialFilter);
  const [sortBy, setSortBy] = useState(initialSort);
  const [sortOrder, setSortOrder] = useState(initialOrder);

  const filteredAndSortedTasks = useMemo(() => {
    let filtered = [...tasks];

    if (statusFilter && statusFilter !== ALL) {
      filtered = filtered.filter((task) => task.status === statusFilter);
    }

    filtered.sort((a, b) => {
      switch (sortBy) {
        case "dueDate": {
          const dateA = new Date(a.dueDate);
          const dateB = new Date(b.dueDate);
          return sortOrder === SORT_ORDER.ASC ? dateA - dateB : dateB - dateA;
        }
        case "title":
          return sortOrder === SORT_ORDER.ASC
            ? a.title.localeCompare(b.title)
            : b.title.localeCompare(a.title);
        case "createdAt": {
          const dateA = new Date(a.createdAt);
          const dateB = new Date(b.createdAt);
          return sortOrder === SORT_ORDER.ASC ? dateA - dateB : dateB - dateA;
        }
        default:
          return 0;
      }
    });

    return filtered;
  }, [tasks, statusFilter, sortBy, sortOrder]);

  const toggleSortOrder = useCallback(() => {
    setSortOrder((prev) =>
      prev === SORT_ORDER.ASC ? SORT_ORDER.DESC : SORT_ORDER.ASC,
    );
  }, []);

  return {
    statusFilter,
    sortBy,
    sortOrder,
    filteredAndSortedTasks,
    setStatusFilter,
    setSortBy,
    setSortOrder,
    toggleSortOrder,
  };
}
