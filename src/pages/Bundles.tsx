
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MessageCircle, CheckCircle, Star } from 'lucide-react';
import { bundles } from '@/data/products';
import { useCart } from '@/context/CartContext';
import { useLanguage } from '@/hooks/useLanguage';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const Bundles = () => {
  const { addBundle } = useCart();
  const { t } = useLanguage();

  const generateWhatsAppBundle = (bundle: any) => {
    const message = `Hello! I'm interested in the ${bundle.name} bundle for ${bundle.bundlePrice}. Please provide more details about availability and delivery.`;
    return `https://wa.me/213XXXXXXXXX?text=${encodeURIComponent(message)}`;
  };

  return (
    <div className="min-h-screen">
      <Header />
      
      {/* Hero Section */}
      <section className="luxury-gradient py-16 px-4">
        <div className="container mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 heading-luxury">
            {t('bundles.title')}
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto text-luxury">
            Complete kits for specific dental procedures. Save money and ensure you have everything needed.
          </p>
        </div>
      </section>

      <div className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {bundles.map((bundle) => (
            <Card key={bundle.id} className="overflow-hidden hover:shadow-xl transition-all duration-300 hover-lift">
              <CardContent className="p-0">
                {/* Bundle Header */}
                <div className="cream-gradient p-6 relative">
                  {bundle.popular && (
                    <Badge className="absolute top-4 right-4 bg-primary text-white">
                      Most Popular
                    </Badge>
                  )}
                  <div className="text-center">
                    <h3 className="text-2xl font-bold text-gray-900 mb-2 heading-luxury">{bundle.name}</h3>
                    <p className="text-gray-600 mb-4 text-luxury">{bundle.description}</p>
                    <div className="text-center mb-4">
                      <div className="text-3xl font-bold text-primary">{bundle.bundlePrice}</div>
                      <div className="text-lg text-gray-400 line-through">{bundle.originalPrice}</div>
                      <div className="text-green-600 font-bold">{t('bundles.save')} {bundle.savings}</div>
                    </div>
                  </div>
                </div>

                {/* Bundle Contents */}
                <div className="p-6">
                  <div className="mb-6">
                    <h4 className="font-bold mb-3 flex items-center gap-2 heading-luxury">
                      <CheckCircle className="w-5 h-5 text-green-500" />
                      {t('bundles.includes')}
                    </h4>
                    <ul className="space-y-2">
                      {bundle.items.map((item, index) => (
                        <li key={index} className="flex items-start gap-2 text-sm text-luxury">
                          <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Multilingual Names */}
                  <div className="text-xs text-gray-500 space-y-1 mb-6">
                    <p className="rtl text-luxury"><span className="font-medium">العربية:</span> {bundle.nameAr}</p>
                    <p className="italic text-luxury"><span className="font-medium">Français:</span> {bundle.nameFr}</p>
                  </div>

                  {/* Bundle Stats */}
                  <div className="flex justify-between items-center mb-6 text-sm">
                    <div className="text-center">
                      <div className="font-bold text-primary">{bundle.procedures}</div>
                      <div className="text-gray-600 text-luxury">Procedures</div>
                    </div>
                    <div className="text-center">
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                        ))}
                      </div>
                      <div className="text-gray-600 text-luxury">Rated</div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="space-y-3">
                    <Button 
                      className="w-full" 
                      size="lg"
                      onClick={() => addBundle(bundle)}
                    >
                      {t('common.addToCart')}
                    </Button>
                    <Button 
                      variant="outline" 
                      className="w-full gap-2"
                      onClick={() => window.open(generateWhatsAppBundle(bundle), '_blank')}
                    >
                      <MessageCircle className="w-4 h-4" />
                      {t('common.orderWhatsApp')}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Why Choose Bundles Section */}
        <section className="mt-16 cream-gradient rounded-2xl p-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 heading-luxury">Why Choose Our Bundles?</h2>
            <p className="text-gray-600 text-luxury">Designed specifically for busy dental practices</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center p-4">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="font-bold mb-2 heading-luxury">Cost Effective</h3>
              <p className="text-sm text-gray-600 text-luxury">Save up to 25% compared to individual purchases</p>
            </div>
            
            <div className="text-center p-4">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Star className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="font-bold mb-2 heading-luxury">Quality Assured</h3>
              <p className="text-sm text-gray-600 text-luxury">All items tested and approved by dental professionals</p>
            </div>
            
            <div className="text-center p-4">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <MessageCircle className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="font-bold mb-2 heading-luxury">Complete Solutions</h3>
              <p className="text-sm text-gray-600 text-luxury">Everything you need for specific procedures in one package</p>
            </div>
          </div>
        </section>

        {/* Link to catalog */}
        <div className="text-center mt-12">
          <Link to="/catalog">
            <Button variant="outline" size="lg" className="px-8">
              {t('common.viewAll')} Bundles in Catalog
            </Button>
          </Link>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Bundles;
