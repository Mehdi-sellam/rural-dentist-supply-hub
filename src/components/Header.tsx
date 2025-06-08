
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Search, User, ShoppingCart, Menu, X, Heart, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useCart } from '@/context/CartContext';
import { useLanguage } from '@/hooks/useLanguage';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const { itemCount } = useCart();
  const { language, setLanguage, t } = useLanguage();

  const toggleLanguage = () => {
    const languages = ['fr', 'ar', 'en'] as const;
    const currentIndex = languages.indexOf(language);
    const nextIndex = (currentIndex + 1) % languages.length;
    setLanguage(languages[nextIndex]);
  };

  const getLanguageLabel = () => {
    switch (language) {
      case 'ar': return t('lang.arabic');
      case 'fr': return t('lang.french');
      case 'en': return t('lang.english');
      default: return t('lang.french');
    }
  };

  const isActivePage = (path: string) => {
    return location.pathname === path;
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
          <Link to="/" className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
              <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center">
                <div className="w-3 h-3 bg-primary rounded-full"></div>
              </div>
            </div>
            <div>
              <h1 className="text-xl font-bold text-primary heading-luxury">DentGo</h1>
              <p className="text-xs text-muted-foreground text-luxury">Supplies that travel to you</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link 
              to="/" 
              className={`transition-colors text-luxury ${isActivePage('/') ? 'text-primary font-medium' : 'text-foreground hover:text-primary'}`}
            >
              {t('nav.home')}
            </Link>
            <Link 
              to="/shop" 
              className={`transition-colors text-luxury ${isActivePage('/shop') ? 'text-primary font-medium' : 'text-foreground hover:text-primary'}`}
            >
              {t('nav.shop')}
            </Link>
            <Link 
              to="/bundles" 
              className={`transition-colors text-luxury ${isActivePage('/bundles') ? 'text-primary font-medium' : 'text-foreground hover:text-primary'}`}
            >
              {t('nav.bundles')}
            </Link>
            <Link 
              to="/catalog" 
              className={`transition-colors text-luxury ${isActivePage('/catalog') ? 'text-primary font-medium' : 'text-foreground hover:text-primary'}`}
            >
              Catalog
            </Link>
            <Link 
              to="/loyalty" 
              className={`transition-colors text-luxury ${isActivePage('/loyalty') ? 'text-primary font-medium' : 'text-foreground hover:text-primary'}`}
            >
              {t('nav.loyalty')}
            </Link>
            <Link 
              to="/about" 
              className={`transition-colors text-luxury ${isActivePage('/about') ? 'text-primary font-medium' : 'text-foreground hover:text-primary'}`}
            >
              {t('nav.about')}
            </Link>
            <Link 
              to="/contact" 
              className={`transition-colors text-luxury ${isActivePage('/contact') ? 'text-primary font-medium' : 'text-foreground hover:text-primary'}`}
            >
              {t('nav.contact')}
            </Link>
          </nav>

          {/* Right side actions */}
          <div className="flex items-center space-x-4">
            {/* Language toggle */}
            <Button 
              variant="outline" 
              size="sm" 
              onClick={toggleLanguage}
              className="hidden sm:flex text-luxury"
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
            <Link to="/cart">
              <Button variant="ghost" size="sm" className="relative">
                <ShoppingCart className="w-4 h-4" />
                {itemCount > 0 && (
                  <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 text-xs">
                    {itemCount}
                  </Badge>
                )}
              </Button>
            </Link>

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
              <Link 
                to="/" 
                className={`transition-colors py-2 text-luxury ${isActivePage('/') ? 'text-primary font-medium' : 'text-foreground hover:text-primary'}`}
                onClick={() => setIsMenuOpen(false)}
              >
                {t('nav.home')}
              </Link>
              <Link 
                to="/shop" 
                className={`transition-colors py-2 text-luxury ${isActivePage('/shop') ? 'text-primary font-medium' : 'text-foreground hover:text-primary'}`}
                onClick={() => setIsMenuOpen(false)}
              >
                {t('nav.shop')}
              </Link>
              <Link 
                to="/bundles" 
                className={`transition-colors py-2 text-luxury ${isActivePage('/bundles') ? 'text-primary font-medium' : 'text-foreground hover:text-primary'}`}
                onClick={() => setIsMenuOpen(false)}
              >
                {t('nav.bundles')}
              </Link>
              <Link 
                to="/catalog" 
                className={`transition-colors py-2 text-luxury ${isActivePage('/catalog') ? 'text-primary font-medium' : 'text-foreground hover:text-primary'}`}
                onClick={() => setIsMenuOpen(false)}
              >
                Catalog
              </Link>
              <Link 
                to="/loyalty" 
                className={`transition-colors py-2 text-luxury ${isActivePage('/loyalty') ? 'text-primary font-medium' : 'text-foreground hover:text-primary'}`}
                onClick={() => setIsMenuOpen(false)}
              >
                {t('nav.loyalty')}
              </Link>
              <Link 
                to="/about" 
                className={`transition-colors py-2 text-luxury ${isActivePage('/about') ? 'text-primary font-medium' : 'text-foreground hover:text-primary'}`}
                onClick={() => setIsMenuOpen(false)}
              >
                {t('nav.about')}
              </Link>
              <Link 
                to="/contact" 
                className={`transition-colors py-2 text-luxury ${isActivePage('/contact') ? 'text-primary font-medium' : 'text-foreground hover:text-primary'}`}
                onClick={() => setIsMenuOpen(false)}
              >
                {t('nav.contact')}
              </Link>
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
