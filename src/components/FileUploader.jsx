import React, { useState } from "react";
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";

function FileUploader({ onFileUpload }) {
  const [file, setFile] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadMessage, setUploadMessage] = useState("");

  // Manejar la selección del archivo
  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setUploadMessage(""); // Resetea el mensaje de estado
    setUploadProgress(0); // Resetea el progreso
  };

  // Manejar la subida del archivo
  const handleUpload = () => {
    if (!file) {
      setUploadMessage("Por favor, selecciona un archivo.");
      return;
    }

    const storage = getStorage(); // Asegúrate de usar el bucket configurado
    const storageRef = ref(storage, `uploads/${file.name}`); // Crea una referencia al archivo

    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        // Calcula el progreso
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setUploadProgress(progress.toFixed(0));
      },
      (error) => {
        // Manejar errores de la subida
        console.error("Error al subir archivo:", error);

        if (error.code === "storage/unauthorized") {
          setUploadMessage("No tienes permiso para subir archivos.");
        } else if (error.code === "storage/canceled") {
          setUploadMessage("La subida fue cancelada.");
        } else if (error.code === "storage/unknown") {
          setUploadMessage("Ocurrió un error desconocido.");
        } else {
          setUploadMessage("Error al subir el archivo. Intenta nuevamente.");
        }
      },
      async () => {
        // Obtener la URL del archivo subido
        try {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          setUploadMessage("Archivo subido correctamente.");
          onFileUpload(downloadURL); // Enviar la URL al componente padre
        } catch (error) {
          console.error("Error al obtener la URL del archivo:", error);
          setUploadMessage("Error al procesar el archivo.");
        }
      }
    );
  };

  return (
    <div className="file-uploader mt-3">
      <input
        type="file"
        className="form-control"
        onChange={handleFileChange}
        accept="application/pdf,image/*" // Restricción para archivos permitidos
      />
      <button
        onClick={handleUpload}
        className="btn btn-primary mt-2"
        disabled={!file} // Deshabilitar el botón si no hay archivo seleccionado
      >
        Subir Archivo
      </button>
      {uploadProgress > 0 && (
        <div className="progress mt-2">
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
      {uploadMessage && <p className="text-info mt-2">{uploadMessage}</p>}
    </div>
  );
}

export default FileUploader;
