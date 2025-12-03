
import { useCart } from '../context/CartProvider';

const useAuth = () => {
  const context = useCart();

  if (!context) {
    throw new Error('useCart no debe ser usado por fuera de CartProvider');
  }

  return context;
};

export default useAuth;