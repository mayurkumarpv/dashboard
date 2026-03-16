import { motion } from "framer-motion";
import React, { useState } from "react";
import { useTasksContext } from "../../context/TaskContext";
import Modal from "../common/Modal";
import TaskForm from "../taskForm/TaskForm";
import {
  taskStatusMap,
  COMPLETED,
  PENDING,
  IN_PROGRESS,
} from "../../constants.js";

export default function TaskCard({ task }) {
  const { dispatch } = useTasksContext();
  const [edit, setEdit] = useState(false);

  const colors = {
    [PENDING]: "bg-yellow-200 text-yellow-800",
    [IN_PROGRESS]: "bg-blue-200 text-blue-800",
    [COMPLETED]: "bg-green-200 text-green-800",
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ scale: 1.02 }}
        className="bg-white p-5 rounded-2xl shadow-lg"
      >
        <div className="flex justify-between">
          <h3 className="font-semibold">{task.title}</h3>
          <span
            className={`text-xs px-3 py-1 rounded-full ${colors[task.status]}`}
          >
            {taskStatusMap[task.status]}
          </span>
        </div>

        <p className="text-gray-600 mt-2 text-sm">{task.description}</p>
        <p className="text-xs text-gray-400 mt-3">
          Due: {new Date(task.dueDate).toLocaleDateString()}
        </p>

        <div className="flex gap-4 mt-4 text-sm">
          <button onClick={() => setEdit(true)} className="text-indigo-600">
            Edit
          </button>
          <button
            onClick={() => dispatch({ type: "DELETE", payload: task.id })}
            className="text-red-500"
          >
            Delete
          </button>
        </div>
      </motion.div>
      {edit && (
        <Modal onClose={() => setEdit(false)}>
          <TaskForm existingTask={task} onClose={() => setEdit(false)} />
        </Modal>
      )}
    </>
  );
}
