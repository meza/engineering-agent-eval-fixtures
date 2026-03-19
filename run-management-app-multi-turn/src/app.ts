import express from 'express';
import runsRouter from './routes/runs';
import magicLinkRouter from './routes/magicLink';
import participantsRouter from './routes/participants';

const app = express();

app.use(express.json());

app.get('/health', (_req, res) => {
  res.json({ status: 'ok' });
});

app.use('/runs', runsRouter);
app.use('/runs/:runId/participants', participantsRouter);
app.use('/magic-links', magicLinkRouter);

app.use((_req, res) => {
  res.status(404).json({ error: 'Not found' });
});

const PORT = process.env.PORT ?? 3000;
app.listen(PORT, () => {
  console.log(`Run management server listening on port ${PORT}`);
});

export default app;
