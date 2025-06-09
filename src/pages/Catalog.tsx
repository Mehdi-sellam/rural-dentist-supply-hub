
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
  const { t, language } = useLanguage();

  const generateProductWhatsApp = (product: any) => {
    const productName = language === 'fr' ? product.nameFr : product.name;
    const message = `${language === 'fr' ? 'Bonjour! Je suis intéressé par' : 'Hello! I am interested in'}: ${productName} (${t('common.price')}: ${product.productCode}) - ${product.price.toLocaleString()} DZD. ${language === 'fr' ? 'Merci de me fournir plus de détails.' : 'Please provide more details.'}`;
    return `https://wa.me/213XXXXXXXXX?text=${encodeURIComponent(message)}`;
  };

  const generateProductTelegram = (product: any) => {
    const productName = language === 'fr' ? product.nameFr : product.name;
    const message = `${language === 'fr' ? 'Bonjour! Je suis intéressé par' : 'Hello! I am interested in'}: ${productName} (Code: ${product.productCode}) - ${product.price.toLocaleString()} DZD. ${language === 'fr' ? 'Merci de me fournir plus de détails.' : 'Please provide more details.'}`;
    return `https://t.me/+213XXXXXXXXX?text=${encodeURIComponent(message)}`;
  };

  const generateCatalogHTML = () => {
    const htmlContent = `
<!DOCTYPE html>
<html lang="${language}">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${t('catalog.title')} - DentGo</title>
    <style>
        body { font-family: 'Arial', sans-serif; margin: 0; padding: 20px; background: #f8fafc; }
        .header { text-align: center; margin-bottom: 40px; background: white; padding: 30px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
        .category { margin-bottom: 30px; background: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
        .category-title { color: #1e40af; font-size: 24px; font-weight: bold; margin-bottom: 15px; }
        .products { display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 15px; }
        .product { border: 1px solid #e5e7eb; padding: 20px; border-radius: 6px; background: #fafafa; }
        .product-code { background: #1e40af; color: white; padding: 4px 8px; border-radius: 4px; font-size: 12px; font-weight: bold; }
        .product-name { font-weight: bold; margin: 8px 0; font-size: 16px; }
        .product-price { color: #1e40af; font-weight: bold; font-size: 18px; margin: 8px 0; }
        .product-link { color: #1e40af; text-decoration: none; font-size: 14px; }
        .product-link:hover { text-decoration: underline; }
        .contact-info { background: #1e40af; color: white; padding: 20px; border-radius: 8px; margin-top: 30px; }
    </style>
</head>
<body>
    <div class="header">
        <h1>CATALOGUE DENTGO</h1>
        <p>${t('catalog.description')}</p>
        <p>${language === 'fr' ? 'Pour commander' : 'To order'}: <a href="https://dentgo.com">www.dentgo.com</a></p>
        <p>WhatsApp: +213 XXX XXX XXX | Telegram: @dentgo_algeria</p>
    </div>
    
    ${categories.map(category => {
      const categoryProducts = products.filter(product => product.category === category.id);
      if (categoryProducts.length === 0) return '';
      
      return `
        <div class="category">
            <h2 class="category-title">${category.icon} ${language === 'fr' ? category.nameFr : category.name}</h2>
            <div class="products">
                ${categoryProducts.map(product => `
                    <div class="product">
                        <span class="product-code">Code: ${product.productCode}</span>
                        <div class="product-name">${language === 'fr' ? product.nameFr : product.name}</div>
                        <div style="font-size: 14px; color: #666; margin: 8px 0;">${language === 'fr' ? product.descriptionFr : product.description}</div>
                        <div class="product-price">${product.price.toLocaleString()} DZD</div>
                        <a href="https://dentgo.com/shop?search=${product.name}" class="product-link">
                            → ${language === 'fr' ? 'Voir sur le site' : 'View on website'}
                        </a>
                    </div>
                `).join('')}
            </div>
        </div>
      `;
    }).join('')}
    
    <div class="contact-info">
        <h3>${t('contact.title')}</h3>
        <p>📱 WhatsApp: +213 XXX XXX XXX</p>
        <p>📱 Telegram: @dentgo_algeria</p>
        <p>📧 Email: info@dentgo.dz</p>
        <p>🌐 Website: www.dentgo.com</p>
    </div>
</body>
</html>`;

    const element = document.createElement('a');
    const file = new Blob([htmlContent], { type: 'text/html' });
    element.href = URL.createObjectURL(file);
    element.download = `Catalogue-DentGo-${language}.html`;
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
            {t('catalog.title')}
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto text-professional mb-8">
            {t('catalog.description')}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button onClick={generateCatalogHTML} className="gap-2 btn-professional" size="lg">
              <Download className="w-5 h-5" />
              {t('common.downloadCatalog')}
            </Button>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="lg" 
                className="gap-2 border-border"
                onClick={() => window.open('https://wa.me/213XXXXXXXXX?text=Hello! I need the complete dental catalog.', '_blank')}
              >
                <MessageCircle className="w-5 h-5" />
                WhatsApp
              </Button>
              <Button 
                variant="outline" 
                size="lg" 
                className="gap-2 border-border"
                onClick={() => window.open('https://t.me/+213XXXXXXXXX?text=Hello! I need the complete dental catalog.', '_blank')}
              >
                <Send className="w-5 h-5" />
                Telegram
              </Button>
            </div>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-16">
        {/* Product Categories */}
        {categories.map((category) => {
          const categoryProducts = products.filter(product => product.category === category.id);
          
          if (categoryProducts.length === 0) return null;

          return (
            <div key={category.id} className="mb-16">
              {/* Category Header */}
              <div className={`bg-gradient-to-r ${category.color} border border-border p-8 mb-8`}>
                <div className="flex items-center gap-4 mb-4">
                  <div className="text-4xl">{category.icon}</div>
                  <div>
                    <h2 className="text-3xl font-bold text-foreground heading-professional">
                      {language === 'fr' ? category.nameFr : category.name}
                    </h2>
                    <p className="text-muted-foreground text-professional">
                      {language === 'fr' ? category.descriptionFr : category.description}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span>{categoryProducts.length} {language === 'fr' ? 'Produits' : 'Products'}</span>
                </div>
              </div>

              {/* Category Products */}
              <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {categoryProducts.map((product) => (
                  <Card key={product.id} className="product-card">
                    <CardContent className="p-0">
                      {/* Product Image */}
                      <div className="relative aspect-square bg-muted flex items-center justify-center overflow-hidden">
                        <img 
                          src={product.image} 
                          alt={language === 'fr' ? product.nameFr : product.name}
                          className="w-full h-full object-cover"
                        />
                        {product.badge && (
                          <Badge className="absolute top-3 left-3 bg-primary text-primary-foreground">
                            {product.badge}
                          </Badge>
                        )}
                        <Badge className="absolute top-3 right-3 bg-white/90 text-foreground border border-border">
                          #{product.productCode}
                        </Badge>
                      </div>

                      {/* Product Info */}
                      <div className="p-4 space-y-3">
                        <h3 className="font-semibold text-foreground heading-professional text-sm">
                          {language === 'fr' ? product.nameFr : product.name}
                        </h3>
                        <p className="text-xs text-muted-foreground text-professional">
                          {language === 'fr' ? product.descriptionFr : product.description}
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
            </div>
          );
        })}

        {/* Catalog Actions */}
        <div className="text-center mt-16 space-y-6">
          <div className="bg-gradient-to-r from-blue-50 to-green-50 border border-border p-8">
            <h3 className="text-2xl font-bold text-foreground mb-4 heading-professional">
              {t('catalog.helpChoose')}
            </h3>
            <p className="text-muted-foreground text-professional mb-6">
              {t('catalog.helpDescription')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="gap-2 btn-professional">
                <MessageCircle className="w-5 h-5" />
                {t('common.contactExperts')}
              </Button>
              <Link to="/shop">
                <Button variant="outline" size="lg" className="border-border">
                  {t('common.shopInteractive')}
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
