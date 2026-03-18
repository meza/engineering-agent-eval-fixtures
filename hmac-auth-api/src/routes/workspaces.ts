import { Router, Request, Response } from 'express';
import { authenticate, requireRole } from '../middleware/authenticate';

const router = Router();

const WORKSPACES = [
  { id: 'ws-001', name: 'Engineering', ownerId: 'user-001', memberIds: ['user-001', 'user-002'] },
  { id: 'ws-002', name: 'Design', ownerId: 'user-002', memberIds: ['user-002'] },
];

router.get('/', authenticate, (req: Request, res: Response) => {
  const userId = req.user!.sub;
  const visible = WORKSPACES.filter(ws => ws.memberIds.includes(userId));
  res.json({ workspaces: visible });
});

router.get('/:id', authenticate, (req: Request, res: Response) => {
  const ws = WORKSPACES.find(w => w.id === req.params.id);
  if (!ws) {
    res.status(404).json({ error: 'Workspace not found' });
    return;
  }

  const isMember = ws.memberIds.includes(req.user!.sub);
  if (!isMember && req.user!.role !== 'admin') {
    res.status(403).json({ error: 'Not a member of this workspace' });
    return;
  }

  res.json({ workspace: ws });
});

router.post('/', authenticate, requireRole('admin', 'member'), (req: Request, res: Response) => {
  const { name } = req.body as { name?: string };
  if (!name) {
    res.status(400).json({ error: 'name is required' });
    return;
  }

  const newWorkspace = {
    id: `ws-${Date.now()}`,
    name,
    ownerId: req.user!.sub,
    memberIds: [req.user!.sub],
  };

  WORKSPACES.push(newWorkspace);
  res.status(201).json({ workspace: newWorkspace });
});

router.delete('/:id', authenticate, requireRole('admin'), (req: Request, res: Response) => {
  const idx = WORKSPACES.findIndex(w => w.id === req.params.id);
  if (idx === -1) {
    res.status(404).json({ error: 'Workspace not found' });
    return;
  }
  WORKSPACES.splice(idx, 1);
  res.status(200).json({ message: `Workspace ${req.params.id} deleted` });
});

export default router;
