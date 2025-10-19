'use client';

import React, { useState } from 'react';

export default function TransactionsPage() {
  // TODO: 3.1.1 - TransactionTabs Component
  // TODO: 3.1.2 - TransactionCard Component
  // TODO: 3.1.3 - TransactionList Component

  const [tab, setTab] = useState<'active' | 'completed' | 'cancelled'>('active');

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Mis Transacciones</h1>

      {/* Tabs */}
      <section className="mb-6">
        <div className="flex gap-4 border-b">
          <button 
            onClick={() => setTab('active')}
            className={`px-4 py-3 font-semibold border-b-2 transition-colors ${
              tab === 'active'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            Activas
          </button>
          <button 
            onClick={() => setTab('completed')}
            className={`px-4 py-3 font-semibold border-b-2 transition-colors ${
              tab === 'completed'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            Completadas
          </button>
          <button 
            onClick={() => setTab('cancelled')}
            className={`px-4 py-3 font-semibold border-b-2 transition-colors ${
              tab === 'cancelled'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            Canceladas
          </button>
        </div>
      </section>

      {/* Transactions List */}
      <section>
        <div className="space-y-4">
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <p className="text-gray-600">Transaction Card Placeholder</p>
          </div>
        </div>
      </section>
    </div>
  );
}
