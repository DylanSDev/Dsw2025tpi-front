import { instance } from '../../shared/api/axiosInstance';

export const login = async (email, password) => {
  const response = await instance.post('api/authenticate/login', { email, password });

  return { data: response.data, error: null };
};