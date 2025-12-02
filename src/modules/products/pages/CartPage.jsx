import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../shared/components/Button';
import Card from '../../shared/components/Card';
import Modal from '../../shared/components/Modal';
import useAuth from '../../auth/hook/useAuth';
import { useCart } from '../context/CartProvider';
import CartItem from '../components/CartItem';
import ModalLoginForm from '../../auth/components/ModalLoginForm';
import { createOrder } from '../../orders/services/create';

function CartPage() {
  const navigate = useNavigate();
  const { cart, totalItems, totalAmount } = useCart();
  const { isAuthenticated } = useAuth();
  
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [checkoutAttempted, setCheckoutAttempted] = useState(false);

  const finalizeOrder = async () => 
  {
    const userStored = localStorage.getItem('user');
    const user = userStored ? JSON.parse(userStored) : null;

    if (!user || !user.id)
    {
      alert('Error: No se pudo identificar al usuario. Por favor, inicie sesión nuevamente.');
      setIsSubmitting(false);
      return;
    }

    const cartItems = cart.map(item => 
    ({
        productId: item.id, 
        quantity: item.quantity
    })                         );

    const orderData = {
        customerId: user.id,
        shippingAddress: "Calle Falsa 123, Tucumán",
        billingAddress: "Calle Falsa 123, Tucumán",
        notes: "Pedido generado desde la web",
        orderItems: cartItems
    };

    console.log('Enviando orden:', orderData);

    const result = await createOrder(orderData);

    if (result.error) 
    {
      alert(`Error al crear la orden: ${result.error.message || result.error.detail || 'Error desconocido'}`);
      console.error(result.error);
    }
    else
    {
      alert('¡Compra finalizada con éxito! Orden enviada.');
      clearCart();
      navigate('/');
    }
  };

  const handleSuccessfullLogin = () => 
  {
    setIsModalOpen(false);
    
    if (checkoutAttempted) {
      finalizeOrder();
      setCheckoutAttempted(false);
    }
  };


  const handleCheckout = () => 
  {
    if (cart.length == 0) {
      alert('Tu carrito está vacío. Agrega productos para continuar.');
      return;
    }

    setCheckoutAttempted(true);

    if (isAuthenticated)
    {
      console.log('Usuario autenticado. Procediendo con la orden...');
      finalizeOrder();
    }
    else 
    {
      setIsModalOpen(true);
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
          onLoginSuccess={handleSuccessfullLogin}
          onRegisterClick={handleRegisterClick}
        />
      </Modal>
    </div>
  );
}

export default CartPage;