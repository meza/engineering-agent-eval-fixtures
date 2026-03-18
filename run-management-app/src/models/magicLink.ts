export interface MagicLink {
  id: string;
  runId: string;
  token: string;
  expiresAt: number;
  createdAt: number;
}

export interface CreateMagicLinkInput {
  runId: string;
  ttlSeconds?: number;
}
