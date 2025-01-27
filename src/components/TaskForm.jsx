import { useState, useEffect } from "react";
import SimpleReactValidator from "simple-react-validator";
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";

function TaskForm({ onAddTask, editingTask }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [validator] = useState(
    new SimpleReactValidator({
      messages: {
        required: "Este campo es obligatorio.",
        min: "Debe tener al menos :min caracteres.",
        max: "No puede exceder :max caracteres.",
        alpha_space: "El título solo puede contener letras y espacios.",
      },
    })
  );

  useEffect(() => {
    if (editingTask) {
      setTitle(editingTask.title);
      setDescription(editingTask.description);
    } else {
      setTitle("");
      setDescription("");
    }
  }, [editingTask]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      alert("Por favor, selecciona un archivo.");
      return;
    }

    // Verificar si el archivo tiene un tipo permitido
    const allowedTypes = ["application/pdf", "image/jpeg", "image/png"];
    if (!allowedTypes.includes(file.type)) {
      alert("Tipo de archivo no permitido. Solo se aceptan PDF, JPG y PNG.");
      return;
    }

    if (validator.allValid()) {
      setIsUploading(true); // Indica que la subida está en curso
      const storage = getStorage();
      const storageRef = ref(storage, `uploads/${file.name}`);
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setUploadProgress(progress.toFixed(0));
        },
        (error) => {
          console.error("Error al subir archivo:", error);
          alert("Error al subir archivo. Intenta nuevamente.");
          setIsUploading(false);
        },
        async () => {
          try {
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
            onAddTask({
              title,
              description,
              fileURL: downloadURL, // URL del archivo subido
            });
            // Resetear los campos
            setTitle("");
            setDescription("");
            setFile(null);
            setUploadProgress(0);
          } catch (error) {
            console.error("Error al obtener la URL del archivo:", error);
            alert("No se pudo obtener la URL del archivo.");
          } finally {
            setIsUploading(false);
          }
        }
      );
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
      <div className="form-group">
        <input
          type="file"
          className="form-control mb-2"
          onChange={(e) => setFile(e.target.files[0])}
        />
        {file && <p className="text-muted">Archivo seleccionado: {file.name}</p>}
      </div>
      {uploadProgress > 0 && (
        <div className="progress mb-2">
          <div
            className="progress-bar"
            role="progressbar"
            style={{ width: `${uploadProgress}%` }}
            aria-valuenow={uploadProgress}
            aria-valuemin="0"
            aria-valuemax="100"
          >
            {uploadProgress}%
          </div>
        </div>
      )}
      <button
        type="submit"
        className="btn btn-primary"
        disabled={isUploading} // Deshabilitar el botón durante la subida
      >
        {editingTask ? "Actualizar Tarea" : "Agregar Tarea"}
      </button>
    </form>
  );
}

export default TaskForm;
