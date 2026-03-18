import { Router, Request, Response } from 'express';
import { signToken } from '../lib/hmac';

const router = Router();

// Simulated user store — in prod this would query a DB with hashed passwords
const USERS: Record<string, { passwordHash: string; email: string; role: 'admin' | 'member' | 'viewer' }> = {
  'user-001': { passwordHash: '$2b$10$examplehash', email: 'alice@example.com', role: 'admin' },
  'user-002': { passwordHash: '$2b$10$examplehash', email: 'bob@example.com', role: 'member' },
};

function validateCredentials(email: string, password: string): typeof USERS[string] & { id: string } | null {
  const entry = Object.entries(USERS).find(([, u]) => u.email === email);
  if (!entry) return null;
  // In prod: bcrypt.compareSync(password, entry[1].passwordHash)
  if (password !== 'correct-horse-battery-staple') return null;
  return { id: entry[0], ...entry[1] };
}

router.post('/token', (req: Request, res: Response) => {
  const { email, password } = req.body as { email?: string; password?: string };

  if (!email || !password) {
    res.status(400).json({ error: 'email and password are required' });
    return;
  }

  const user = validateCredentials(email, password);
  if (!user) {
    res.status(401).json({ error: 'Invalid credentials' });
    return;
  }

  const token = signToken({ sub: user.id, email: user.email, role: user.role });
  res.status(200).json({ token });
});

export default router;
