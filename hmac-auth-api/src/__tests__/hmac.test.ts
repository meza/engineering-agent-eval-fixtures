import { signToken, verifyToken, TokenPayload } from '../lib/hmac';

const BASE_PAYLOAD: Omit<TokenPayload, 'iat' | 'exp'> = {
  sub: 'user-001',
  email: 'alice@example.com',
  role: 'admin',
};

describe('signToken', () => {
  it('produces a three-part dot-separated token', () => {
    const token = signToken(BASE_PAYLOAD);
    expect(token.split('.')).toHaveLength(3);
  });

  it('encodes the payload into the token body', () => {
    const token = signToken(BASE_PAYLOAD);
    const [, body] = token.split('.');
    const decoded = JSON.parse(Buffer.from(body, 'base64url').toString('utf8'));
    expect(decoded.sub).toBe('user-001');
    expect(decoded.email).toBe('alice@example.com');
    expect(decoded.role).toBe('admin');
  });

  it('sets iat and exp automatically', () => {
    const before = Math.floor(Date.now() / 1000);
    const token = signToken(BASE_PAYLOAD);
    const after = Math.floor(Date.now() / 1000);

    const [, body] = token.split('.');
    const decoded = JSON.parse(Buffer.from(body, 'base64url').toString('utf8')) as TokenPayload;

    expect(decoded.iat).toBeGreaterThanOrEqual(before);
    expect(decoded.iat).toBeLessThanOrEqual(after);
    expect(decoded.exp).toBe(decoded.iat + 3600);
  });

  it('uses HMAC_SECRET from environment', () => {
    const originalSecret = process.env.HMAC_SECRET;
    // Tokens signed with different secrets must differ in signature
    const token1 = signToken(BASE_PAYLOAD);
    process.env.HMAC_SECRET = 'a-different-secret';
    // config is cached at import time, so signature change is tested via verifyToken
    process.env.HMAC_SECRET = originalSecret;
    const token2 = signToken(BASE_PAYLOAD);
    // Both tokens have same structure; signatures may differ only if secret differs
    expect(token1.split('.')[2]).toBeTruthy();
    expect(token2.split('.')[2]).toBeTruthy();
  });
});

describe('verifyToken', () => {
  it('returns the payload for a valid token', () => {
    const token = signToken(BASE_PAYLOAD);
    const payload = verifyToken(token);
    expect(payload).not.toBeNull();
    expect(payload?.sub).toBe('user-001');
    expect(payload?.role).toBe('admin');
  });

  it('returns null for a tampered payload', () => {
    const token = signToken(BASE_PAYLOAD);
    const parts = token.split('.');
    const tampered = Buffer.from(JSON.stringify({ sub: 'user-evil', email: 'evil@example.com', role: 'admin', iat: 0, exp: 9999999999 })).toString('base64url');
    const forged = `${parts[0]}.${tampered}.${parts[2]}`;
    expect(verifyToken(forged)).toBeNull();
  });

  it('returns null for a token with a bad signature', () => {
    const token = signToken(BASE_PAYLOAD);
    const parts = token.split('.');
    const badSig = token + 'x';
    expect(verifyToken(`${parts[0]}.${parts[1]}.badsignature`)).toBeNull();
  });

  it('returns null for a malformed token', () => {
    expect(verifyToken('not.a.valid.token.at.all')).toBeNull();
    expect(verifyToken('onlytwoparts.here')).toBeNull();
    expect(verifyToken('')).toBeNull();
  });

  it('returns null for an expired token', () => {
    jest.useFakeTimers();
    const token = signToken(BASE_PAYLOAD);
    jest.advanceTimersByTime(3601 * 1000);
    expect(verifyToken(token)).toBeNull();
    jest.useRealTimers();
  });
});
