import LoginForm from './login-form';

export const metadata = {
  title: 'Login',
};

export default function LoginPage() {
  return (
    <div className="container mx-auto px-6 py-24">
      <div className="max-w-md mx-auto">
        <h1 className="font-headline text-3xl font-bold mb-6">Entrar</h1>
        <LoginForm />
      </div>
    </div>
  );
}
