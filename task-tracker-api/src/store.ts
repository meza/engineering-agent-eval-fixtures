import { Task } from './models/task';

let tasks: Task[] = [];

export function getAllTasks(): Task[] {
  return tasks;
}

export function getTaskById(id: string): Task | undefined {
  return tasks.find((t) => t.id === id);
}

export function addTask(task: Task): Task {
  tasks.push(task);
  return task;
}

export function resetTasks(): void {
  tasks = [];
}
