'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  MapPin, 
  Clock, 
  DollarSign, 
  User, 
  Star, 
  Eye, 
  MessageCircle,
  AlertCircle,
  Calendar,
  Users
} from 'lucide-react';

interface Posting {
  id: string;
  title: string;
  description: string;
  category: string;
  location: string;
  distance: number;
  priceMin: number;
  priceMax: number;
  requiredFrom: string;
  requiredTo: string;
  urgent: boolean;
  clientName: string;
  clientRating: number;
  offersCount: number;
  createdAt: string;
  media: string[];
}

interface ProfessionalPostingCardProps {
  posting: Posting;
  onOffer: () => void;
  onViewDetails: () => void;
}

export function ProfessionalPostingCard({ 
  posting, 
  onOffer, 
  onViewDetails 
}: ProfessionalPostingCardProps) {
  const [showOfferForm, setShowOfferForm] = useState(false);
  const [offerAmount, setOfferAmount] = useState('');

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-VE', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatPrice = (amount: number) => {
    return new Intl.NumberFormat('es-VE', {
      style: 'currency',
      currency: 'VES',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const handleOfferSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (offerAmount && parseFloat(offerAmount) >= posting.priceMin) {
      onOffer();
      setShowOfferForm(false);
      setOfferAmount('');
    }
  };

  return (
    <Card className="hover:shadow-md transition-shadow duration-200">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <h3 className="text-lg font-semibold text-gray-900 line-clamp-1">
                {posting.title}
              </h3>
              {posting.urgent && (
                <Badge variant="destructive" className="flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  Urgente
                </Badge>
              )}
            </div>
            <p className="text-sm text-gray-600 line-clamp-2 mb-2">
              {posting.description}
            </p>
            <div className="flex items-center gap-4 text-sm text-gray-500">
              <span className="flex items-center gap-1">
                <MapPin className="h-4 w-4" />
                {posting.distance} km
              </span>
              <span className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                {formatDate(posting.requiredFrom)}
              </span>
              <span className="flex items-center gap-1">
                <Users className="h-4 w-4" />
                {posting.offersCount} ofertas
              </span>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        <div className="space-y-4">
          {/* Category and Location */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Badge variant="outline">{posting.category}</Badge>
              <span className="text-sm text-gray-600">{posting.location}</span>
            </div>
            <div className="text-right">
              <div className="text-lg font-semibold text-green-600">
                {formatPrice(posting.priceMin)} - {formatPrice(posting.priceMax)}
              </div>
              <div className="text-xs text-gray-500">Rango de precio</div>
            </div>
          </div>

          {/* Client Info */}
          <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
              <User className="h-4 w-4 text-white" />
            </div>
            <div className="flex-1">
              <div className="font-medium text-sm">{posting.clientName}</div>
              <div className="flex items-center gap-1 text-xs text-gray-500">
                <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                <span>{posting.clientRating}</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={onViewDetails}
              className="flex-1 flex items-center gap-2"
            >
              <Eye className="h-4 w-4" />
              Ver Detalles
            </Button>
            <Button
              onClick={() => setShowOfferForm(!showOfferForm)}
              className="flex-1 flex items-center gap-2"
            >
              <MessageCircle className="h-4 w-4" />
              Ofertar
            </Button>
          </div>

          {/* Offer Form */}
          {showOfferForm && (
            <form onSubmit={handleOfferSubmit} className="p-4 bg-blue-50 rounded-lg space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tu oferta (mínimo: {formatPrice(posting.priceMin)})
                </label>
                <div className="flex gap-2">
                  <div className="flex-1">
                    <input
                      type="number"
                      value={offerAmount}
                      onChange={(e) => setOfferAmount(e.target.value)}
                      placeholder="Ingresa tu oferta"
                      min={posting.priceMin}
                      max={posting.priceMax}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                      required
                    />
                  </div>
                  <Button type="submit" size="sm">
                    Enviar
                  </Button>
                </div>
              </div>
              <div className="text-xs text-gray-600">
                💡 Tip: Las ofertas más competitivas tienen mayor probabilidad de ser aceptadas
              </div>
            </form>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
