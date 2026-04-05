import React, { useState } from 'react';
import './Demo3Page.scss';

// ── Data ─────────────────────────────────────────────────────────────────────

const tags = ['Spring Boot', 'OpenAPI', 'Swagger UI', 'JUnit', 'MockMvc', 'Integration Testing'];

interface EndpointDoc {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  path: string;
  summary: string;
  description: string;
  auth: string;
  example: string;
  requestBody?: { lang: string; code: string };
  response: { status: number; description: string; code: string };
  errors: { status: number; code: string; description: string }[];
  serviceMethod: string;
  serviceNote: string;
}

const endpoints: EndpointDoc[] = [
  {
    method: 'GET',
    path: '/tasks',
    summary: 'Listar todas las tareas',
    description:
      'Devuelve todas las tareas ordenadas por fecha de creación descendente. Los flags canModify y canToggleComplete se calculan dinámicamente en función del usuario autenticado, por lo que la misma lista se adapta al rol del llamante.',
    auth: 'Bearer JWT requerido',
    example: `curl -X GET https://api.oscarpelegrina.com/tasks \\
  -H "Authorization: Bearer <token>"`,
    requestBody: undefined,
    response: {
      status: 200,
      description: 'Array de tareas (puede estar vacío)',
      code: `[
  {
    "id": 12,
    "title": "Preparar demo de Swagger para CRUD",
    "completed": false,
    "createdAt": "2026-04-04T15:30:00Z",
    "updatedAt": "2026-04-04T15:30:00Z",
    "canModify": true,
    "canToggleComplete": true,
    "owner": { "id": 7, "username": "oscar" },
    "completedBy": null
  }
]`,
    },
    errors: [{ status: 401, code: 'Unauthorized', description: 'JWT ausente o inválido' }],
    serviceMethod: 'TaskService.getAll()',
    serviceNote:
      'Llama a taskRepo.findAllByOrderByCreatedAtDesc(). Para cada tarea calcula canModify y canToggleComplete comparando el uid del JWT con el owner y, si aplica, con el completedBy.',
  },
  {
    method: 'POST',
    path: '/tasks',
    summary: 'Crear una tarea',
    description:
      'Crea una nueva tarea asociada al usuario autenticado. El título se normaliza con trim antes de guardarse; si queda vacío tras el trim, se lanza VALIDATION_ERROR antes de tocar la base de datos.',
    auth: 'Bearer JWT requerido',
    example: `curl -X POST https://api.oscarpelegrina.com/tasks \\
  -H "Authorization: Bearer <token>" \\
  -H "Content-Type: application/json" \\
  -d '{"title": "Preparar demo de Swagger para CRUD"}'`,
    requestBody: {
      lang: 'json',
      code: `{
  "title": "Preparar demo de Swagger para CRUD"
}`,
    },
    response: {
      status: 201,
      description: 'Tarea creada',
      code: `{
  "id": 12,
  "title": "Preparar demo de Swagger para CRUD",
  "completed": false,
  "createdAt": "2026-04-04T15:30:00Z",
  "updatedAt": "2026-04-04T15:30:00Z",
  "canModify": true,
  "canToggleComplete": true,
  "owner": { "id": 7, "username": "oscar" },
  "completedBy": null
}`,
    },
    errors: [
      { status: 400, code: 'VALIDATION_ERROR', description: 'Título vacío o solo espacios' },
      { status: 401, code: 'Unauthorized', description: 'JWT ausente o inválido' },
      { status: 404, code: 'USER_NOT_FOUND', description: 'El uid del JWT no existe en la BD' },
    ],
    serviceMethod: 'TaskService.create(userId, title)',
    serviceNote:
      'Primero normaliza el título (trim + validación), lo que evita cargar el usuario si el input ya es inválido. Solo entonces busca el usuario con userService.requireById y persiste la tarea.',
  },
  {
    method: 'PUT',
    path: '/tasks/{id}',
    summary: 'Actualizar una tarea',
    description:
      'Actualiza título y/o estado de completado. Ambos campos son opcionales; se puede enviar solo title, solo completed, o ambos. Las reglas de autorización difieren: renombrar requiere ser owner o admin, pero completar puede hacerlo cualquier usuario autenticado.',
    auth: 'Bearer JWT requerido',
    example: `# Solo renombrar
curl -X PUT https://api.oscarpelegrina.com/tasks/12 \\
  -H "Authorization: Bearer <token>" \\
  -H "Content-Type: application/json" \\
  -d '{"title": "Preparar demo final de Swagger"}'

# Solo completar
curl -X PUT https://api.oscarpelegrina.com/tasks/12 \\
  -H "Authorization: Bearer <token>" \\
  -H "Content-Type: application/json" \\
  -d '{"completed": true}'`,
    requestBody: {
      lang: 'json',
      code: `// Solo renombrar
{ "title": "Preparar demo final de Swagger" }

// Solo completar
{ "completed": true }

// Renombrar y completar
{ "title": "Preparar demo final", "completed": true }`,
    },
    response: {
      status: 200,
      description: 'Tarea actualizada',
      code: `{
  "id": 12,
  "title": "Preparar demo final de Swagger",
  "completed": true,
  "createdAt": "2026-04-04T15:30:00Z",
  "updatedAt": "2026-04-04T16:00:00Z",
  "canModify": true,
  "canToggleComplete": true,
  "owner": { "id": 7, "username": "oscar" },
  "completedBy": { "id": 7, "username": "oscar" }
}`,
    },
    errors: [
      { status: 400, code: 'VALIDATION_ERROR', description: 'Nuevo título vacío o solo espacios' },
      { status: 401, code: 'Unauthorized', description: 'JWT ausente o inválido' },
      { status: 403, code: 'FORBIDDEN', description: 'Sin permiso para la operación solicitada' },
      { status: 404, code: 'TASK_NOT_FOUND', description: 'No existe ninguna tarea con ese id' },
    ],
    serviceMethod: 'TaskService.update(userId, username, taskId, title, completed)',
    serviceNote:
      'Para el título: comprueba canModify (owner o admin) antes de normalizar. Para el estado: comprueba canToggleComplete, que es más permisivo al completar que al descompletar. applyCompletion guarda quién completó la tarea en el campo completedBy.',
  },
  {
    method: 'DELETE',
    path: '/tasks/{id}',
    summary: 'Eliminar una tarea',
    description:
      'Elimina permanentemente una tarea. Solo el propietario o el admin pueden borrarla. Devuelve 204 sin cuerpo si la operación fue exitosa.',
    auth: 'Bearer JWT requerido',
    example: `curl -X DELETE https://api.oscarpelegrina.com/tasks/12 \\
  -H "Authorization: Bearer <token>"`,
    requestBody: undefined,
    response: {
      status: 204,
      description: 'Sin cuerpo',
      code: '// 204 No Content',
    },
    errors: [
      { status: 401, code: 'Unauthorized', description: 'JWT ausente o inválido' },
      { status: 403, code: 'FORBIDDEN', description: 'El usuario no es owner ni admin' },
      { status: 404, code: 'TASK_NOT_FOUND', description: 'No existe ninguna tarea con ese id' },
    ],
    serviceMethod: 'TaskService.delete(userId, username, taskId)',
    serviceNote:
      'Carga la tarea o lanza TASK_NOT_FOUND. Evalúa canModify: si devuelve false lanza FORBIDDEN. Solo entonces llama a taskRepo.delete(task).',
  },
];

interface TestCase {
  name: string;
  type: 'unit' | 'integration';
  endpoint: string;
  scenario: string;
  code: string;
}

const testCases: TestCase[] = [
  {
    name: 'createAssignsOwnerTrimsTitleAndPersistsTask',
    type: 'unit',
    endpoint: 'POST /tasks',
    scenario: 'Título con espacios → se guarda trimado y se asigna el owner',
    code: `@Test
void createAssignsOwnerTrimsTitleAndPersistsTask() {
    User owner = userWithId(7L, "oscar", "oscar@test.com");
    when(userService.requireById(7L)).thenReturn(owner);
    when(taskRepository.save(any(Task.class)))
        .thenAnswer(inv -> inv.getArgument(0));

    Task created = taskService.create(7L,
        "  Preparar demo de Swagger para CRUD  ");

    ArgumentCaptor<Task> captor =
        ArgumentCaptor.forClass(Task.class);
    verify(taskRepository).save(captor.capture());

    assertAll(
        () -> assertSame(owner, created.getUser()),
        () -> assertEquals(
            "Preparar demo de Swagger para CRUD",
            created.getTitle()),
        () -> assertFalse(created.isCompleted())
    );
}`,
  },
  {
    name: 'createRejectsBlankTitleBeforeLoadingUser',
    type: 'unit',
    endpoint: 'POST /tasks',
    scenario: 'Título en blanco → VALIDATION_ERROR sin tocar BD ni usuario',
    code: `@Test
void createRejectsBlankTitleBeforeLoadingUser() {
    RuntimeException ex = assertThrows(
        RuntimeException.class,
        () -> taskService.create(7L, "   "));

    assertEquals("VALIDATION_ERROR", ex.getMessage());
    verify(userService, never()).requireById(any());
    verify(taskRepository, never()).save(any(Task.class));
}`,
  },
  {
    name: 'updateAllowsAdminToRenameAnyTask',
    type: 'unit',
    endpoint: 'PUT /tasks/{id}',
    scenario: 'Admin puede renombrar tarea de otro usuario',
    code: `@Test
void updateAllowsAdminToRenameAnyTask() {
    // "oscar" matchea ADMIN_USERNAME → isAdmin true sin tocar BD
    User owner = userWithId(3L, "alice", "alice@test.com");
    Task task = taskOwnedBy(owner);
    when(taskRepository.findById(42L))
        .thenReturn(Optional.of(task));
    when(taskRepository.save(any(Task.class)))
        .thenAnswer(inv -> inv.getArgument(0));

    Task updated = taskService.update(
        1L, "oscar", 42L, "Titulo cambiado por admin", null);

    assertEquals("Titulo cambiado por admin", updated.getTitle());
}`,
  },
  {
    name: 'updateCompletesTaskAndRecordsCompletedByUser',
    type: 'unit',
    endpoint: 'PUT /tasks/{id}',
    scenario: 'Cualquier usuario puede completar tarea ajena; se guarda completedBy',
    code: `@Test
void updateCompletesTaskAndRecordsCompletedByUser() {
    User owner = userWithId(3L, "alice", "alice@test.com");
    User completer = userWithId(9L, "bob", "bob@test.com");
    Task task = taskOwnedBy(owner);
    when(taskRepository.findById(42L))
        .thenReturn(Optional.of(task));
    when(userService.requireById(9L)).thenReturn(completer);
    when(taskRepository.save(any(Task.class)))
        .thenAnswer(inv -> inv.getArgument(0));

    Task updated = taskService.update(
        9L, "bob", 42L, null, true);

    assertTrue(updated.isCompleted());
    assertSame(completer, updated.getCompletedBy());
}`,
  },
  {
    name: 'createTaskRejectsBlankTitle',
    type: 'integration',
    endpoint: 'POST /tasks',
    scenario: 'Request con título en blanco → 400 con código VALIDATION_ERROR',
    code: `@Test
void createTaskRejectsBlankTitle() throws Exception {
    User owner = saveEnabledUser("creator", "creator@test.com");

    mockMvc.perform(post("/tasks")
            .with(jwtFor(owner))
            .contentType(MediaType.APPLICATION_JSON)
            .content("{\\"title\\":\\"   \\"}"))
        .andExpect(status().isBadRequest())
        .andExpect(jsonPath("$.code").value("VALIDATION_ERROR"));
}`,
  },
  {
    name: 'updateForbidsRenamingOtherUsersTask',
    type: 'integration',
    endpoint: 'PUT /tasks/{id}',
    scenario: 'Usuario intenta renombrar tarea ajena → 403 FORBIDDEN',
    code: `@Test
void updateForbidsRenamingOtherUsersTask() throws Exception {
    mockMvc.perform(put("/tasks/" + task.getId())
            .with(jwtFor(stranger))
            .contentType(MediaType.APPLICATION_JSON)
            .content("{\\"title\\": \\"Titulo robado\\"}"))
        .andExpect(status().isForbidden())
        .andExpect(jsonPath("$.code").value("FORBIDDEN"));
}`,
  },
  {
    name: 'updateCompletesTaskByAnyAuthenticatedUser',
    type: 'integration',
    endpoint: 'PUT /tasks/{id}',
    scenario: 'Usuario no-owner completa tarea → 200 con completedBy correcto',
    code: `@Test
void updateCompletesTaskByAnyAuthenticatedUser() throws Exception {
    mockMvc.perform(put("/tasks/" + task.getId())
            .with(jwtFor(stranger))
            .contentType(MediaType.APPLICATION_JSON)
            .content("{\\"completed\\": true}"))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.completed").value(true))
        .andExpect(jsonPath("$.completedBy.username")
            .value(stranger.getUsername()));
}`,
  },
  {
    name: 'deleteReturnsNoContentAndRemovesTask',
    type: 'integration',
    endpoint: 'DELETE /tasks/{id}',
    scenario: 'Owner elimina su tarea → 204 y la tarea desaparece de la BD',
    code: `@Test
void deleteReturnsNoContentAndRemovesTask() throws Exception {
    mockMvc.perform(delete("/tasks/" + task.getId())
            .with(jwtFor(owner)))
        .andExpect(status().isNoContent());

    assertFalse(taskRepository.existsById(task.getId()));
}`,
  },
];

// ── Components ────────────────────────────────────────────────────────────────

type MethodBadge = 'GET' | 'POST' | 'PUT' | 'DELETE';

function MethodBadge({ method }: { method: MethodBadge }) {
  return (
    <span className={`oa-method-badge oa-method-badge--${method.toLowerCase()}`}>{method}</span>
  );
}

function StatusBadge({ status }: { status: number }) {
  const cls =
    status < 300 ? 'success' : status < 400 ? 'redirect' : status < 500 ? 'client' : 'server';
  return <span className={`oa-status-badge oa-status-badge--${cls}`}>{status}</span>;
}

function TypeBadge({ type }: { type: 'unit' | 'integration' }) {
  return <span className={`oa-type-badge oa-type-badge--${type}`}>{type === 'unit' ? 'Unit' : 'Integration'}</span>;
}

function EndpointCard({ ep }: { ep: EndpointDoc }) {
  const [open, setOpen] = useState(false);

  return (
    <div className={`oa-card${open ? ' oa-card--open' : ''}`}>
      <button
        type="button"
        className="oa-card__header"
        onClick={() => setOpen(o => !o)}
        aria-expanded={open}
      >
        <div className="oa-card__header-left">
          <MethodBadge method={ep.method} />
          <code className="oa-card__path">{ep.path}</code>
          <span className="oa-card__summary">{ep.summary}</span>
        </div>
        <span className={`oa-card__chevron${open ? ' oa-card__chevron--up' : ''}`} aria-hidden>▾</span>
      </button>

      {open && (
        <div className="oa-card__body">
          <p className="oa-card__description">{ep.description}</p>

          <div className="oa-card__section">
            <h4 className="oa-card__section-title">Ejemplo de llamada</h4>
            <pre className="oa-pre"><code>{ep.example}</code></pre>
          </div>

          <div className="oa-card__meta-row">
            <span className="oa-card__meta-label">Autenticación</span>
            <span className="oa-card__auth-pill">{ep.auth}</span>
          </div>

          {ep.requestBody && (
            <div className="oa-card__section">
              <h4 className="oa-card__section-title">Request body</h4>
              <pre className="oa-pre"><code>{ep.requestBody.code}</code></pre>
            </div>
          )}

          <div className="oa-card__section">
            <h4 className="oa-card__section-title">
              Response <StatusBadge status={ep.response.status} />
              <span className="oa-card__response-desc">{ep.response.description}</span>
            </h4>
            <pre className="oa-pre"><code>{ep.response.code}</code></pre>
          </div>

          <div className="oa-card__section">
            <h4 className="oa-card__section-title">Errores</h4>
            <table className="oa-errors-table">
              <thead>
                <tr>
                  <th>Status</th>
                  <th>Código</th>
                  <th>Descripción</th>
                </tr>
              </thead>
              <tbody>
                {ep.errors.map(err => (
                  <tr key={`${err.status}-${err.code}`}>
                    <td><StatusBadge status={err.status} /></td>
                    <td><code>{err.code}</code></td>
                    <td>{err.description}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="oa-card__service-box">
            <span className="oa-card__service-label">Validado en</span>
            <code className="oa-card__service-method">{ep.serviceMethod}</code>
            <p className="oa-card__service-note">{ep.serviceNote}</p>
          </div>
        </div>
      )}
    </div>
  );
}

function TestCard({ tc }: { tc: TestCase }) {
  const [open, setOpen] = useState(false);

  return (
    <div className={`oa-card${open ? ' oa-card--open' : ''}`}>
      <button
        type="button"
        className="oa-card__header"
        onClick={() => setOpen(o => !o)}
        aria-expanded={open}
      >
        <div className="oa-card__header-left">
          <TypeBadge type={tc.type} />
          <code className="oa-card__path">{tc.endpoint}</code>
          <span className="oa-card__summary">{tc.scenario}</span>
        </div>
        <span className={`oa-card__chevron${open ? ' oa-card__chevron--up' : ''}`} aria-hidden>▾</span>
      </button>

      {open && (
        <div className="oa-card__body">
          <pre className="oa-pre"><code>{tc.code}</code></pre>
        </div>
      )}
    </div>
  );
}

// ── Page ─────────────────────────────────────────────────────────────────────

export const Demo3Page: React.FC = () => {
  return (
    <div className="oa-page">
      <header className="oa-page__banner">
        <div className="oa-page__banner-content">
          <span className="oa-page__category">Backend</span>
          <h1 className="oa-page__title">OpenAPI &amp; Testing</h1>
          <p className="oa-page__description">
            CRUD de tareas completamente documentado con OpenAPI/Swagger y cubierto con tests de
            unidad e integración que validan lógica de negocio, autorización y contratos de
            endpoint.
          </p>
        </div>
      </header>

      <main className="oa-page__main">
        <section>
          <h2 className="oa-page__section-title">Tecnologías</h2>
          <ul className="oa-page__tags">
            {tags.map(tag => (
              <li key={tag} className="oa-page__tag">{tag}</li>
            ))}
          </ul>
        </section>

        <section>
          <h2 className="oa-page__section-title">Documentación de endpoints</h2>
          <p className="oa-page__section-lead">
            Cada endpoint expone su contrato real: método, ruta, autenticación JWT, ejemplos de
            request y response, errores posibles y el método de servicio que valida el
            comportamiento. Haz clic en cualquier endpoint para expandirlo.
          </p>
          <div className="oa-cards">
            {endpoints.map(ep => (
              <EndpointCard key={`${ep.method}-${ep.path}`} ep={ep} />
            ))}
          </div>
        </section>

        <section>
          <h2 className="oa-page__section-title">Tests clave</h2>
          <p className="oa-page__section-lead">
            Los tests cubren la lógica de negocio desde el servicio (unitarios, sin BD) y el
            contrato HTTP completo (integración con MockMvc y H2). Haz clic en cualquier test
            para ver el código.
          </p>

          <div className="oa-tests-legend">
            <TypeBadge type="unit" /> Tests de servicio — sin BD, Mockito
            <TypeBadge type="integration" /> Tests de endpoint — MockMvc + H2
          </div>

          <div className="oa-cards">
            {testCases.map(tc => (
              <TestCard key={tc.name} tc={tc} />
            ))}
          </div>
        </section>
      </main>
    </div>
  );
};
