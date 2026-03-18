import { Router, Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { getAllRuns, getRun, createRun, updateRunState } from '../db';
import { CreateRunInput, UpdateRunStateInput, RunState } from '../models/run';

const router = Router();

const VALID_STATES: RunState[] = ['ACTIVE', 'COMPLETED', 'CANCELLED'];

router.get('/', (_req: Request, res: Response) => {
  res.json(getAllRuns());
});

router.get('/:id', (req: Request, res: Response) => {
  const run = getRun(req.params.id);
  if (!run) {
    res.status(404).json({ error: 'Run not found' });
    return;
  }
  res.json(run);
});

router.post('/', (req: Request, res: Response) => {
  const body = req.body as CreateRunInput;
  if (!body.title) {
    res.status(400).json({ error: 'title is required' });
    return;
  }
  const now = Date.now();
  const run = createRun({
    id: uuidv4(),
    title: body.title,
    state: 'ACTIVE',
    createdAt: now,
    updatedAt: now,
  });
  res.status(201).json(run);
});

router.patch('/:id/state', (req: Request, res: Response) => {
  const body = req.body as UpdateRunStateInput;
  if (!body.state || !VALID_STATES.includes(body.state)) {
    res.status(400).json({ error: `state must be one of: ${VALID_STATES.join(', ')}` });
    return;
  }
  const run = updateRunState(req.params.id, body.state);
  if (!run) {
    res.status(404).json({ error: 'Run not found' });
    return;
  }
  res.json(run);
});

export default router;
