
import { instance } from '../../shared/api/axiosInstance'; 

/**
 * Obtiene los detalles de un producto por su ID.
 */
export async function getProductById(productId) {
  try {
    const response = await instance.get(`/api/products/${productId}`);
    return { data: response.data, error: null };
  } catch (error) {
    console.error('Error en getProductById:', error);
    if (error?.response?.status === 404) {
      return { data: null, error: 'Producto no encontrado.' };
    }
    return { data: null, error: 'Error al obtener el producto.' };
  }
}

/**
 * Actualiza completamente un producto (PUT).
 * @param {string} productId El ID del producto a actualizar.
 * @param {object} productData Los datos completos del producto.
 */
export async function updateProduct(productId, productData) {
  try {
    // PUT /api/products/{id}
    const response = await instance.put(`/api/products/${productId}`, productData);
    return { data: response.data, error: null };
  } catch (error) {
    console.error('Error en updateProduct:', error.response?.data || error.message);
    const errorMessage = error.response?.data?.message || 'Error al actualizar el producto.';
    return { data: null, error: errorMessage };
  }
}

/**
 * Habilita o deshabilita un producto (PATCH).
 * @param {string} productId El ID del producto.
 * @param {boolean} newStatus El nuevo estado de activación (true para habilitar, false para deshabilitar).
 */
export async function toggleProductStatus(productId, newStatus) {
  try {
    // PATCH /api/products/{id}/status (Asumimos este endpoint)
    // El payload debe coincidir con lo que espera el controlador de tu API.
    const payload = { isActive: newStatus }; 
    const response = await instance.patch(`/api/products/${productId}`, payload);
    return { data: response.data, error: null };
  } catch (error) {
    console.error('Error en toggleProductStatus:', error.response?.data || error.message);
    const errorMessage = error.response?.data?.message || 'Error al cambiar el estado del producto.';
    return { data: null, error: errorMessage };
  }
}