'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function SplashPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to login after 2 seconds
    const timer = setTimeout(() => {
      router.push('/login');
    }, 2000);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 to-slate-800">
      <div className="text-center">
        <div className="mb-8 animate-pulse">
          <div className="text-6xl font-bold text-white mb-4">🐯</div>
          <h1 className="text-5xl font-bold text-white mb-2">UnTigrito®</h1>
        </div>
        <p className="text-slate-300 text-lg">Bienvenido a UnTigrito®</p>
        <div className="mt-8 flex justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
        </div>
      </div>
    </div>
  );
}
