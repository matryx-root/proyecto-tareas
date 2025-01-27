import { useState, useEffect } from "react";
import SimpleReactValidator from "simple-react-validator";

function TaskForm({ onAddTask, editingTask }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [validator] = useState(new SimpleReactValidator({
    messages: {
      required: "Este campo es obligatorio.",
      min: "Debe tener al menos :min caracteres.",
      max: "No puede exceder :max caracteres.",
      alpha_space: "El título solo puede contener letras y espacios.",
    },
  }));

  useEffect(() => {
    if (editingTask) {
      setTitle(editingTask.title);
      setDescription(editingTask.description);
    } else {
      setTitle("");
      setDescription("");
    }
  }, [editingTask]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validator.allValid()) {
      onAddTask({ title, description });
      setTitle("");
      setDescription("");
      validator.hideMessages();
    } else {
      validator.showMessages();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-4">
      <div className="form-group">
        <input
          type="text"
          className="form-control mb-2"
          placeholder="Título"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        {validator.message("title", title, "required|alpha_space|min:3|max:50", {
          className: "text-danger",
        })}
      </div>
      <div className="form-group">
        <textarea
          className="form-control mb-2"
          placeholder="Descripción"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        {validator.message("description", description, "required|min:5|max:200", {
          className: "text-danger",
        })}
      </div>
      <button type="submit" className="btn btn-primary">
        {editingTask ? "Actualizar Tarea" : "Agregar Tarea"}
      </button>
    </form>
  );
}

export default TaskForm;
