export type RunState = 'ACTIVE' | 'COMPLETED' | 'CANCELLED';

export interface Run {
  id: string;
  title: string;
  state: RunState;
  createdAt: number;
  updatedAt: number;
}

export interface CreateRunInput {
  title: string;
}

export interface UpdateRunStateInput {
  state: RunState;
}
