import express from 'express';
import tasksRouter from './routes/tasks';

export const app = express();

app.use(express.json());

app.use('/tasks', tasksRouter);

app.use((_req, res) => {
  res.status(404).json({ error: 'Not found' });
});
