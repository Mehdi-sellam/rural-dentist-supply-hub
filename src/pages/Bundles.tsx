
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MessageCircle, CheckCircle, Star, Send, Loader2 } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useLanguage } from '@/hooks/useLanguage';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

interface Bundle {
  id: string;
  name: string;
  description: string;
  items: string[];
  original_price: string;
  bundle_price: string;
  savings?: string;
  procedures?: string;
  popular?: boolean;
}

const Bundles = () => {
  const { addBundle } = useCart();
  const { t } = useLanguage();
  const { user } = useAuth();
  const [bundles, setBundles] = useState<Bundle[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBundles();
    window.scrollTo(0, 0);
  }, []);

  const fetchBundles = async () => {
    try {
      const { data, error } = await supabase
        .from('bundles')
        .select('*')
        .order('created_at', { ascending: false });

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

  const generateWhatsAppBundle = (bundle: Bundle) => {
    const message = `Bonjour! Je suis intéressé par le kit ${bundle.name} au prix de ${bundle.bundle_price}. Merci de me fournir plus d'informations sur la disponibilité et la livraison.`;
    return `https://wa.me/213XXXXXXXXX?text=${encodeURIComponent(message)}`;
  };

  const generateTelegramBundle = (bundle: Bundle) => {
    const message = `Bonjour! Je suis intéressé par le kit ${bundle.name} au prix de ${bundle.bundle_price}. Merci de me fournir plus d'informations sur la disponibilité et la livraison.`;
    return `https://t.me/+213XXXXXXXXX?text=${encodeURIComponent(message)}`;
  };

  const handleAddToCart = async (bundle: Bundle) => {
    if (!user) {
      toast.error('Veuillez vous connecter pour ajouter des articles au panier');
      return;
    }

    try {
      const { error } = await supabase
        .from('cart_bundles')
        .upsert({
          user_id: user.id,
          bundle_id: bundle.id,
          quantity: 1
        }, {
          onConflict: 'user_id,bundle_id'
        });

      if (error) {
        console.error('Error adding to cart:', error);
        toast.error('Erreur lors de l\'ajout au panier');
        return;
      }

      addBundle(bundle);
      toast.success('Kit ajouté au panier');
    } catch (error) {
      console.error('Error:', error);
      toast.error('Erreur lors de l\'ajout au panier');
    }
  };

  return (
    <div className="min-h-screen">
      <Header />
      
      {/* Hero Section */}
      <section className="dental-gradient py-16 px-4">
        <div className="container mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6 heading-professional">
            {t('bundles.title')}
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto text-professional">
            Kits complets pour procédures spécifiques. Économisez et assurez-vous d'avoir tout le nécessaire.
          </p>
        </div>
      </section>

      <div className="container mx-auto px-4 py-16">
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="w-8 h-8 animate-spin" />
            <span className="ml-2">Chargement des kits...</span>
          </div>
        ) : bundles.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg text-professional">Aucun kit disponible pour le moment.</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {bundles.map((bundle) => (
              <Card key={bundle.id} className="overflow-hidden product-card">
                <CardContent className="p-0">
                  {/* Bundle Header */}
                  <div className="premium-gradient p-6 relative">
                    {bundle.popular && (
                      <Badge className="absolute top-4 right-4 bg-primary text-primary-foreground">
                        Plus Populaire
                      </Badge>
                    )}
                    <div className="text-center">
                      <h3 className="text-2xl font-bold text-foreground mb-2 heading-professional">{bundle.name}</h3>
                      <p className="text-muted-foreground mb-4 text-professional">{bundle.description}</p>
                      <div className="text-center mb-4">
                        <div className="text-3xl font-bold text-primary heading-professional">
                          {bundle.bundle_price}
                        </div>
                        {bundle.original_price && (
                          <div className="text-lg text-muted-foreground line-through">
                            {bundle.original_price}
                          </div>
                        )}
                        {bundle.savings && (
                          <div className="text-green-600 font-bold text-professional">{t('bundles.save')} {bundle.savings}</div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Bundle Contents */}
                  <div className="p-6">
                    <div className="mb-6">
                      <h4 className="font-bold mb-3 flex items-center gap-2 heading-professional">
                        <CheckCircle className="w-5 h-5 text-green-500" />
                        {t('bundles.includes')}
                      </h4>
                      <ul className="space-y-2">
                        {(bundle.items || []).map((item: string, index: number) => (
                          <li key={index} className="flex items-start gap-2 text-sm text-professional">
                            <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Bundle Stats */}
                    <div className="flex justify-between items-center mb-6 text-sm">
                      <div className="text-center">
                        <div className="font-bold text-primary heading-professional">{bundle.procedures || '10+'}</div>
                        <div className="text-muted-foreground text-professional">Procédures</div>
                      </div>
                      <div className="text-center">
                        <div className="flex items-center gap-1">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                          ))}
                        </div>
                        <div className="text-muted-foreground text-professional">Évalué</div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="space-y-3">
                      <Button 
                        className="w-full btn-professional" 
                        size="lg"
                        onClick={() => handleAddToCart(bundle)}
                      >
                        {t('common.addToCart')}
                      </Button>
                      <div className="flex gap-2">
                        <Button 
                          variant="outline" 
                          className="flex-1 gap-2 border-border text-sm"
                          onClick={() => window.open(generateWhatsAppBundle(bundle), '_blank')}
                        >
                          <MessageCircle className="w-4 h-4" />
                          WhatsApp
                        </Button>
                        <Button 
                          variant="outline" 
                          className="flex-1 gap-2 border-border text-sm"
                          onClick={() => window.open(generateTelegramBundle(bundle), '_blank')}
                        >
                          <Send className="w-4 h-4" />
                          Telegram
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Why Choose Bundles Section */}
        <section className="mt-16 premium-gradient border border-border p-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-foreground mb-4 heading-professional">Pourquoi Choisir Nos Kits ?</h2>
            <p className="text-muted-foreground text-professional">Conçus spécifiquement pour les cabinets dentaires professionnels</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center p-4">
              <div className="w-12 h-12 bg-green-100 border border-green-200 flex items-center justify-center mx-auto mb-3">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="font-bold mb-2 heading-professional">Économique</h3>
              <p className="text-sm text-muted-foreground text-professional">Économisez jusqu'à 25% par rapport aux achats individuels</p>
            </div>
            
            <div className="text-center p-4">
              <div className="w-12 h-12 bg-blue-100 border border-blue-200 flex items-center justify-center mx-auto mb-3">
                <Star className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="font-bold mb-2 heading-professional">Qualité Assurée</h3>
              <p className="text-sm text-muted-foreground text-professional">Tous les articles testés et approuvés par des professionnels dentaires</p>
            </div>
            
            <div className="text-center p-4">
              <div className="w-12 h-12 bg-purple-100 border border-purple-200 flex items-center justify-center mx-auto mb-3">
                <MessageCircle className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="font-bold mb-2 heading-professional">Solutions Complètes</h3>
              <p className="text-sm text-muted-foreground text-professional">Tout ce dont vous avez besoin pour des procédures spécifiques en un seul package</p>
            </div>
          </div>
        </section>

        {/* Link to catalog */}
        <div className="text-center mt-12">
          <Link to="/catalog">
            <Button variant="outline" size="lg" className="px-8 border-border">
              {t('common.viewAll')} les Kits dans le Catalogue
            </Button>
          </Link>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Bundles;
