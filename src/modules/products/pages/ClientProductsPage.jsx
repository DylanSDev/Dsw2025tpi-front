import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../../shared/components/Card';
import Button from '../../shared/components/Button';
import Input from '../../shared/components/Input';
import { getClientProducts } from '../services/list';
import useCart from '../hooks/useCart';

// Componente para mostrar una tarjeta de producto individual
function ProductCard({ product, addToCart }) {
  const [quantity, setQuantity] = useState(1);
  const { cart } = useCart();
  
  // Sincronizar la cantidad con lo que hay en el carrito
  useEffect(() => {
    const existingItem = cart.find(item => item.id === product.id);
    if (existingItem) {
      setQuantity(existingItem.quantity);
    }
  }, [product.id, cart]);

  const handleQuantityChange = (evt) => {
    const newQuantity = Number(evt.target.value);
    if (newQuantity >= 1) { // Asegura que la cantidad mínima sea 1 
      setQuantity(newQuantity);
    }
  };

  const handleAddToCart = () => {
    addToCart(product, quantity);
  };

  return (
    <Card className='flex flex-col gap-2'>
      {/* Placeholder de imagen*/}
      <div className='w-full h-40 bg-gray-200 rounded-md flex items-center justify-center'>
        <span>Imagen</span>
      </div>
      
      {/* Información del producto */}
      <h3 className='text-2xl font-bold'>{product.name}</h3>
      <p className='text-xl font-semibold'>${product.currentUnitPrice}</p>
      
      <div className='flex items-center gap-2 mt-2'>
        <Button 
          className='w-8 h-8 p-0' 
          // Aseguramos que la cantidad no baje de 1, como requiere la consigna
          onClick={() => setQuantity(Math.max(1, quantity - 1))} 
        >
          -
        </Button>
        <Input 
          type='number' 
          value={quantity} 
          onChange={handleQuantityChange}
          min='1'
          className='w-12 h-8 text-center p-0'
        />
        <Button 
          className='w-8 h-8 p-0' 
          onClick={() => setQuantity(quantity + 1)}
        >
          +
        </Button>
        <Button 
          onClick={handleAddToCart}
          className='ml-auto w-fit'
        >
          {cart.some(item => item.id === product.id) ? 'Actualizar' : 'Agregar'}
        </Button>
      </div>
    </Card>
  );
}

function ClientProductsPage() {
  const navigate = useNavigate();
  const { addToCart, totalItems } = useCart();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(8); 
  const [total, setTotal] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [tempSearchTerm, setTempSearchTerm] = useState('');

  const fetchProducts = async (search, page) => {
    try {
      setLoading(true);
      const { data, error } = await getClientProducts(search, page, pageSize);

      if (error) throw error;
      
      setTotal(data.total);
      // Asumimos que data.productItems contiene la lista de productos
      setProducts(data.productItems || []); 
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Si la búsqueda cambia o la página cambia, volvemos a buscar
    fetchProducts(searchTerm, pageNumber);
  }, [pageNumber, pageSize, searchTerm]);

  const handleSearch = () => {
    setPageNumber(1); // Siempre reiniciar a la página 1 en una nueva búsqueda
    setSearchTerm(tempSearchTerm);
  };

  const totalPages = Math.ceil(total / pageSize);

  return (
    <div className='p-4 sm:p-10'>
      <header className='flex flex-col gap-3 sm:flex-row sm:justify-between sm:items-center mb-6'>
        <div className='flex gap-4 items-center'>
          <h1 className='text-3xl font-bold'>Productos</h1>
          <Button variant='secondary' onClick={() => navigate('/cart')}>
            Carrito de compras ({totalItems})
          </Button>
        </div>
        
        {/* Barra de Búsqueda y Botones de Auth [cite: 571, 572, 574, 575] */}
        <div className='flex items-center gap-2'>
          <Input 
            type='text'
            placeholder='Search'
            value={tempSearchTerm}
            onChange={(e) => setTempSearchTerm(e.target.value)}
            className='p-1.5 w-full sm:w-auto'
          />
          <Button onClick={handleSearch} className='h-10 w-10 p-1'>
             <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" width="24" height="24"><path d="M15.7955 15.8111L21 21M18 10.5C18 14.6421 14.6421 18 10.5 18C6.35786 18 3 14.6421 3 10.5C3 6.35786 6.35786 3 10.5 3C14.6421 3 18 6.35786 18 10.5Z" stroke="#000000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path></svg>
          </Button>
          <Button variant='secondary' onClick={() => navigate('/login')} className='hidden sm:block'>Iniciar Sesión</Button>
          <Button onClick={() => alert('Implementar navegación a /signup')} className='hidden sm:block'>Registrarse</Button>
          {/* Botón de menú para móvil (simulado) */}
          <button className='sm:hidden'>&#9776;</button> 
        </div>
      </header>

      {/* Grid de Productos */}
      {loading ? (
        <span className='text-center block'>Cargando productos...</span>
      ) : products.length === 0 ? (
        <span className='text-center block'>No se encontraron productos habilitados que coincidan con la búsqueda.</span>
      ) : (
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6'>
          {products.map(product => (
            <ProductCard 
              key={product.id} 
              product={product} 
              addToCart={addToCart} 
            />
          ))}
        </div>
      )}

      {/* Paginación */}
      {totalPages > 1 && (
        <div className='flex justify-center items-center mt-6 gap-4'>
          <Button
            disabled={pageNumber === 1}
            onClick={() => setPageNumber(pageNumber - 1)}
            className='bg-gray-200 disabled:bg-gray-100'
          >
            Atras
          </Button>
          <span>Página {pageNumber} de {totalPages}</span>
          <Button
            disabled={pageNumber >= totalPages}
            onClick={() => setPageNumber(pageNumber + 1)}
            className='bg-gray-200 disabled:bg-gray-100'
          >
            Siguiente
          </Button>
        </div>
      )}
    </div>
  );
}

export default ClientProductsPage;