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
        {/* TODO: TransactionTabs Component */}
        <div className="flex gap-4 border-b">
          <button 
            onClick={() => setTab('active')}
            className={`px-4 py-2 font-semibold ${tab === 'active' ? 'border-b-2 border-primary' : ''}`}
          >
            Activas
          </button>
          <button 
            onClick={() => setTab('completed')}
            className={`px-4 py-2 font-semibold ${tab === 'completed' ? 'border-b-2 border-primary' : ''}`}
          >
            Completadas
          </button>
          <button 
            onClick={() => setTab('cancelled')}
            className={`px-4 py-2 font-semibold ${tab === 'cancelled' ? 'border-b-2 border-primary' : ''}`}
          >
            Canceladas
          </button>
        </div>
      </section>

      {/* Transactions List */}
      <section>
        {/* TODO: TransactionList Component */}
        <div className="space-y-4">
          {/* TODO: TransactionCard Components */}
          <div className="bg-card rounded-lg p-6">Transaction Card Placeholder</div>
        </div>
      </section>
    </div>
  );
}
