import { instance } from '../../shared/api/axiosInstance';

export const getProducts = async (search = '', status = "All", pageNumber = 1, pageSize = 10 ) => {
  const queryString = new URLSearchParams({
    search,
    status,
    pageNumber,
    pageSize,
  });

  const response = await instance.get(`api/products/admin?${queryString}`);

  return { data: response.data, error: null };
};

export const getClientProducts = async (search = '', pageNumber = 1, pageSize = 10) => {
  const queryString = new URLSearchParams({
    search,
    pageNumber,
    pageSize,
  });

  const response = await instance.get(`api/products?${queryString}`);

  return { data: response.data, error: null };
};