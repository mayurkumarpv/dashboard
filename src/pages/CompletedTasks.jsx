import React from "react";

import { useState, useMemo } from "react";
import { useTasksContext } from "../context/TaskContext";
import TaskCard from "../components/tasks/TaskCard";

export default function CompletedTasks() {
  const { tasks } = useTasksContext();
  const [sortOrder, setSortOrder] = useState("desc"); 

  const completedAndSortedTasks = useMemo(() => {
    const completed = tasks.filter(t => t.status === "Completed");
    
    return completed.sort((a, b) => {
      const dateA = new Date(a.dueDate);
      const dateB = new Date(b.dueDate);
      return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
    });
  }, [tasks, sortOrder]);

  const handleSortToggle = () => {
    setSortOrder(prev => prev === "asc" ? "desc" : "asc");
  };

  return (
    <div className="max-w-5xl mx-auto p-8">

      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Completed Tasks</h1>
        <div className="text-sm text-gray-600 bg-green-50 px-3 py-2 rounded-lg border border-green-200">
          ✅ {completedAndSortedTasks.length} completed
        </div>
      </div>

      {completedAndSortedTasks.length > 0 && (
        <div className="bg-white rounded-lg p-4 mb-6 shadow-sm border border-gray-200">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-700">
              Sort by Due Date:
            </span>
            <button
              onClick={handleSortToggle}
              className="flex items-center gap-1 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 border border-gray-300 rounded-lg text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-primary"
            >
              {sortOrder === "asc" ? (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 11l5-5m0 0l5 5m-5-5v12" />
                  </svg>
                  Earliest First
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 13l-5 5m0 0l-5-5m5 5V6" />
                  </svg>
                  Latest First
                </>
              )}
            </button>
          </div>
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-6">
        {completedAndSortedTasks.length === 0 && (
          <div className="col-span-full text-center py-12">
            <div className="text-6xl mb-4">🎯</div>
            <p className="text-gray-400 text-lg">
              No completed tasks yet.
            </p>
            <p className="text-gray-500 text-sm mt-2">
              Complete some tasks to see them here!
            </p>
          </div>
        )}

        {completedAndSortedTasks.map(task => (
          <TaskCard key={task.id} task={task} />
        ))}
      </div>
    </div>
  );
}