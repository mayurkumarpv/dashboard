# Task Dashboard

A simple task management app built with React and Tailwind CSS.

## Live Demo

🚀 **[View Live Demo](https://glistening-hummingbird-28f0db.netlify.app/)**

## Getting Started

```bash
npm install
npm run dev
```

## Tech Stack

- React + Vite
- Tailwind CSS  
- React Router
- Framer Motion

## Features

- Create, edit, and delete tasks
- Task status tracking
- Local storage persistence
- Responsive design

## State Management

The app uses React Context with useReducer for state management:

### State Structure
```javascript
{
  tasks: [
    {
      id: "1640995200000",
      title: "Complete project",
      description: "Finish the dashboard app",
      status: "pending", // "pending" | "in_progress" | "completed"
      dueDate: "2026-03-15",
      createdAt: "2026-03-01T10:00:00.000Z",
      updatedAt: "2026-03-01T10:00:00.000Z"
    }
  ]
}
```

### Actions
- `ADD` - Add new task
- `UPDATE` - Update existing task
- `DELETE` - Remove task by ID

Data persists automatically to localStorage on every state change.

## Scripts

- `npm run dev` - Development server
- `npm run build` - Production build
- `npm run preview` - Preview build

## Deployment

Configured for Netlify deployment with `netlify.toml`.
