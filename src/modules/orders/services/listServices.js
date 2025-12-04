import { instance } from '../../shared/api/axiosInstance';

export const listOrders = async (status = null, pageNumber = 1, pageSize = 10) =>
{
  try {
    const filter =
    {
      pageNumber,
      pageSize,
    };

    if (status && status !== 'ALL')
    {
      filter.status = status;
    }

    const response = await instance.get('/api/orders', { filter });

    return { data: response.data, error: null };
  }
  catch (error)
  {
    return { data: null, error: error.response?.data || error.message };
  }
};