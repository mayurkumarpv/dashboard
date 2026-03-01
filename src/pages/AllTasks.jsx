import React from "react";

import { useState, useMemo } from "react";
import { useTasksContext } from "../context/TaskContext";
import TaskCard from "../components/tasks/TaskCard.jsx";
import Modal from "../components/common/Modal.jsx";
import TaskForm from "../components/tasks/TaskForm.jsx";
import {
  ALL,
  PENDING,
  IN_PROGRESS,
  COMPLETED,
  SORT_ORDER,
} from "../constants.js";

export default function AllTasks() {
  const { tasks } = useTasksContext();
  const [show, setShow] = useState(false);
  const [statusFilter, setStatusFilter] = useState(ALL);
  const [sortBy, setSortBy] = useState("dueDate");
  const [sortByDateOrder, setSortByDateOrder] = useState(SORT_ORDER.ASC);

  const filteredAndSortedTasks = useMemo(() => {
    let filtered = [...tasks];

    if (statusFilter !== ALL) {
      filtered = filtered.filter((task) => task.status === statusFilter);
    }

    filtered.sort((a, b) => {
      if (sortBy === "dueDate") {
        const dateA = new Date(a.dueDate);
        const dateB = new Date(b.dueDate);
        return sortByDateOrder === SORT_ORDER.ASC ? dateA - dateB : dateB - dateA;
      }
      return 0;
    });

    return filtered;
  }, [tasks, statusFilter, sortBy, sortByDateOrder]);

  const handleSortToggle = () => {
    setSortByDateOrder((prev) => (prev === SORT_ORDER.ASC ? SORT_ORDER.DESC : SORT_ORDER.ASC));
  };

  return (
    <div className="max-w-5xl mx-auto p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">All Tasks</h1>
        <button
          onClick={() => setShow(true)}
          className="bg-primary text-white px-5 py-2 rounded-xl hover:bg-purple-700 transition-colors"
        >
          + Add Task
        </button>
      </div>

      <div className="bg-white rounded-lg p-4 mb-6 shadow-sm border border-gray-200">
        <div className="flex flex-wrap gap-4 items-center">
          <div className="flex items-center gap-2">
            <label
              htmlFor="status-filter"
              className="text-sm font-medium text-gray-700"
            >
              Filter by Status:
            </label>
            <select
              id="status-filter"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="Pending">Pending</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-700">
              Sort by Due Date:
            </span>
            <button
              onClick={handleSortToggle}
              className="flex items-center gap-1 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 border border-gray-300 rounded-lg text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-primary"
            >
              {sortByDateOrder === SORT_ORDER.ASC ? (
                <>
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M7 11l5-5m0 0l5 5m-5-5v12"
                    />
                  </svg>
                  Earliest First
                </>
              ) : (
                <>
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 13l-5 5m0 0l-5-5m5 5V6"
                    />
                  </svg>
                  Latest First
                </>
              )}
            </button>
          </div>

    
          <div className="ml-auto">
            <span className="text-sm text-gray-600">
              {filteredAndSortedTasks.length} of {tasks.length} tasks
            </span>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {filteredAndSortedTasks.length === 0 && tasks.length === 0 && (
          <p className="text-gray-400 col-span-full text-center text-lg">
            No tasks yet 🚀
          </p>
        )}

        {filteredAndSortedTasks.length === 0 && tasks.length > 0 && (
          <div className="col-span-full text-center py-8">
            <div className="text-gray-400 text-lg mb-2">
              No tasks match your current filter 🔍
            </div>
            <button
              onClick={() => setStatusFilter("all")}
              className="text-primary hover:text-purple-700 font-medium text-sm underline"
            >
              Clear filters
            </button>
          </div>
        )}

        {filteredAndSortedTasks.map((task) => (
          <TaskCard key={task.id} task={task} />
        ))}
      </div>

      {show && (
        <Modal onClose={() => setShow(false)}>
          <TaskForm onClose={() => setShow(false)} />
        </Modal>
      )}
    </div>
  );
}
