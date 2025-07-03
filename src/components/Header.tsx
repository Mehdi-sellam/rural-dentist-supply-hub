
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { Menu, Search, ShoppingCart, User, LogOut, Settings, Bell } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/hooks/useLanguage';
import { supabase } from '@/integrations/supabase/client';

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [unreadNotifications, setUnreadNotifications] = useState(0);
  const { itemCount } = useCart();
  const { user, profile, logout } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/shop?search=${encodeURIComponent(searchTerm.trim())}`);
      setSearchTerm('');
      setIsOpen(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const isAdmin = profile?.is_admin;

  // Check for unread notifications (new responses from admins)
  useEffect(() => {
    const checkNotifications = async () => {
      if (!user || isAdmin) return;
      
      const { data: messages } = await supabase
        .from('messages')
        .select(`
          id, 
          message_responses(
            id,
            created_at, 
            responder_id,
            responder_profile:profiles!message_responses_responder_id_fkey(
              id,
              full_name,
              is_admin
            )
          )
        `)
        .eq('user_id', user.id)
        .neq('status', 'closed');
      
      if (messages) {
        let unreadCount = 0;
        messages.forEach((msg: any) => {
          const adminResponses = msg.message_responses?.filter((resp: any) => 
            resp.responder_id !== user.id && resp.responder_profile?.is_admin
          ) || [];
          unreadCount += adminResponses.length;
        });
        setUnreadNotifications(unreadCount);
      }
    };

    checkNotifications();
    
    // Set up real-time subscription for new responses
    const channel = supabase
      .channel('message_responses_changes')
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'message_responses'
      }, (payload) => {
        console.log('New message response received:', payload);
        checkNotifications();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, isAdmin]);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">DG</span>
            </div>
            <span className="font-bold text-xl text-primary">DentGo</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link to="/" className="text-sm font-medium hover:text-primary transition-colors">
              {t('nav.home')}
            </Link>
            <Link to="/shop" className="text-sm font-medium hover:text-primary transition-colors">
              {t('nav.shop')}
            </Link>
            <Link to="/bundles" className="text-sm font-medium hover:text-primary transition-colors">
              {t('nav.bundles')}
            </Link>
            <Link to="/catalog" className="text-sm font-medium hover:text-primary transition-colors">
              {t('nav.catalog')}
            </Link>
            <Link to="/about" className="text-sm font-medium hover:text-primary transition-colors">
              {t('nav.about')}
            </Link>
            <Link to="/contact" className="text-sm font-medium hover:text-primary transition-colors">
              {t('nav.contact')}
            </Link>
          </nav>

          {/* Search Bar */}
          <div className="hidden lg:flex flex-1 max-w-md mx-6">
            <form onSubmit={handleSearch} className="relative w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                type="search"
                placeholder={t('nav.search')}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-full"
              />
            </form>
          </div>

          {/* Right side actions */}
          <div className="flex items-center space-x-4">
            {/* Notifications - Only for non-admin users */}
            {!isAdmin && user && unreadNotifications > 0 && (
              <div className="relative">
                <Button variant="ghost" size="sm" className="relative">
                  <Bell className="w-5 h-5" />
                  <Badge 
                    variant="destructive" 
                    className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
                  >
                    {unreadNotifications}
                  </Badge>
                </Button>
              </div>
            )}

            {/* Cart - Hidden for admin users */}
            {!isAdmin && (
              <Link to="/cart" className="relative">
                <Button variant="ghost" size="sm" className="relative">
                  <ShoppingCart className="w-5 h-5" />
                  {itemCount > 0 && (
                    <Badge 
                      variant="destructive" 
                      className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
                    >
                      {itemCount}
                    </Badge>
                  )}
                </Button>
              </Link>
            )}

            {/* User Menu */}
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm">
                    <User className="w-5 h-5 mr-2" />
                    {profile?.full_name || user.email}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  {isAdmin ? (
                    <>
                      <DropdownMenuItem onClick={() => navigate('/admin')}>
                        <Settings className="w-4 h-4 mr-2" />
                        Administration
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => navigate('/account')}>
                        <User className="w-4 h-4 mr-2" />
                        Informations de compte
                      </DropdownMenuItem>
                    </>
                  ) : (
                    <>
                      <DropdownMenuItem onClick={() => navigate('/dashboard')}>
                        <ShoppingCart className="w-4 h-4 mr-2" />
                        Mes commandes
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => navigate('/account')}>
                        <User className="w-4 h-4 mr-2" />
                        Informations de compte
                      </DropdownMenuItem>
                    </>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="w-4 h-4 mr-2" />
                    Se déconnecter
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link to="/auth">
                <Button variant="outline" size="sm">
                  Se connecter
                </Button>
              </Link>
            )}

            {/* Mobile Menu */}
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild className="md:hidden">
                <Button variant="ghost" size="sm">
                  <Menu className="w-5 h-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                <nav className="flex flex-col space-y-4">
                  <Link 
                    to="/" 
                    className="text-lg font-medium hover:text-primary transition-colors"
                    onClick={() => setIsOpen(false)}
                  >
                    {t('nav.home')}
                  </Link>
                  <Link 
                    to="/shop" 
                    className="text-lg font-medium hover:text-primary transition-colors"
                    onClick={() => setIsOpen(false)}
                  >
                    {t('nav.shop')}
                  </Link>
                  <Link 
                    to="/bundles" 
                    className="text-lg font-medium hover:text-primary transition-colors"
                    onClick={() => setIsOpen(false)}
                  >
                    {t('nav.bundles')}
                  </Link>
                  <Link 
                    to="/catalog" 
                    className="text-lg font-medium hover:text-primary transition-colors"
                    onClick={() => setIsOpen(false)}
                  >
                    {t('nav.catalog')}
                  </Link>
                  <Link 
                    to="/about" 
                    className="text-lg font-medium hover:text-primary transition-colors"
                    onClick={() => setIsOpen(false)}
                  >
                    {t('nav.about')}
                  </Link>
                  <Link 
                    to="/contact" 
                    className="text-lg font-medium hover:text-primary transition-colors"
                    onClick={() => setIsOpen(false)}
                  >
                    {t('nav.contact')}
                  </Link>
                  
                  {/* Mobile Search */}
                  <div className="pt-4">
                    <form onSubmit={handleSearch}>
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                        <Input
                          type="search"
                          placeholder={t('nav.search')}
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="pl-10 w-full"
                        />
                      </div>
                    </form>
                  </div>
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
