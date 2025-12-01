import { instance } from '../../shared/api/axiosInstance';

//Lista productos para la vista de administración (usa el endpoint /api/products/admin).
export const getProducts = async (search = null, status = null, pageNumber = 1, pageSize = 20 ) => {
  const queryString = new URLSearchParams({
    search,
    status,
    pageNumber,
    pageSize,
  });

  const response = await instance.get(`api/products/admin?${queryString}`);

  return { data: response.data, error: null };
};

/**
 * Obtiene productos para la vista pública (usa el endpoint /api/products).
 * Siempre filtra por status 'enabled' (habilitados) para el cliente [REQUISITO].
 */
export const getClientProducts = async (search = null, pageNumber = 1, pageSize = 20) => {
  const queryString = new URLSearchParams({
    search,
    status: 'enabled', // Solo habilitados para el cliente
    pageNumber,
    pageSize,
  });

  // Endpoint público: /api/products
  const response = await instance.get(`api/products?${queryString}`); 

  return { data: response.data, error: null };
};