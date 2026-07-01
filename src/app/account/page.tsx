
import { Metadata } from 'next';
import AccountForm from './account-form';

export const dynamic = 'force-dynamic';
export const metadata: Metadata = {
  title: 'Minha Conta | Play Vision Papelaria',
  description: 'Gerencie seus dados cadastrais.',
};

export default async function AccountPage() {
  return (
    <div className="container mx-auto px-6 py-20 max-w-4xl">
      <h1 className="font-headline text-4xl font-bold mb-8">Minha Conta</h1>
      <AccountForm />
    </div>
  );
}
