import Todo from '../models/todo.model.js';

export const getAllTodos = async (req, res) => {
  try {
    const tenantId = req.tenantId;
    const todos = await Todo.find({ tenantId }).sort({ createdAt: -1 });
    res.json({ count: todos.length, todos });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch todos', error: error.message });
  }
};

export const createTodo = async (req, res) => {
  try {
    const { title } = req.body;
    const tenantId = req.tenantId;

    if (!title || !title.trim()) {
      return res.status(400).json({ message: 'Title is required' });
    }

    const todo = new Todo({ title: title.trim(), tenantId });
    await todo.save();

    res.status(201).json({ message: 'Todo created', todo });
  } catch (error) {
    res.status(500).json({ message: 'Failed to create todo', error: error.message });
  }
};

export const updateTodo = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, completed } = req.body;
    const tenantId = req.tenantId;

    const todo = await Todo.findOneAndUpdate(
      { _id: id, tenantId },
      { $set: { ...(title !== undefined && { title }), ...(completed !== undefined && { completed }) } },
      { new: true, runValidators: true },
    );

    if (!todo) {
      return res.status(404).json({ message: 'Todo not found' });
    }

    res.json({ message: 'Todo updated', todo });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update todo', error: error.message });
  }
};

export const deleteTodo = async (req, res) => {
  try {
    const { id } = req.params;
    const tenantId = req.tenantId;

    const todo = await Todo.findOneAndDelete({ _id: id, tenantId });

    if (!todo) {
      return res.status(404).json({ message: 'Todo not found' });
    }

    res.json({ message: 'Todo deleted', todo });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete todo', error: error.message });
  }
};

export default { getAllTodos, createTodo, updateTodo, deleteTodo };
