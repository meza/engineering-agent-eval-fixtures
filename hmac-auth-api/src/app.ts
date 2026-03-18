import express from 'express';
import { config } from './config';
import authRouter from './routes/auth';
import usersRouter from './routes/users';
import workspacesRouter from './routes/workspaces';

export const app = express();

app.use(express.json());

app.get('/health', (_req, res) => {
  res.json({ status: 'ok', env: config.nodeEnv });
});

app.use('/auth', authRouter);
app.use('/users', usersRouter);
app.use('/workspaces', workspacesRouter);

app.use((_req, res) => {
  res.status(404).json({ error: 'Not found' });
});

if (require.main === module) {
  app.listen(config.port, () => {
    console.log(`Server listening on port ${config.port} [${config.nodeEnv}]`);
  });
}
