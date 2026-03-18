import { Request, Response, NextFunction } from 'express';
import { getMagicLink } from '../db';
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

  const link = getMagicLink(rawToken);
  if (!link) {
    res.status(401).json({ error: 'Token not found' });
    return;
  }

  if (link.expiresAt < Date.now()) {
    res.status(401).json({ error: 'Token has expired' });
    return;
  }

  req.magicLinkId = link.id;
  req.runId = link.runId;
  next();
}
