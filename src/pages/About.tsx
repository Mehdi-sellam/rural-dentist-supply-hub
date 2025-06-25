
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { DollarSign, CreditCard, Headphones, Globe, MapPin, Phone } from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const About = () => {
  const { t } = useLanguage();

  // Scroll to top when component mounts
  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen">
      <Header />
      
      {/* Hero Section */}
      <section className="dental-gradient py-16 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6 heading-professional">
              {t('about.title')}
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed text-professional">
              Fournisseur professionnel d'équipements dentaires de qualité européenne et asiatique. 
              Nous croyons que chaque patient mérite des soins dentaires excellents, peu importe sa localisation.
            </p>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-foreground mb-6 heading-professional">{t('about.mission')}</h2>
              <p className="text-muted-foreground mb-4 leading-relaxed text-professional">
                Les dentistes en zones rurales font face à des défis uniques pour accéder aux fournitures dentaires de qualité. 
                Les longues distances, les fournisseurs limités et les services de livraison peu fiables peuvent compromettre les soins aux patients.
              </p>
              <p className="text-muted-foreground mb-6 leading-relaxed text-professional">
                DentGo comble cette lacune en fournissant une plateforme en ligne complète spécialement conçue 
                pour les professionnels dentaires dans les zones mal desservies. Nous nous assurons que la distance 
                ne compromet jamais la qualité des soins dentaires.
              </p>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4">
                  <div className="text-2xl font-bold text-primary heading-professional">48h</div>
                  <p className="text-sm text-muted-foreground text-professional">Livraison partout</p>
                </div>
                <div className="text-center p-4">
                  <div className="text-2xl font-bold text-primary heading-professional">500+</div>
                  <p className="text-sm text-muted-foreground text-professional">Produits disponibles</p>
                </div>
              </div>
            </div>
            <div className="dental-gradient p-8 text-center border border-border">
              <div className="text-6xl mb-4">🦷</div>
              <h3 className="text-xl font-bold mb-2 heading-professional">Soins de Qualité Partout</h3>
              <p className="text-muted-foreground text-professional">D'Alger aux villages les plus reculés</p>
            </div>
          </div>
        </div>
      </section>

      {/* 4 Pillars Section */}
      <section className="premium-gradient py-16 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4 heading-professional">Nos 4 Piliers</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto text-professional">
              Les fondements de notre excellence professionnelle
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="text-center border-border bg-white professional-shadow">
              <CardContent className="p-6">
                <DollarSign className="w-12 h-12 text-primary mx-auto mb-4" />
                <h3 className="font-bold mb-2 heading-professional">{t('common.bestPrices')}</h3>
                <p className="text-sm text-muted-foreground text-professional">
                  Prix compétitifs grâce à nos partenariats directs avec les fabricants européens et asiatiques
                </p>
              </CardContent>
            </Card>
            
            <Card className="text-center border-border bg-white professional-shadow">
              <CardContent className="p-6">
                <CreditCard className="w-12 h-12 text-primary mx-auto mb-4" />
                <h3 className="font-bold mb-2 heading-professional">{t('common.paymentPlans')}</h3>
                <p className="text-sm text-muted-foreground text-professional">
                  Options de paiement échelonné flexibles adaptées à votre budget professionnel
                </p>
              </CardContent>
            </Card>
            
            <Card className="text-center border-border bg-white professional-shadow">
              <CardContent className="p-6">
                <Headphones className="w-12 h-12 text-primary mx-auto mb-4" />
                <h3 className="font-bold mb-2 heading-professional">{t('common.customerSupport')}</h3>
                <p className="text-sm text-muted-foreground text-professional">
                  Assistance technique et commerciale 24/7 en français et anglais
                </p>
              </CardContent>
            </Card>
            
            <Card className="text-center border-border bg-white professional-shadow">
              <CardContent className="p-6">
                <Globe className="w-12 h-12 text-primary mx-auto mb-4" />
                <h3 className="font-bold mb-2 heading-professional">{t('common.euAsiaSourced')}</h3>
                <p className="text-sm text-muted-foreground text-professional">
                  Produits certifiés sourcés auprès de fabricants européens et asiatiques de confiance
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Coverage Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4 heading-professional">
              Service dans Toute l'Algérie
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto text-professional">
              Des grandes villes aux villages reculés, nous livrons partout
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="bg-blue-50 border-blue-200 border">
              <CardContent className="p-6 text-center">
                <MapPin className="w-8 h-8 text-blue-600 mx-auto mb-3" />
                <h3 className="font-bold mb-2 heading-professional">Nord de l'Algérie</h3>
                <p className="text-sm text-muted-foreground mb-3 text-professional">
                  Alger, Oran, Constantine et zones environnantes
                </p>
                <p className="text-xs text-blue-600 text-professional">Livraison 24-48h</p>
              </CardContent>
            </Card>
            
            <Card className="bg-green-50 border-green-200 border">
              <CardContent className="p-6 text-center">
                <MapPin className="w-8 h-8 text-green-600 mx-auto mb-3" />
                <h3 className="font-bold mb-2 heading-professional">Hauts Plateaux & Sud</h3>
                <p className="text-sm text-muted-foreground mb-3 text-professional">
                  Ouargla, Ghardaïa, Tamanrasset et régions reculées
                </p>
                <p className="text-xs text-green-600 text-professional">48h garanti</p>
              </CardContent>
            </Card>
            
            <Card className="bg-purple-50 border-purple-200 border">
              <CardContent className="p-6 text-center">
                <Phone className="w-8 h-8 text-purple-600 mx-auto mb-3" />
                <h3 className="font-bold mb-2 heading-professional">Zones Spéciales</h3>
                <p className="text-sm text-muted-foreground mb-3 text-professional">
                  Villages reculés, zones montagneuses, communautés du désert
                </p>
                <p className="text-xs text-purple-600 text-professional">Arrangements sur mesure</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default About;
