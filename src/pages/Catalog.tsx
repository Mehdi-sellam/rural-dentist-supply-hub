
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Download, ShoppingCart, MessageCircle, Send } from 'lucide-react';
import { products, bundles, categories } from '@/data/products';
import { useCart } from '@/context/CartContext';
import { useLanguage } from '@/hooks/useLanguage';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const Catalog = () => {
  const { addItem } = useCart();
  const { t } = useLanguage();

  const generateProductWhatsApp = (product: any) => {
    const message = `Bonjour! Je suis intéressé par: ${product.name} (ID: ${product.productId}) - ${product.price.toLocaleString()} DZD. Merci de me fournir plus de détails.`;
    return `https://wa.me/213XXXXXXXXX?text=${encodeURIComponent(message)}`;
  };

  const generateProductTelegram = (product: any) => {
    const message = `Bonjour! Je suis intéressé par: ${product.name} (ID: ${product.productId}) - ${product.price.toLocaleString()} DZD. Merci de me fournir plus de détails.`;
    return `https://t.me/+213XXXXXXXXX?text=${encodeURIComponent(message)}`;
  };

  const generateCatalogHTML = () => {
    const htmlContent = `
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Catalogue DentGo - Fournitures Dentaires Professionnelles</title>
    <style>
        body { font-family: 'Arial', sans-serif; margin: 0; padding: 20px; background: #f5f5f5; }
        .header { text-align: center; margin-bottom: 40px; }
        .category { margin-bottom: 30px; background: white; padding: 20px; border-radius: 8px; }
        .category-title { color: #1e40af; font-size: 24px; font-weight: bold; margin-bottom: 15px; }
        .products { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 15px; }
        .product { border: 1px solid #e5e7eb; padding: 15px; border-radius: 6px; background: #fafafa; }
        .product-id { background: #1e40af; color: white; padding: 2px 8px; border-radius: 4px; font-size: 12px; }
        .product-name { font-weight: bold; margin: 8px 0; }
        .product-price { color: #1e40af; font-weight: bold; font-size: 18px; }
        .product-link { color: #1e40af; text-decoration: none; }
        .product-link:hover { text-decoration: underline; }
    </style>
</head>
<body>
    <div class="header">
        <h1>CATALOGUE DENTGO</h1>
        <p>Fournitures Dentaires Professionnelles - Qualité EU/Asie</p>
        <p>Pour commander: <a href="https://dentgo.com">www.dentgo.com</a></p>
    </div>
    
    ${categories.map(category => {
      const categoryProducts = products.filter(product => product.category === category.id);
      if (categoryProducts.length === 0) return '';
      
      return `
        <div class="category">
            <h2 class="category-title">${category.icon} ${category.name}</h2>
            <div class="products">
                ${categoryProducts.map(product => `
                    <div class="product">
                        <span class="product-id">ID: ${product.productId}</span>
                        <div class="product-name">${product.name}</div>
                        <div>${product.description}</div>
                        <div class="product-price">${product.price.toLocaleString()} DZD</div>
                        <a href="https://dentgo.com/shop?search=${product.name}" class="product-link">
                            → Voir sur le site
                        </a>
                    </div>
                `).join('')}
            </div>
        </div>
      `;
    }).join('')}
</body>
</html>`;

    const element = document.createElement('a');
    const file = new Blob([htmlContent], { type: 'text/html' });
    element.href = URL.createObjectURL(file);
    element.download = 'Catalogue-DentGo.html';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  // Scroll to top when component mounts
  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen">
      <Header />
      
      {/* Hero Section */}
      <section className="dental-gradient py-16 px-4">
        <div className="container mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6 heading-professional">
            Catalogue Complet des Produits
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto text-professional mb-8">
            Parcourez notre gamme complète de fournitures dentaires, organisée par catégorie
          </p>
          <Button onClick={generateCatalogHTML} className="gap-2 btn-professional" size="lg">
            <Download className="w-5 h-5" />
            Télécharger le Catalogue Complet
          </Button>
        </div>
      </section>

      <div className="container mx-auto px-4 py-16">
        {/* Product Categories */}
        {categories.map((category) => {
          const categoryProducts = products.filter(product => product.category === category.id);
          const categoryBundles = bundles.filter(bundle => 
            bundle.name.toLowerCase().includes(category.name.toLowerCase().split(' ')[0])
          );
          
          if (categoryProducts.length === 0 && categoryBundles.length === 0) return null;

          return (
            <div key={category.id} className="mb-16">
              {/* Category Header */}
              <div className={`bg-gradient-to-r ${category.color} border border-border p-8 mb-8`}>
                <div className="flex items-center gap-4 mb-4">
                  <div className="text-4xl">{category.icon}</div>
                  <div>
                    <h2 className="text-3xl font-bold text-foreground heading-professional">{category.name}</h2>
                    <p className="text-muted-foreground text-professional">{category.description}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span>{categoryProducts.length} Produits</span>
                  {categoryBundles.length > 0 && <span>• {categoryBundles.length} Kits</span>}
                </div>
              </div>

              {/* Category Products */}
              <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
                {categoryProducts.map((product) => (
                  <Card key={product.id} className="product-card">
                    <CardContent className="p-0">
                      {/* Product Image */}
                      <div className="relative aspect-square bg-muted flex items-center justify-center overflow-hidden">
                        <img 
                          src={product.image} 
                          alt={product.name}
                          className="w-full h-full object-cover"
                        />
                        {product.badge && (
                          <Badge className="absolute top-3 left-3 bg-primary text-primary-foreground">
                            {product.badge}
                          </Badge>
                        )}
                        <Badge className="absolute top-3 right-3 bg-white/90 text-foreground border border-border">
                          #{product.productId}
                        </Badge>
                      </div>

                      {/* Product Info */}
                      <div className="p-4 space-y-3">
                        <h3 className="font-semibold text-foreground heading-professional text-sm">
                          {product.name}
                        </h3>
                        <p className="text-xs text-muted-foreground text-professional">
                          {product.description}
                        </p>
                        
                        <div className="flex items-center justify-between">
                          <div className="font-bold text-primary heading-professional">
                            {product.price.toLocaleString()} DZD
                          </div>
                          <div className="flex gap-1">
                            <Button 
                              size="sm" 
                              className="text-xs px-2 btn-professional"
                              onClick={() => addItem(product)}
                            >
                              <ShoppingCart className="w-3 h-3" />
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="text-xs px-2 border-border"
                              onClick={() => window.open(generateProductWhatsApp(product), '_blank')}
                            >
                              <MessageCircle className="w-3 h-3" />
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="text-xs px-2 border-border"
                              onClick={() => window.open(generateProductTelegram(product), '_blank')}
                            >
                              <Send className="w-3 h-3" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Category Bundles */}
              {categoryBundles.length > 0 && (
                <div>
                  <h3 className="text-xl font-bold text-foreground mb-4 heading-professional">
                    Kits {category.name}
                  </h3>
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {categoryBundles.map((bundle) => (
                      <Card key={bundle.id} className="product-card">
                        <CardContent className="p-6">
                          <div className="space-y-4">
                            <div>
                              <h4 className="font-bold text-foreground heading-professional">{bundle.name}</h4>
                              <p className="text-sm text-muted-foreground text-professional">{bundle.description}</p>
                            </div>
                            
                            <div className="text-center">
                              <div className="text-2xl font-bold text-primary heading-professional">{bundle.bundlePrice}</div>
                              <div className="text-sm text-muted-foreground line-through">{bundle.originalPrice}</div>
                              <Badge className="bg-green-100 text-green-800 text-xs border border-green-200">
                                Économie {bundle.savings}
                              </Badge>
                            </div>

                            <div className="flex gap-2">
                              <Button size="sm" className="flex-1 text-xs btn-professional">
                                Ajouter Kit
                              </Button>
                              <Button variant="outline" size="sm" className="text-xs border-border">
                                <MessageCircle className="w-3 h-3" />
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}

        {/* Catalog Actions */}
        <div className="text-center mt-16 space-y-6">
          <div className="bg-gradient-to-r from-blue-50 to-green-50 border border-border p-8">
            <h3 className="text-2xl font-bold text-foreground mb-4 heading-professional">
              Besoin d'Aide pour Choisir ?
            </h3>
            <p className="text-muted-foreground text-professional mb-6">
              Nos experts peuvent vous aider à sélectionner les bons produits pour votre cabinet
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="gap-2 btn-professional">
                <MessageCircle className="w-5 h-5" />
                Contacter Nos Experts
              </Button>
              <Link to="/shop">
                <Button variant="outline" size="lg" className="border-border">
                  Parcourir la Boutique Interactive
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Catalog;
