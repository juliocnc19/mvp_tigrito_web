'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

interface BalanceCardProps {
  balance: number;
  currency?: string;
  onRecharge?: () => void;
  onWithdraw?: () => void;
}

export function BalanceCard({
  balance = 15000,
  currency = 'Bs',
  onRecharge,
  onWithdraw,
}: BalanceCardProps) {
  const formattedBalance = balance.toLocaleString('es-VE', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  return (
    <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg p-8 shadow-lg">
      <div className="mb-6">
        <p className="text-sm opacity-90 mb-1">Saldo Disponible</p>
        <h2 className="text-4xl font-bold">
          {formattedBalance} {currency}
        </h2>
        <p className="text-xs opacity-75 mt-2">Actualizado hace unos momentos</p>
      </div>

      <div className="flex gap-3 pt-4 border-t border-white border-opacity-20">
        <Button
          variant="secondary"
          className="flex-1"
          onClick={onRecharge}
          asChild={!onRecharge}
        >
          {onRecharge ? (
            'Recargar'
          ) : (
            <Link href="/profile/balance">Recargar</Link>
          )}
        </Button>
        <Button
          variant="outline"
          className="flex-1 bg-transparent text-white border-white hover:bg-white hover:bg-opacity-20"
          onClick={onWithdraw}
          asChild={!onWithdraw}
        >
          {onWithdraw ? (
            'Retirar'
          ) : (
            <Link href="/profile/balance">Retirar</Link>
          )}
        </Button>
      </div>
    </div>
  );
}
