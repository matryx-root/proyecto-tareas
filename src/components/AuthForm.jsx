import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // Importa useNavigate para redirecciones
import { auth } from "../firebaseConfig";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";

function AuthForm() {
  const [email, setEmail] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const [password, setPassword] = useState("");
  const [isRegister, setIsRegister] = useState(true);
  const navigate = useNavigate(); // Inicializa navigate para redirecciones

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isRegister) {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        console.log("Usuario registrado:", userCredential);
      } else {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        console.log("Usuario autenticado:", userCredential);
      }
      navigate("/tasks");
    } catch (error) {
      console.error("Error en la autenticación:", error.message);
      setErrorMessage(error.message);
    }
  };
  
  

  return (
    <div className="container mt-4">
      <h2 className="text-center">{isRegister ? "Registrarse" : "Iniciar Sesión"}</h2>
      <form onSubmit={handleSubmit} className="mt-4">
        <div className="form-group mb-3">
          <input
            type="email"
            className="form-control"
            placeholder="Correo electrónico"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="form-group mb-3">
          <input
            type="password"
            className="form-control"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="btn btn-primary btn-block">
          {isRegister ? "Registrarse" : "Iniciar Sesión"}
        </button>
      </form>
      <div className="text-center mt-3">
        <button
          className="btn btn-link"
          onClick={() => setIsRegister(!isRegister)}
        >
          {isRegister ? "¿Ya tienes cuenta? Inicia sesión" : "¿No tienes cuenta? Regístrate"}
        </button>
      </div>
    </div>
  );
}

export default AuthForm;
