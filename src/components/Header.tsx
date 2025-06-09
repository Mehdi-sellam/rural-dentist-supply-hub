import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Search, User, ShoppingCart, Menu, X, Phone, MessageCircle, Send, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/hooks/useLanguage';
import { products } from '@/data/products';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { itemCount } = useCart();
  const { user, logout } = useAuth();
  const { language, setLanguage, t } = useLanguage();

  const toggleLanguage = () => {
    const newLanguage = language === 'fr' ? 'en' : 'fr';
    setLanguage(newLanguage);
  };

  const getLanguageLabel = () => {
    return language === 'fr' ? t('lang.french') : t('lang.english');
  };

  const isActivePage = (path: string) => {
    return location.pathname === path;
  };

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    if (value.length > 0) {
      const results = products.filter(product =>
        product.name.toLowerCase().includes(value.toLowerCase()) ||
        product.nameFr.toLowerCase().includes(value.toLowerCase()) ||
        product.productId.includes(value) ||
        product.productCode.includes(value)
      ).slice(0, 5);
      setSearchResults(results);
      setShowResults(true);
    } else {
      setShowResults(false);
    }
  };

  const selectProduct = (product) => {
    setSearchTerm('');
    setShowResults(false);
    navigate(`/shop?search=${product.name}`);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      setShowResults(false);
      navigate(`/shop?search=${searchTerm}`);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="bg-white shadow-sm border-b sticky top-0 z-50">
      {/* Top bar */}
      <div className="bg-primary text-primary-foreground py-2 px-4">
        <div className="container mx-auto flex justify-between items-center text-sm">
          <p className="text-professional">{t('common.fastShipping')} • {t('common.bestPrices')} • {t('common.customerSupport')}</p>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4" />
              <span>+213 XXX XXX XXX</span>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                className="p-1 h-auto text-primary-foreground hover:bg-primary-foreground/20"
                onClick={() => window.open('https://wa.me/213XXXXXXXXX', '_blank')}
              >
                <MessageCircle className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="p-1 h-auto text-primary-foreground hover:bg-primary-foreground/20"
                onClick={() => window.open('https://t.me/+213XXXXXXXXX', '_blank')}
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-primary border border-primary/20 flex items-center justify-center">
              <div className="w-6 h-6 bg-white flex items-center justify-center">
                <div className="w-3 h-3 bg-primary"></div>
              </div>
            </div>
            <div>
              <h1 className="text-xl font-bold text-primary heading-professional">DentGo</h1>
              <p className="text-xs text-muted-foreground text-professional">Professional Dental Supplies</p>
            </div>
          </Link>

          {/* Search Bar */}
          <div className="hidden md:flex relative flex-1 max-w-md mx-8">
            <form onSubmit={handleSearchSubmit} className="relative w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder={t('nav.search')}
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
                className="pl-10 border-border"
              />
              {showResults && searchResults.length > 0 && (
                <div className="absolute top-full left-0 right-0 bg-white border border-border mt-1 rounded-sm shadow-lg z-50">
                  {searchResults.map((product) => (
                    <div
                      key={product.id}
                      onClick={() => selectProduct(product)}
                      className="p-3 hover:bg-muted cursor-pointer border-b border-border last:border-0"
                    >
                      <div className="flex items-center gap-3">
                        <img src={product.image} alt={product.name} className="w-8 h-8 object-cover" />
                        <div>
                          <p className="text-sm font-medium text-professional">{language === 'fr' ? product.nameFr : product.name}</p>
                          <p className="text-xs text-muted-foreground">ID: {product.productCode}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </form>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link 
              to="/" 
              className={`transition-colors text-professional ${isActivePage('/') ? 'text-primary font-medium' : 'text-foreground hover:text-primary'}`}
            >
              {t('nav.home')}
            </Link>
            <Link 
              to="/shop" 
              className={`transition-colors text-professional ${isActivePage('/shop') ? 'text-primary font-medium' : 'text-foreground hover:text-primary'}`}
            >
              {t('nav.shop')}
            </Link>
            <Link 
              to="/bundles" 
              className={`transition-colors text-professional ${isActivePage('/bundles') ? 'text-primary font-medium' : 'text-foreground hover:text-primary'}`}
            >
              {t('nav.bundles')}
            </Link>
            <Link 
              to="/catalog" 
              className={`transition-colors text-professional ${isActivePage('/catalog') ? 'text-primary font-medium' : 'text-foreground hover:text-primary'}`}
            >
              {t('nav.catalog')}
            </Link>
            <Link 
              to="/about" 
              className={`transition-colors text-professional ${isActivePage('/about') ? 'text-primary font-medium' : 'text-foreground hover:text-primary'}`}
            >
              {t('nav.about')}
            </Link>
            <Link 
              to="/contact" 
              className={`transition-colors text-professional ${isActivePage('/contact') ? 'text-primary font-medium' : 'text-foreground hover:text-primary'}`}
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
              className="hidden sm:flex text-professional border-border"
            >
              {getLanguageLabel()}
            </Button>

            {/* Cart */}
            <Link to="/cart">
              <Button variant="ghost" size="sm" className="relative">
                <ShoppingCart className="w-4 h-4" />
                {itemCount > 0 && (
                  <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 text-xs bg-primary">
                    {itemCount}
                  </Badge>
                )}
              </Button>
            </Link>

            {/* User Menu */}
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="flex items-center gap-2">
                    <User className="w-4 h-4" />
                    <span className="hidden sm:inline">{user.fullName.split(' ')[0]}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => navigate('/dashboard')}>
                    Mes commandes
                  </DropdownMenuItem>
                  {user.isAdmin && (
                    <DropdownMenuItem onClick={() => navigate('/admin')}>
                      Administration
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="w-4 h-4 mr-2" />
                    Déconnexion
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link to="/login">
                <Button variant="outline" size="sm" className="hidden sm:flex">
                  Connexion
                </Button>
              </Link>
            )}

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
              {/* Mobile Search */}
              <form onSubmit={handleSearchSubmit} className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder={t('nav.search')}
                  value={searchTerm}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="pl-10 border-border"
                />
              </form>
              
              {/* Navigation Links */}
              <Link 
                to="/" 
                className={`transition-colors py-2 text-professional ${isActivePage('/') ? 'text-primary font-medium' : 'text-foreground hover:text-primary'}`}
                onClick={() => setIsMenuOpen(false)}
              >
                {t('nav.home')}
              </Link>
              <Link 
                to="/shop" 
                className={`transition-colors py-2 text-professional ${isActivePage('/shop') ? 'text-primary font-medium' : 'text-foreground hover:text-primary'}`}
                onClick={() => setIsMenuOpen(false)}
              >
                {t('nav.shop')}
              </Link>
              <Link 
                to="/bundles" 
                className={`transition-colors py-2 text-professional ${isActivePage('/bundles') ? 'text-primary font-medium' : 'text-foreground hover:text-primary'}`}
                onClick={() => setIsMenuOpen(false)}
              >
                {t('nav.bundles')}
              </Link>
              <Link 
                to="/catalog" 
                className={`transition-colors py-2 text-professional ${isActivePage('/catalog') ? 'text-primary font-medium' : 'text-foreground hover:text-primary'}`}
                onClick={() => setIsMenuOpen(false)}
              >
                {t('nav.catalog')}
              </Link>
              <Link 
                to="/about" 
                className={`transition-colors py-2 text-professional ${isActivePage('/about') ? 'text-primary font-medium' : 'text-foreground hover:text-primary'}`}
                onClick={() => setIsMenuOpen(false)}
              >
                {t('nav.about')}
              </Link>
              <Link 
                to="/contact" 
                className={`transition-colors py-2 text-professional ${isActivePage('/contact') ? 'text-primary font-medium' : 'text-foreground hover:text-primary'}`}
                onClick={() => setIsMenuOpen(false)}
              >
                {t('nav.contact')}
              </Link>
              
              {user ? (
                <>
                  <Link 
                    to="/dashboard" 
                    className="transition-colors py-2 text-professional text-foreground hover:text-primary"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Mes commandes
                  </Link>
                  {user.isAdmin && (
                    <Link 
                      to="/admin" 
                      className="transition-colors py-2 text-professional text-foreground hover:text-primary"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Administration
                    </Link>
                  )}
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      handleLogout();
                      setIsMenuOpen(false);
                    }}
                    className="text-left justify-start"
                  >
                    Déconnexion
                  </Button>
                </>
              ) : (
                <Link 
                  to="/login" 
                  className="transition-colors py-2 text-professional text-foreground hover:text-primary"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Connexion
                </Link>
              )}
              
              <div className="flex items-center justify-between pt-2 border-t">
                <Button variant="outline" size="sm" onClick={toggleLanguage} className="border-border">
                  {getLanguageLabel()}
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
