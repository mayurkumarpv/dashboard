import React from "react";
import TaskCard from "../taskCard/TaskCard";

export default function TaskGrid({
  tasks,
  emptyState,
  className = "grid md:grid-cols-2 gap-6",
}) {
  if (tasks.length === 0) {
    return (
      <div className={className}>
        {emptyState || (
          <div className="col-span-full text-center py-8">
            <div className="text-gray-400 text-lg mb-2">No tasks found 📋</div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className={className}>
      {tasks.map((task) => (
        <TaskCard key={task.id} task={task} />
      ))}
    </div>
  );
}
