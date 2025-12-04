import { useEffect, useState } from 'react';
import Button from '../../shared/components/Button';
import Input from '../../shared/components/Input';
import { createProduct } from '../services/create';
import { updateProduct } from '../services/detail';

// Aceptamos la nueva prop isFormDisabled
function ProductForm({ initialData = null, productId = null, onSubmissionSuccess, isFormDisabled = false }) {
    
    const isEdit = !!productId;

    const [formData, setFormData] = useState({
        sku: '',
        internalCode: '',
        name: '',
        description: '',
        currentUnitPrice: 0,
        stockQuantity: 0,
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);

    // Cargar datos iniciales
    useEffect(() => {
        if (initialData) {
            setFormData({
                sku: initialData.sku || '',
                internalCode: initialData.internalCode || '',
                name: initialData.name || '',
                description: initialData.description || '',
                currentUnitPrice: initialData.currentUnitPrice || 0,
                stockQuantity: initialData.stockQuantity || 0,
            });
        }
    }, [initialData]);

    const handleChange = (evt) => {
        const { name, value, type } = evt.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'number' ? Number(value) : value,
        }));
        setError(null);
        setSuccessMessage(null);
    };

    const handleSubmit = async (evt) => {
        evt.preventDefault();
        // Prevenir el guardado si el formulario está deshabilitado
        if (isFormDisabled) return; 

        if (!formData.description || formData.description.trim() === '') {
            setError('La descripción es obligatoria.');
            return;
        }
        
        setLoading(true);

        try {
            let response;
            if (isEdit) {
                // Lógica de Edición (PUT)
                response = await updateProduct(productId, formData); 
            } else {
                // Lógica de Creación (POST)
                response = await createProduct(formData);
            }

            if (response.error) {
                throw new Error(response.error);
            }

            setSuccessMessage(isEdit ? 'Producto actualizado con éxito!' : 'Producto creado con éxito!');
            
            if (onSubmissionSuccess) {
                onSubmissionSuccess(response.data);
            }

            if (!isEdit) {
                setFormData({
                    sku: '',
                    internalCode: '',
                    name: '',
                    description: '',
                    currentUnitPrice: 0,
                    stockQuantity: 0,
                });
            }

        } catch (err) {
            setError(err.message || 'Error en la operación.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            {successMessage && <p className='text-green-600 mb-4'>{successMessage}</p>}
            {error && <p className='text-red-600 mb-4'>{error}</p>}
            
            {/* Mensaje de advertencia si el producto está deshabilitado */}
            {isFormDisabled && (
                <div className='p-3 mb-4 bg-yellow-100 border border-yellow-400 text-yellow-800 rounded'>
                    ⚠️ Este producto está **DESHABILITADO**. No se pueden modificar sus atributos hasta que sea habilitado.
                </div>
            )}

            {/*
              Utilizamos <fieldset disabled={isFormDisabled}> para deshabilitar 
              todos los campos editables de una sola vez si el producto no está activo.
            */}
            <fieldset disabled={isFormDisabled} className='flex flex-col gap-4'> 
                
                {/* ID (Código Único) - Campo inmodificable y solo visible en edición */}
                {isEdit && (
                    <Input
                        label="Codigo Único (ID)"
                        name="id"
                        value={productId} 
                        disabled // Siempre deshabilitado
                        placeholder="ID (Inmodificable)"
                        className='opacity-75'
                    />
                )}
                <Input
                    label="Código Interno (InternalCode)"
                    name="internalCode"
                    value={formData.internalCode}
                    onChange={handleChange}
                    disabled={isEdit} // Inmodificable en edición
                    placeholder="Código Único"
                    required
                />

                {/* SKU - Inmodificable en edición */}
                <Input
                    label="SKU"
                    name="sku"
                    value={formData.sku}
                    onChange={handleChange}
                    disabled={isEdit} // Mantiene la restricción original
                    placeholder="Código de Producto"
                    required
                />
                
                <Input
                    label="Nombre"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Nombre del Producto"
                    required
                />
                
                <label className='flex flex-col gap-2'>
                    Descripción
                    <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        placeholder="Descripción detallada del producto"
                        className='p-2 border rounded-md text-[1.3rem]'
                        rows="4"
                        required
                    />
                </label>

                <Input
                    label="Precio Unitario"
                    name="currentUnitPrice"
                    type="number"
                    value={formData.currentUnitPrice}
                    onChange={handleChange}
                    placeholder="0.00"
                    min="0"
                    required
                />
                
                <Input
                    label="Stock"
                    name="stockQuantity"
                    type="number"
                    value={formData.stockQuantity}
                    onChange={handleChange}
                    placeholder="0"
                    min="0"
                    required
                />
            </fieldset>

            <div className='mt-6'>
                <Button 
                    type="submit" 
                    // Deshabilitar si está cargando O si el formulario está deshabilitado
                    disabled={loading || isFormDisabled} 
                    className="w-full"
                >
                    {loading ? 'Guardando...' : (isEdit ? 'Guardar Cambios' : 'Crear Producto')}
                </Button>
            </div>
        </form>
    );
}

export default ProductForm;
