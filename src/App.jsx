
import React from "react";
import { BrowserRouter, Routes, Route, NavLink } from "react-router-dom";
import { TaskProvider } from "./context/TaskContext";
import AllTasks from "./pages/AllTasks";
import CompletedTasks from "./pages/CompletedTasks";

export default function App() {
  return (
    <TaskProvider>
      <BrowserRouter>
        <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-white to-blue-100">
          <nav className="backdrop-blur-md bg-white/70 border-b px-8 py-4 flex gap-6">
            <NavLink to="/" className="font-medium">All Tasks</NavLink>
            <NavLink to="/completed" className="font-medium">Completed</NavLink>
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
