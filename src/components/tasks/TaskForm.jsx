import React, { useState, useCallback, useRef, useEffect } from "react";
import { useTasksContext } from "../../context/TaskContext.jsx";
import { ALL, PENDING, IN_PROGRESS, COMPLETED } from "../../constants.js";

// Validation rules
const validateField = (name, value, formData) => {
  switch (name) {
    case 'title':
      if (!value.trim()) return "Title is required";
      if (value.length < 3) return "Title must be at least 3 characters";
      if (value.length > 100) return "Title must be less than 100 characters";
      return "";
    
    case 'dueDate':
      if (!value) return "Due date is required";
      const selectedDate = new Date(value);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (selectedDate < today) return "Due date cannot be in the past";
      return "";
    
    case 'description':
      if (value.length > 500) return "Description must be less than 500 characters";
      return "";
    
    default:
      return "";
  }
};

const validateForm = (formData) => {
  const errors = {};
  const fields = ['title', 'description', 'status', 'dueDate'];
  fields.forEach(field => {
    const error = validateField(field, formData[field], formData);
    if (error) errors[field] = error;
  });
  return errors;
};

export default function TaskForm({ existingTask, onClose }) {
  const { dispatch } = useTasksContext();
  const formRef = useRef(null);
  const titleInputRef = useRef(null);

  const [title, setTitle] = useState(existingTask?.title || "");
  const [description, setDescription] = useState(existingTask?.description || "");
  const [status, setStatus] = useState(existingTask?.status || PENDING);
  const [dueDate, setDueDate] = useState(existingTask?.dueDate || "");
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDirty, setIsDirty] = useState(false);


  useEffect(() => {
    if (existingTask) {
      setTitle(existingTask.title || "");
      setDescription(existingTask.description || "");
      setStatus(existingTask.status || PENDING);
      setDueDate(existingTask.dueDate || "");
      setIsDirty(false);
    }
  }, [existingTask]);

  useEffect(() => {
    if (titleInputRef.current) {
      titleInputRef.current.focus();
    }
  }, []);


  const handleFieldChange = useCallback((field, value) => {
    switch (field) {
      case 'title':
        setTitle(value);
        break;
      case 'description':
        setDescription(value);
        break;
      case 'status':
        setStatus(value);
        break;
      case 'dueDate':
        setDueDate(value);
        break;
    }
    
    setIsDirty(true);
    
    setErrors(prev => ({ ...prev, [field]: "" }));
    
    if (touched[field]) {
      const formData = { title, description, status, dueDate, [field]: value };
      const error = validateField(field, value, formData);
      if (error !== errors[field]) {
        setErrors(prev => ({ ...prev, [field]: error }));
      }
    }
  }, [touched, errors, title, description, status, dueDate]);


  const handleFieldBlur = useCallback((field) => {
    setTouched(prev => ({ ...prev, [field]: true }));
    
    const formData = { title, description, status, dueDate };
    const error = validateField(field, formData[field], formData);
    if (error) {
      setErrors(prev => ({ ...prev, [field]: error }));
    }
  }, [title, description, status, dueDate]);


  const handleSubmit = async (e) => {
    e.preventDefault();
    

    const allFields = { title: true, description: true, status: true, dueDate: true };
    setTouched(allFields);


    const formData = { title, description, status, dueDate };
    const validationErrors = validateForm(formData);
    setErrors(validationErrors);


    if (Object.keys(validationErrors).length > 0) {
      const firstErrorField = Object.keys(validationErrors)[0];
      const errorInput = formRef.current?.querySelector(`[name="${firstErrorField}"]`);
      if (errorInput) errorInput.focus();
      return;
    }

    setIsSubmitting(true);

    try {
      const task = {
        id: existingTask?.id || Date.now().toString(),
        title: title.trim(),
        description: description.trim(),
        status,
        dueDate,
        createdAt: existingTask?.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      await new Promise(resolve => setTimeout(resolve, 500));

      dispatch({
        type: existingTask ? "UPDATE" : "ADD",
        payload: task
      });

      onClose();
    } catch (error) {
      console.error('Error saving task:', error);
      setErrors(prev => ({ 
        ...prev, 
        submit: 'Failed to save task. Please try again.' 
      }));
    } finally {
      setIsSubmitting(false);
    }
  };



  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && e.target.type !== 'textarea') {
      e.preventDefault();
      handleSubmit(e);
    }
  };

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

      {errors.submit && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-700 text-sm font-medium">{errors.submit}</p>
        </div>
      )}

      <form ref={formRef} onSubmit={handleSubmit} onKeyDown={handleKeyDown}>
        <div className="mb-4">
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
            Task Title *
          </label>
          <input
            ref={titleInputRef}
            id="title"
            name="title"
            type="text"
            required
            aria-invalid={errors.title ? 'true' : 'false'}
            aria-describedby={errors.title ? 'title-error' : undefined}
            className={`w-full px-3 py-2 border rounded-lg shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent ${
              errors.title 
                ? 'border-red-300 bg-red-50' 
                : 'border-gray-300 hover:border-gray-400'
            }`}
            placeholder="Enter task title..."
            value={title}
            onChange={(e) => handleFieldChange('title', e.target.value)}
            onBlur={() => handleFieldBlur('title')}
            disabled={isSubmitting}
            maxLength={100}
          />
          {errors.title && (
            <p id="title-error" className="mt-1 text-sm text-red-600" role="alert">
              {errors.title}
            </p>
          )}
          <p className="mt-1 text-xs text-gray-500">
            {title.length}/100 characters
          </p>
        </div>

        {/* Description Field */}
        <div className="mb-4">
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            rows={3}
            aria-invalid={errors.description ? 'true' : 'false'}
            aria-describedby={errors.description ? 'description-error' : undefined}
            className={`w-full px-3 py-2 border rounded-lg shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none ${
              errors.description 
                ? 'border-red-300 bg-red-50' 
                : 'border-gray-300 hover:border-gray-400'
            }`}
            placeholder="Add a description (optional)..."
            value={description}
            onChange={(e) => handleFieldChange('description', e.target.value)}
            onBlur={() => handleFieldBlur('description')}
            disabled={isSubmitting}
            maxLength={500}
          />
          {errors.description && (
            <p id="description-error" className="mt-1 text-sm text-red-600" role="alert">
              {errors.description}
            </p>
          )}
          <p className="mt-1 text-xs text-gray-500">
            {description.length}/500 characters
          </p>
        </div>

        {/* Status Field */}
        <div className="mb-4">
          <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-2">
            Status
          </label>
          <select
            id="status"
            name="status"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent hover:border-gray-400 transition-colors"
            value={status}
            onChange={(e) => handleFieldChange('status', e.target.value)}
            disabled={isSubmitting}
          >
            <option value="Pending">Pending</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
          </select>
        </div>

        {/* Due Date Field */}
        <div className="mb-6">
          <label htmlFor="dueDate" className="block text-sm font-medium text-gray-700 mb-2">
            Due Date *
          </label>
          <input
            id="dueDate"
            name="dueDate"
            type="date"
            required
            aria-invalid={errors.dueDate ? 'true' : 'false'}
            aria-describedby={errors.dueDate ? 'dueDate-error' : undefined}
            className={`w-full px-3 py-2 border rounded-lg shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent ${
              errors.dueDate 
                ? 'border-red-300 bg-red-50' 
                : 'border-gray-300 hover:border-gray-400'
            }`}
            value={dueDate}
            onChange={(e) => handleFieldChange('dueDate', e.target.value)}
            onBlur={() => handleFieldBlur('dueDate')}
            disabled={isSubmitting}
            min={new Date().toISOString().split('T')[0]}
          />
          {errors.dueDate && (
            <p id="dueDate-error" className="mt-1 text-sm text-red-600" role="alert">
              {errors.dueDate}
            </p>
          )}
        </div>

        {/* Form Actions */}
        <div className="flex gap-3">
          <button
            type="submit"
            disabled={isSubmitting || Object.keys(errors).some(key => key !== 'submit' && errors[key])}
            className="flex-1 bg-primary hover:bg-purple-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-medium py-2.5 px-4 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
          >
            {isSubmitting ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Saving...
              </span>
            ) : (
              `${existingTask ? 'Update' : 'Create'} Task`
            )}
          </button>

          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="px-4 py-2.5 text-gray-700 bg-white hover:bg-gray-50 disabled:bg-gray-50 disabled:cursor-not-allowed border border-gray-300 rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}