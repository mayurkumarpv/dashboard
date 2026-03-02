
import React from "react";
import { BrowserRouter, Routes, Route, NavLink } from "react-router-dom";
import { TaskProvider } from "./context/TaskContext";
import AllTasks from "./pages/AllTasks";
import CompletedTasks from "./pages/CompletedTasks";

export default function App() {
  return (
    <TaskProvider>
      <BrowserRouter>
        <div className="min-h-screen bg-gradient-to-br from-violet-100 via-white to-violet-200">
          <nav className="backdrop-blur-md bg-white/70 border-b px-8 py-4 flex gap-6">
            <NavLink 
              to="/" 
              className={({ isActive }) => 
                `font-medium px-3 py-2 rounded-lg transition-colors ${
                  isActive 
                    ? 'bg-primary text-white border border-indigo-200' 
                    : 'text-gray-600 hover:text-indigo-600 hover:bg-indigo-50'
                }`
              }
            >
              All Tasks
            </NavLink>
            <NavLink 
              to="/completed" 
              className={({ isActive }) => 
                `font-medium px-3 py-2 rounded-lg transition-colors ${
                  isActive 
                    ? 'bg-primary text-white border border-indigo-200' 
                    : 'text-gray-600 hover:text-indigo-600 hover:bg-indigo-50'
                }`
              }
            >
              Completed
            </NavLink>
          </nav>
          <Routes>
            <Route path="/" element={<AllTasks />} />
            <Route path="/completed" element={<CompletedTasks />} />
          </Routes>
        </div>
      </BrowserRouter>
    </TaskProvider>
  );
}
