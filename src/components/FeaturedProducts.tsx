
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { DollarSign, CreditCard, Headphones, Truck } from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';

const InfoSection = () => {
  const { t } = useLanguage();

  return (
    <section className="py-16 px-4 premium-gradient">
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4 heading-professional">
            Pourquoi Choisir DentGo ?
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto text-professional">
            Des solutions professionnelles adaptées à votre pratique dentaire
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          <Card className="text-center border-border bg-white professional-shadow hover:sharp-shadow transition-all duration-200">
            <CardContent className="p-8">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <Truck className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-3 heading-professional">
                {t('common.fastShipping')}
              </h3>
              <p className="text-muted-foreground text-professional">
                Livraison rapide dans toute l'Algérie, même en zones rurales
              </p>
            </CardContent>
          </Card>

          <Card className="text-center border-border bg-white professional-shadow hover:sharp-shadow transition-all duration-200">
            <CardContent className="p-8">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <DollarSign className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-3 heading-professional">
                {t('common.bestPrices')}
              </h3>
              <p className="text-muted-foreground text-professional">
                Prix compétitifs grâce à nos partenariats directs avec les fabricants
              </p>
            </CardContent>
          </Card>

          <Card className="text-center border-border bg-white professional-shadow hover:sharp-shadow transition-all duration-200">
            <CardContent className="p-8">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <CreditCard className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-3 heading-professional">
                {t('common.installmentPayment')}
              </h3>
              <p className="text-muted-foreground text-professional">
                Options de paiement échelonné adaptées à votre budget
              </p>
            </CardContent>
          </Card>

          <Card className="text-center border-border bg-white professional-shadow hover:sharp-shadow transition-all duration-200">
            <CardContent className="p-8">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <Headphones className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-3 heading-professional">
                {t('common.customerSupport')}
              </h3>
              <p className="text-muted-foreground text-professional">
                Support technique et commercial disponible 24/7
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="text-center mt-12">
          <Link to="/shop">
            <Button size="lg" className="px-8 btn-professional">
              {t('common.viewAll')} Nos Produits
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default InfoSection;
