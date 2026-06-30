import RegisterForm from './register-form';

export const metadata = {
  title: 'Criar conta',
};

export default function RegisterPage() {
  return (
    <div className="container mx-auto px-6 py-24">
      <div className="max-w-md mx-auto">
        <h1 className="font-headline text-3xl font-bold mb-6">Criar conta</h1>
        <RegisterForm />
      </div>
    </div>
  );
}
