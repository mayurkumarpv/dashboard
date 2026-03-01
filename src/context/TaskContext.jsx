import React from "react";

import { createContext, useContext, useReducer, useEffect } from "react";

const TaskContext = createContext();

const reducer = (state, action) => {
  switch (action.type) {
    case "ADD":
      return { tasks: [...state.tasks, action.payload] };
    case "UPDATE":
      return {
        tasks: state.tasks.map((t) =>
          t.id === action.payload.id ? action.payload : t,
        ),
      };
    case "DELETE":
      return {
        tasks: state.tasks.filter((t) => t.id !== action.payload),
      };
    default:
      return state;
  }
};

export const TaskProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, {
    tasks: JSON.parse(localStorage.getItem("tasks")) || [],
  });

  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(state.tasks));
  }, [state.tasks]);

  return (
    <TaskContext.Provider value={{ tasks: state.tasks, dispatch }}>
      {children}
    </TaskContext.Provider>
  );
};

export const useTasksContext = () =>{
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error("useTasksContext must be used within a TaskProvider");
  }
  return context;
}
