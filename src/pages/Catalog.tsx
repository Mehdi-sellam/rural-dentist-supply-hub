import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, MessageCircle, Send, FileText, Users, Phone, ShoppingCart } from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';
import { useCart } from '@/context/CartContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import type { Product } from '@/types/product';

const Catalog = () => {
  const { t } = useLanguage();
  const { addItem } = useCart();
  const [products, setProducts] = React.useState<any[]>([]);
  const [categories, setCategories] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);

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

  const downloadCatalog = () => {
    // Generate CSV content with fresh data
    const headers = ['ID', 'Code', 'Nom', 'Description', 'Prix (DZD)', 'Catégorie', 'En stock'];
    const csvContent = [
      headers.join(','),
      ...products.map((product: any) => [
        product.id,
        product.product_code,
        product.name_fr,
        product.description_fr,
        product.price,
        product.categories?.name_fr || 'Non catégorisé',
        product.in_stock ? 'Oui' : 'Non'
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'catalog-dentgo.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast.success('Catalogue téléchargé avec succès');
  };

  // Scroll to top when component mounts
  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">{t('common.loading')}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
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
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{category.icon}</span>
                  <h3 className="text-xl font-bold text-foreground heading-professional">
                    {category.name_fr || category.name}
                  </h3>
                  <Badge variant="secondary" className="ml-auto">
                    {categoryProducts.length} produits
                  </Badge>
                </div>
                
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {categoryProducts.map((product: any) => (
                    <Card key={product.id} className="border-border">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between mb-2">
                          <h4 className="font-semibold text-foreground text-sm line-clamp-2">
                            {product.name_fr || product.name}
                          </h4>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => addItem({
                              id: product.id,
                              name: product.name_fr || product.name,
                              nameAr: product.name_ar || '',
                              nameFr: product.name_fr || product.name,
                              price: product.price,
                              originalPrice: product.original_price,
                              image: product.image,
                              description: product.description_fr || product.description,
                              quantity: 1,
                              type: 'product'
                            })}
                            className="p-1 h-auto"
                          >
                            <ShoppingCart className="w-4 h-4" />
                          </Button>
                        </div>
                        
                        <p className="text-xs text-muted-foreground mb-2 line-clamp-2">
                          {product.description_fr || product.description}
                        </p>
                        
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-primary text-sm">
                            {product.price?.toLocaleString()} DZD
                          </span>
                          <span className="text-xs text-muted-foreground">
                            #{product.product_code || product.product_id}
                          </span>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Catalog;
