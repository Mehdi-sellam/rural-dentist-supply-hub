
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
    'nav.search': 'Rechercher produit ou code...',
    'nav.catalog': 'Catalogue',
    
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
    'common.contactExperts': 'Contacter Nos Experts',
    'common.shopInteractive': 'Parcourir la Boutique',
    
    // Homepage
    'hero.title': 'Fournitures Dentaires Professionnelles',
    'hero.subtitle': 'Équipements de qualité européenne et asiatique pour votre cabinet dentaire',
    'hero.description': 'Équipements de qualité européenne et asiatique pour votre cabinet dentaire professionnel.',
    'hero.cta': 'Découvrir nos produits',
    'hero.pillars.bestPrices': 'Meilleurs Prix',
    'hero.pillars.paymentPlans': 'Paiement Échelonné',
    'hero.pillars.support': 'Support Client',
    'hero.pillars.sourced': 'Produits EU/Asie',
    'hero.pillars.pricesDesc': 'Prix compétitifs',
    'hero.pillars.paymentDesc': 'Facilités de paiement',
    'hero.pillars.supportDesc': 'Support dédié',
    'hero.pillars.sourcedDesc': 'Qualité garantie',
    
    // Info Section
    'info.title': 'Pourquoi Choisir DentGo ?',
    'info.fastShipping': 'Livraison Rapide',
    'info.fastShippingDesc': 'Livraison dans toute l\'Algérie sous 24-48h',
    'info.bestPrices': 'Meilleurs Prix',
    'info.bestPricesDesc': 'Prix compétitifs garantis sur tous nos produits',
    'info.installmentPayment': 'Paiement Échelonné',
    'info.installmentDesc': 'Options de paiement flexibles pour votre cabinet',
    'info.customerSupport': 'Support Client 24/7',
    'info.supportDesc': 'Assistance professionnelle disponible à tout moment',
    
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
    'contact.sendWhatsApp': 'Envoyer via WhatsApp',
    'contact.sendTelegram': 'Envoyer via Telegram',
    
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
    
    // Catalog
    'catalog.title': 'Catalogue Produits',
    'catalog.description': 'Catalogue complet de nos produits dentaires professionnels',
    'catalog.download': 'Télécharger le PDF',
    'catalog.helpChoose': 'Besoin d\'Aide pour Choisir ?',
    'catalog.helpDescription': 'Nos experts peuvent vous aider à sélectionner les bons produits pour votre cabinet',
    
    // Footer
    'footer.company': 'DentGo',
    'footer.description': 'Votre partenaire de confiance pour les fournitures dentaires professionnelles en Algérie.',
    'footer.quickLinks': 'Liens Rapides',
    'footer.categories': 'Catégories',
    'footer.support': 'Support',
    'footer.contact': 'Contact',
    'footer.rights': 'Tous droits réservés.',
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
    'nav.search': 'Search product or code...',
    'nav.catalog': 'Catalog',
    
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
    'common.contactExperts': 'Contact Our Experts',
    'common.shopInteractive': 'Browse Interactive Shop',
    
    // Homepage
    'hero.title': 'Professional Dental Supplies',
    'hero.subtitle': 'European and Asian quality equipment for your dental practice',
    'hero.description': 'European and Asian quality equipment for your professional dental practice.',
    'hero.cta': 'Discover our products',
    'hero.pillars.bestPrices': 'Best Prices',
    'hero.pillars.paymentPlans': 'Payment Plans',
    'hero.pillars.support': 'Customer Support',
    'hero.pillars.sourced': 'EU/Asia Sourced',
    'hero.pillars.pricesDesc': 'Competitive prices',
    'hero.pillars.paymentDesc': 'Payment facilities',
    'hero.pillars.supportDesc': 'Dedicated support',
    'hero.pillars.sourcedDesc': 'Guaranteed quality',
    
    // Info Section
    'info.title': 'Why Choose DentGo?',
    'info.fastShipping': 'Fast Shipping',
    'info.fastShippingDesc': 'Delivery across Algeria within 24-48h',
    'info.bestPrices': 'Best Prices',
    'info.bestPricesDesc': 'Guaranteed competitive prices on all our products',
    'info.installmentPayment': 'Installment Payment',
    'info.installmentDesc': 'Flexible payment options for your practice',
    'info.customerSupport': '24/7 Customer Support',
    'info.supportDesc': 'Professional assistance available at any time',
    
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
    'contact.sendWhatsApp': 'Send via WhatsApp',
    'contact.sendTelegram': 'Send via Telegram',
    
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
    
    // Catalog
    'catalog.title': 'Product Catalog',
    'catalog.description': 'Complete catalog of our professional dental products',
    'catalog.download': 'Download PDF',
    'catalog.helpChoose': 'Need Help Choosing?',
    'catalog.helpDescription': 'Our experts can help you select the right products for your practice',
    
    // Footer
    'footer.company': 'DentGo',
    'footer.description': 'Your trusted partner for professional dental supplies in Algeria.',
    'footer.quickLinks': 'Quick Links',
    'footer.categories': 'Categories',
    'footer.support': 'Support',
    'footer.contact': 'Contact',
    'footer.rights': 'All rights reserved.',
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
