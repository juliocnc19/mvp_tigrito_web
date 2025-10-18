'use client';

import React, { useState } from 'react';

export default function BalancePage() {
  // TODO: 3.2.1 - BalanceCard Component
  // TODO: 3.2.2 - PaymentMethods Component
  // TODO: 3.2.3 - RechargeForm Component
  // TODO: 3.2.4 - WithdrawalForm Component

  const [action, setAction] = useState<'view' | 'recharge' | 'withdraw'>('view');

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <h1 className="text-3xl font-bold mb-8">Saldo y Pagos</h1>

      {/* Balance Display */}
      <section className="bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg p-8 mb-8">
        {/* TODO: BalanceCard Component */}
        <p className="text-sm opacity-90 mb-2">Saldo Disponible</p>
        <h2 className="text-4xl font-bold">15,000.00 Bs</h2>
        <p className="text-sm opacity-90 mt-2">Última actualización: hoy a las 2:30 PM</p>
      </section>

      {/* Action Buttons */}
      <section className="grid grid-cols-2 gap-4 mb-8">
        <button
          onClick={() => setAction('recharge')}
          className="px-6 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700"
        >
          + Recargar
        </button>
        <button
          onClick={() => setAction('withdraw')}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700"
        >
          Retirar
        </button>
      </section>

      {/* Content Based on Action */}
      {action === 'view' && (
        <section>
          {/* TODO: PaymentHistory Component */}
          <h3 className="text-xl font-semibold mb-4">Historial Reciente</h3>
          <div className="space-y-3">
            <div className="bg-card rounded-lg p-4 flex justify-between items-center">
              <div>
                <p className="font-semibold">Recargo Inicial</p>
                <p className="text-sm text-gray-600">15 de enero, 2025</p>
              </div>
              <p className="font-semibold text-green-600">+ 15,000.00 Bs</p>
            </div>
          </div>
        </section>
      )}

      {action === 'recharge' && (
        <section className="bg-card rounded-lg p-6">
          {/* TODO: RechargeForm Component */}
          <h3 className="text-xl font-semibold mb-4">Recargar Saldo</h3>
          <form className="space-y-4">
            <div>
              <label className="block font-semibold mb-2">Monto a Recargar</label>
              <div className="flex">
                <span className="px-4 py-2 bg-gray-100 border rounded-l-lg">Bs</span>
                <input
                  type="number"
                  placeholder="Ingresa el monto"
                  className="flex-1 px-4 py-2 border rounded-r-lg"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold mb-2">Método de Pago</label>
              {/* TODO: PaymentMethods Component */}
              <select className="w-full px-4 py-2 border rounded-lg">
                <option>Selecciona un método</option>
                <option>Transferencia Bancaria</option>
                <option>Pago Móvil</option>
                <option>Cuenta UnTigrito</option>
              </select>
            </div>

            <button
              type="submit"
              className="w-full px-6 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700"
            >
              Continuar con Pago
            </button>
          </form>
        </section>
      )}

      {action === 'withdraw' && (
        <section className="bg-card rounded-lg p-6">
          {/* TODO: WithdrawalForm Component */}
          <h3 className="text-xl font-semibold mb-4">Retirar Saldo</h3>
          <form className="space-y-4">
            <div>
              <label className="block font-semibold mb-2">Monto a Retirar</label>
              <div className="flex">
                <span className="px-4 py-2 bg-gray-100 border rounded-l-lg">Bs</span>
                <input
                  type="number"
                  placeholder="Ingresa el monto"
                  className="flex-1 px-4 py-2 border rounded-r-lg"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold mb-2">Cuenta de Destino</label>
              {/* TODO: PaymentMethods Component */}
              <select className="w-full px-4 py-2 border rounded-lg">
                <option>Selecciona una cuenta</option>
                <option>Transferencia Bancaria</option>
                <option>Pago Móvil</option>
              </select>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 text-sm">
              <p className="font-semibold text-yellow-800">Nota:</p>
              <p className="text-yellow-700">Los retiros se procesan en 2-3 días hábiles.</p>
            </div>

            <button
              type="submit"
              className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700"
            >
              Solicitar Retiro
            </button>
          </form>
        </section>
      )}
    </div>
  );
}
