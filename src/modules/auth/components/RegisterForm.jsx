import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import Input from '../../shared/components/Input';
import Button from '../../shared/components/Button';
import { registerUser } from '../services/register';

function RegisterForm() {
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    watch, // Necesario para comparar la contraseña
    formState: { errors, isSubmitting },
  } = useForm({ 
    defaultValues: { 
      username: '', 
      email: '', 
      password: '', 
      confirmPassword: '', 
    },
  });

  const password = watch('password');

  const onValid = async (formData) => {
    setErrorMessage('');

    const { error } = await registerUser(formData.username, formData.email, formData.password);

    if (error) {
      // Manejo básico de errores del backend (ej: usuario ya existe)
      const detail = error.detail || 'Error al registrar. Intente nuevamente.';
      setErrorMessage(detail);

      return;
    }

    // Registro exitoso, redirigir al login
    alert('¡Registro exitoso! Por favor, inicie sesión.');
    navigate('/login');
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
      <h2 className='text-2xl font-bold mb-4'>Registro de Usuario</h2>
      
      <Input
        label='Usuario'
        { ...register('username', {
          required: 'Usuario es obligatorio',
          minLength: { value: 3, message: 'Mínimo 3 caracteres' },
        }) }
        error={errors.username?.message}
      />
      
      <Input
        label='Email'
        { ...register('email', {
          required: 'Email es obligatorio',
          pattern: { 
            value: /^\S+@\S+$/i, 
            message: 'Formato de email inválido' 
          },
        }) }
        type='email'
        error={errors.email?.message}
      />
      
      <Input
        label='Contraseña'
        { ...register('password', {
          required: 'Contraseña es obligatoria',
          minLength: { value: 6, message: 'Mínimo 6 caracteres' },
        }) }
        type='password'
        error={errors.password?.message}
      />
      
      <Input
        label='Confirmar contraseña'
        { ...register('confirmPassword', {
          required: 'Confirmar contraseña es obligatorio',
          validate: value => 
            value === password || 'Las contraseñas no coinciden',
        }) }
        type='password'
        error={errors.confirmPassword?.message}
      />
      
      {/* El campo 'Role' es omitido en el frontend ya que se asigna 'User' automáticamente */}
      
      <Button type='submit' disabled={isSubmitting}>
        {isSubmitting ? 'Registrando...' : 'Registrar Usuario'}
      </Button>
      
      <Button 
        variant='secondary' 
        onClick={() => navigate('/login')}
        type='button'
      >
        Inicio de Sesión
      </Button>
      
      {errorMessage && <p className='text-red-500 text-center'>{errorMessage}</p>}
    </form>
  );
};

export default RegisterForm;