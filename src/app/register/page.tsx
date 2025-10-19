import { RegisterForm } from '@/components/auth/RegisterForm';

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 to-white p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-black mb-2">UnTigrito®</h1>
          <p className="text-gray-600">Crea tu cuenta</p>
        </div>
        <RegisterForm />
      </div>
    </div>
  );
}
