function TaskList({ tasks, onDeleteTask, onEditTask }) {
  if (!tasks || tasks.length === 0) {
    return <p className="text-center text-muted">No hay tareas registradas.</p>;
  }

  return (
    <ul className="list-group">
      {tasks.map((task) => (
        <li
          key={task.id}
          className="list-group-item d-flex justify-content-between align-items-center"
        >
          <div>
            <h5 className="mb-1">{task.title}</h5>
            <p className="mb-1 text-muted">{task.description}</p>
          </div>
          <div>
            {/* Comunicación hacia el padre para iniciar la edición */}
            <button
              className="btn btn-warning btn-sm me-2"
              onClick={() => onEditTask(task)}
            >
              Editar
            </button>
            {/* Comunicación hacia el padre para eliminar una tarea */}
            <button
              className="btn btn-danger btn-sm"
              onClick={() => onDeleteTask(task.id)}
            >
              Eliminar
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
}

export default TaskList;
