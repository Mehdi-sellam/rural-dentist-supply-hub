
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Truck, DollarSign, CreditCard, Headphones } from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';

const InfoSection = () => {
  const { t } = useLanguage();

  const features = [
    {
      icon: Truck,
      title: t('info.fastShipping'),
      description: t('info.fastShippingDesc'),
      gradient: 'from-blue-50 to-blue-100'
    },
    {
      icon: DollarSign,
      title: t('info.bestPrices'),
      description: t('info.bestPricesDesc'),
      gradient: 'from-green-50 to-green-100'
    },
    {
      icon: CreditCard,
      title: t('info.installmentPayment'),
      description: t('info.installmentDesc'),
      gradient: 'from-purple-50 to-purple-100'
    },
    {
      icon: Headphones,
      title: t('info.customerSupport'),
      description: t('info.supportDesc'),
      gradient: 'from-orange-50 to-orange-100'
    }
  ];

  return (
    <section className="py-16 px-4 bg-gradient-to-b from-white to-gray-50">
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4 heading-professional">
            {t('info.title')}
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto text-professional">
            DentGo s'engage à fournir les meilleurs services pour votre cabinet dentaire
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => {
            const IconComponent = feature.icon;
            return (
              <Card key={index} className="border-border professional-shadow hover:shadow-lg transition-shadow">
                <CardContent className={`p-8 text-center bg-gradient-to-br ${feature.gradient}`}>
                  <div className="mb-6">
                    <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                      <IconComponent className="w-8 h-8 text-primary" />
                    </div>
                    <h3 className="text-xl font-bold text-foreground mb-2 heading-professional">
                      {feature.title}
                    </h3>
                    <p className="text-muted-foreground text-professional text-sm">
                      {feature.description}
                    </p>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default InfoSection;
