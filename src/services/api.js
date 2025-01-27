import axios from "axios";

const api = axios.create({
  baseURL: "https://jsonplaceholder.typicode.com", // URL de ejemplo
});

export const fetchExampleData = async () => {
  try {
    const response = await api.get("/todos");
    return response.data;
  } catch (error) {
    console.error("Error al obtener los datos:", error);
    throw error;
  }
};
