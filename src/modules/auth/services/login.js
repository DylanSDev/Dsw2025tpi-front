import { instance } from "../../shared/api/axiosInstance";

export const login = async (email, password) => {
  try {
    const response = await instance.post("api/authenticate/login", {
      email,
      password,
    });
    return { data: response.data, error: null };
  } catch (error) {
    // Retornamos la data del error (donde viene el 'code' del backend) o el error genérico
    return { data: null, error: error.response?.data || error };
  }
};
