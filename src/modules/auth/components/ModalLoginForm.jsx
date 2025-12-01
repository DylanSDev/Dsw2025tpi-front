import { useState } from 'react';
import { useForm } from 'react-hook-form';
import Input from '../../shared/components/Input';
import Button from '../../shared/components/Button';
import useAuth from '../hook/useAuth';
import { frontendErrorMessage } from '../helpers/backendError';

/**
 * Formulario de Login adaptado para uso dentro de un Modal en el checkout.
 * @param {function} onLoginSuccess - Callback a ejecutar tras un login exitoso.
 * @param {function} onRegisterClick - Callback para que el padre navegue al registro.
 */
function ModalLoginForm({ onLoginSuccess, onRegisterClick }) {
  const [errorMessage, setErrorMessage] = useState('');
  const { singin } = useAuth();
  
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({ defaultValues: { username: '', password: '' } });

  const onValid = async (formData) => {
    setErrorMessage('');
    
    try {
      const { error } = await singin(formData.username, formData.password);

      if (error) {
        setErrorMessage(error.frontendErrorMessage);
        return;
      }

      // Si el login es exitoso, notificar al componente padre
      onLoginSuccess();
    } catch (error) {
      if (error?.response?.data?.code) {
        setErrorMessage(frontendErrorMessage[error?.response?.data?.code]);
      } else {
        setErrorMessage('Llame a soporte');
      }
    }
  };

  return (
    <form className='
        flex
        flex-col
        gap-4
        pt-4
      '
      onSubmit={handleSubmit(onValid)}
    >
      <h3 className='text-xl font-bold'>Iniciar Sesión para Finalizar Compra</h3>
      
      <Input
        label='Usuario'
        { ...register('username', {
          required: 'Usuario es obligatorio',
        }) }
        error={errors.username?.message}
      />
      <Input
        label='Contraseña'
        { ...register('password', {
          required: 'Contraseña es obligatoria',
        }) }
        type='password'
        error={errors.password?.message}
      />

      <Button type='submit' disabled={isSubmitting}>
        {isSubmitting ? 'Iniciando Sesión...' : 'Iniciar Sesión'}
      </Button>
      
      <Button 
        variant='secondary' 
        onClick={onRegisterClick} 
        type='button'
      >
        Registrar Nueva Cuenta
      </Button>
      
      {errorMessage && <p className='text-red-500 text-center'>{errorMessage}</p>}
    </form>
  );
}

export default ModalLoginForm;