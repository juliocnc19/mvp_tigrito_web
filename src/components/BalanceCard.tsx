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
    <div className="bg-card border border-border rounded-lg p-8 shadow-sm">
      <div className="mb-6">
        <p className="text-sm text-[var(--color-neutral-text-secondary)] mb-1">Saldo Disponible</p>
        <h2 className="text-4xl font-bold text-[var(--color-neutral-text)]">
          {formattedBalance} {currency}
        </h2>
        <p className="text-xs text-[var(--color-neutral-text-tertiary)] mt-2">Actualizado hace unos momentos</p>
      </div>

      <div className="flex gap-3 pt-4 border-t border-border">
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
