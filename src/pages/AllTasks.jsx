import React, { useState } from "react";
import { useTasksContext } from "../context/TaskContext";
import { useTaskFiltering } from "../hooks/useTaskFiltering";
import TaskForm from "../components/taskForm/TaskForm.jsx";
import { Modal, TaskFilters, TaskGrid } from "../components/common";
import { ALL } from "../constants.js";

export default function AllTasks() {
  const { tasks } = useTasksContext();
  const [show, setShow] = useState(false);

  const {
    statusFilter,
    sortOrder,
    filteredAndSortedTasks,
    setStatusFilter,
    toggleSortOrder,
  } = useTaskFiltering(tasks);

  const noTasksEmptyState = (
    <p className="text-gray-400 col-span-full text-center text-lg">
      No tasks yet 🚀
    </p>
  );

  const noMatchesEmptyState = (
    <div className="col-span-full text-center py-8">
      <div className="text-gray-400 text-lg mb-2">
        No tasks match your current filter 🔍
      </div>
      <button
        onClick={() => setStatusFilter(ALL)}
        className="text-primary hover:text-purple-700 font-medium text-sm underline"
      >
        Clear filters
      </button>
    </div>
  );

  return (
    <div className="max-w-5xl mx-auto p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-lg md:text-3xl font-bold">All Tasks</h1>
        <button
          onClick={() => setShow(true)}
          className="bg-primary text-sm md:text-lg  text-white px-5 py-2 rounded-xl hover:bg-purple-700 transition-colors"
        >
          + Add Task
        </button>
      </div>

      <TaskFilters
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
        sortOrder={sortOrder}
        onSortToggle={toggleSortOrder}
        totalCount={tasks.length}
        filteredCount={filteredAndSortedTasks.length}
      />

      <TaskGrid
        tasks={filteredAndSortedTasks}
        emptyState={
          tasks.length === 0
            ? noTasksEmptyState
            : filteredAndSortedTasks.length === 0
              ? noMatchesEmptyState
              : null
        }
      />

      {show && (
        <Modal onClose={() => setShow(false)}>
          <TaskForm onClose={() => setShow(false)} />
        </Modal>
      )}
    </div>
  );
}
