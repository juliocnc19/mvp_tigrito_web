'use client';

import React from 'react';
import { BalanceCard, CategoryGrid, ServiceCard, ProfessionalCard } from '@/components';
import { useServicePostings, useTransactions, useAuth, useActivePromotions } from '@/hooks';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function DashboardPage() {
  const { user } = useAuth();
  const { data: servicePostings, isLoading: servicesLoading } = useServicePostings({ limit: 6 });
  const { data: transactions, isLoading: transactionsLoading } = useTransactions({ limit: 5 });
  const { data: promotionsData, isLoading: promotionsLoading } = useActivePromotions();

  const userBalance = user?.balance || 0;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING_SOLICITUD':
        return 'bg-yellow-100 text-yellow-800';
      case 'SCHEDULED':
        return 'bg-blue-100 text-blue-800';
      case 'IN_PROGRESS':
        return 'bg-purple-100 text-purple-800';
      case 'COMPLETED':
        return 'bg-green-100 text-green-800';
      case 'CANCELED':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'PENDING_SOLICITUD':
        return 'Pendiente';
      case 'SCHEDULED':
        return 'Programado';
      case 'IN_PROGRESS':
        return 'En Progreso';
      case 'COMPLETED':
        return 'Completado';
      case 'CANCELED':
        return 'Cancelado';
      default:
        return status;
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      {/* Page Title */}
      <div>
        <h1 className="text-4xl font-bold mb-2">
          Bienvenido a UnTigrito
          {user?.name && `, ${user.name}`}
        </h1>
        <p className="text-gray-600">Encuentra los mejores servicios profesionales</p>
      </div>

      {/* Balance Section */}
      <section>
        <BalanceCard balance={userBalance} />
      </section>

      {/* Main Content Tabs */}
      <Tabs defaultValue="overview" className="space-y-6">
        

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-8">
          {/* Promotional Banners */}
          {promotionsLoading ? (
            <section className="bg-white border border-gray-200 rounded-lg p-8">
              <div className="h-20 bg-gray-100 rounded animate-pulse"></div>
            </section>
          ) : promotionsData?.data && promotionsData.data.length > 0 ? (
            <section className="space-y-4">
              {promotionsData.data.slice(0, 2).map((promo) => (
                <div key={promo.id} className="bg-white border border-gray-200 rounded-lg p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-xl font-bold mb-1 text-gray-900">¡Oferta Especial!</h2>
                      <p className="text-sm text-gray-600">
                        {promo.discountType === 'PERCENTAGE' 
                          ? `${promo.discountValue}% de descuento`
                          : `${promo.discountValue} Bs de descuento`
                        } con el código: <span className="font-bold text-blue-600">{promo.code}</span>
                      </p>
                      {promo.targetCategory && (
                        <p className="text-xs text-gray-500 mt-1">
                          Válido para: {promo.targetCategory}
                        </p>
                      )}
                    </div>
                    <Badge variant="secondary" className="bg-blue-50 text-blue-700 border-blue-200">
                      {promo.discountType === 'PERCENTAGE' ? `${promo.discountValue}%` : `${promo.discountValue} Bs`}
                    </Badge>
                  </div>
                </div>
              ))}
            </section>
          ) : (
            <section className="bg-white border border-gray-200 rounded-lg p-8">
              <h2 className="text-2xl font-bold mb-2 text-gray-900">¡Bienvenido a UnTigrito!</h2>
              <p className="text-gray-600">Encuentra los mejores servicios profesionales en tu área</p>
            </section>
          )}

          {/* Categories Section */}
          <section>
            <h2 className="text-2xl font-bold mb-4">Explorar Categorías</h2>
            <CategoryGrid columns={4} />
          </section>

          {/* Recent Services Section */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold">Servicios Disponibles</h2>
              <Link href="/services" className="text-blue-600 hover:underline text-sm">
                Ver más →
              </Link>
            </div>
            {servicesLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="h-48 w-full rounded-lg bg-gray-200 animate-pulse" />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {servicePostings?.servicePostings?.slice(0, 4).map((service) => (
                  <ServiceCard
                    key={service.id}
                    id={service.id}
                    title={service.title}
                    category={service.category}
                    description={service.description}
                    priceMin={service.priceMin || 0}
                    priceMax={service.priceMax || 0}
                    rating={4.5} // Default rating since it's not in the API response
                    reviewCount={0}
                    distance={0}
                    urgent={service.isUrgent}
                  />
                ))}
              </div>
            )}
          </section>

          {/* CTA Section */}
          <section className="bg-white border border-gray-200 rounded-lg p-6">
            <h3 className="text-xl font-bold mb-2 text-gray-900">¿Necesitas un servicio?</h3>
            <p className="text-gray-600 mb-4">
              Publica tu solicitud y recibe ofertas de profesionales verificados en minutos.
            </p>
            <Link
              href="/my-requests/create"
              className="inline-block px-6 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              Publicar Solicitud
            </Link>
          </section>
        </TabsContent>

        {/* Services Tab */}
        <TabsContent value="services" className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">Todos los Servicios</h2>
            <Link href="/services">
              <Button variant="outline">Ver todos</Button>
            </Link>
          </div>
          
          {servicesLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-48 w-full rounded-lg bg-gray-200 animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {servicePostings?.servicePostings?.map((service) => (
                <ServiceCard
                  key={service.id}
                  id={service.id}
                  title={service.title}
                  category={service.category}
                  description={service.description}
                  priceMin={service.priceMin || 0}
                  priceMax={service.priceMax || 0}
                  rating={4.5}
                  reviewCount={0}
                  distance={0}
                  urgent={service.isUrgent}
                />
              ))}
            </div>
          )}
        </TabsContent>

        {/* Transactions Tab */}
        <TabsContent value="transactions" className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">Historial de Transacciones</h2>
            <Link href="/transactions">
              <Button variant="outline">Ver todas</Button>
            </Link>
          </div>
          
          {transactionsLoading ? (
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-20 w-full rounded-lg bg-gray-200 animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {transactions?.transactions?.map((transaction) => (
                <Card key={transaction.id}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-semibold">
                            {transaction.servicePosting?.title || transaction.professionalService?.title || 'Servicio'}
                          </h3>
                          <Badge className={getStatusColor(transaction.currentStatus)}>
                            {getStatusText(transaction.currentStatus)}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600 mb-1">
                          {transaction.servicePosting?.description || transaction.professionalService?.description}
                        </p>
                        <p className="text-sm text-gray-500">
                          Precio acordado: Bs. {transaction.agreedPrice.toLocaleString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-500">
                          {new Date(transaction.createdAt).toLocaleDateString()}
                        </p>
                        <Link href={`/transactions/${transaction.id}`}>
                          <Button variant="outline" size="sm">
                            Ver detalles
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        {/* My Postings Tab */}
        <TabsContent value="my-postings" className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">Mis Publicaciones</h2>
            <Link href="/my-requests">
              <Button>Gestionar Solicitudes</Button>
            </Link>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Gestiona tus solicitudes de servicio</CardTitle>
              <CardDescription>
                Aquí puedes ver y gestionar todas las solicitudes de servicio que has publicado
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <p className="text-gray-500 mb-4">
                  Ve a la sección de "Mis Solicitudes" para gestionar tus publicaciones
                </p>
                <Link href="/my-requests">
                  <Button>Ir a Mis Solicitudes</Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}