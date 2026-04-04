import { useCallback, useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { getTasks, createTask, updateTask, deleteTask } from '../api/tasks/tasksApi';
import type { Task } from '../api/tasks/tasksTypes';
import './TasksPage.scss';

export function TasksPage() {
  const { token, clearToken } = useAuth();

  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [newTitle, setNewTitle] = useState('');
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editValue, setEditValue] = useState('');
  const [busy, setBusy] = useState<Set<number>>(new Set());

  const canModify = useCallback((task: Task) => task.canModify, []);
  const canToggleComplete = useCallback((task: Task) => task.canToggleComplete, []);

  const markBusy = (id: number) => setBusy(prev => new Set(prev).add(id));
  const unmarkBusy = (id: number) => setBusy(prev => { const s = new Set(prev); s.delete(id); return s; });

  // ── Fetch ────────────────────────────────────────────────
  useEffect(() => {
    if (!token) return;
    getTasks(token)
      .then(setTasks)
      .finally(() => setLoading(false));
  }, [token]);

  // ── Add ──────────────────────────────────────────────────
  const addTask = async () => {
    const title = newTitle.trim();
    if (!title || !token) return;
    setNewTitle('');
    const task = await createTask(token, title);
    setTasks(prev => [task, ...prev]);
  };

  // ── Toggle complete ──────────────────────────────────────
  const toggleTask = async (task: Task) => {
    if (!token || busy.has(task.id)) return;
    markBusy(task.id);
    try {
      const updated = await updateTask(token, task.id, { completed: !task.completed });
      setTasks(prev => prev.map(t => t.id === updated.id ? updated : t));
    } finally {
      unmarkBusy(task.id);
    }
  };

  // ── Edit ─────────────────────────────────────────────────
  const startEdit = (task: Task) => {
    setEditingId(task.id);
    setEditValue(task.title);
  };

  const saveEdit = async () => {
    if (!token || editingId === null) return;
    const title = editValue.trim();
    if (!title) return;
    markBusy(editingId);
    const id = editingId;
    setEditingId(null);
    try {
      const updated = await updateTask(token, id, { title });
      setTasks(prev => prev.map(t => t.id === updated.id ? updated : t));
    } finally {
      unmarkBusy(id);
    }
  };

  const cancelEdit = () => setEditingId(null);

  // ── Delete ───────────────────────────────────────────────
  const removeTask = async (id: number) => {
    if (!token || busy.has(id)) return;
    markBusy(id);
    try {
      await deleteTask(token, id);
      setTasks(prev => prev.filter(t => t.id !== id));
    } finally {
      unmarkBusy(id);
    }
  };

  const pending = tasks.filter(t => !t.completed).length;
  const done    = tasks.filter(t =>  t.completed).length;

  return (
    <div className="tasks-page">
      <header className="tasks-page__header">
        <h1 className="tasks-page__title">Mis tareas</h1>
        <button type="button" className="tasks-page__logout" onClick={clearToken}>
          Cerrar sesion
        </button>
      </header>

      <main className="tasks-page__main">
        {/* Add task */}
        <form className="tasks-page__add-form" onSubmit={e => { e.preventDefault(); addTask(); }}>
          <input
            className="tasks-page__add-input"
            value={newTitle}
            onChange={e => setNewTitle(e.target.value)}
            placeholder="Nueva tarea..."
            maxLength={120}
          />
          <button type="submit" className="tasks-page__add-btn" disabled={!newTitle.trim()}>
            + Añadir
          </button>
        </form>

        {/* Stats */}
        {tasks.length > 0 && (
          <p className="tasks-page__stats">
            {pending} pendiente{pending !== 1 ? 's' : ''} · {done} completada{done !== 1 ? 's' : ''}
          </p>
        )}

        {/* List */}
        {loading ? (
          <div className="tasks-page__empty">
            <span className="tasks-page__spinner" />
          </div>
        ) : tasks.length === 0 ? (
          <div className="tasks-page__empty">
            <span className="tasks-page__empty-icon">📋</span>
            <p>No hay tareas. Añade una arriba.</p>
          </div>
        ) : (
          <ul className="tasks-page__list">
            {tasks.map(task => (
              <li
                key={task.id}
                className={`tasks-page__item${task.completed ? ' tasks-page__item--done' : ''}${busy.has(task.id) ? ' tasks-page__item--busy' : ''}`}
              >
                {/* Checkbox */}
                <button
                  type="button"
                  className={`tasks-page__check${task.completed ? ' tasks-page__check--checked' : ''}`}
                  onClick={() => canToggleComplete(task) && toggleTask(task)}
                  disabled={!canToggleComplete(task) || busy.has(task.id)}
                  aria-label={task.completed ? 'Marcar como pendiente' : 'Completar'}
                >
                  {task.completed && (
                    <svg viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth={2.5}>
                      <polyline points="2,6 5,9 10,3" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                </button>

                {/* Title / edit input */}
                <div className="tasks-page__item-body">
                  {editingId === task.id ? (
                    <input
                      className="tasks-page__edit-input"
                      value={editValue}
                      onChange={e => setEditValue(e.target.value)}
                      onKeyDown={e => { if (e.key === 'Enter') saveEdit(); if (e.key === 'Escape') cancelEdit(); }}
                      autoFocus
                      maxLength={120}
                    />
                  ) : (
                    <span className="tasks-page__item-title">{task.title}</span>
                  )}
                  <div className="tasks-page__item-meta">
                    <span className="tasks-page__item-owner">@{task.owner.username} la creo</span>
                    {task.completedBy && (
                      <span className="tasks-page__item-completed-by">@{task.completedBy.username} la completo</span>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="tasks-page__item-actions">
                  {editingId === task.id ? (
                    <>
                      <button type="button" className="tasks-page__action-btn tasks-page__action-btn--save" onClick={saveEdit} disabled={!editValue.trim()}>Guardar</button>
                      <button type="button" className="tasks-page__action-btn tasks-page__action-btn--cancel" onClick={cancelEdit}>Cancelar</button>
                    </>
                  ) : canModify(task) ? (
                    <>
                      <button
                        type="button"
                        className="tasks-page__action-btn tasks-page__action-btn--edit"
                        onClick={() => startEdit(task)}
                        disabled={task.completed || busy.has(task.id)}
                        aria-label="Editar"
                      >
                        <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth={1.8}>
                          <path d="M11.5 2.5a2.121 2.121 0 0 1 3 3L5 15H2v-3L11.5 2.5z" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </button>
                      <button
                        type="button"
                        className="tasks-page__action-btn tasks-page__action-btn--delete"
                        onClick={() => removeTask(task.id)}
                        disabled={busy.has(task.id)}
                        aria-label="Eliminar"
                      >
                        <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth={1.8}>
                          <polyline points="2,4 14,4" strokeLinecap="round" />
                          <path d="M6 4V2h4v2" strokeLinecap="round" strokeLinejoin="round" />
                          <rect x="3" y="4" width="10" height="10" rx="1.5" />
                          <line x1="6" y1="7" x2="6" y2="11" strokeLinecap="round" />
                          <line x1="10" y1="7" x2="10" y2="11" strokeLinecap="round" />
                        </svg>
                      </button>
                    </>
                  ) : null}
                </div>
              </li>
            ))}
          </ul>
        )}
      </main>
    </div>
  );
}
