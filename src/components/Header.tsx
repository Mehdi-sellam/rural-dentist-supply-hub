
import React, { useState } from 'react';
import { Search, User, ShoppingCart, Menu, X, Heart, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [language, setLanguage] = useState('en');

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'ar' : language === 'ar' ? 'fr' : 'en');
  };

  const getLanguageLabel = () => {
    switch (language) {
      case 'ar': return 'العربية';
      case 'fr': return 'Français';
      default: return 'English';
    }
  };

  return (
    <header className="bg-white shadow-sm border-b sticky top-0 z-50">
      {/* Top bar */}
      <div className="bg-primary text-primary-foreground py-2 px-4">
        <div className="container mx-auto flex justify-between items-center text-sm">
          <p>🚀 Free delivery to rural areas • Livraison gratuite • توصيل مجاني</p>
          <div className="flex items-center gap-4">
            <Phone className="w-4 h-4" />
            <span>WhatsApp: +213 XXX XXX XXX</span>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
              <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center">
                <div className="w-3 h-3 bg-primary rounded-full"></div>
              </div>
            </div>
            <div>
              <h1 className="text-xl font-bold text-primary">DentGo</h1>
              <p className="text-xs text-muted-foreground">Supplies that travel to you</p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <a href="/" className="text-foreground hover:text-primary transition-colors">Home</a>
            <a href="/shop" className="text-foreground hover:text-primary transition-colors">Shop</a>
            <a href="/bundles" className="text-foreground hover:text-primary transition-colors">Bundles</a>
            <a href="/loyalty" className="text-foreground hover:text-primary transition-colors">Loyalty</a>
            <a href="/about" className="text-foreground hover:text-primary transition-colors">About</a>
            <a href="/contact" className="text-foreground hover:text-primary transition-colors">Contact</a>
          </nav>

          {/* Right side actions */}
          <div className="flex items-center space-x-4">
            {/* Language toggle */}
            <Button 
              variant="outline" 
              size="sm" 
              onClick={toggleLanguage}
              className="hidden sm:flex"
            >
              {getLanguageLabel()}
            </Button>

            {/* Search */}
            <Button variant="ghost" size="sm" className="hidden sm:flex">
              <Search className="w-4 h-4" />
            </Button>

            {/* Wishlist */}
            <Button variant="ghost" size="sm" className="relative">
              <Heart className="w-4 h-4" />
              <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 text-xs">3</Badge>
            </Button>

            {/* Cart */}
            <Button variant="ghost" size="sm" className="relative">
              <ShoppingCart className="w-4 h-4" />
              <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 text-xs">2</Badge>
            </Button>

            {/* Account */}
            <Button variant="ghost" size="sm" className="hidden sm:flex">
              <User className="w-4 h-4" />
            </Button>

            {/* Mobile menu toggle */}
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <nav className="md:hidden mt-4 pb-4 border-t pt-4">
            <div className="flex flex-col space-y-3">
              <a href="/" className="text-foreground hover:text-primary transition-colors py-2">Home</a>
              <a href="/shop" className="text-foreground hover:text-primary transition-colors py-2">Shop</a>
              <a href="/bundles" className="text-foreground hover:text-primary transition-colors py-2">Bundles</a>
              <a href="/loyalty" className="text-foreground hover:text-primary transition-colors py-2">Loyalty</a>
              <a href="/about" className="text-foreground hover:text-primary transition-colors py-2">About</a>
              <a href="/contact" className="text-foreground hover:text-primary transition-colors py-2">Contact</a>
              <div className="flex items-center justify-between pt-2 border-t">
                <Button variant="outline" size="sm" onClick={toggleLanguage}>
                  {getLanguageLabel()}
                </Button>
                <Button variant="ghost" size="sm">
                  <Search className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;
