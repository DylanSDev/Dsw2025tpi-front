import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../shared/components/Button';
import Card from '../../shared/components/Card';
import Modal from '../../shared/components/Modal';
import useAuth from '../../auth/hook/useAuth';
import { useCart } from '../context/CartProvider';
import CartItem from '../components/CartItem';
import ModalLoginForm from '../../auth/components/ModalLoginForm';

function CartPage() {
  const navigate = useNavigate();
  const { cart, totalItems, totalAmount } = useCart();
  const { isAuthenticated } = useAuth();
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  // Estado para rastrear si el usuario intentó comprar antes de logearse
  const [checkoutAttempted, setCheckoutAttempted] = useState(false);


  /**
   * Lógica de la Consigna:
   * 1. Si está autenticado: se envia la informacion a '/api/orders', limpiar localStorage y redirigir.
   * 2. Si NO está autenticado: abre el modal y luego de login, ejecuta esta función automáticamente.
   */
  const finalizeOrder = () => {
    // PENDIENTE: Aquí debe ir la llamada al servicio de creación de orden (createOrder).

    console.log('ENVIANDO ORDEN AL BACKEND (Simulado)...');
    console.log('Datos de la orden a enviar:', cart);
    
    // Una vez que el servicio de orden sea exitoso:
    alert('¡Compra finalizada con éxito! Orden enviada.');
    
    // 1. Limpiar el carrito (clearCart implementa localStorage.removeItem('cart'))
    clearCart(); 
    
    // 2. Redirigir al listado de productos
    navigate('/');
  };

  const handleSuccessfulLogin = () => {
    setIsModalOpen(false); // Cierra el modal
    
    // La consigna dice que debe enviar la orden automáticamente tras el login
    if (checkoutAttempted) {
      finalizeOrder();
      setCheckoutAttempted(false); // Resetear
    }
  };


  const handleCheckout = () => {
    if (cart.length === 0) {
      alert('Tu carrito está vacío. Agrega productos para continuar.');
      return;
    }

    setCheckoutAttempted(true);

    if (isAuthenticated) {

        finalizeOrder();
      // Flujo 1: Usuario ya logeado (PENDIENTE: enviar a /api/orders)
      console.log('Usuario autenticado. Procediendo con la orden...');
      alert('¡Compra simulada exitosa! Reemplazar por llamada real a /api/orders.');
      // En una implementación real, aquí limpiarías el carrito y redirigirías
      // clearCart(); 
    } else {
        setIsModalOpen(true);
      // Flujo 2: Usuario no logeado (PENDIENTE: debe abrir una modal de login)
      alert('Debes iniciar sesión para finalizar la compra. Implementar Modal de Login/Registro.');
      // Después de iniciar sesión/registro, el flujo enviaría la orden automáticamente.
    }
  };

  const handleRegisterClick = () => {
    setIsModalOpen(false);
    navigate('/signup'); 
  };

  return (
    <div className='p-4 sm:p-10'>
      <h1 className='text-3xl font-bold mb-6'>Carrito de Compras</h1>

      <div className='grid grid-cols-1 gap-6 lg:grid-cols-3'>
        {/* Columna de Ítems del Carrito */}
        <div className='lg:col-span-2 flex flex-col gap-4'>
          {cart.length === 0 ? (
            <Card>
              <p className='text-center'>Tu carrito está vacío. 
                <Button variant='secondary' onClick={() => navigate('/')}>Ir a Productos</Button>
              </p>
            </Card>
          ) : (
            cart.map(item => (
              <CartItem key={item.id} item={item} />
            ))
          )}
        </div>

        {/* Columna de Resumen de Pedido */}
        <Card className='lg:col-span-1 h-fit'>
          <h2 className='text-2xl font-bold border-b pb-2 mb-4'>Detalle de Pedido</h2>
          
          <div className='flex justify-between text-lg'>
            <span>Cantidad total de ítems:</span>
            <span className='font-semibold'>{totalItems}</span>
          </div>

          <div className='flex justify-between text-xl font-bold mt-4 pt-4 border-t'>
            <span>Total a pagar:</span>
            <span className='text-purple-600'>${totalAmount}</span>
          </div>
          
          <Button 
            className='w-full mt-6 text-xl h-12' 
            type='submit'
            onClick={handleCheckout}
            disabled={cart.length === 0}
          >
            Finalizar Compra
          </Button>
          
          {!isAuthenticated && cart.length > 0 && (
            <p className='text-red-500 text-sm mt-2'>* Debes iniciar sesión para continuar.</p>
          )}

        </Card>
      </div>

      {/* Modal de Login (Solo se muestra si isModalOpen es true) */}
      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
      >
        <ModalLoginForm 
          onLoginSuccess={handleSuccessfulLogin}
          onRegisterClick={handleRegisterClick}
        />
      </Modal>
    </div>
  );
}

export default CartPage;