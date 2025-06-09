
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, MessageCircle, Send, FileText, Users, Phone } from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';
import { products, categories } from '@/data/products';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const Catalog = () => {
  const { t } = useLanguage();

  const downloadCatalog = () => {
    // Generate CSV content
    const headers = ['ID', 'Code', 'Nom', 'Description', 'Prix (DZD)', 'Catégorie', 'En stock'];
    const csvContent = [
      headers.join(','),
      ...products.map(product => [
        product.id,
        product.productCode,
        product.nameFr,
        product.descriptionFr,
        product.price,
        product.category,
        product.inStock ? 'Oui' : 'Non'
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

        {/* Categories Overview */}
        <div className="mb-12">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-8 text-center heading-professional">
            Nos Catégories
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((category) => (
              <Card key={category.id} className={`border-border bg-gradient-to-br ${category.color}`}>
                <CardContent className="p-6 text-center">
                  <div className="text-4xl mb-4">{category.icon}</div>
                  <h3 className="font-bold text-lg mb-2 heading-professional text-foreground">
                    {category.nameFr}
                  </h3>
                  <p className="text-sm text-muted-foreground text-professional">
                    {category.descriptionFr}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Product Showcase */}
        <div className="mb-12">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-8 text-center heading-professional">
            Exemples de Produits
          </h2>
          <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.slice(0, 8).map((product) => (
              <Card key={product.id} className="border-border">
                <CardContent className="p-4">
                  <div className="aspect-square bg-muted rounded mb-3 flex items-center justify-center">
                    <img 
                      src={product.image} 
                      alt={product.name}
                      className="w-full h-full object-cover rounded"
                    />
                  </div>
                  <h3 className="font-medium text-sm mb-1 text-foreground heading-professional">
                    {product.nameFr}
                  </h3>
                  <p className="text-xs text-muted-foreground mb-2 text-professional">
                    Code: {product.productCode}
                  </p>
                  <p className="font-bold text-primary heading-professional">
                    {product.price.toLocaleString()} DZD
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Contact Information */}
        <Card className="text-center border-border">
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
