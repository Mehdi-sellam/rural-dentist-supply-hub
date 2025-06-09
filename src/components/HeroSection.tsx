import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { DollarSign, CreditCard, Headphones, Globe, MessageCircle, Send } from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';
const HeroSection = () => {
  const {
    t
  } = useLanguage();
  return <section className="dental-gradient py-16 px-4">
      <div className="container mx-auto">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Text content */}
          <div className="space-y-6">
            <div className="space-y-4">
              <h1 className="text-4xl text-foreground leading-tight heading-professional md:text-5xl font-bold my-0 mx-0 py-0 px-0">
                {t('hero.title')}
              </h1>
              <span className="text-primary text-2xl md:text-3xl font-semibold block heading-professional">
                {t('hero.subtitle')}
              </span>
              <p className="text-muted-foreground leading-relaxed text-professional text-xl px-0">
                {t('hero.description')}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/shop">
                <Button size="lg" className="text-lg px-8 py-6 btn-professional">
                  {t('hero.cta')}
                </Button>
              </Link>
              <div className="flex gap-2">
                <Button variant="outline" size="lg" className="text-lg px-6 py-6 gap-2 border-border flex-1" onClick={() => window.open('https://wa.me/213XXXXXXXXX?text=Hello! I would like to place an order for dental supplies.', '_blank')}>
                  <MessageCircle className="w-5 h-5" />
                  {t('common.orderWhatsApp')}
                </Button>
                <Button variant="outline" size="lg" className="text-lg px-6 py-6 gap-2 border-border flex-1" onClick={() => window.open('https://t.me/+213XXXXXXXXX?text=Hello! I would like to place an order for dental supplies.', '_blank')}>
                  <Send className="w-5 h-5" />
                  {t('common.orderTelegram')}
                </Button>
              </div>
            </div>

            {/* Professional benefits cards - Updated with full width grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
              <Card className="p-4 text-center border-border bg-white/90 professional-shadow flex-1">
                <DollarSign className="w-8 h-8 text-primary mx-auto mb-2" />
                <p className="text-sm font-semibold heading-professional text-foreground mb-1">
                  {t('hero.pillars.bestPrices')}
                </p>
                <p className="text-xs text-muted-foreground text-professional">
                  {t('hero.pillars.pricesDesc')}
                </p>
              </Card>
              <Card className="p-4 text-center border-border bg-white/90 professional-shadow flex-1">
                <CreditCard className="w-8 h-8 text-primary mx-auto mb-2" />
                <p className="text-sm font-semibold heading-professional text-foreground mb-1">
                  {t('hero.pillars.paymentPlans')}
                </p>
                <p className="text-xs text-muted-foreground text-professional">
                  {t('hero.pillars.paymentDesc')}
                </p>
              </Card>
              <Card className="p-4 text-center border-border bg-white/90 professional-shadow flex-1">
                <Headphones className="w-8 h-8 text-primary mx-auto mb-2" />
                <p className="text-sm font-semibold heading-professional text-foreground mb-1">
                  {t('hero.pillars.support')}
                </p>
                <p className="text-xs text-muted-foreground text-professional">
                  {t('hero.pillars.supportDesc')}
                </p>
              </Card>
              <Card className="p-4 text-center border-border bg-white/90 professional-shadow flex-1">
                <Globe className="w-8 h-8 text-primary mx-auto mb-2" />
                <p className="text-sm font-semibold heading-professional text-foreground mb-1">
                  {t('hero.pillars.sourced')}
                </p>
                <p className="text-xs text-muted-foreground text-professional">
                  {t('hero.pillars.sourcedDesc')}
                </p>
              </Card>
            </div>
          </div>

          {/* Professional showcase - improved layout */}
          <div className="relative flex items-center justify-center">
            
          </div>
        </div>
      </div>
    </section>;
};
export default HeroSection;