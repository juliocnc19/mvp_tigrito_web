import { LoginForm } from '@/components/auth/LoginForm';

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 to-slate-800 p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">UnTigrito®</h1>
          <p className="text-slate-300">Bienvenido de vuelta</p>
        </div>
        <LoginForm />
      </div>
    </div>
  );
}
