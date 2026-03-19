import crypto from 'crypto';

const SECRET = process.env.HMAC_SECRET ?? 'dev-secret-change-in-production';

export function signToken(payload: Record<string, unknown>): string {
  const data = JSON.stringify(payload);
  const encoded = Buffer.from(data).toString('base64url');
  const sig = crypto
    .createHmac('sha256', SECRET)
    .update(encoded)
    .digest('base64url');
  return `${encoded}.${sig}`;
}

export function verifyToken(token: string): Record<string, unknown> | null {
  const parts = token.split('.');
  if (parts.length !== 2) return null;

  const [encoded, sig] = parts;
  const expected = crypto
    .createHmac('sha256', SECRET)
    .update(encoded)
    .digest('base64url');

  const sigBuf = Buffer.from(sig);
  const expectedBuf = Buffer.from(expected);
  if (sigBuf.length !== expectedBuf.length || !crypto.timingSafeEqual(sigBuf, expectedBuf)) {
    return null;
  }

  try {
    return JSON.parse(Buffer.from(encoded, 'base64url').toString('utf8'));
  } catch {
    return null;
  }
}
