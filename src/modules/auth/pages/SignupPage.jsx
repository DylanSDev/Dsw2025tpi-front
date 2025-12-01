import RegisterForm from '../components/RegisterForm';

function SignupPage() {
  return (
    <div className='
      flex
      flex-col
      justify-center
      h-[100dvh]
      bg-neutral-100
      sm:items-center
    '>
      <RegisterForm />
    </div>
  );
}

export default SignupPage;