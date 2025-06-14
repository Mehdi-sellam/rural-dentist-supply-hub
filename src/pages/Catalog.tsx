import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, MessageCircle, Send, FileText, Users, Phone, ShoppingCart } from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';
import { useCart } from '@/context/CartContext';
import { supabase } from '@/integrations/supabase/client';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { toast } from 'sonner';
import type { Product } from '@/types/product';
import { generateCompleteCatalogPDF } from '@/utils/pdfGenerator';

const Catalog = () => {
  const { t } = useLanguage();
  const { addItem } = useCart();
  const [products, setProducts] = React.useState<any[]>([]);
  const [categories, setCategories] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [downloadLoading, setDownloadLoading] = React.useState(false);

  // Fetch data from Supabase
  React.useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch categories
        const { data: categoriesData, error: categoriesError } = await supabase
          .from('categories')
          .select('*');

        if (categoriesError) {
          console.error('Error fetching categories:', categoriesError);
          toast.error('Erreur lors du chargement des catégories');
        } else {
          setCategories(categoriesData || []);
        }

        // Fetch products with category information
        const { data: productsData, error: productsError } = await supabase
          .from('products')
          .select(`
            *,
            categories (
              id,
              name_fr,
              icon
            )
          `);

        if (productsError) {
          console.error('Error fetching products:', productsError);
          toast.error('Erreur lors du chargement des produits');
        } else {
          setProducts(productsData || []);
        }

      } catch (error) {
        console.error('Exception fetching data:', error);
        toast.error('Erreur de connexion');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const downloadCatalog = async () => {
    try {
      setDownloadLoading(true);
      
      // Fetch all necessary data
      const [productsData, categoriesData, bundlesData] = await Promise.all([
        supabase.from('products').select('*, categories(*)'),
        supabase.from('categories').select('*'),
        supabase.from('bundles').select('*')
      ]);

      if (productsData.error || categoriesData.error || bundlesData.error) {
        throw new Error('Erreur lors de la récupération des données');
      }

      // Generate complete catalog PDF
      const doc = generateCompleteCatalogPDF(
        productsData.data || [],
        categoriesData.data || [],
        bundlesData.data || []
      );
      
      doc.save('catalogue-dentgo-complet.pdf');
      toast.success('Catalogue téléchargé avec succès');
    } catch (error) {
      console.error('Error downloading catalog:', error);
      toast.error('Erreur lors du téléchargement du catalogue');
    } finally {
      setDownloadLoading(false);
    }
  };

  // Scroll to top when component mounts
  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">{t('common.loading')}</p>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4 heading-professional">
            {t('catalog.title')}
          </h1>
          <p className="text-xl text-muted-foreground text-professional max-w-2xl mx-auto">
            {t('catalog.description')}
          </p>
        </div>

        {/* Main Actions */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {/* Download Catalog */}
          <Card className="text-center border-border">
            <CardHeader>
              <CardTitle className="flex items-center justify-center gap-2 heading-professional">
                <Download className="w-6 h-6 text-primary" />
                {t('common.downloadCatalog')}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground text-professional">
                Téléchargez notre catalogue complet avec tous les codes produits, descriptions et prix.
              </p>
              <Button onClick={downloadCatalog} size="lg" className="w-full btn-professional">
                <Download className="w-4 h-4 mr-2" />
                {t('catalog.download')}
              </Button>
            </CardContent>
          </Card>

          {/* Contact Experts */}
          <Card className="text-center border-border">
            <CardHeader>
              <CardTitle className="flex items-center justify-center gap-2 heading-professional">
                <Users className="w-6 h-6 text-primary" />
                {t('catalog.helpChoose')}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground text-professional">
                {t('catalog.helpDescription')}
              </p>
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  className="flex-1 gap-2 border-border"
                  onClick={() => window.open('https://wa.me/213XXXXXXXXX?text=Bonjour! J\'aimerais des conseils pour choisir les bons produits dentaires.', '_blank')}
                >
                  <MessageCircle className="w-4 h-4" />
                  WhatsApp
                </Button>
                <Button 
                  variant="outline" 
                  className="flex-1 gap-2 border-border"
                  onClick={() => window.open('https://t.me/+213XXXXXXXXX?text=Bonjour! J\'aimerais des conseils pour choisir les bons produits dentaires.', '_blank')}
                >
                  <Send className="w-4 h-4" />
                  Telegram
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Categories with Products */}
        <div className="space-y-12">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-8 text-center heading-professional">
            Nos Catégories et Produits
          </h2>
          
          {categories.map((category: any) => {
            const categoryProducts = products.filter((product: any) => product.category_id === category.id);
            
            return (
              <div key={category.id} className="space-y-6">
                {/* Category Header */}
                <Card className={`border-border bg-gradient-to-br ${category.color || 'from-blue-50 to-indigo-100'}`}>
                  <CardContent className="p-6 text-center">
                    <div className="text-4xl mb-4">{category.icon}</div>
                    <h3 className="font-bold text-2xl mb-2 heading-professional text-foreground">
                      {category.name_fr}
                    </h3>
                    <p className="text-muted-foreground text-professional">
                      {category.description_fr}
                    </p>
                    <p className="text-sm text-primary font-medium mt-2">
                      {categoryProducts.length} produit(s) disponible(s)
                    </p>
                  </CardContent>
                </Card>

                {/* Category Products */}
                {categoryProducts.length > 0 && (
                  <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {categoryProducts.map((product: any) => (
                      <Card key={product.id} className="border-border hover:shadow-lg transition-shadow">
                        <CardContent className="p-4">
                          <div className="aspect-square bg-muted rounded mb-3 flex items-center justify-center">
                            <img 
                              src={product.image} 
                              alt={product.name_fr}
                              className="w-full h-full object-cover rounded"
                            />
                          </div>
                          <h4 className="font-medium text-sm mb-1 text-foreground heading-professional">
                            {product.name_fr}
                          </h4>
                          <p className="text-xs text-muted-foreground mb-2 text-professional">
                            Code: {product.product_code}
                          </p>
                          <p className="font-bold text-primary heading-professional">
                            {product.price.toLocaleString()} DZD
                          </p>
                          <p className="text-xs text-muted-foreground mt-2 text-professional line-clamp-3">
                            {product.description_fr}
                          </p>
                          
                          {/* Add to Cart Button */}
                          <div className="mt-3">
                            <Button
                              className="w-full text-xs btn-professional"
                              onClick={() => {
                                const productForCart: Product = {
                                  id: product.id,
                                  name: product.name_fr,
                                  nameAr: product.name_ar || '',
                                  nameFr: product.name_fr,
                                  description: product.description_fr,
                                  descriptionAr: product.description_ar || '',
                                  descriptionFr: product.description_fr,
                                  price: product.price,
                                  originalPrice: product.original_price,
                                  image: product.image,
                                  category: product.categories?.name_fr || 'Non catégorisé',
                                  rating: product.rating || 4.5,
                                  reviews: product.reviews || 0,
                                  inStock: product.in_stock,
                                  badge: product.badge,
                                  specifications: product.specifications,
                                  productId: product.product_id,
                                  productCode: product.product_code
                                };
                                addItem(productForCart);
                                toast.success('Produit ajouté au panier');
                              }}
                              disabled={!product.in_stock}
                            >
                              <ShoppingCart className="w-3 h-3 mr-1" />
                              {t('common.addToCart')}
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}

                {categoryProducts.length === 0 && (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground text-professional">
                      Aucun produit disponible dans cette catégorie pour le moment.
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Contact Information */}
        <Card className="text-center border-border mt-12">
          <CardContent className="p-8">
            <h2 className="text-2xl font-bold text-foreground mb-4 heading-professional">
              Besoin d'aide pour passer commande ?
            </h2>
            <p className="text-muted-foreground mb-6 text-professional">
              Notre équipe est disponible pour vous accompagner dans vos choix et traiter vos commandes.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                variant="outline" 
                className="gap-2 border-border"
                onClick={() => window.open('tel:+213XXXXXXXXX')}
              >
                <Phone className="w-4 h-4" />
                +213 XXX XXX XXX
              </Button>
              <Button 
                variant="outline" 
                className="gap-2 border-border"
                onClick={() => window.open('https://wa.me/213XXXXXXXXX?text=Bonjour! J\'aimerais passer une commande.', '_blank')}
              >
                <MessageCircle className="w-4 h-4" />
                Commander via WhatsApp
              </Button>
              <Button 
                variant="outline" 
                className="gap-2 border-border"
                onClick={() => window.open('https://t.me/+213XXXXXXXXX?text=Bonjour! J\'aimerais passer une commande.', '_blank')}
              >
                <Send className="w-4 h-4" />
                Commander via Telegram
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <Footer />
    </div>
  );
};

export default Catalog;
