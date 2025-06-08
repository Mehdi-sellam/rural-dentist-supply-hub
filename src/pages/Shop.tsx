
import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { ShoppingCart, MessageCircle, Star, Search, Send } from 'lucide-react';
import { products, categories } from '@/data/products';
import { useCart } from '@/context/CartContext';
import { useLanguage } from '@/hooks/useLanguage';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const Shop = () => {
  const [searchParams] = useSearchParams();
  const categoryFilter = searchParams.get('category');
  const searchFilter = searchParams.get('search');
  const [searchTerm, setSearchTerm] = useState(searchFilter || '');
  const [selectedCategory, setSelectedCategory] = useState(categoryFilter || '');
  const { addItem } = useCart();
  const { t } = useLanguage();

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.productId.includes(searchTerm);
    const matchesCategory = !selectedCategory || product.category === selectedCategory;
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
    const message = `Bonjour! Je suis intéressé par:\n${product.name} (ID: ${product.productId})\nPrix: ${product.price.toLocaleString()} DZD\n\nMerci de me fournir plus d'informations.`;
    return `https://wa.me/213XXXXXXXXX?text=${encodeURIComponent(message)}`;
  };

  const generateTelegramMessage = (product: any) => {
    const message = `Bonjour! Je suis intéressé par:\n${product.name} (ID: ${product.productId})\nPrix: ${product.price.toLocaleString()} DZD\n\nMerci de me fournir plus d'informations.`;
    return `https://t.me/+213XXXXXXXXX?text=${encodeURIComponent(message)}`;
  };

  // Scroll to top when component mounts
  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen">
      <Header />
      
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
            {categories.map((category) => (
              <Button
                key={category.id}
                variant={selectedCategory === category.id ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedCategory(selectedCategory === category.id ? '' : category.id)}
                className="border-border"
              >
                {category.icon} {category.name}
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
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                  
                  {/* Badge */}
                  {product.badge && (
                    <Badge className={`absolute top-3 left-3 ${getBadgeColor(product.badge)}`}>
                      {product.badge}
                    </Badge>
                  )}
                  
                  {/* Product ID */}
                  <Badge className="absolute top-3 right-3 bg-white/90 text-foreground border border-border">
                    #{product.productId}
                  </Badge>
                  
                  {/* Quick actions on hover */}
                  <div className="absolute inset-0 bg-black/20 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <Button size="sm" onClick={() => addItem(product)} className="btn-professional">
                      <ShoppingCart className="w-4 h-4 mr-1" />
                      Ajouter
                    </Button>
                  </div>
                </div>

                {/* Product Info */}
                <div className="p-4 space-y-3">
                  {/* Rating */}
                  <div className="flex items-center gap-1 text-sm">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-3 h-3 ${
                            i < Math.floor(product.rating) 
                              ? 'fill-yellow-400 text-yellow-400' 
                              : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-muted-foreground">({product.reviews})</span>
                  </div>

                  {/* Product Name */}
                  <div>
                    <h3 className="font-bold text-foreground mb-1 heading-professional text-sm">{product.name}</h3>
                    <p className="text-xs text-muted-foreground text-professional">{product.description}</p>
                  </div>

                  {/* Price */}
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-bold text-primary heading-professional">{product.price.toLocaleString()} DZD</span>
                    {product.originalPrice && (
                      <span className="text-sm text-muted-foreground line-through">{product.originalPrice.toLocaleString()} DZD</span>
                    )}
                  </div>

                  {/* Stock Status */}
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${product.inStock ? 'bg-green-500' : 'bg-red-500'}`}></div>
                    <span className={`text-xs ${product.inStock ? 'text-green-600' : 'text-red-600'}`}>
                      {product.inStock ? t('common.inStock') : t('common.outOfStock')}
                    </span>
                  </div>

                  {/* Action buttons */}
                  <div className="space-y-2">
                    <Button 
                      className="w-full text-sm btn-professional" 
                      onClick={() => addItem(product)}
                      disabled={!product.inStock}
                    >
                      <ShoppingCart className="w-4 h-4 mr-1" />
                      {t('common.addToCart')}
                    </Button>
                    <div className="flex gap-1">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="flex-1 text-xs border-border"
                        onClick={() => window.open(generateWhatsAppMessage(product), '_blank')}
                      >
                        <MessageCircle className="w-3 h-3 mr-1" />
                        WhatsApp
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="flex-1 text-xs border-border"
                        onClick={() => window.open(generateTelegramMessage(product), '_blank')}
                      >
                        <Send className="w-3 h-3 mr-1" />
                        Telegram
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* No products found */}
        {filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg text-professional">Aucun produit trouvé correspondant à vos critères.</p>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default Shop;
