import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { ShoppingCart, MessageCircle, Star, Search, Send } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useLanguage } from '@/hooks/useLanguage';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const Shop = () => {
  const [searchParams] = useSearchParams();
  const categoryFilter = searchParams.get('category');
  const searchFilter = searchParams.get('search');
  const [searchTerm, setSearchTerm] = useState(searchFilter || '');
  const [selectedCategory, setSelectedCategory] = useState(categoryFilter || '');
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { addItem } = useCart();
  const { t } = useLanguage();

  // Fetch data from Supabase
  useEffect(() => {
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

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name_fr?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description_fr?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.product_code?.includes(searchTerm) ||
                         product.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.product_id?.includes(searchTerm);
    
    const matchesCategory = !selectedCategory || 
                          product.category_id === selectedCategory ||
                          product.categories?.id === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  const getBadgeColor = (badge: string) => {
    switch (badge) {
      case 'Best Seller': return 'bg-green-600 text-white';
      case 'New Arrival': return 'bg-blue-600 text-white';
      case 'Professional': return 'bg-purple-600 text-white';
      case 'Limited Offer': return 'bg-red-600 text-white';
      default: return 'bg-gray-600 text-white';
    }
  };

  const generateWhatsAppMessage = (product: any) => {
    const message = `Bonjour! Je suis intéressé par:\n${product.name_fr || product.name} (Code: ${product.product_code || product.product_id})\nPrix: ${product.price.toLocaleString()} DZD\n\nMerci de me fournir plus d'informations.`;
    return `https://wa.me/213XXXXXXXXX?text=${encodeURIComponent(message)}`;
  };

  const generateTelegramMessage = (product: any) => {
    const message = `Bonjour! Je suis intéressé par:\n${product.name_fr || product.name} (Code: ${product.product_code || product.product_id})\nPrix: ${product.price.toLocaleString()} DZD\n\nMerci de me fournir plus d'informations.`;
    return `https://t.me/+213XXXXXXXXX?text=${encodeURIComponent(message)}`;
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
              <p className="text-muted-foreground">Chargement des produits...</p>
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
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4 heading-professional">
            {t('nav.shop')}
          </h1>
          <p className="text-xl text-muted-foreground text-professional">
            Matériel dentaire professionnel et équipements de qualité
          </p>
        </div>

        {/* Search and Filters */}
        <div className="mb-8 space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Rechercher par nom ou code produit..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 border-border"
            />
          </div>

          {/* Category Filter */}
          <div className="flex flex-wrap gap-2">
            <Button
              variant={selectedCategory === '' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedCategory('')}
              className="border-border"
            >
              Toutes les catégories
            </Button>
            {categories.map((category) => (
              <Button
                key={category.id}
                variant={selectedCategory === category.id ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedCategory(selectedCategory === category.id ? '' : category.id)}
                className="border-border"
              >
                {category.icon} {category.name_fr || category.name}
              </Button>
            ))}
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <Card key={product.id} className="product-card">
              <CardContent className="p-0">
                {/* Product Image Area */}
                <div className="relative aspect-square bg-muted flex items-center justify-center overflow-hidden">
                  <img 
                    src={product.image} 
                    alt={product.name_fr || product.name}
                    className="w-full h-full object-cover"
                  />
                  
                  {/* Badge */}
                  {product.badge && (
                    <Badge className={`absolute top-3 left-3 ${getBadgeColor(product.badge)}`}>
                      {product.badge}
                    </Badge>
                  )}
                  
                  {/* Rating */}
                  {product.rating && (
                    <div className="absolute top-3 right-3 flex items-center gap-1 bg-white/90 px-2 py-1 rounded-full">
                      <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                      <span className="text-xs font-medium">{product.rating}</span>
                    </div>
                  )}
                </div>

                {/* Product Info */}
                <div className="p-4">
                  <h3 className="font-semibold text-foreground mb-2 line-clamp-2">
                    {product.name_fr || product.name}
                  </h3>
                  
                  <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                    {product.description_fr || product.description}
                  </p>
                  
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <span className="text-lg font-bold text-primary">
                        {product.price?.toLocaleString()} DZD
                      </span>
                      {product.original_price && (
                        <span className="text-sm text-muted-foreground line-through ml-2">
                          {product.original_price.toLocaleString()} DZD
                        </span>
                      )}
                    </div>
                    <span className="text-xs text-muted-foreground">
                      Code: {product.product_code || product.product_id}
                    </span>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2">
                    <Button 
                      size="sm" 
                      className="flex-1 gap-2"
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
                    >
                      <ShoppingCart className="w-4 h-4" />
                      Ajouter
                    </Button>
                    
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => window.open(generateWhatsAppMessage(product), '_blank')}
                      className="border-border"
                    >
                      <MessageCircle className="w-4 h-4" />
                    </Button>
                    
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => window.open(generateTelegramMessage(product), '_blank')}
                      className="border-border"
                    >
                      <Send className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* No Products Found */}
        {filteredProducts.length === 0 && (
          <div className="text-center py-16">
            <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">Aucun produit trouvé</h3>
            <p className="text-gray-500">Essayez de modifier vos critères de recherche.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Shop;
