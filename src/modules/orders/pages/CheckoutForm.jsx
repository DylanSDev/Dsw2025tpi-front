import { useForm } from 'react-hook-form';
import Input from '../../shared/components/Input';
import Button from '../../shared/components/Button';

function CheckoutForm({ onConfirm, onCancel, isSubmitting }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      shippingAddress: '',
      billingAddress: '',
      notes: '',
    },
  });

  return (
    <form 
      className='flex flex-col gap-4 min-w-[300px] sm:min-w-[400px]'
      onSubmit={handleSubmit(onConfirm)}
    >
      <h2 className='text-2xl font-bold mb-2'>Datos de Envío</h2>
      
      <Input
        label='Dirección de Envío'
        {...register('shippingAddress', { required: 'La dirección de envío es obligatoria' })}
        error={errors.shippingAddress?.message}
        placeholder="Ej: Av. Siempre Viva 742"
      />

      <Input
        label='Dirección de Facturación'
        {...register('billingAddress', { required: 'La dirección de facturación es obligatoria' })}
        error={errors.billingAddress?.message}
        placeholder="Ej: Av. Siempre Viva 742"
      />

      <div className='flex flex-col'>
        <label className='mb-1'>Notas del Pedido (Opcional):</label>
        <textarea
          className='border border-gray-200 rounded-md p-2 hover:shadow h-24 resize-none'
          {...register('notes')}
          placeholder="Ej: Tocar timbre, dejar en portería..."
        />
      </div>

      <div className='flex gap-3 justify-end mt-4'>
        <Button variant='secondary' onClick={onCancel} type="button">
          Cancelar
        </Button>
        <Button type='submit' disabled={isSubmitting}>
          {isSubmitting ? 'Procesando...' : 'Confirmar Compra'}
        </Button>
      </div>
    </form>
  );
}

export default CheckoutForm;