import { authRequest } from '../client';
import type { Task } from './tasksTypes';

export const getTasks = (token: string): Promise<Task[]> =>
  authRequest<Task[]>('/tasks', token);

export const createTask = (token: string, title: string): Promise<Task> =>
  authRequest<Task>('/tasks', token, {
    method: 'POST',
    body: JSON.stringify({ title }),
  });

export const updateTask = (
  token: string,
  id: number,
  data: Partial<{ title: string; completed: boolean }>
): Promise<Task> =>
  authRequest<Task>(`/tasks/${id}`, token, {
    method: 'PUT',
    body: JSON.stringify(data),
  });

export const deleteTask = (token: string, id: number): Promise<void> =>
  authRequest<void>(`/tasks/${id}`, token, { method: 'DELETE' });
