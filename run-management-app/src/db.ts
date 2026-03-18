import { Run, RunState } from './models/run';
import { MagicLink } from './models/magicLink';
import { Participant } from './models/participant';

const runs = new Map<string, Run>();
const magicLinks = new Map<string, MagicLink>();
const participants = new Map<string, Participant[]>();

export function getRun(id: string): Run | undefined {
  return runs.get(id);
}

export function getAllRuns(): Run[] {
  return Array.from(runs.values());
}

export function createRun(run: Run): Run {
  runs.set(run.id, run);
  return run;
}

export function updateRunState(id: string, state: RunState): Run | undefined {
  const run = runs.get(id);
  if (!run) return undefined;
  const updated = { ...run, state, updatedAt: Date.now() };
  runs.set(id, updated);
  return updated;
}

export function getMagicLink(token: string): MagicLink | undefined {
  return Array.from(magicLinks.values()).find((ml) => ml.token === token);
}

export function getMagicLinkById(id: string): MagicLink | undefined {
  return magicLinks.get(id);
}

export function createMagicLink(link: MagicLink): MagicLink {
  magicLinks.set(link.id, link);
  return link;
}

export function getParticipantsByRun(runId: string): Participant[] {
  return participants.get(runId) ?? [];
}

export function createParticipant(participant: Participant): Participant {
  const existing = participants.get(participant.runId) ?? [];
  participants.set(participant.runId, [...existing, participant]);
  return participant;
}
