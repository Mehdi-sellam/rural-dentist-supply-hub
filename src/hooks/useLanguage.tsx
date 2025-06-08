
import React, { createContext, useContext, useState, ReactNode } from 'react';

type Language = 'fr' | 'ar' | 'en';

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
    
    // Common
    'common.addToCart': 'Ajouter au panier',
    'common.orderWhatsApp': 'Commander via WhatsApp',
    'common.price': 'Prix',
    'common.inStock': 'En stock',
    'common.outOfStock': 'Rupture de stock',
    'common.viewAll': 'Voir tout',
    'common.loading': 'Chargement...',
    
    // Homepage
    'hero.title': 'Fournitures Dentaires pour l\'Algérie Rurale',
    'hero.subtitle': 'Équipements professionnels livrés directement à votre clinique',
    'hero.cta': 'Découvrir nos produits',
    
    // Product categories
    'category.restoratives': 'Restaurations',
    'category.surgical': 'Instruments Chirurgicaux',
    'category.disposables': 'Jetables',
    'category.equipment': 'Équipements',
    'category.orthodontics': 'Orthodontie',
    'category.endodontics': 'Endodontie',
    
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
    'lang.arabic': 'العربية',
    'lang.english': 'English'
  },
  ar: {
    // Navigation
    'nav.home': 'الرئيسية',
    'nav.shop': 'المتجر',
    'nav.bundles': 'الحزم',
    'nav.loyalty': 'الولاء',
    'nav.about': 'حولنا',
    'nav.contact': 'اتصل',
    'nav.faq': 'الأسئلة',
    'nav.cart': 'السلة',
    
    // Common
    'common.addToCart': 'أضف للسلة',
    'common.orderWhatsApp': 'اطلب عبر واتساب',
    'common.price': 'السعر',
    'common.inStock': 'متوفر',
    'common.outOfStock': 'غير متوفر',
    'common.viewAll': 'عرض الكل',
    'common.loading': 'جاري التحميل...',
    
    // Homepage
    'hero.title': 'مستلزمات طب الأسنان للجزائر الريفية',
    'hero.subtitle': 'معدات مهنية توصل مباشرة لعيادتك',
    'hero.cta': 'اكتشف منتجاتنا',
    
    // Product categories
    'category.restoratives': 'مواد الترميم',
    'category.surgical': 'أدوات الجراحة',
    'category.disposables': 'المواد المستهلكة',
    'category.equipment': 'المعدات',
    'category.orthodontics': 'تقويم الأسنان',
    'category.endodontics': 'علاج الجذور',
    
    // Cart
    'cart.title': 'سلة التسوق',
    'cart.empty': 'السلة فارغة',
    'cart.total': 'المجموع',
    'cart.checkout': 'إتمام الطلب',
    'cart.quantity': 'الكمية',
    'cart.remove': 'حذف',
    
    // Contact
    'contact.title': 'اتصل بنا',
    'contact.name': 'الاسم',
    'contact.email': 'البريد الإلكتروني',
    'contact.message': 'الرسالة',
    'contact.send': 'إرسال',
    
    // About
    'about.title': 'حول DentGo',
    'about.mission': 'مهمتنا',
    
    // Bundles
    'bundles.title': 'حزم الإجراءات',
    'bundles.save': 'وفر',
    'bundles.includes': 'يتضمن:',
    
    // FAQ
    'faq.title': 'الأسئلة الشائعة',
    
    // Languages
    'lang.french': 'Français',
    'lang.arabic': 'العربية',
    'lang.english': 'English'
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
    
    // Common
    'common.addToCart': 'Add to Cart',
    'common.orderWhatsApp': 'Order via WhatsApp',
    'common.price': 'Price',
    'common.inStock': 'In Stock',
    'common.outOfStock': 'Out of Stock',
    'common.viewAll': 'View All',
    'common.loading': 'Loading...',
    
    // Homepage
    'hero.title': 'Dental Supplies for Rural Algeria',
    'hero.subtitle': 'Professional equipment delivered directly to your clinic',
    'hero.cta': 'Discover our products',
    
    // Product categories
    'category.restoratives': 'Restoratives',
    'category.surgical': 'Surgical Tools',
    'category.disposables': 'Disposables',
    'category.equipment': 'Equipment',
    'category.orthodontics': 'Orthodontics',
    'category.endodontics': 'Endodontics',
    
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
    'lang.arabic': 'العربية',
    'lang.english': 'English'
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
      <div className={language === 'ar' ? 'rtl' : 'ltr'}>
        {children}
      </div>
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
