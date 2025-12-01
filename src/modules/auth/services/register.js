import { instance } from '../../shared/api/axiosInstance';

/**
 * Registra un nuevo usuario en el sistema.
 * @param {string} username - Nombre de usuario.
 * @param {string} email - Correo electrónico.
 * @param {string} password - Contraseña.
 */
export const registerUser = async (username, email, password) => {
  try {
    const response = await instance.post('api/auth/register', { 
      username, 
      email, 
      password,
      // Nota: Si el backend requiere un role explícito, agrégalo aquí.
      // Asumimos que el backend asigna automáticamente el rol 'User'.
    });

    // Asumimos que una respuesta exitosa (201 Created) no necesita retornar datos sensibles.
    return { data: response.data, error: null }; 
  } catch (error) {
    console.error('Error durante el registro:', error);

    // Retornamos el error para que el componente maneje los mensajes específicos del backend.
    return { data: null, error: error.response?.data || { detail: 'Error desconocido.' } };
  }
};