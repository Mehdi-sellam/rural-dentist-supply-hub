
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
  'nav.admin': 'Administration',
  
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
  'common.save': 'Sauvegarder',
  'common.cancel': 'Annuler',
  'common.delete': 'Supprimer',
  'common.edit': 'Modifier',
  'common.add': 'Ajouter',
  'common.download': 'Télécharger',
  'common.yes': 'Oui',
  'common.no': 'Non',
  'common.confirm': 'Confirmer',
  'common.error': 'Erreur',
  'common.success': 'Succès',
  
  // Homepage & Hero
  'hero.title': 'Fournitures Dentaires Professionnelles',
  'hero.subtitle': 'Produits de qualité européenne et asiatique aux meilleurs prix avec facilités de paiement',
  'hero.description': 'Nous fournissons la meilleure qualité aux meilleurs prix avec des facilités de paiement et des livraisons régulières pour les dentistes.',
  'hero.cta': 'Découvrir nos produits',
  'hero.pillars.bestPrices': 'Meilleurs Prix',
  'hero.pillars.paymentPlans': 'Facilités de Paiement',
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
  'info.installmentPayment': 'Facilités de Paiement',
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
  'cart.continueShopping': 'Continuer les achats',
  'cart.orderSummary': 'Résumé de la commande',
  'cart.subtotal': 'Sous-total',
  'cart.shipping': 'Livraison',
  'cart.free': 'Gratuit',
  'cart.proceedCheckout': 'Passer à la commande',
  'cart.loginCheckout': 'Se connecter pour commander',
  'cart.orderViaWhatsApp': 'Commander via WhatsApp',
  'cart.freeDelivery': 'Livraison gratuite en zones rurales',
  'cart.support247': 'Support 24/7 disponible',
  'cart.qualityGuaranteed': 'Qualité garantie',
  
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
  
  // Admin Dashboard
  'admin.title': 'Administration',
  'admin.database': 'Base de données',
  'admin.orders': 'Commandes',
  'admin.clients': 'Clients',
  'admin.products': 'Produits',
  'admin.categories': 'Catégories',
  'admin.bundles': 'Kits',
  'admin.orderManagement': 'Gestion des commandes',
  'admin.noOrders': 'Aucune commande trouvée.',
  'admin.clientsRegistered': 'Clients enregistrés',
  'admin.noClients': 'Aucun client enregistré.',
  'admin.productManagement': 'Gestion des produits',
  'admin.addProduct': 'Ajouter produit',
  'admin.categoryManagement': 'Gestion des catégories',
  'admin.addCategory': 'Ajouter catégorie',
  'admin.bundleManagement': 'Gestion des kits',
  'admin.addBundle': 'Ajouter kit',
  'admin.downloadData': 'Télécharger les données',
  'admin.rollback': 'Rollback',
  'admin.seedDatabase': 'Alimenter la base',
  'admin.clearDatabase': 'Vider la base',
  
  // Footer
  'footer.company': 'DentGo',
  'footer.description': 'Votre partenaire de confiance pour les fournitures dentaires professionnelles en Algérie. Nous fournissons la meilleure qualité aux meilleurs prix.',
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
