export interface Participant {
  id: string;
  runId: string;
  email: string;
  invitedAt: number;
}

export interface InviteParticipantInput {
  email: string;
}
