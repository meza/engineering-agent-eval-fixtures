import request from 'supertest';
import { app } from '../app';
import { signToken } from '../lib/hmac';
import { TokenPayload } from '../lib/hmac';

const ADMIN_PAYLOAD: Omit<TokenPayload, 'iat' | 'exp'> = {
  sub: 'user-001',
  email: 'alice@example.com',
  role: 'admin',
};

const MEMBER_PAYLOAD: Omit<TokenPayload, 'iat' | 'exp'> = {
  sub: 'user-002',
  email: 'bob@example.com',
  role: 'member',
};

function makeBearer(payload: Omit<TokenPayload, 'iat' | 'exp'>): string {
  return `Bearer ${signToken(payload)}`;
}

describe('authenticate middleware', () => {
  it('returns 401 when no Authorization header is present', async () => {
    const res = await request(app).get('/users');
    expect(res.status).toBe(401);
    expect(res.body.error).toMatch(/authorization/i);
  });

  it('returns 401 when Authorization header is malformed', async () => {
    const res = await request(app).get('/users').set('Authorization', 'Token abc123');
    expect(res.status).toBe(401);
  });

  it('returns 401 for a token signed with the wrong secret', async () => {
    // Manually construct a token with a different secret
    const header = Buffer.from(JSON.stringify({ alg: 'sha256', ver: 'v1' })).toString('base64url');
    const body = Buffer.from(JSON.stringify({ ...ADMIN_PAYLOAD, iat: 1000, exp: 9999999999 })).toString('base64url');
    const fakeToken = `${header}.${body}.invalidsignature`;

    const res = await request(app).get('/users').set('Authorization', `Bearer ${fakeToken}`);
    expect(res.status).toBe(401);
    expect(res.body.error).toMatch(/invalid or expired/i);
  });

  it('passes through to the route handler with a valid token', async () => {
    const res = await request(app).get('/users').set('Authorization', makeBearer(ADMIN_PAYLOAD));
    expect(res.status).toBe(200);
    expect(res.body.users).toBeDefined();
  });

  it('attaches decoded user payload to req.user', async () => {
    const res = await request(app).get('/users').set('Authorization', makeBearer(ADMIN_PAYLOAD));
    expect(res.status).toBe(200);
    expect(res.body.requestedBy).toBe('user-001');
  });
});

describe('requireRole middleware', () => {
  it('returns 403 when a member tries a DELETE (admin-only route)', async () => {
    const res = await request(app)
      .delete('/users/user-001')
      .set('Authorization', makeBearer(MEMBER_PAYLOAD));
    expect(res.status).toBe(403);
  });

  it('allows an admin to hit an admin-only route', async () => {
    const res = await request(app)
      .delete('/users/user-001')
      .set('Authorization', makeBearer(ADMIN_PAYLOAD));
    expect(res.status).toBe(200);
  });
});

describe('POST /auth/token', () => {
  it('returns a valid HMAC token on correct credentials', async () => {
    const res = await request(app)
      .post('/auth/token')
      .send({ email: 'alice@example.com', password: 'correct-horse-battery-staple' });

    expect(res.status).toBe(200);
    expect(res.body.token).toBeDefined();
    expect(res.body.token.split('.')).toHaveLength(3);
  });

  it('returns 401 on wrong password', async () => {
    const res = await request(app)
      .post('/auth/token')
      .send({ email: 'alice@example.com', password: 'wrong' });
    expect(res.status).toBe(401);
  });
});
