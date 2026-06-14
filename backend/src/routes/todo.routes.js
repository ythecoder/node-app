import { Router } from 'express';
import { getAllTodos, createTodo, updateTodo, deleteTodo } from '../controllers/todo.controller.js';
import { auth } from '../middlewares/auth.middleware.js';

const router = Router();

router.use(auth);

router.get('/', getAllTodos);
router.post('/', createTodo);
router.put('/:id', updateTodo);
router.delete('/:id', deleteTodo);

export default router;
