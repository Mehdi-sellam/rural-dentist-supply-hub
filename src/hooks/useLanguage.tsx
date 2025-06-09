
import React, { createContext, useContext, ReactNode } from 'react';

interface LanguageContextType {
  t: (key: string) => string;
}

const translations = {
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
  'hero.pillars.pricesDesc': 'Prix compétitifs garantis',
  'hero.pillars.paymentDesc': 'Facilités de paiement flexibles',
  'hero.pillars.supportDesc': 'Support dédié 24/7',
  'hero.pillars.sourcedDesc': 'Qualité européenne et asiatique',
  
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
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const t = (key: string): string => {
    return translations[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ t }}>
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
