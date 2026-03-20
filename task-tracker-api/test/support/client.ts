import request from 'supertest';
import { app } from '../../src/app';

export function client() {
  const agent = request(app);
  return {
    get: (path: string) => agent.get(path),
    post: (path: string, body: unknown) => agent.post(path).send(body as object),
  };
}
