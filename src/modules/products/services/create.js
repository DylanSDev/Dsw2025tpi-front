import { instance } from '../../shared/api/axiosInstance';

export const createProduct = async (formData) => {
  try {
    const response = await instance.post('/api/products', {
      // Usamos los campos correctos (InternalCode agregado)
      sku: formData.sku,
      internalCode: formData.internalCode, // Asegúrate de que este campo existe en el formData
      name: formData.name,
      description: formData.description,
      currentUnitPrice: formData.currentUnitPrice,
      stockQuantity: formData.stockQuantity,
    });
    
    // Si la creación es exitosa (201 Created), devolvemos los datos.
    return { data: response.data, error: null };
  } catch (error) {
    console.error('Error al crear producto:', error.response?.data || error.message);
    
    // Si es un 400 Bad Request con un objeto de errores
    if (error.response?.data?.errors) {
        // Se podría procesar el objeto de errores de validación (ej. {"Name": ["The Name field is required."]})
        return { data: null, error: 'Error de validación en el servidor.' };
    }
    
    // Error genérico del backend (500 o error de negocio 400)
    const errorMessage = error.response?.data?.message || error.response?.data?.detail || 'Error desconocido al crear el producto.';
    
    return { data: null, error: errorMessage };
  }
};
