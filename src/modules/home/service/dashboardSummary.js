import { instance } from '../../shared/api/axiosInstance';

export const getDashboardSummary = async () => {
  try
  {
    const response = await instance.get('/api/dashboard/summary');

    return { data: response.data, error: null };
  } catch (error)
  {
    //aqui debe ir un mensaje de error
    return { data: null, error };
  }
};