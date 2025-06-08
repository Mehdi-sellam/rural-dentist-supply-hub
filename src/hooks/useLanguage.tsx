
import React, { createContext, useContext, useState, ReactNode } from 'react';

type Language = 'fr' | 'en';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations = {
  fr: {
    // Navigation
    'nav.home': 'Accueil',
    'nav.shop': 'Boutique',
    'nav.bundles': 'Kits',
    'nav.loyalty': 'Fidélité',
    'nav.about': 'À propos',
    'nav.contact': 'Contact',
    'nav.faq': 'FAQ',
    'nav.cart': 'Panier',
    'nav.search': 'Rechercher...',
    
    // Common
    'common.addToCart': 'Ajouter au panier',
    'common.orderWhatsApp': 'Commander via WhatsApp',
    'common.orderTelegram': 'Commander via Telegram',
    'common.price': 'Prix',
    'common.inStock': 'En stock',
    'common.outOfStock': 'Rupture de stock',
    'common.viewAll': 'Voir tout',
    'common.loading': 'Chargement...',
    'common.bestPrices': 'Meilleurs Prix',
    'common.paymentPlans': 'Paiement Échelonné',
    'common.customerSupport': 'Support Client',
    'common.euAsiaSourced': 'Produits EU/Asie',
    'common.fastShipping': 'Livraison Rapide',
    'common.installmentPayment': 'Paiement Échelonné',
    'common.downloadCatalog': 'Télécharger le Catalogue',
    
    // Homepage
    'hero.title': 'Fournitures Dentaires Professionnelles',
    'hero.subtitle': 'Équipements de qualité européenne et asiatique pour votre cabinet dentaire',
    'hero.cta': 'Découvrir nos produits',
    'hero.pillars.bestPrices': 'Meilleurs Prix',
    'hero.pillars.paymentPlans': 'Paiement Échelonné',
    'hero.pillars.support': 'Support Client',
    'hero.pillars.sourced': 'Produits EU/Asie',
    
    // Product categories
    'category.restoratives': 'Restaurations',
    'category.surgical': 'Instruments Chirurgicaux',
    'category.disposables': 'Jetables',
    'category.equipment': 'Équipements',
    'category.orthodontics': 'Orthodontie',
    'category.endodontics': 'Endodontie',
    'category.sterilization': 'Stérilisation',
    
    // Cart
    'cart.title': 'Votre Panier',
    'cart.empty': 'Votre panier est vide',
    'cart.total': 'Total',
    'cart.checkout': 'Passer commande',
    'cart.quantity': 'Quantité',
    'cart.remove': 'Supprimer',
    
    // Contact
    'contact.title': 'Contactez-nous',
    'contact.name': 'Nom',
    'contact.email': 'Email',
    'contact.message': 'Message',
    'contact.send': 'Envoyer',
    
    // About
    'about.title': 'À Propos de DentGo',
    'about.mission': 'Notre Mission',
    
    // Bundles
    'bundles.title': 'Kits Procédures',
    'bundles.save': 'Économisez',
    'bundles.includes': 'Contient:',
    
    // FAQ
    'faq.title': 'Questions Fréquentes',
    
    // Languages
    'lang.french': 'Français',
    'lang.english': 'English',
    
    // Info section
    'info.fastShipping': 'Livraison Rapide',
    'info.bestPrices': 'Meilleurs Prix',
    'info.installmentPayment': 'Paiement Échelonné',
    'info.customerSupport': 'Support Client',
    
    // Catalog
    'catalog.title': 'Catalogue Produits',
    'catalog.description': 'Catalogue complet de nos produits dentaires professionnels',
    'catalog.download': 'Télécharger le PDF'
  },
  en: {
    // Navigation
    'nav.home': 'Home',
    'nav.shop': 'Shop',
    'nav.bundles': 'Bundles',
    'nav.loyalty': 'Loyalty',
    'nav.about': 'About',
    'nav.contact': 'Contact',
    'nav.faq': 'FAQ',
    'nav.cart': 'Cart',
    'nav.search': 'Search...',
    
    // Common
    'common.addToCart': 'Add to Cart',
    'common.orderWhatsApp': 'Order via WhatsApp',
    'common.orderTelegram': 'Order via Telegram',
    'common.price': 'Price',
    'common.inStock': 'In Stock',
    'common.outOfStock': 'Out of Stock',
    'common.viewAll': 'View All',
    'common.loading': 'Loading...',
    'common.bestPrices': 'Best Prices',
    'common.paymentPlans': 'Payment Plans',
    'common.customerSupport': 'Customer Support',
    'common.euAsiaSourced': 'EU/Asia Sourced',
    'common.fastShipping': 'Fast Shipping',
    'common.installmentPayment': 'Installment Payment',
    'common.downloadCatalog': 'Download Catalog',
    
    // Homepage
    'hero.title': 'Professional Dental Supplies',
    'hero.subtitle': 'European and Asian quality equipment for your dental practice',
    'hero.cta': 'Discover our products',
    'hero.pillars.bestPrices': 'Best Prices',
    'hero.pillars.paymentPlans': 'Payment Plans',
    'hero.pillars.support': 'Customer Support',
    'hero.pillars.sourced': 'EU/Asia Sourced',
    
    // Product categories
    'category.restoratives': 'Restoratives',
    'category.surgical': 'Surgical Tools',
    'category.disposables': 'Disposables',
    'category.equipment': 'Equipment',
    'category.orthodontics': 'Orthodontics',
    'category.endodontics': 'Endodontics',
    'category.sterilization': 'Sterilization',
    
    // Cart
    'cart.title': 'Your Cart',
    'cart.empty': 'Your cart is empty',
    'cart.total': 'Total',
    'cart.checkout': 'Checkout',
    'cart.quantity': 'Quantity',
    'cart.remove': 'Remove',
    
    // Contact
    'contact.title': 'Contact Us',
    'contact.name': 'Name',
    'contact.email': 'Email',
    'contact.message': 'Message',
    'contact.send': 'Send',
    
    // About
    'about.title': 'About DentGo',
    'about.mission': 'Our Mission',
    
    // Bundles
    'bundles.title': 'Procedure Bundles',
    'bundles.save': 'Save',
    'bundles.includes': 'Includes:',
    
    // FAQ
    'faq.title': 'Frequently Asked Questions',
    
    // Languages
    'lang.french': 'Français',
    'lang.english': 'English',
    
    // Info section
    'info.fastShipping': 'Fast Shipping',
    'info.bestPrices': 'Best Prices',
    'info.installmentPayment': 'Installment Payment',
    'info.customerSupport': 'Customer Support',
    
    // Catalog
    'catalog.title': 'Product Catalog',
    'catalog.description': 'Complete catalog of our professional dental products',
    'catalog.download': 'Download PDF'
  }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguage] = useState<Language>('fr'); // French as default

  const t = (key: string): string => {
    return translations[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
