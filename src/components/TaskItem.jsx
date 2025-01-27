import { doc, deleteDoc } from "firebase/firestore";
import { db } from "../firebaseConfig";

function TaskItem({ task, onDelete }) {
  const handleDelete = async () => {
    if (window.confirm("¿Estás seguro de que deseas eliminar esta tarea?")) {
      await deleteDoc(doc(db, "tasks", task.id));
      onDelete(task.id);
    }
  };
  

  return (
    <li>
      <h3>{task.title}</h3>
      <p>{task.description}</p>
      <button onClick={handleDelete}>Eliminar</button>
    </li>
  );
}

export default TaskItem;
