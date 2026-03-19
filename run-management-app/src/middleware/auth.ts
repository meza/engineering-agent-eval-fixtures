import { Request, Response, NextFunction } from 'express';
import { getRun } from '../db';
import { verifyToken } from '../lib/hmac';

export interface AuthenticatedRequest extends Request {
  magicLinkId?: string;
  runId?: string;
}

export function requireMagicLink(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): void {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) {
    res.status(401).json({ error: 'Missing authorization header' });
    return;
  }

  const rawToken = authHeader.slice(7);
  const payload = verifyToken(rawToken);

  if (!payload) {
    res.status(401).json({ error: 'Invalid token signature' });
    return;
  }

  const expiresAt = payload.expiresAt as number;
  if (expiresAt < Date.now()) {
    res.status(401).json({ error: 'Token has expired' });
    return;
  }

  const runId = payload.runId as string;
  const run = getRun(runId);
  if (!run || run.state !== 'ACTIVE') {
    res.status(401).json({ error: 'Run is no longer active' });
    return;
  }

  req.magicLinkId = payload.linkId as string;
  req.runId = runId;
  next();
}
