
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
            {/* Logo and slogan */}
            <div className="space-y-2 mb-6">
              <div className="flex items-center justify-center md:justify-start space-x-3">
                <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center shadow-lg">
                  <span className="text-white font-bold text-xl">DG</span>
                </div>
                <span className="font-bold text-3xl text-primary">DentGo</span>
              </div>
              <p className="text-sm text-muted-foreground italic">
                "Votre partenaire de confiance pour l'excellence dentaire"
              </p>
            </div>

            <div className="space-y-4">
              <h1 className="text-4xl text-foreground leading-tight heading-professional md:text-5xl font-bold my-0 mx-0 py-0 px-0">
                Fournitures Dentaires Professionnelles
              </h1>
              <p className="text-muted-foreground leading-relaxed text-professional text-xl px-0">
                Équipements de qualité européenne et asiatique pour votre cabinet dentaire professionnel.
              </p>
            </div>

            <div className="flex flex-col gap-4 justify-center md:justify-start">
              <Link to="/shop">
                <Button size="lg" className="text-lg px-8 py-6 btn-professional w-full md:w-auto">
                  Découvrir nos produits
                </Button>
              </Link>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Button variant="outline" size="lg" className="text-sm px-4 py-3 gap-2 border-border" onClick={() => window.open('https://wa.me/213XXXXXXXXX?text=Bonjour! Je souhaiterais passer une commande de fournitures dentaires.', '_blank')}>
                  <MessageCircle className="w-4 h-4" />
                  Commander via WhatsApp
                </Button>
                <Button variant="outline" size="lg" className="text-sm px-4 py-3 gap-2 border-border" onClick={() => window.open('https://t.me/+213XXXXXXXXX?text=Bonjour! Je souhaiterais passer une commande de fournitures dentaires.', '_blank')}>
                  <Send className="w-4 h-4" />
                  Commander via Telegram
                </Button>
              </div>
            </div>
          </div>

          {/* Professional benefits cards */}
          <div className="flex justify-center">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-lg w-full">
              <Card className="p-4 text-center border-border bg-white/95 professional-shadow hover:shadow-lg transition-all duration-300">
                <DollarSign className="w-10 h-10 text-primary mx-auto mb-3" />
                <p className="text-sm font-bold heading-professional text-foreground mb-2">
                  Meilleurs Prix
                </p>
                <p className="text-xs text-muted-foreground text-professional leading-relaxed">
                  Prix compétitifs garantis sur tous nos produits de qualité
                </p>
              </Card>
              <Card className="p-4 text-center border-border bg-white/95 professional-shadow hover:shadow-lg transition-all duration-300">
                <CreditCard className="w-10 h-10 text-primary mx-auto mb-3" />
                <p className="text-sm font-bold heading-professional text-foreground mb-2">
                  Paiement Échelonné
                </p>
                <p className="text-xs text-muted-foreground text-professional leading-relaxed">
                  Facilités de paiement flexibles adaptées à votre cabinet
                </p>
              </Card>
              <Card className="p-4 text-center border-border bg-white/95 professional-shadow hover:shadow-lg transition-all duration-300">
                <Headphones className="w-10 h-10 text-primary mx-auto mb-3" />
                <p className="text-sm font-bold heading-professional text-foreground mb-2">
                  Support Client
                </p>
                <p className="text-xs text-muted-foreground text-professional leading-relaxed">
                  Support dédié 24/7 pour tous vos besoins professionnels
                </p>
              </Card>
              <Card className="p-4 text-center border-border bg-white/95 professional-shadow hover:shadow-lg transition-all duration-300">
                <Globe className="w-10 h-10 text-primary mx-auto mb-3" />
                <p className="text-sm font-bold heading-professional text-foreground mb-2">
                  Produits EU/Asie
                </p>
                <p className="text-xs text-muted-foreground text-professional leading-relaxed">
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
