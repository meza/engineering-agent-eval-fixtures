import { Router, Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { getRun, getMagicLink, createMagicLink } from '../db';
import { CreateMagicLinkInput } from '../models/magicLink';
import { signToken, verifyToken } from '../lib/hmac';

const router = Router();

const DEFAULT_TTL_SECONDS = 60 * 60 * 24 * 7;

router.post('/', (req: Request, res: Response) => {
  const body = req.body as CreateMagicLinkInput;
  if (!body.runId) {
    res.status(400).json({ error: 'runId is required' });
    return;
  }

  const run = getRun(body.runId);
  if (!run) {
    res.status(404).json({ error: 'Run not found' });
    return;
  }

  if (run.state !== 'ACTIVE') {
    res.status(422).json({ error: 'Magic links can only be issued for active runs' });
    return;
  }

  const ttl = (body.ttlSeconds ?? DEFAULT_TTL_SECONDS) * 1000;
  const expiresAt = Date.now() + ttl;
  const id = uuidv4();

  const token = signToken({ linkId: id, runId: run.id, expiresAt });

  const link = createMagicLink({ id, runId: run.id, token, expiresAt, createdAt: Date.now() });

  res.status(201).json({ id: link.id, token: link.token, expiresAt: link.expiresAt });
});

router.get('/validate', (req: Request, res: Response) => {
  const raw = req.query.token as string;
  if (!raw) {
    res.status(400).json({ error: 'token query parameter is required' });
    return;
  }

  const payload = verifyToken(raw);
  if (!payload) {
    res.status(401).json({ error: 'Invalid token' });
    return;
  }

  const link = getMagicLink(raw);
  if (!link) {
    res.status(401).json({ error: 'Token not recognised' });
    return;
  }

  if (link.expiresAt < Date.now()) {
    res.status(401).json({ error: 'Token has expired' });
    return;
  }

  res.json({ valid: true, runId: link.runId });
});

export default router;
