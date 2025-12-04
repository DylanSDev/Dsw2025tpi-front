import Button from '../../shared/components/Button';
import Input from '../../shared/components/Input';
import { useCart } from '../context/CartProvider';

function CartItem({ item }) {
  const { addToCart, removeFromCart } = useCart();
  
  // Función para manejar el cambio de cantidad desde el input o botones +/-
  const handleQuantityChange = (newQuantity) => {
    // Aseguramos que la cantidad sea al menos 1
    const quantity = Math.max(1, Number(newQuantity));
    
    // El objeto item tiene la estructura necesaria (id, name, currentUnitPrice)
    addToCart(item, quantity);
  };

  const handleRemove = () => {
    removeFromCart(item.id);
  };

  const subtotal = (item.currentUnitPrice * item.quantity).toFixed(2);

  return (
    <div className='
      flex
      flex-col
      p-4
      border
      rounded-xl
      shadow-sm
      bg-white
      gap-3
      sm:flex-row
      sm:items-center
      sm:justify-between
    '>
      {/* Información del Producto */}
      <div className='flex flex-col sm:w-1/2'>
        <h3 className='text-xl font-bold'>{item.name}</h3>
        <p className='text-sm text-gray-600'>SKU: {item.sku}</p>
        <p className='text-md'>Precio unitario: ${item.currentUnitPrice}</p>
        <p className='text-lg font-semibold mt-1'>Sub Total: ${subtotal}</p>
      </div>

      {/* Controles de Cantidad y Botones */}
      <div className='flex items-center gap-2 mt-2 sm:mt-0'>
        {/* Botón de Decremento */}
        <Button 
          className='w-8 h-8 p-0' 
          variant='secondary'
          onClick={() => handleQuantityChange(item.quantity - 1)}
        >
          -
        </Button>
        {/* Input de Cantidad */}
        <input 
          type='number' 
          value={item.quantity} 
          onChange={(e) => handleQuantityChange(e.target.value)}
          min='1'
          className='w-12 h-8 text-center p-0'
        />
        {/* Botón de Incremento */}
        <Button 
          className='w-8 h-8 p-0' 
          variant='secondary'
          onClick={() => handleQuantityChange(item.quantity + 1)}
        >
          +
        </Button>
        {/* Botón de Borrar */}
        <Button 
          onClick={handleRemove}
          className='ml-4 bg-red-400 hover:bg-red-500 text-white'
        >
          Borrar
        </Button>
      </div>
    </div>
  );
}

export default CartItem;