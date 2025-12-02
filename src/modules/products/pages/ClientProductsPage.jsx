import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../shared/components/Button';
import Input from '../../shared/components/Input';
import { getClientProducts } from '../services/list'; 
import { useCart } from '../context/CartProvider';

function ProductCard({ product, addToCart }) 
{
  const [quantity, setQuantity] = useState(1);

  const handleIncrement = () => 
  {
    setQuantity(prev => prev + 1);
  };

  const handleDecrement = () => 
  {
    if (quantity > 1) setQuantity(prev => prev - 1);
  };

  const handleAddToCart = () =>
  {
    addToCart(product, quantity);
    setQuantity(1);
  };

  return (
    <div className='bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col h-full'>
      {/* 1. Placeholder de Imagen (Cuadrado Gris) */}
      <div className='bg-gray-200 w-full aspect-square rounded-lg mb-4 flex items-center justify-center text-gray-400'>
        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
      </div>
      
      {/* 2. Texto y Precio */}
      <div className='mb-4'>
        <h3 className='text-gray-700 font-medium text-lg truncate' title={product.name}>
          {product.name}
        </h3>
        <p className='text-gray-900 font-bold text-xl mt-1'>
          $ {product.currentUnitPrice}
        </p>
      </div>
      
      {/* 3. Controles (Botones +/- y Agregar) */}
      <div className='mt-auto flex items-center justify-between gap-3'>
        <div className='flex items-center gap-2'>
          <button 
            onClick={handleDecrement}
            className='w-8 h-8 rounded-md flex items-center justify-center text-gray-600 hover:bg-gray-100 font-bold text-xl'
            type="button"
          >
            -
          </button>
          
          <span className='w-8 text-center font-medium border border-gray-200 rounded py-1 bg-white text-sm'>
            {quantity}
          </span>
          
          <button 
            onClick={handleIncrement}
            className='w-8 h-8 rounded-md flex items-center justify-center text-gray-600 hover:bg-gray-100 font-bold text-xl'
            type="button"
          >
            +
          </button>
        </div>

        <Button 
          onClick={handleAddToCart}
          className='bg-purple-200 text-purple-800 hover:bg-purple-300 px-4 py-2 rounded-lg font-medium text-sm transition-colors'
        >
          Agregar
        </Button>
      </div>
    </div>
  );
}

function ClientProductsPage() {
  const navigate = useNavigate();
  const { addToCart, totalItems } = useCart();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize] = useState(8); 
  const [total, setTotal] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [tempSearchTerm, setTempSearchTerm] = useState('');

  const fetchProducts = async (search, page) => {
    try {
      setLoading(true);
      const { data, error } = await getClientProducts(search, page, pageSize);

      if (error) throw error;
      
      setTotal(data.total);
      setProducts(data.productsItems || []); 
    } catch (error) {
      console.error(error);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts(searchTerm, pageNumber);
  }, [pageNumber, pageSize, searchTerm]);

  const handleSearch = (e) => {
    e.preventDefault();
    setPageNumber(1);
    setSearchTerm(tempSearchTerm);
  };

  const totalPages = Math.ceil(total / pageSize);

  return (
    <div className='min-h-screen bg-gray-50'>
      {/* Header / Navbar */}
      <header className='bg-white px-6 py-4 shadow-sm sticky top-0 z-10'>
        <div className='max-w-7xl mx-auto flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
          
          <div className='flex items-center gap-4'>
            {/* Logo o Título */}
            <div className='flex items-center gap-2'>
               {/* Simulación del logo negro de tu imagen */}
               <div className="w-8 h-8 bg-black rounded-full flex items-center justify-center text-white font-bold">B</div>
            </div>
            
            <nav className='flex gap-4'>
               <span className='font-semibold bg-gray-100 px-3 py-1 rounded-md text-sm cursor-pointer'>Productos</span>
               <span 
                 className='text-gray-500 cursor-pointer hover:text-black transition px-3 py-1 text-sm'
                 onClick={() => navigate('/cart')}
               >
                 Carrito de compras ({totalItems})
               </span>
            </nav>
          </div>
          
          {/* Buscador Central */}
          <form onSubmit={handleSearch} className='flex-1 max-w-lg mx-4 relative'>
            <input 
              type='text'
              placeholder='Search'
              value={tempSearchTerm}
              onChange={(e) => setTempSearchTerm(e.target.value)}
              className='w-full pl-4 pr-10 py-2 border border-gray-200 rounded-full text-sm focus:outline-none focus:border-purple-400 focus:ring-1 focus:ring-purple-400'
            />
            <button type="submit" className='absolute right-3 top-1/2 -translate-y-1/2 text-gray-400'>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
            </button>
          </form>

          {/* Botones Auth */}
          <div className='flex gap-3'>
            <Button variant='secondary' onClick={() => navigate('/login')} className='bg-purple-100 text-purple-700 hover:bg-purple-200 text-sm py-2'>
              Iniciar Sesión
            </Button>
            <Button onClick={() => navigate('/signup')} className='bg-gray-200 text-gray-700 hover:bg-gray-300 text-sm py-2 shadow-none'>
              Registrarse
            </Button>
          </div>
        </div>
      </header>

      {/* Grid de Contenido */}
      <main className='p-6 max-w-7xl mx-auto'>
        {loading ? (
          <div className='text-center py-20 text-gray-500'>Cargando productos...</div>
        ) : products.length === 0 ? (
          <div className='text-center py-20 text-gray-500'>
            No se encontraron productos habilitados que coincidan con la búsqueda.
            <br />
            <small>(Verifica en la BD que IsActive sea 1)</small>
          </div>
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
          <div className='flex justify-center items-center mt-10 gap-4'>
            <Button
              disabled={pageNumber === 1}
              onClick={() => setPageNumber(pageNumber - 1)}
              variant="secondary"
            >
              Anterior
            </Button>
            <span className='text-sm text-gray-600'>Página {pageNumber} de {totalPages}</span>
            <Button
              disabled={pageNumber >= totalPages}
              onClick={() => setPageNumber(pageNumber + 1)}
              variant="secondary"
            >
              Siguiente
            </Button>
          </div>
        )}
      </main>
    </div>
  );
}

export default ClientProductsPage;