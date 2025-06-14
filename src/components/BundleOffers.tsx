
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ShoppingCart, Package, Check, Crown, MessageCircle } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { supabase } from '@/integrations/supabase/client';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';

const BundleOffers = () => {
  const { addBundle } = useCart();
  const [bundles, setBundles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBundles();
  }, []);

  const fetchBundles = async () => {
    try {
      const { data, error } = await supabase
        .from('bundles')
        .select('*')
        .eq('popular', true)
        .limit(3);

      if (error) {
        console.error('Error fetching bundles:', error);
        return;
      }

      setBundles(data || []);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddBundle = (bundle: any) => {
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

  const handleWhatsAppOrder = (bundle: any) => {
    const message = `Bonjour! Je souhaiterais commander le kit: ${bundle.name_fr || bundle.name} - Prix: ${bundle.bundle_price}`;
    window.open(`https://wa.me/213XXXXXXXXX?text=${encodeURIComponent(message)}`, '_blank');
  };

  if (loading) {
    return (
      <section className="py-16 px-4 bg-white">
        <div className="container mx-auto text-center">
          <p>Chargement des kits...</p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 px-4 bg-white">
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Kits de Procédures
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Économisez du temps et de l'argent avec nos kits de procédures soigneusement sélectionnés
          </p>
        </div>

        <div className="grid md:grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {bundles.map((bundle) => (
            <Card key={bundle.id} className="relative overflow-hidden transition-all duration-300 hover:shadow-xl ring-2 ring-primary">
              <div className="absolute top-0 right-0 bg-primary text-white px-4 py-2 rounded-bl-lg">
                <Crown className="w-4 h-4 inline mr-1" />
                Populaire
              </div>
              
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
                {bundle.description_fr && (
                  <p className="text-gray-600">{bundle.description_fr}</p>
                )}
                
                <div>
                  <h4 className="font-semibold mb-2">Inclus:</h4>
                  <ul className="space-y-1">
                    {bundle.items.map((item: string, index: number) => (
                      <li key={index} className="flex items-center gap-2 text-sm">
                        <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div className="bg-gray-50 p-3 rounded-lg">
                  <span className="text-sm text-gray-600">
                    Idéal pour {bundle.procedures} procédures
                  </span>
                </div>
                
                <div className="space-y-2">
                  <Button 
                    onClick={() => handleAddBundle(bundle)}
                    className="w-full gap-2"
                    size="lg"
                  >
                    <ShoppingCart className="w-4 h-4" />
                    Ajouter au Panier
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    onClick={() => handleWhatsAppOrder(bundle)}
                    className="w-full gap-2"
                    size="lg"
                  >
                    <MessageCircle className="w-4 h-4" />
                    Commander via WhatsApp
                  </Button>
                </div>
                
                <div className="text-center text-sm text-gray-500 space-y-1">
                  <p>✨ Parfait pour les cliniques rurales</p>
                  <p>• Prêt à expédier • Qualité garantie</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center">
          <Link to="/bundles">
            <Button size="lg" className="text-lg px-8 py-6">
              Voir Tous les Kits
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default BundleOffers;
