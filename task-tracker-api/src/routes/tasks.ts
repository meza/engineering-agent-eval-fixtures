import { Router, Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { getAllTasks, addTask } from '../store';
import { CreateTaskInput, TaskStatus } from '../models/task';

const router = Router();

const VALID_STATUSES: TaskStatus[] = ['TODO', 'IN_PROGRESS', 'DONE'];

router.get('/', (_req: Request, res: Response) => {
  res.json(getAllTasks());
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
