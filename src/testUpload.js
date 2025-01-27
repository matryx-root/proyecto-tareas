import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";

const testUpload = async () => {
  try {
    const storage = getStorage();
    const storageRef = ref(storage, "test-upload.txt");
    const file = new Blob(["Test content"], { type: "text/plain" });

    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log(`Progreso de subida: ${progress}%`);
      },
      (error) => {
        console.error("Error al subir archivo:", error);
      },
      async () => {
        const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
        console.log("Archivo subido correctamente, URL:", downloadURL);
      }
    );
  } catch (error) {
    console.error("Error durante la prueba de subida:", error);
  }
};

testUpload();
