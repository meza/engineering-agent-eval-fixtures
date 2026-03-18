import { Router, Request, Response } from 'express';
import { authenticate, requireRole } from '../middleware/authenticate';

const router = Router();

const USERS = [
  { id: 'user-001', email: 'alice@example.com', role: 'admin', name: 'Alice' },
  { id: 'user-002', email: 'bob@example.com', role: 'member', name: 'Bob' },
];

router.get('/', authenticate, (req: Request, res: Response) => {
  // All authenticated users can list users, but only non-sensitive fields
  const safeUsers = USERS.map(({ id, email, name }) => ({ id, email, name }));
  res.json({ users: safeUsers, requestedBy: req.user?.sub });
});

router.get('/:id', authenticate, (req: Request, res: Response) => {
  const user = USERS.find(u => u.id === req.params.id);

  if (!user) {
    res.status(404).json({ error: 'User not found' });
    return;
  }

  const isSelf = req.user?.sub === user.id;
  const isAdmin = req.user?.role === 'admin';

  if (!isSelf && !isAdmin) {
    res.status(403).json({ error: 'Cannot view another user\'s profile' });
    return;
  }

  res.json({ user });
});

router.delete('/:id', authenticate, requireRole('admin'), (req: Request, res: Response) => {
  const exists = USERS.some(u => u.id === req.params.id);
  if (!exists) {
    res.status(404).json({ error: 'User not found' });
    return;
  }
  // In prod: soft-delete from DB, also invalidate any outstanding HMAC tokens —
  // NOTE: HMAC tokens are stateless; revocation requires a blocklist or waiting for exp
  res.status(200).json({ message: `User ${req.params.id} deleted` });
});

export default router;
