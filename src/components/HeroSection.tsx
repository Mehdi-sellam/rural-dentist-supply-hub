
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { DollarSign, CreditCard, Headphones, Globe, MessageCircle, Send } from 'lucide-react';

const HeroSection = () => {
  return (
    <section className="dental-gradient py-16 px-4">
      <div className="container mx-auto">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Text content */}
          <div className="space-y-6 text-center md:text-left">
            <div className="space-y-4">
              <h1 className="text-4xl text-foreground leading-tight heading-professional md:text-5xl font-bold my-0 mx-0 py-0 px-0">
                Fournitures Dentaires Professionnelles
              </h1>
              <span className="text-primary text-2xl md:text-3xl font-semibold block heading-professional">
                Équipements de qualité européenne et asiatique pour votre cabinet dentaire
              </span>
              <p className="text-muted-foreground leading-relaxed text-professional text-xl px-0">
                Équipements de qualité européenne et asiatique pour votre cabinet dentaire professionnel.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
              <Link to="/shop">
                <Button size="lg" className="text-lg px-8 py-6 btn-professional">
                  Découvrir nos produits
                </Button>
              </Link>
              <div className="flex gap-2">
                <Button variant="outline" size="lg" className="text-lg px-6 py-6 gap-2 border-border flex-1" onClick={() => window.open('https://wa.me/213XXXXXXXXX?text=Bonjour! Je souhaiterais passer une commande de fournitures dentaires.', '_blank')}>
                  <MessageCircle className="w-5 h-5" />
                  Commander via WhatsApp
                </Button>
                <Button variant="outline" size="lg" className="text-lg px-6 py-6 gap-2 border-border flex-1" onClick={() => window.open('https://t.me/+213XXXXXXXXX?text=Bonjour! Je souhaiterais passer une commande de fournitures dentaires.', '_blank')}>
                  <Send className="w-5 h-5" />
                  Commander via Telegram
                </Button>
              </div>
            </div>
          </div>

          {/* Professional benefits cards - centered properly */}
          <div className="flex justify-center">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-2xl">
              <Card className="p-6 text-center border-border bg-white/95 professional-shadow hover:shadow-lg transition-all duration-300 flex-1 min-h-[160px] flex flex-col justify-center">
                <DollarSign className="w-12 h-12 text-primary mx-auto mb-4" />
                <p className="text-base font-bold heading-professional text-foreground mb-2">
                  Meilleurs Prix
                </p>
                <p className="text-sm text-muted-foreground text-professional leading-relaxed">
                  Prix compétitifs garantis sur tous nos produits de qualité
                </p>
              </Card>
              <Card className="p-6 text-center border-border bg-white/95 professional-shadow hover:shadow-lg transition-all duration-300 flex-1 min-h-[160px] flex flex-col justify-center">
                <CreditCard className="w-12 h-12 text-primary mx-auto mb-4" />
                <p className="text-base font-bold heading-professional text-foreground mb-2">
                  Paiement Échelonné
                </p>
                <p className="text-sm text-muted-foreground text-professional leading-relaxed">
                  Facilités de paiement flexibles adaptées à votre cabinet
                </p>
              </Card>
              <Card className="p-6 text-center border-border bg-white/95 professional-shadow hover:shadow-lg transition-all duration-300 flex-1 min-h-[160px] flex flex-col justify-center">
                <Headphones className="w-12 h-12 text-primary mx-auto mb-4" />
                <p className="text-base font-bold heading-professional text-foreground mb-2">
                  Support Client
                </p>
                <p className="text-sm text-muted-foreground text-professional leading-relaxed">
                  Support dédié 24/7 pour tous vos besoins professionnels
                </p>
              </Card>
              <Card className="p-6 text-center border-border bg-white/95 professional-shadow hover:shadow-lg transition-all duration-300 flex-1 min-h-[160px] flex flex-col justify-center">
                <Globe className="w-12 h-12 text-primary mx-auto mb-4" />
                <p className="text-base font-bold heading-professional text-foreground mb-2">
                  Produits EU/Asie
                </p>
                <p className="text-sm text-muted-foreground text-professional leading-relaxed">
                  Qualité européenne et asiatique certifiée pour votre pratique
                </p>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
