import { useState, useEffect } from "react";
import SimpleReactValidator from "simple-react-validator";

function TaskForm({ onAddTask, editingTask }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [validator] = useState(new SimpleReactValidator());

  useEffect(() => {
    if (editingTask) {
      setTitle(editingTask.title);
      setDescription(editingTask.description);
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
        {validator.message("title", title, "required|min:3|max:50", {
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
        {validator.message(
          "description",
          description,
          "required|min:5|max:200",
          { className: "text-danger" }
        )}
      </div>
      <button type="submit" className="btn btn-primary">
        {editingTask ? "Actualizar Tarea" : "Agregar Tarea"}
      </button>
    </form>
  );
}

export default TaskForm;
