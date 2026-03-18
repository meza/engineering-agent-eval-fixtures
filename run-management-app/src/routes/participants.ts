import { Router, Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { getRun, getParticipantsByRun, createParticipant } from '../db';
import { InviteParticipantInput } from '../models/participant';

const router = Router({ mergeParams: true });

router.get('/', (req: Request, res: Response) => {
  const run = getRun(req.params.runId);
  if (!run) {
    res.status(404).json({ error: 'Run not found' });
    return;
  }
  res.json(getParticipantsByRun(req.params.runId));
});

router.post('/', (req: Request, res: Response) => {
  const run = getRun(req.params.runId);
  if (!run) {
    res.status(404).json({ error: 'Run not found' });
    return;
  }

  if (run.state !== 'ACTIVE') {
    res.status(422).json({ error: 'Cannot invite participants to a non-active run' });
    return;
  }

  const body = req.body as InviteParticipantInput;
  if (!body.email) {
    res.status(400).json({ error: 'email is required' });
    return;
  }

  const existing = getParticipantsByRun(req.params.runId);
  if (existing.some((p) => p.email === body.email)) {
    res.status(409).json({ error: 'Participant already invited' });
    return;
  }

  const participant = createParticipant({
    id: uuidv4(),
    runId: req.params.runId,
    email: body.email,
    invitedAt: Date.now(),
  });

  res.status(201).json(participant);
});

export default router;
