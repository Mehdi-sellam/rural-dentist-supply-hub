import React, { useEffect } from 'react';
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AuthProvider } from "@/context/AuthContext";
import { CartProvider } from "@/context/CartContext";
import { LanguageProvider } from "@/hooks/useLanguage";
import WhatsAppFloat from "@/components/WhatsAppFloat";
import Index from "./pages/Index";
import Shop from "./pages/Shop";
import Cart from "./pages/Cart";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Bundles from "./pages/Bundles";
import Catalog from "./pages/Catalog";
import FAQ from "./pages/FAQ";
import Loyalty from "./pages/Loyalty";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Checkout from "./pages/Checkout";
import OrderConfirmation from "./pages/OrderConfirmation";
import Dashboard from "./pages/Dashboard";
import AdminDashboard from "./pages/AdminDashboard";
import Account from "./pages/Account";
import NotFound from "./pages/NotFound";
import Auth from "./pages/Auth";
import TestSuite from "./pages/TestSuite";

const queryClient = new QueryClient();

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

// Wrapper to supply session from AuthContext to AdminDashboard
const AdminDashboardWrapper = () => {
  const { session } = useAuth();
  return <AdminDashboard session={session} />;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <LanguageProvider>
      <AuthProvider>
        <CartProvider>
          <TooltipProvider>
            <Toaster />
            <BrowserRouter>
              <ScrollToTop />
              <div className="page-transition">
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/shop" element={<Shop />} />
                  <Route path="/cart" element={<Cart />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/contact" element={<Contact />} />
                  <Route path="/bundles" element={<Bundles />} />
                  <Route path="/catalog" element={<Catalog />} />
                  <Route path="/faq" element={<FAQ />} />
                  <Route path="/loyalty" element={<Loyalty />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  <Route path="/checkout" element={<Checkout />} />
                  <Route path="/order-confirmation" element={<OrderConfirmation />} />
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/admin" element={<AdminDashboardWrapper />} />
                  <Route path="/account" element={<Account />} />
                  <Route path="/auth" element={<Auth />} />
                  <Route path="/test" element={<TestSuite />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
                <WhatsAppFloat />
              </div>
            </BrowserRouter>
          </TooltipProvider>
        </CartProvider>
      </AuthProvider>
    </LanguageProvider>
  </QueryClientProvider>
);

export default App;
