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
    <div className="bg-white border border-gray-200 rounded-lg p-8 shadow-sm">
      <div className="mb-6">
        <p className="text-sm text-gray-600 mb-1">Saldo Disponible</p>
        <h2 className="text-4xl font-bold text-gray-900">
          {formattedBalance} {currency}
        </h2>
        <p className="text-xs text-gray-500 mt-2">Actualizado hace unos momentos</p>
      </div>

      <div className="flex gap-3 pt-4 border-t border-gray-200">
        <Button
          variant="default"
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
          className="flex-1"
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
