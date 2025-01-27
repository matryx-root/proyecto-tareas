import { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes, useNavigate } from "react-router-dom";
import { collection, addDoc, getDocs, doc, updateDoc, deleteDoc } from "firebase/firestore";
import { db, auth } from "./firebaseConfig";
import { onAuthStateChanged, signOut } from "firebase/auth";

import "bootstrap/dist/css/bootstrap.min.css";
import TaskForm from "./components/TaskForm";
import TaskList from "./components/TaskList";
import AuthForm from "./components/AuthForm";
import axios from "axios";

function App() {
  const [tasks, setTasks] = useState([]);
  const [editingTask, setEditingTask] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsAuthenticated(!!user); // Cambia el estado según la autenticación
    });
    return () => unsubscribe();
  }, []);

  // Función para cerrar sesión
  const handleLogout = async () => {
    try {
      await signOut(auth);
      console.log("Sesión cerrada");
      navigate("/"); // Redirige al inicio de sesión
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchTasks();
      fetchExternalData(); // Llama a una API externa usando Axios
    }
  }, [isAuthenticated]);

  const fetchTasks = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "tasks"));
      const fetchedTasks = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setTasks(fetchedTasks);
    } catch (error) {
      console.error("Error al obtener tareas:", error);
    }
  };

  const fetchExternalData = async () => {
    try {
      const response = await axios.get("https://jsonplaceholder.typicode.com/todos");
      console.log("Datos externos:", response.data.slice(0, 5)); // Muestra los primeros 5 resultados
    } catch (error) {
      console.error("Error al obtener datos externos:", error);
    }
  };

  const addTask = async (task) => {
    if (!isAuthenticated) {
      console.error("Acción no permitida: no estás autenticado");
      return;
    }
    try {
      if (editingTask) {
        const docRef = doc(db, "tasks", editingTask.id);
        await updateDoc(docRef, task);
        setTasks((prevTasks) =>
          prevTasks.map((t) => (t.id === editingTask.id ? { ...t, ...task } : t))
        );
        setEditingTask(null);
      } else {
        const newTask = { ...task, completed: false };
        const docRef = await addDoc(collection(db, "tasks"), newTask);
        setTasks((prevTasks) => [...prevTasks, { id: docRef.id, ...newTask }]);
      }
    } catch (error) {
      console.error("Error al agregar o editar tarea:", error);
    }
  };

  const deleteTask = async (taskId) => {
    try {
      await deleteDoc(doc(db, "tasks", taskId));
      setTasks((prevTasks) => prevTasks.filter((task) => task.id !== taskId));
    } catch (error) {
      console.error("Error al eliminar tarea:", error);
    }
  };

  const startEditTask = (task) => {
    setEditingTask(task);
  };

  return (
    <div className="App container mt-4">
      <Routes>
        <Route path="/" element={<AuthForm />} />
        <Route
          path="/tasks"
          element={
            <>
              <div className="d-flex justify-content-between align-items-center mb-4">
                <h1 className="text-center">Gestión de Tareas</h1>
                <button className="btn btn-danger" onClick={handleLogout}>
                  Cerrar Sesión
                </button>
              </div>
              <TaskForm onAddTask={addTask} editingTask={editingTask} />
              <TaskList tasks={tasks} onDeleteTask={deleteTask} onEditTask={startEditTask} />
            </>
          }
        />
      </Routes>
    </div>
  );
}

export default App;
