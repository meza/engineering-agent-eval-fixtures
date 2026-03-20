import { client } from './support/client';
import { resetTasks } from '../src/store';

beforeEach(() => {
  resetTasks();
});

describe('GET /tasks', () => {
  it('returns an empty array when there are no tasks', async () => {
    const res = await client().get('/tasks');
    expect(res.status).toBe(200);
    expect(res.body).toEqual([]);
  });

  it('returns all created tasks', async () => {
    await client().post('/tasks', { title: 'Write tests', status: 'TODO' });
    await client().post('/tasks', { title: 'Review PR', status: 'IN_PROGRESS' });

    const res = await client().get('/tasks');
    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(2);
  });
});

describe('POST /tasks', () => {
  it('creates a task and returns it with generated id and createdAt', async () => {
    const res = await client().post('/tasks', { title: 'Ship feature', status: 'TODO' });

    expect(res.status).toBe(201);
    expect(res.body).toMatchObject({
      title: 'Ship feature',
      status: 'TODO',
    });
    expect(typeof res.body.id).toBe('string');
    expect(typeof res.body.createdAt).toBe('string');
  });

  it('returns 400 when status is invalid', async () => {
    const res = await client().post('/tasks', { title: 'Bad task', status: 'NOPE' });

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('error');
  });

  it('returns 400 when title is missing', async () => {
    const res = await client().post('/tasks', { status: 'TODO' });

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('error');
  });

  it('persists the task so GET /tasks returns it', async () => {
    await client().post('/tasks', { title: 'Persistent task', status: 'DONE' });

    const res = await client().get('/tasks');
    expect(res.body[0]).toMatchObject({ title: 'Persistent task', status: 'DONE' });
  });
});
