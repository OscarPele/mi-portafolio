export interface TaskOwner {
  id: number;
  username: string;
}

export interface Task {
  id: number;
  title: string;
  completed: boolean;
  createdAt: string;
  updatedAt: string;
  owner: TaskOwner;
  completedBy: TaskOwner | null;
  canModify: boolean;
  canToggleComplete: boolean;
}
