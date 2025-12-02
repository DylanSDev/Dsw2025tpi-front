import { instance } from '../../shared/api/axiosInstance';
 
export const registerUser = async (username, email, password) => {
  try 
  {
    const response = await instance.post('api/authenticate/register', 
    { 
      username, 
      email, 
      password,
    }                                   );
    return { data: response.data, error: null }; 
  } catch (error) {
    console.error('Error durante el registro:', error);

    return { data: null, error: error.response?.data || { detail: 'Error desconocido.' } };
  }
};