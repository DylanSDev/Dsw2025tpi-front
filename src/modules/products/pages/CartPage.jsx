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
import CheckoutForm from '../../orders/pages/CheckoutForm'; 

function CartPage() {
  const navigate = useNavigate();
  const { cart, totalItems, totalAmount, clearCart } = useCart();
  const { isAuthenticated } = useAuth();
  
  // Modal states
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState(false);
  
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Esta función ahora recibe los datos del formulario (addressFormData)
  const finalizeOrder = async (addressFormData) => {
    setIsSubmitting(true);

    const userStored = localStorage.getItem('user');
    const user = userStored ? JSON.parse(userStored) : null;

    if (!user || !user.id) {
        alert('Error: No se pudo identificar al usuario. Por favor, inicie sesión nuevamente.');
        setIsSubmitting(false);
        return;
    }

    const orderItems = cart.map(item => ({
        productId: item.id, 
        quantity: item.quantity
    }));

    // USAMOS LOS DATOS DEL FORMULARIO AQUÍ
    const orderData = {
        customerId: user.id,
        shippingAddress: addressFormData.shippingAddress,
        billingAddress: addressFormData.billingAddress,
        notes: addressFormData.notes,
        orderItems: orderItems
    };

    console.log('Enviando orden:', orderData);

    const result = await createOrder(orderData);

    if (result.error) {
        const serverError = result.error.error || result.error.message || result.error.detail || 'Error desconocido';
        alert(`Error al crear la orden: ${serverError}`);
        console.error("Detalle del error:", result.error);
    } else {
        alert('¡Compra finalizada con éxito! Orden enviada.');
        clearCart();
        navigate('/');
    }

    setIsSubmitting(false);
    setIsCheckoutModalOpen(false); // Cerramos el modal al terminar
  };

  const handleSuccessfulLogin = () => {
    setIsLoginModalOpen(false); 
    // Al loguearse, abrimos inmediatamente el formulario de dirección
    setIsCheckoutModalOpen(true);
  };

  const handleCheckoutClick = () => {
    if (cart.length === 0) {
      alert('Tu carrito está vacío.');
      return;
    }

    if (isAuthenticated) {
        // Si ya está logueado, vamos directo a pedir dirección
        setIsCheckoutModalOpen(true);
    } else {
        // Si no, pedimos login primero
        setIsLoginModalOpen(true);
    }
  };

  const handleRegisterClick = () => {
    setIsLoginModalOpen(false);
    navigate('/signup'); 
  };

  return (
    <div className='p-4 sm:p-10'>
      <h1 className='text-3xl font-bold mb-6'>Carrito de Compras</h1>

      <div className='grid grid-cols-1 gap-6 lg:grid-cols-3'>
        {/* Columna de Ítems */}
        <div className='lg:col-span-2 flex flex-col gap-4'>
          {cart.length === 0 ? (
            <Card>
              <p className='text-center'>Tu carrito está vacío. <br/><br/>
                <Button variant='secondary' onClick={() => navigate('/')}>Ir a Productos</Button>
              </p>
            </Card>
          ) : (
            cart.map(item => (
              <CartItem key={item.id} item={item} />
            ))
          )}
        </div>

        {/* Columna de Resumen */}
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
            onClick={handleCheckoutClick}
            disabled={cart.length === 0}
          >
            Finalizar Compra
          </Button>
          
          {!isAuthenticated && cart.length > 0 && (
            <p className='text-red-500 text-sm mt-2'>* Debes iniciar sesión para continuar.</p>
          )}
        </Card>
      </div>

      {/* MODAL DE LOGIN */}
      <Modal 
        isOpen={isLoginModalOpen} 
        onClose={() => setIsLoginModalOpen(false)}
      >
        <ModalLoginForm 
          onLoginSuccess={handleSuccessfulLogin}
          onRegisterClick={handleRegisterClick}
        />
      </Modal>

      {/* MODAL DE CHECKOUT (DIRECCIÓN) */}
      <Modal
        isOpen={isCheckoutModalOpen}
        onClose={() => !isSubmitting && setIsCheckoutModalOpen(false)}
      >
        <CheckoutForm 
            onConfirm={finalizeOrder}
            onCancel={() => setIsCheckoutModalOpen(false)}
            isSubmitting={isSubmitting}
        />
      </Modal>
    </div>
  );
}

export default CartPage;