import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form'; // ⬅️ Nuevo: Importar useForm
import Button from '../../shared/components/Button';
import Input from '../../shared/components/Input';
import { createProduct } from '../services/create';
import { updateProduct } from '../services/detail'; 

// Aceptamos la nueva prop isFormDisabled
function ProductForm({ initialData = null, productId = null, onSubmissionSuccess, isFormDisabled = false }) {
    
    const isEdit = !!productId;

    // 1. Inicialización de useForm (Reemplaza a useState(formData))
    const {
        register,
        handleSubmit,
        formState: { errors, isValid }, // errors para mensajes, isValid para deshabilitar botón
        reset,
        getValues, // Necesario para cargar data inicial en edición
    } = useForm({
        defaultValues: {
            sku: initialData?.sku || '',
            internalCode: initialData?.internalCode || '',
            name: initialData?.name || '',
            description: initialData?.description || '',
            // Se asegura que los valores numéricos sean 0 si son nulos para evitar NaN
            currentUnitPrice: initialData?.currentUnitPrice ?? 0, 
            stockQuantity: initialData?.stockQuantity ?? 0,
        },
        mode: 'onBlur', // ⬅️ Activa la validación en tiempo real al salir del campo (onBlur)
    });
    
    // Eliminada: const [formData, setFormData] = useState({...});

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);

    // 2. Cargar datos iniciales usando reset
    useEffect(() => {
        if (initialData) {
            // Usa reset para inyectar los datos en RHF, lo que sobrescribe los valores iniciales.
            reset({
                sku: initialData.sku || '',
                internalCode: initialData.internalCode || '',
                name: initialData.name || '',
                description: initialData.description || '',
                currentUnitPrice: initialData.currentUnitPrice || 0,
                stockQuantity: initialData.stockQuantity || 0,
            });
        }
    }, [initialData, reset]);

    // Eliminada: const handleChange = (evt) => { ... }; // Reemplazada por ...register

    // 3. Función onValid que maneja la lógica de envío (solo se llama si la validación pasa)
    // El argumento 'data' contiene los campos y valores del formulario (ya validados).
    const onValid = async (data) => {

        if (isEdit) {
        data.sku = getValues('sku');
        data.internalCode = getValues('internalCode');
    }
        // Eliminada: La validación manual de descripción, ahora cubierta por 'required' en register.
        // if (!formData.description || formData.description.trim() === '') { ... }

        setLoading(true);
        setError(null);
        setSuccessMessage(null);

        try {
            let response;
            if (isEdit) {
                // Lógica de Edición (PUT)
                // Usar 'data' que contiene los valores del formulario
                // Nota: Asegúrate que 'updateProduct' reciba el ID y los datos.
                response = await updateProduct(productId, data); 
            } else {
                // Lógica de Creación (POST)
                response = await createProduct(data);
            }

            if (response.error) {
                throw new Error(response.error);
            }

            setSuccessMessage(isEdit ? 'Producto actualizado con éxito!' : 'Producto creado con éxito!');
            
            if (onSubmissionSuccess) {
                onSubmissionSuccess(response.data);
            }

            if (!isEdit) {
                // Resetear form a valores por defecto/vacíos después de la creación
                reset();
            }

        } catch (err) {
            setError(err.message || 'Error en la operación.');
        } finally {
            setLoading(false);
        }
    };

    // 4. Se usa handleSubmit de RHF para envolver la función onValid
    return (
        <form onSubmit={handleSubmit(onValid)}>
            {successMessage && <p className='text-green-600 mb-4'>{successMessage}</p>}
            {error && <p className='text-red-600 mb-4'>{error}</p>}
            
            {/* Mensaje de advertencia si el producto está deshabilitado */}
            {isFormDisabled && (
                <div className='p-3 mb-4 bg-yellow-100 border border-yellow-400 text-yellow-800 rounded'>
                    ⚠️ Este producto está **DESHABILITADO**. No se pueden modificar sus atributos hasta que sea habilitado.
                </div>
            )}

            <fieldset disabled={isFormDisabled} className='flex flex-col gap-4'> 
                
                {/* ID (Código Único) - Campo inmodificable y solo visible en edición */}
                {isEdit && (
                    <Input
                        label="Codigo Único (ID)"
                        name="id"
                        value={productId || initialData?.id} 
                        disabled // Siempre deshabilitado
                        placeholder="ID (Inmodificable)"
                        className='opacity-75'
                    />
                )}
                
                {/* Código Interno (InternalCode) - Requerido, Inmodificable en edición */}
                <Input
                    label="Código Interno (InternalCode)"
                    {...register('internalCode', {
                        required: 'El Código Interno es obligatorio',
                        disabled: isEdit, // Inmodificable en edición
                    })}
                    // ⬅️ Mostrar error de validación en tiempo real
                    error={errors.internalCode?.message} 
                    placeholder="Código Único"
                />

                {/* SKU - Requerido, Inmodificable en edición */}
                <Input
                    label="SKU"
                    {...register('sku', {
                        required: 'SKU es obligatorio',
                        disabled: isEdit, // Mantiene la restricción original
                    })}
                    // ⬅️ Mostrar error de validación en tiempo real
                    error={errors.sku?.message} 
                    placeholder="Código de Producto"
                />
                
                {/* Nombre - Requerido */}
                <Input
                    label="Nombre"
                    {...register('name', {
                        required: 'El nombre es obligatorio',
                    })}
                    // ⬅️ Mostrar error de validación en tiempo real
                    error={errors.name?.message} 
                    placeholder="Nombre del Producto"
                />
                
                {/* Descripción - Requerida */}
                <label className='flex flex-col gap-2'>
                    Descripción
                    <textarea
                        {...register('description', {
                            required: 'La descripción es obligatoria',
                        })}
                        placeholder="Descripción detallada del producto"
                        // Ajustar la clase para mostrar el error visualmente en el textarea
                        className={`p-2 border rounded-md text-[1.3rem] ${errors.description ? 'border-red-400' : 'border-gray-200'}`}
                        rows="4"
                    />
                    {/* ⬅️ Mostrar error de validación en tiempo real */}
                    {errors.description && <p className="text-red-500 text-base sm:text-xs">{errors.description.message}</p>}
                </label>

                {/* Precio Unitario - Requerido y > 0 */}
                <Input
                    label="Precio Unitario"
                    type="number"
                    step="0.01" // Añadir step para decimales
                    {...register('currentUnitPrice', {
                        required: 'El precio unitario es obligatorio',
                        valueAsNumber: true, // Convierte el input a número
                        // Validación: El precio debe ser mayor a 0
                        validate: (value) => (value > 0) || 'El precio debe ser mayor a 0', 
                    })}
                    // ⬅️ Mostrar error de validación en tiempo real
                    error={errors.currentUnitPrice?.message} 
                    placeholder="0.00"
                />
                
                {/* Stock - Requerido y >= 0 */}
                <Input
                    label="Stock"
                    type="number"
                    {...register('stockQuantity', {
                        required: 'El Stock es obligatorio',
                        valueAsNumber: true, // Convierte el input a número
                        min: {
                            value: 0,
                            message: 'El stock no puede ser negativo',
                        },
                    })}
                    // ⬅️ Mostrar error de validación en tiempo real
                    error={errors.stockQuantity?.message} 
                    placeholder="0"
                />
            </fieldset>

            <div className='mt-6'>
                <Button 
                    type="submit" 
                    // Se deshabilita si está cargando, si el formulario está deshabilitado, O si RHF reporta errores (isValid es false)
                    disabled={loading || isFormDisabled || !isValid} 
                    className="w-full"
                >
                    {loading ? 'Guardando...' : (isEdit ? 'Guardar Cambios' : 'Crear Producto')}
                </Button>
            </div>
        </form>
    );
}

export default ProductForm;
