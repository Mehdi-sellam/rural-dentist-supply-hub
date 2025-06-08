
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { DollarSign, CreditCard, Headphones, Globe, MessageCircle } from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';

const HeroSection = () => {
  const { t } = useLanguage();

  return (
    <section className="dental-gradient py-16 px-4">
      <div className="container mx-auto">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Text content */}
          <div className="space-y-6">
            <div className="space-y-4">
              <h1 className="text-4xl md:text-5xl font-bold text-foreground leading-tight heading-professional">
                {t('hero.title')}
                <span className="text-primary block">{t('hero.subtitle')}</span>
              </h1>
              <p className="text-xl text-muted-foreground leading-relaxed text-professional">
                Équipements de qualité européenne et asiatique pour votre cabinet dentaire professionnel.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/shop">
                <Button size="lg" className="text-lg px-8 py-6 btn-professional">
                  {t('hero.cta')}
                </Button>
              </Link>
              <Button 
                variant="outline" 
                size="lg" 
                className="text-lg px-8 py-6 gap-2 border-border"
                onClick={() => window.open('https://wa.me/213XXXXXXXXX?text=Hello! I would like to place an order for dental supplies.', '_blank')}
              >
                <MessageCircle className="w-5 h-5" />
                {t('common.orderWhatsApp')}
              </Button>
            </div>

            {/* Professional pillars */}
            <div className="grid grid-cols-2 gap-4 mt-8">
              <Card className="p-4 text-center border-border bg-white/80 professional-shadow">
                <DollarSign className="w-8 h-8 text-primary mx-auto mb-2" />
                <p className="text-sm font-medium heading-professional">{t('hero.pillars.bestPrices')}</p>
                <p className="text-xs text-muted-foreground text-professional">Prix compétitifs</p>
              </Card>
              <Card className="p-4 text-center border-border bg-white/80 professional-shadow">
                <CreditCard className="w-8 h-8 text-primary mx-auto mb-2" />
                <p className="text-sm font-medium heading-professional">{t('hero.pillars.paymentPlans')}</p>
                <p className="text-xs text-muted-foreground text-professional">Facilités de paiement</p>
              </Card>
              <Card className="p-4 text-center border-border bg-white/80 professional-shadow">
                <Headphones className="w-8 h-8 text-primary mx-auto mb-2" />
                <p className="text-sm font-medium heading-professional">{t('hero.pillars.support')}</p>
                <p className="text-xs text-muted-foreground text-professional">Support dédié</p>
              </Card>
              <Card className="p-4 text-center border-border bg-white/80 professional-shadow">
                <Globe className="w-8 h-8 text-primary mx-auto mb-2" />
                <p className="text-sm font-medium heading-professional">{t('hero.pillars.sourced')}</p>
                <p className="text-xs text-muted-foreground text-professional">Qualité garantie</p>
              </Card>
            </div>
          </div>

          {/* Professional showcase */}
          <div className="relative">
            <div className="bg-white border border-border professional-shadow p-8">
              <div className="aspect-square bg-gradient-to-br from-muted to-secondary flex items-center justify-center mb-6">
                <div className="text-6xl">🦷</div>
              </div>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200">
                  <span className="text-sm font-medium text-professional">Kit Composite Premium</span>
                  <span className="text-primary font-bold text-professional">En Stock</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-blue-50 border border-blue-200">
                  <span className="text-sm font-medium text-professional">Instruments Chirurgicaux</span>
                  <span className="text-primary font-bold text-professional">Livraison Rapide</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200">
                  <span className="text-sm font-medium text-professional">Gants Jetables (Bulk)</span>
                  <span className="text-primary font-bold text-professional">Prix Dégressif</span>
                </div>
              </div>
            </div>
            
            {/* Professional testimonial */}
            <Card className="absolute -bottom-4 -left-4 p-4 bg-white professional-shadow max-w-xs border-border">
              <p className="text-sm italic text-professional">"Enfin des fournitures de qualité qui arrivent à temps dans notre clinique !"</p>
              <p className="text-xs text-muted-foreground mt-2 text-professional">- Dr. Amina K., Dentiste</p>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
