
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Package, CheckCircle, MessageCircle, Percent } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useQuery } from '@tanstack/react-query';

const BundleOffers = () => {
  const { data: bundles = [], isLoading, error } = useQuery({
    queryKey: ['bundles'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('bundles')
        .select('*')
        .order('popular', { ascending: false });
      
      if (error) throw error;
      return data;
    }
  });

  if (isLoading) {
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
            {[...Array(3)].map((_, index) => (
              <Card key={index} className="animate-pulse">
                <CardContent className="p-6">
                  <div className="h-32 bg-gray-200 rounded mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-16 px-4 bg-gradient-to-br from-green-50 to-blue-50">
        <div className="container mx-auto text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Unable to load bundles
          </h2>
          <p className="text-gray-600">Please try again later.</p>
        </div>
      </section>
    );
  }

  // Show only first 3 bundles for homepage
  const displayBundles = bundles.slice(0, 3);

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
          {displayBundles.map((bundle) => (
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
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{bundle.name_fr || bundle.name}</h3>
                  <p className="text-sm text-gray-600 mb-3">{bundle.description_fr || bundle.description}</p>
                  
                  {/* Multilingual names */}
                  <div className="text-xs text-gray-500 space-y-1 mb-4">
                    {bundle.name_ar && <p className="rtl">{bundle.name_ar}</p>}
                    {bundle.name && bundle.name !== bundle.name_fr && <p className="italic">{bundle.name}</p>}
                  </div>

                  {/* Pricing */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-center gap-2">
                      <span className="text-2xl font-bold text-primary">{bundle.bundle_price}</span>
                      <span className="text-lg text-gray-400 line-through">{bundle.original_price}</span>
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
                    {bundle.items.map((item: string, index: number) => (
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
