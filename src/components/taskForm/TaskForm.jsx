import React, { useState, useRef, useEffect, useCallback } from "react";
import { useTasksContext } from "../../context/TaskContext.jsx";
import { SpinnerIcon } from "../icons/index.js";
import { PENDING } from "../../constants.js";
import TaskInput from "./TaskInput.jsx";
import TaskTextarea from "./TaskTextArea.jsx";
import TaskSelect from "./TaskSelect.jsx";

const initialState = {
  title: "",
  description: "",
  status: PENDING,
  dueDate: "",
};

export default function TaskForm({ existingTask, onClose }) {
  const { dispatch } = useTasksContext();
  const formRef = useRef(null);
  const titleInputRef = useRef(null);

  const [formData, setFormData] = useState(existingTask || initialState);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDirty, setIsDirty] = useState(false);

  useEffect(() => {
    if (existingTask) {
      setFormData(existingTask);
      setErrors({});
      setTouched({});
      setIsDirty(false);
    }
  }, [existingTask]);

  useEffect(() => {
    if (titleInputRef.current) {
      titleInputRef.current.focus();
    }
  }, []);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        handleClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isDirty]);

  const validateField = (name, value, data) => {
    switch (name) {
      case "title":
        if (!value.trim()) return "Title is required";
        if (value.length < 3) return "Title must be at least 3 characters";
        if (value.length > 100) return "Title must be less than 100 characters";
        return "";

      case "dueDate":
        if (!value) return "Due date is required";

        const selectedDate = new Date(value);
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        if (selectedDate < today) return "Due date cannot be in the past";

        return "";

      case "description":
        if (value.length > 500)
          return "Description must be less than 500 characters";
        return "";

      default:
        return "";
    }
  };

  const validateForm = (data) => {
    const newErrors = {};

    Object.keys(data).forEach((field) => {
      const error = validateField(field, data[field], data);
      if (error) newErrors[field] = error;
    });

    return newErrors;
  };

  const handleChange = useCallback(
    (e) => {
      const { name, value } = e.target;

      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));

      setIsDirty(true);

      if (errors[name]) {
        setErrors((prev) => ({
          ...prev,
          [name]: "",
        }));
      }

      if (touched[name]) {
        const error = validateField(name, value, {
          ...formData,
          [name]: value,
        });

        setErrors((prev) => ({
          ...prev,
          [name]: error,
        }));
      }
    },
    [formData, touched, errors],
  );

  const handleBlur = useCallback(
    (e) => {
      const { name } = e.target;

      setTouched((prev) => ({
        ...prev,
        [name]: true,
      }));

      const error = validateField(name, formData[name], formData);

      setErrors((prev) => ({
        ...prev,
        [name]: error,
      }));
    },
    [formData],
  );

  const handleClose = useCallback(() => {
    if (isDirty) {
      const shouldClose = window.confirm(
        "You have unsaved changes. Are you sure you want to close?",
      );
      if (!shouldClose) return;
    }
    onClose();
  }, [isDirty, onClose]);

  const resetForm = useCallback(() => {
    setFormData(initialState);
    setErrors({});
    setTouched({});
    setIsDirty(false);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validateForm(formData);
    setErrors(validationErrors);

    const allTouched = {};
    Object.keys(formData).forEach((field) => {
      allTouched[field] = true;
    });

    setTouched(allTouched);

    if (Object.keys(validationErrors).length > 0) {
      const firstErrorField = Object.keys(validationErrors)[0];
      const input = formRef.current?.querySelector(
        `[name="${firstErrorField}"]`,
      );
      input?.focus();
      return;
    }

    setIsSubmitting(true);

    try {
      const task = {
        ...formData,
        id: existingTask?.id || crypto.randomUUID(),
        createdAt: existingTask?.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      await new Promise((resolve) => setTimeout(resolve, 500));

      dispatch({
        type: existingTask ? "UPDATE" : "ADD",
        payload: task,
      });

      onClose();
    } catch (err) {
      console.error("Error saving task:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const hasErrors = Object.values(errors).some((error) => error);
  const canSubmit =
    !isSubmitting && !hasErrors && formData.title.trim() && formData.dueDate;

  return (
    <div className="max-w-md mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">
          {existingTask ? "Edit Task" : "Create New Task"}
        </h2>
        {isDirty && (
          <span className="text-sm text-amber-600 font-medium">
            Unsaved changes
          </span>
        )}
      </div>

      <form ref={formRef} onSubmit={handleSubmit} className="space-y-4">
        <TaskInput
          ref={titleInputRef}
          label="Task Title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          onBlur={handleBlur}
          error={touched.title && errors.title}
          required
          maxLength={100}
          showCounter
          placeholder="Enter a descriptive task title..."
          autoComplete="off"
        />

        <TaskTextarea
          label="Description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          onBlur={handleBlur}
          error={touched.description && errors.description}
          maxLength={500}
          showCounter
          placeholder="Add details about the task (optional)..."
        />

        <TaskSelect
          label="Status"
          name="status"
          value={formData.status}
          onChange={handleChange}
        />

        <TaskInput
          label="Due Date"
          name="dueDate"
          type="date"
          value={formData.dueDate}
          onChange={handleChange}
          onBlur={handleBlur}
          error={touched.dueDate && errors.dueDate}
          required
          min={new Date().toISOString().split("T")[0]}
        />

        <div className="flex gap-3 pt-2">
          <button
            type="submit"
            disabled={!canSubmit}
            className="flex-1 bg-primary hover:bg-purple-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-medium py-2.5 px-4 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <>
                <SpinnerIcon className="animate-spin w-4 h-4" />
                Saving...
              </>
            ) : (
              `${existingTask ? "Update" : "Create"} Task`
            )}
          </button>

          <button
            type="button"
            onClick={handleClose}
            disabled={isSubmitting}
            className="px-4 py-2.5 text-gray-700 bg-white hover:bg-gray-50 disabled:bg-gray-50 disabled:cursor-not-allowed border border-gray-300 rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
          >
            Cancel
          </button>
        </div>

        {!existingTask && (
          <button
            type="button"
            onClick={resetForm}
            className="w-full text-sm text-gray-500 hover:text-gray-700 transition-colors"
          >
            Clear Form
          </button>
        )}
      </form>
    </div>
  );
}
