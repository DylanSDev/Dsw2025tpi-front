import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import Input from '../../shared/components/Input';
import Button from '../../shared/components/Button';
import useAuth from '../hook/useAuth';
import { frontendErrorMessage } from '../helpers/backendError';

function LoginForm() {
  const [errorMessage, setErrorMessage] = useState('');
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ defaultValues: { email: '', password: '' } });

  const navigate = useNavigate();

  const { singin } = useAuth();

  const onValid = async (formData) => {
    try {
      const { error, user } = await singin(formData.email, formData.password);

      if (error) {
        setErrorMessage(error.frontendErrorMessage);

        return;
      }

      if(user.role == 'admin')
      {
        navigate('/admin/home');
      }
      else
      {
        navigate('/');
      }
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
        gap-20
        bg-white
        p-8
        sm:w-md
        sm:gap-4
        sm:rounded-lg
        sm:shadow-lg
      '
    onSubmit={handleSubmit(onValid)}
    >
      <Input
        label='Email'
        { ...register('email', {
          required: 'Email es obligatorio',
        }) }
        error={errors.email?.message}
      />
      <Input
        label='Contraseña'
        { ...register('password', {
          required: 'Contraseña es obligatorio',
        }) }
        type='password'
        error={errors.password?.message}
      />

      <Button type='submit'>Iniciar Sesión</Button>
      <Button variant='secondary' onClick={() => alert('Debe impletar navegacion y pagina de registro')}>Registrar Usuario</Button>
      {errorMessage && <p className='text-red-500'>{errorMessage}</p>}
    </form>
  );
};

export default LoginForm;
