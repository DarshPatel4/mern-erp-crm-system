const Task = require('../models/Task');
const Employee = require('../models/Employee');

// Get all tasks with filters and pagination
const getTasks = async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 10, 
      search = '', 
      status = '', 
      priority = '', 
      assigned_to = '' 
    } = req.query;

    // Build filter object
    const filter = {};
    
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }
    
    if (status) {
      filter.status = status;
    }
    
    if (priority) {
      filter.priority = priority;
    }
    
    if (assigned_to) {
      filter.assigned_to = assigned_to;
    }

    // Calculate pagination
    const skip = (page - 1) * limit;
    
    // Get tasks with populated assigned_to field
    const tasks = await Task.find(filter)
      .populate('assigned_to', 'name email designation department')
      .sort({ created_at: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    // Get total count for pagination
    const total = await Task.countDocuments(filter);

    res.json({
      success: true,
      data: tasks,
      pagination: {
        current: parseInt(page),
        pages: Math.ceil(total / limit),
        total
      }
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Error fetching tasks', 
      error: error.message 
    });
  }
};

// Get task by ID
const getTaskById = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id)
      .populate('assigned_to', 'name email designation department');
    
    if (!task) {
      return res.status(404).json({ 
        success: false, 
        message: 'Task not found' 
      });
    }

    res.json({ success: true, data: task });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Error fetching task', 
      error: error.message 
    });
  }
};

// Create new task
const createTask = async (req, res) => {
  try {
    const { title, description, assigned_to, priority, due_date, status } = req.body;

    // Validate required fields
    if (!title || !description || !assigned_to || !due_date) {
      return res.status(400).json({
        success: false,
        message: 'Title, description, assigned_to, and due_date are required'
      });
    }

    // Check if assigned employee exists
    const employee = await Employee.findById(assigned_to);
    if (!employee) {
      return res.status(400).json({
        success: false,
        message: 'Assigned employee not found'
      });
    }

    const task = new Task({
      title,
      description,
      assigned_to,
      priority: priority || 'Medium',
      due_date: new Date(due_date),
      status: status || 'Pending'
    });

    await task.save();
    await task.populate('assigned_to', 'name email designation department');

    res.status(201).json({ 
      success: true, 
      data: task,
      message: 'Task created successfully' 
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Error creating task', 
      error: error.message 
    });
  }
};

// Update task
const updateTask = async (req, res) => {
  try {
    const { title, description, assigned_to, priority, due_date, status } = req.body;

    // Check if assigned employee exists (if provided)
    if (assigned_to) {
      const employee = await Employee.findById(assigned_to);
      if (!employee) {
        return res.status(400).json({
          success: false,
          message: 'Assigned employee not found'
        });
      }
    }

    const updateData = {};
    if (title) updateData.title = title;
    if (description) updateData.description = description;
    if (assigned_to) updateData.assigned_to = assigned_to;
    if (priority) updateData.priority = priority;
    if (due_date) updateData.due_date = new Date(due_date);
    if (status) updateData.status = status;

    const task = await Task.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    ).populate('assigned_to', 'name email designation department');

    if (!task) {
      return res.status(404).json({ 
        success: false, 
        message: 'Task not found' 
      });
    }

    res.json({ 
      success: true, 
      data: task,
      message: 'Task updated successfully' 
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Error updating task', 
      error: error.message 
    });
  }
};

// Delete task
const deleteTask = async (req, res) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);
    
    if (!task) {
      return res.status(404).json({ 
        success: false, 
        message: 'Task not found' 
      });
    }

    res.json({ 
      success: true, 
      message: 'Task deleted successfully' 
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Error deleting task', 
      error: error.message 
    });
  }
};

// Update task status (for drag and drop)
const updateTaskStatus = async (req, res) => {
  try {
    const { status } = req.body;
    
    if (!status || !['Pending', 'In Progress', 'Completed', 'Overdue'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Valid status is required'
      });
    }

    const task = await Task.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    ).populate('assigned_to', 'name email designation department');

    if (!task) {
      return res.status(404).json({ 
        success: false, 
        message: 'Task not found' 
      });
    }

    res.json({ 
      success: true, 
      data: task,
      message: 'Task status updated successfully' 
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Error updating task status', 
      error: error.message 
    });
  }
};

// Get tasks for Kanban view (grouped by status)
const getTasksForKanban = async (req, res) => {
  try {
    const { search = '', assigned_to = '', priority = '' } = req.query;

    // Build filter object
    const filter = {};
    
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }
    
    if (assigned_to) {
      filter.assigned_to = assigned_to;
    }
    
    if (priority) {
      filter.priority = priority;
    }

    // Get all tasks with populated assigned_to field
    const tasks = await Task.find(filter)
      .populate('assigned_to', 'name email designation department')
      .sort({ created_at: -1 });

    // Group tasks by status
    const groupedTasks = {
      'Pending': tasks.filter(task => task.status === 'Pending'),
      'In Progress': tasks.filter(task => task.status === 'In Progress'),
      'Completed': tasks.filter(task => task.status === 'Completed'),
      'Overdue': tasks.filter(task => task.status === 'Overdue')
    };

    res.json({
      success: true,
      data: groupedTasks
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Error fetching tasks for Kanban', 
      error: error.message 
    });
  }
};

module.exports = {
  getTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
  updateTaskStatus,
  getTasksForKanban
};
