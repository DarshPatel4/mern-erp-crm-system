# Task Management Module

A comprehensive task management system for the ERP-CRM project with both List and Kanban views.

## Features

### Views
- **List View**: Tabular display with pagination
- **Kanban View**: Drag-and-drop board with status columns

### Task Management
- Create, edit, view, and delete tasks
- Assign tasks to employees
- Set priority levels (Low, Medium, High)
- Set due dates and status
- Real-time status updates via drag-and-drop

### Filtering & Search
- Filter by assigned user
- Filter by status (Pending, In Progress, Completed, Overdue)
- Filter by priority (Low, Medium, High)
- Search tasks by title and description

### Responsive Design
- Fully responsive for desktop, tablet, and mobile
- Modern UI components matching the ERP-CRM theme
- Consistent with existing dashboard design

## Components

### Main Components
- `TaskManagement.jsx` - Main page component
- `TaskList.jsx` - List view with table and pagination
- `TaskKanban.jsx` - Kanban board with drag-and-drop
- `TaskModal.jsx` - Create/edit task modal
- `DeleteConfirmModal.jsx` - Delete confirmation modal

### Services
- `taskService.js` - API service for task operations

## API Endpoints

### Backend Routes (`/api/tasks`)
- `GET /` - Get all tasks with filters and pagination
- `GET /kanban` - Get tasks grouped by status for Kanban view
- `GET /:id` - Get task by ID
- `POST /` - Create new task
- `PUT /:id` - Update task
- `PATCH /:id/status` - Update task status (for drag-and-drop)
- `DELETE /:id` - Delete task

## Database Schema

### Task Model
```javascript
{
  title: String (required),
  description: String (required),
  assigned_to: ObjectId (ref: Employee, required),
  priority: String (enum: ['Low', 'Medium', 'High'], default: 'Medium'),
  due_date: Date (required),
  status: String (enum: ['Pending', 'In Progress', 'Completed', 'Overdue'], default: 'Pending'),
  created_at: Date (default: now),
  updated_at: Date (auto-update)
}
```

## Usage

### Navigation
Access the Task Management page by clicking "Tasks" in the sidebar navigation.

### Creating Tasks
1. Click the "Create Task" button
2. Fill in the required fields (title, description, assigned user, due date)
3. Set priority and status
4. Click "Create Task"

### Editing Tasks
1. Click the edit icon (pencil) in the actions column
2. Modify the task details
3. Click "Update Task"

### Deleting Tasks
1. Click the delete icon (trash) in the actions column
2. Confirm deletion in the modal

### Drag and Drop (Kanban View)
1. Switch to Kanban view
2. Drag task cards between status columns
3. Status updates automatically in the database

## Sample Data

To initialize sample tasks, run:
```bash
node server/initTaskData.js
```

This will create sample tasks assigned to random employees.

## Dependencies

### Frontend
- React Icons for UI icons
- React Router for navigation
- Tailwind CSS for styling

### Backend
- Express.js for API routes
- Mongoose for MongoDB integration
- JWT for authentication

## Responsive Breakpoints

- **Mobile**: < 768px (single column layout)
- **Tablet**: 768px - 1024px (2-column Kanban)
- **Desktop**: > 1024px (4-column Kanban, full table)

## Security

- All routes protected with JWT authentication
- Role-based access control (admin, hr, employee)
- Input validation and sanitization
- CSRF protection via same-origin policy
