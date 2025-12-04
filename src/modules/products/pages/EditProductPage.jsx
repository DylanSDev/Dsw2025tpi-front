
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Button from '../../shared/components/Button';
import Card from '../../shared/components/Card';
import ProductForm from '../components/CreateProductForm'; 
import { getProductById, toggleProductStatus } from '../services/detail'; 

function EditProductPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [statusLoading, setStatusLoading] = useState(false); 

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const { data, error } = await getProductById(id);

      if (error) {
        setError(error);
        setProduct(null);
      } else {
        setProduct(data);
        setError(null);
      }
    } catch (e) {
      setError('Ocurrió un error inesperado al cargar el producto.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProduct();
  }, [id]);

  // Función para manejar el cambio de estado (Habilitar/Deshabilitar)
  const handleStatusToggle = async () => {
    if (!product) return;
    
    setStatusLoading(true);
    const newStatus = !product.isActive; // El nuevo estado es el opuesto al actual
    
    try {
        const { error } = await toggleProductStatus(product.id, newStatus);

        if (error) {
            alert(`Error al cambiar el estado: ${error}`);
        } else {
            // Actualizamos el estado local de 'isActive' y mostramos el mensaje
            setProduct(prev => ({ ...prev, isActive: newStatus }));
            alert(`Producto ${newStatus ? 'Habilitado' : 'Deshabilitado'} con éxito!`);
        }
    } catch (e) {
        alert('Error inesperado al intentar cambiar el estado.');
    } finally {
        setStatusLoading(false);
    }
  };
  
  // Función para actualizar el estado del producto tras un PUT exitoso en el formulario
  const handleSubmissionSuccess = (updatedData) => {
    setProduct(updatedData);
  };

  if (loading) {
    return <p>Cargando producto...</p>;
  }

  if (error) {
    return (
      <Card>
        <p className='text-red-600'>Error al cargar el producto: {error}</p>
        <Button onClick={() => navigate('/admin/products')} className='mt-4'>Volver al listado</Button>
      </Card>
    );
  }

  if (!product) {
    return (
      <Card>
        <p>Producto no encontrado.</p>
      </Card>
    );
  }

  const toggleButtonText = product.isActive ? 'Deshabilitar Producto' : 'Habilitar Producto';
  const toggleButtonClass = product.isActive ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600';
  
  // Determinamos si el formulario debe estar deshabilitado (lo está si NO está activo)
  const isFormDisabled = !product.isActive;

  return (
    <div>
      <Card>
        <div className='flex justify-between items-center mb-4'>
            <h1 className='text-3xl'>Editar Producto: {product.name}</h1>
            
            {/* Botón Habilitar/Deshabilitar (PATCH) - Siempre disponible para productos existentes */}
            <Button
                onClick={handleStatusToggle}
                disabled={statusLoading}
                className={`w-auto ${toggleButtonClass}`}
            >
                {statusLoading ? 'Cargando...' : toggleButtonText}
            </Button>
        </div>
        
        {/* Pasamos la bandera para deshabilitar el formulario si es necesario */}
        <ProductForm
            initialData={product}
            productId={product.id}
            onSubmissionSuccess={handleSubmissionSuccess}
            isFormDisabled={isFormDisabled} // <-- NUEVA PROP
        />
        
      </Card>
    </div>
  );
}

export default EditProductPage;