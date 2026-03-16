import React from "react";
import { useTasksContext } from "../context/TaskContext";
import { useTaskFiltering } from "../hooks/useTaskFiltering";
import { TaskFilters, TaskGrid } from "../components/common";
import { COMPLETED, SORT_ORDER } from "../constants.js";

export default function CompletedTasks() {
  const { tasks } = useTasksContext();

  const { sortOrder, filteredAndSortedTasks, toggleSortOrder } =
    useTaskFiltering(tasks, COMPLETED, "dueDate", SORT_ORDER.DESC);

  const emptyState = (
    <div className="col-span-full text-center py-12">
      <div className="text-6xl mb-4">🎯</div>
      <p className="text-gray-400 text-lg">No completed tasks yet.</p>
      <p className="text-gray-500 text-sm mt-2">
        Complete some tasks to see them here!
      </p>
    </div>
  );

  return (
    <div className="max-w-5xl mx-auto p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-lg md:text-3xl font-bold">Completed Tasks</h1>
        <div className="text-sm px-2 md:px-3 text-gray-600 bg-green-50 py-2 rounded-lg border border-green-200">
          ✅ {filteredAndSortedTasks.length} completed
        </div>
      </div>

      {filteredAndSortedTasks.length > 0 && (
        <TaskFilters
          sortOrder={sortOrder}
          onSortToggle={toggleSortOrder}
          showStatusFilter={false}
          totalCount={filteredAndSortedTasks.length}
          filteredCount={filteredAndSortedTasks.length}
        />
      )}

      <TaskGrid tasks={filteredAndSortedTasks} emptyState={emptyState} />
    </div>
  );
}
