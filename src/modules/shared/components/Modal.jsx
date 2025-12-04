import { useEffect } from 'react';

/**
 * Componente Modal reutilizable.
 * @param {boolean} isOpen - Controla si el modal es visible.
 * @param {function} onClose - Función a ejecutar cuando se cierra el modal.
 * @param {React.ReactNode} children - Contenido del modal.
 */
function Modal({ isOpen, onClose, children }) {
  // Manejo del scroll del body cuando el modal está abierto para evitar movimiento
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    // Limpieza al desmontar o cerrar
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) {
    return null;
  }

  // Evita que el clic dentro del modal cierre el modal
  const handleModalClick = (e) => {
    e.stopPropagation();
  };

  return (
    <div 
      className="
        fixed /* Mantiene el modal en su posición incluso al hacer scroll */
        top-0
        left-0
        w-full
        h-full
        bg-black/50 /* 👈 La clave: Fondo negro con 70% de opacidad. Ajusta la opacidad (ej: /50, /60, etc.) */
        flex
        justify-center
        items-center
        z-50
      " 
      onClick={onClose}
    >
      <div 
        className="
          bg-white p-8 rounded-lg shadow-2xl 
          max-w-md w-full m-4 relative
          transform transition-all duration-300 scale-100 opacity-100
        "
        onClick={handleModalClick}
      >
        <button 
          className="absolute top-4 right-4 text-xl font-bold p-1 hover:text-gray-700 transition"
          onClick={onClose}
        >
          &times;
        </button>
        {children}
      </div>
    </div>
  );
}

export default Modal;