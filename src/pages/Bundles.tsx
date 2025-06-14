
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ShoppingCart, Package, Check, Crown } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { supabase } from '@/integrations/supabase/client';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { toast } from 'sonner';

interface Bundle {
  id: string;
  name: string;
  name_ar?: string;
  name_fr?: string;
  description?: string;
  description_ar?: string;
  description_fr?: string;
  items: string[];
  original_price: string;
  bundle_price: string;
  savings?: string;
  procedures?: string;
  popular?: boolean;
}

const Bundles = () => {
  const { addBundle } = useCart();
  const [bundles, setBundles] = useState<Bundle[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBundles();
  }, []);

  const fetchBundles = async () => {
    try {
      const { data, error } = await supabase
        .from('bundles')
        .select('*')
        .order('popular', { ascending: false });

      if (error) {
        console.error('Error fetching bundles:', error);
        toast.error('Erreur lors du chargement des kits');
        return;
      }

      setBundles(data || []);
    } catch (error) {
      console.error('Error:', error);
      toast.error('Erreur lors du chargement des kits');
    } finally {
      setLoading(false);
    }
  };

  const handleAddBundle = (bundle: Bundle) => {
    const cartBundle = {
      id: bundle.id,
      name: bundle.name_fr || bundle.name,
      nameAr: bundle.name_ar || '',
      nameFr: bundle.name_fr || bundle.name,
      bundlePrice: bundle.bundle_price,
      originalPrice: bundle.original_price,
      items: bundle.items,
      quantity: 1,
      type: 'bundle' as const
    };
    
    addBundle(cartBundle);
    toast.success(`${bundle.name_fr || bundle.name} ajouté au panier`);
  };

  if (loading) {
    return (
      <div className="min-h-screen">
        <Header />
        <div className="container mx-auto px-4 py-16 text-center">
          <p>Chargement des kits...</p>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Header />
      
      <section className="py-16 bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Kits Exclusifs
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Économisez plus avec nos kits soigneusement sélectionnés pour votre pratique dentaire
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {bundles.map((bundle) => (
              <Card key={bundle.id} className={`relative overflow-hidden transition-all duration-300 hover:shadow-xl ${bundle.popular ? 'ring-2 ring-primary' : ''}`}>
                {bundle.popular && (
                  <div className="absolute top-0 right-0 bg-primary text-white px-4 py-2 rounded-bl-lg">
                    <Crown className="w-4 h-4 inline mr-1" />
                    Populaire
                  </div>
                )}
                
                <CardHeader className="pb-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Package className="w-6 h-6 text-primary" />
                    <CardTitle className="text-xl">{bundle.name_fr || bundle.name}</CardTitle>
                  </div>
                  
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-bold text-primary">{bundle.bundle_price}</span>
                    <span className="text-lg text-gray-400 line-through">{bundle.original_price}</span>
                  </div>
                  
                  {bundle.savings && (
                    <Badge variant="secondary" className="w-fit">
                      Économie: {bundle.savings}
                    </Badge>
                  )}
                </CardHeader>
                
                <CardContent className="space-y-4">
                  {(bundle.description_fr || bundle.description) && (
                    <p className="text-gray-600">{bundle.description_fr || bundle.description}</p>
                  )}
                  
                  <div>
                    <h4 className="font-semibold mb-2">Inclus dans ce kit:</h4>
                    <ul className="space-y-1">
                      {bundle.items.map((item, index) => (
                        <li key={index} className="flex items-center gap-2 text-sm">
                          <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  {bundle.procedures && (
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <span className="text-sm text-gray-600">
                        Idéal pour {bundle.procedures} procédures
                      </span>
                    </div>
                  )}
                  
                  <Button 
                    onClick={() => handleAddBundle(bundle)}
                    className="w-full gap-2"
                    size="lg"
                  >
                    <ShoppingCart className="w-4 h-4" />
                    Ajouter au Panier
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
          
          {bundles.length === 0 && (
            <div className="text-center py-16">
              <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">Aucun kit disponible</h3>
              <p className="text-gray-500">Les kits seront bientôt disponibles.</p>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Bundles;
