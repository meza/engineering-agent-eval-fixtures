import crypto from 'crypto';
import { config } from '../config';

export interface TokenPayload {
  sub: string;
  email: string;
  role: 'admin' | 'member' | 'viewer';
  iat: number;
  exp: number;
}

const ALGORITHM = 'sha256';
const VERSION = 'v1';

function encodePayload(payload: object): string {
  return Buffer.from(JSON.stringify(payload)).toString('base64url');
}

function decodePayload(encoded: string): object {
  return JSON.parse(Buffer.from(encoded, 'base64url').toString('utf8'));
}

function sign(data: string): string {
  return crypto
    .createHmac(ALGORITHM, config.hmacSecret)
    .update(data)
    .digest('base64url');
}

export function signToken(payload: Omit<TokenPayload, 'iat' | 'exp'>): string {
  const now = Math.floor(Date.now() / 1000);
  const fullPayload: TokenPayload = {
    ...payload,
    iat: now,
    exp: now + 3600,
  };

  const header = encodePayload({ alg: ALGORITHM, ver: VERSION });
  const body = encodePayload(fullPayload);
  const signature = sign(`${header}.${body}`);

  return `${header}.${body}.${signature}`;
}

export function verifyToken(token: string): TokenPayload | null {
  const parts = token.split('.');
  if (parts.length !== 3) return null;

  const [header, body, signature] = parts;
  const expectedSig = sign(`${header}.${body}`);

  if (!crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSig))) {
    return null;
  }

  const payload = decodePayload(body) as TokenPayload;
  const now = Math.floor(Date.now() / 1000);

  if (payload.exp < now) return null;

  return payload;
}
