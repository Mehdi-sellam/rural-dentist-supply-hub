
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Package, CheckCircle, MessageCircle, Percent } from 'lucide-react';

const BundleOffers = () => {
  const bundles = [
    {
      id: 1,
      name: 'Complete Cavity Kit',
      nameAr: 'مجموعة علاج التسوس الكاملة',
      nameFr: 'Kit carie complet',
      description: 'Everything needed for cavity treatment',
      items: [
        'Composite filling materials (3 shades)',
        'Bonding agent',
        'Etching gel',
        'Disposable brushes',
        'Curing light tips'
      ],
      originalPrice: '24,500 DZD',
      bundlePrice: '18,900 DZD',
      savings: '5,600 DZD',
      procedures: '20+ procedures',
      popular: true
    },
    {
      id: 2,
      name: 'Surgical Starter Pack',
      nameAr: 'حزمة الجراحة للمبتدئين',
      nameFr: 'Pack chirurgie débutant',
      description: 'Essential tools for minor oral surgery',
      items: [
        'Extraction forceps set',
        'Surgical scissors',
        'Tissue forceps',
        'Suture materials',
        'Sterile gloves (50 pairs)'
      ],
      originalPrice: '19,800 DZD',
      bundlePrice: '15,200 DZD',
      savings: '4,600 DZD',
      procedures: '15+ procedures',
      popular: false
    },
    {
      id: 3,
      name: 'Monthly Essentials',
      nameAr: 'الأساسيات الشهرية',
      nameFr: 'Essentiels mensuels',
      description: 'Monthly supply of consumables',
      items: [
        'Disposable gloves (500 pieces)',
        'Face masks (100 pieces)',
        'Surface disinfectant',
        'Impression materials',
        'Cotton rolls & pellets'
      ],
      originalPrice: '8,900 DZD',
      bundlePrice: '7,200 DZD',
      savings: '1,700 DZD',
      procedures: 'Month supply',
      popular: false
    }
  ];

  return (
    <section className="py-16 px-4 bg-gradient-to-br from-green-50 to-blue-50">
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Package className="w-8 h-8 text-primary" />
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
              Procedure Bundles
            </h2>
          </div>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Save time and money with our curated procedure kits
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {bundles.map((bundle) => (
            <Card 
              key={bundle.id} 
              className={`relative overflow-hidden transition-all duration-300 hover:shadow-xl ${
                bundle.popular ? 'ring-2 ring-primary scale-105' : ''
              }`}
            >
              {bundle.popular && (
                <div className="absolute top-0 left-0 right-0 bg-primary text-white text-center py-2 text-sm font-medium">
                  🏆 Most Popular Choice
                </div>
              )}
              
              <CardContent className={`p-6 ${bundle.popular ? 'pt-14' : ''}`}>
                {/* Bundle Header */}
                <div className="text-center mb-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{bundle.name}</h3>
                  <p className="text-sm text-gray-600 mb-3">{bundle.description}</p>
                  
                  {/* Multilingual names */}
                  <div className="text-xs text-gray-500 space-y-1 mb-4">
                    <p className="rtl">{bundle.nameAr}</p>
                    <p className="italic">{bundle.nameFr}</p>
                  </div>

                  {/* Pricing */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-center gap-2">
                      <span className="text-2xl font-bold text-primary">{bundle.bundlePrice}</span>
                      <span className="text-lg text-gray-400 line-through">{bundle.originalPrice}</span>
                    </div>
                    <Badge className="bg-green-100 text-green-800 border-green-200">
                      <Percent className="w-3 h-3 mr-1" />
                      Save {bundle.savings}
                    </Badge>
                    <p className="text-xs text-gray-600">{bundle.procedures}</p>
                  </div>
                </div>

                {/* Items List */}
                <div className="space-y-3 mb-6">
                  <h4 className="font-medium text-gray-900 text-sm">Includes:</h4>
                  <ul className="space-y-2">
                    {bundle.items.map((item, index) => (
                      <li key={index} className="flex items-start gap-2 text-sm">
                        <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Action Buttons */}
                <div className="space-y-3">
                  <Button 
                    className={`w-full ${
                      bundle.popular 
                        ? 'bg-primary hover:bg-primary/90' 
                        : ''
                    }`}
                    size="lg"
                  >
                    Add Bundle to Cart
                  </Button>
                  <Button variant="outline" className="w-full gap-2" size="sm">
                    <MessageCircle className="w-4 h-4" />
                    Order via WhatsApp
                  </Button>
                </div>

                {/* Additional info */}
                <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                  <p className="text-xs text-blue-800 text-center">
                    ✨ Perfect for rural clinics • Ready to ship • Quality guaranteed
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <Button variant="outline" size="lg" className="px-8">
            View All Bundles
          </Button>
        </div>
      </div>
    </section>
  );
};

export default BundleOffers;
