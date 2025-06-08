
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Download, ShoppingCart, MessageCircle } from 'lucide-react';
import { products, bundles, categories } from '@/data/products';
import { useCart } from '@/context/CartContext';
import { useLanguage } from '@/hooks/useLanguage';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const Catalog = () => {
  const { addItem } = useCart();
  const { t } = useLanguage();

  const generateProductWhatsApp = (product: any) => {
    const message = `Hello! I'm interested in: ${product.name} - ${product.price.toLocaleString()} DZD. Please provide more details.`;
    return `https://wa.me/213XXXXXXXXX?text=${encodeURIComponent(message)}`;
  };

  const generateCatalogPDF = () => {
    // In a real implementation, this would generate/download a PDF
    const catalogContent = `DENTGO DENTAL SUPPLIES CATALOG\n\n${categories.map(cat => `\n${cat.name.toUpperCase()}\n${products.filter(p => p.category === cat.id).map(p => `• ${p.name} - ${p.price.toLocaleString()} DZD`).join('\n')}`).join('\n')}`;
    
    const element = document.createElement('a');
    const file = new Blob([catalogContent], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = 'DentGo-Catalog.txt';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="min-h-screen">
      <Header />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 to-green-50 py-16 px-4">
        <div className="container mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 heading-luxury">
            Complete Product Catalog
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto text-luxury mb-8">
            Browse our complete range of dental supplies, organized by category
          </p>
          <Button onClick={generateCatalogPDF} className="gap-2" size="lg">
            <Download className="w-5 h-5" />
            Download Full Catalog
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
              <div className={`bg-gradient-to-r ${category.color} rounded-lg p-8 mb-8`}>
                <div className="flex items-center gap-4 mb-4">
                  <div className="text-4xl">{category.icon}</div>
                  <div>
                    <h2 className="text-3xl font-bold text-gray-900 heading-luxury">{category.name}</h2>
                    <p className="text-gray-600 text-luxury">{category.description}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <span>{categoryProducts.length} Products</span>
                  {categoryBundles.length > 0 && <span>• {categoryBundles.length} Bundles</span>}
                </div>
              </div>

              {/* Category Products */}
              <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
                {categoryProducts.map((product) => (
                  <Card key={product.id} className="product-card hover-lift">
                    <CardContent className="p-0">
                      {/* Product Image */}
                      <div className="relative aspect-square bg-gray-50 flex items-center justify-center overflow-hidden">
                        <img 
                          src={product.image} 
                          alt={product.name}
                          className="w-full h-full object-cover"
                        />
                        {product.badge && (
                          <Badge className="absolute top-3 left-3 bg-primary text-white">
                            {product.badge}
                          </Badge>
                        )}
                      </div>

                      {/* Product Info */}
                      <div className="p-4 space-y-3">
                        <h3 className="font-semibold text-gray-900 heading-luxury text-sm">
                          {product.name}
                        </h3>
                        <p className="text-xs text-gray-600 text-luxury">
                          {product.description}
                        </p>
                        
                        <div className="flex items-center justify-between">
                          <div className="font-bold text-primary">
                            {product.price.toLocaleString()} DZD
                          </div>
                          <div className="flex gap-1">
                            <Button 
                              size="sm" 
                              className="text-xs px-2"
                              onClick={() => addItem(product)}
                            >
                              <ShoppingCart className="w-3 h-3" />
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="text-xs px-2"
                              onClick={() => window.open(generateProductWhatsApp(product), '_blank')}
                            >
                              <MessageCircle className="w-3 h-3" />
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
                  <h3 className="text-xl font-bold text-gray-900 mb-4 heading-luxury">
                    {category.name} Bundles
                  </h3>
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {categoryBundles.map((bundle) => (
                      <Card key={bundle.id} className="product-card hover-lift">
                        <CardContent className="p-6">
                          <div className="space-y-4">
                            <div>
                              <h4 className="font-bold text-gray-900 heading-luxury">{bundle.name}</h4>
                              <p className="text-sm text-gray-600 text-luxury">{bundle.description}</p>
                            </div>
                            
                            <div className="text-center">
                              <div className="text-2xl font-bold text-primary">{bundle.bundlePrice}</div>
                              <div className="text-sm text-gray-400 line-through">{bundle.originalPrice}</div>
                              <Badge className="bg-green-100 text-green-800 text-xs">
                                Save {bundle.savings}
                              </Badge>
                            </div>

                            <div className="flex gap-2">
                              <Button size="sm" className="flex-1 text-xs">
                                Add Bundle
                              </Button>
                              <Button variant="outline" size="sm" className="text-xs">
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
          <div className="bg-gradient-to-r from-blue-50 to-green-50 rounded-lg p-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-4 heading-luxury">
              Need Help Choosing?
            </h3>
            <p className="text-gray-600 text-luxury mb-6">
              Our experts can help you select the right products for your practice
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="gap-2">
                <MessageCircle className="w-5 h-5" />
                Contact Our Experts
              </Button>
              <Link to="/shop">
                <Button variant="outline" size="lg">
                  Browse Interactive Shop
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
