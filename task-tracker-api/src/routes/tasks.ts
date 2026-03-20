import { Router, Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { getAllTasks, addTask, getTaskById } from '../store';
import { CreateTaskInput, TaskStatus } from '../models/task';

const router = Router();

const VALID_STATUSES: TaskStatus[] = ['TODO', 'IN_PROGRESS', 'DONE'];

router.get('/', (_req: Request, res: Response) => {
  res.json(getAllTasks());
});

router.get('/:id', (req: Request, res: Response) => {
  const task = getTaskById(req.params.id);
  if (!task) {
    res.status(404).json({ error: 'Task not found' });
    return;
  }
  res.json(task);
});

router.post('/', (req: Request, res: Response) => {
  const body = req.body as CreateTaskInput;

  if (!body.title || typeof body.title !== 'string') {
    res.status(400).json({ error: 'title is required' });
    return;
  }

  if (!body.status || !VALID_STATUSES.includes(body.status)) {
    res.status(400).json({ error: `status must be one of: ${VALID_STATUSES.join(', ')}` });
    return;
  }

  const task = addTask({
    id: uuidv4(),
    title: body.title,
    status: body.status,
    createdAt: new Date().toISOString(),
  });

  res.status(201).json(task);
});

export default router;
