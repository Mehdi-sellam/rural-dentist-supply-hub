
import { Product, Bundle } from '@/types/product';

export const products: Product[] = [
  {
    id: '1',
    name: 'Premium Composite Kit',
    nameAr: 'مجموعة الحشوات المركبة المتميزة',
    nameFr: 'Kit composite premium',
    description: 'Complete restoration kit with 8 shades for natural-looking fillings',
    descriptionAr: 'مجموعة ترميم كاملة مع 8 ألوان للحشوات الطبيعية',
    descriptionFr: 'Kit de restauration complet avec 8 teintes pour des obturations naturelles',
    price: 15900,
    originalPrice: 18500,
    image: '🦷',
    category: 'restoratives',
    rating: 4.8,
    reviews: 126,
    inStock: true,
    badge: 'Best Seller',
    specifications: ['8 composite shades', 'Bonding agent included', 'Etching gel', 'Application brushes']
  },
  {
    id: '2',
    name: 'Surgical Instruments Set',
    nameAr: 'مجموعة الأدوات الجراحية',
    nameFr: 'Set d\'instruments chirurgicaux',
    description: 'Professional grade stainless steel surgical instruments',
    descriptionAr: 'أدوات جراحية من الفولاذ المقاوم للصدأ عالية الجودة',
    descriptionFr: 'Instruments chirurgicaux en acier inoxydable de qualité professionnelle',
    price: 8750,
    image: '⚕️',
    category: 'surgical',
    rating: 4.9,
    reviews: 89,
    inStock: true,
    badge: 'New Arrival',
    specifications: ['Extraction forceps', 'Surgical scissors', 'Tissue forceps', 'Sterilizable']
  },
  {
    id: '3',
    name: 'Nitrile Gloves (100 Box)',
    nameAr: 'قفازات نيتريل (صندوق 100)',
    nameFr: 'Gants nitrile (boîte 100)',
    description: 'Powder-free, latex-free protection gloves',
    descriptionAr: 'قفازات حماية خالية من المسحوق واللاتكس',
    descriptionFr: 'Gants de protection sans poudre et sans latex',
    price: 2300,
    originalPrice: 2800,
    image: '🧤',
    category: 'disposables',
    rating: 4.7,
    reviews: 203,
    inStock: true,
    badge: 'Rural Favorite',
    specifications: ['100 pieces per box', 'Powder-free', 'Latex-free', 'Medical grade']
  },
  {
    id: '4',
    name: 'LED Curing Light',
    nameAr: 'ضوء المعالجة LED',
    nameFr: 'Lampe de polymérisation LED',
    description: 'High intensity, cordless design curing light',
    descriptionAr: 'ضوء معالجة عالي الكثافة بتصميم لاسلكي',
    descriptionFr: 'Lampe de polymérisation haute intensité, design sans fil',
    price: 12400,
    originalPrice: 14900,
    image: '💡',
    category: 'equipment',
    rating: 4.6,
    reviews: 67,
    inStock: true,
    badge: 'Limited Offer',
    specifications: ['Cordless operation', 'High intensity LED', '10 second cure time', 'Rechargeable battery']
  },
  {
    id: '5',
    name: 'Dental Impression Material',
    nameAr: 'مادة طبع الأسنان',
    nameFr: 'Matériau d\'empreinte dentaire',
    description: 'Fast-setting silicone impression material',
    descriptionAr: 'مادة طبع سيليكون سريعة التصلب',
    descriptionFr: 'Matériau d\'empreinte en silicone à prise rapide',
    price: 4200,
    image: '🎯',
    category: 'restoratives',
    rating: 4.5,
    reviews: 94,
    inStock: true,
    specifications: ['Fast setting', 'High precision', 'Dimensional stability', 'Easy mixing']
  },
  {
    id: '6',
    name: 'Orthodontic Brackets Set',
    nameAr: 'مجموعة أقواس تقويم الأسنان',
    nameFr: 'Set de brackets orthodontiques',
    description: 'Complete orthodontic brackets with adhesive',
    descriptionAr: 'أقواس تقويم أسنان كاملة مع لاصق',
    descriptionFr: 'Brackets orthodontiques complets avec adhésif',
    price: 6800,
    image: '🦾',
    category: 'orthodontics',
    rating: 4.7,
    reviews: 156,
    inStock: true,
    specifications: ['Metal brackets', 'Orthodontic adhesive', 'Various sizes', 'Easy placement']
  }
];

export const bundles: Bundle[] = [
  {
    id: '1',
    name: 'Complete Cavity Kit',
    nameAr: 'مجموعة علاج التسوس الكاملة',
    nameFr: 'Kit carie complet',
    description: 'Everything needed for cavity treatment',
    items: [
      'Composite filling materials (3 shades)',
      'Bonding agent',
      'Etching gel',
      'Disposable brushes',
      'Curing light tips'
    ],
    originalPrice: '24,500 DZD',
    bundlePrice: '18,900 DZD',
    savings: '5,600 DZD',
    procedures: '20+ procedures',
    popular: true
  },
  {
    id: '2',
    name: 'Surgical Starter Pack',
    nameAr: 'حزمة الجراحة للمبتدئين',
    nameFr: 'Pack chirurgie débutant',
    description: 'Essential tools for minor oral surgery',
    items: [
      'Extraction forceps set',
      'Surgical scissors',
      'Tissue forceps',
      'Suture materials',
      'Sterile gloves (50 pairs)'
    ],
    originalPrice: '19,800 DZD',
    bundlePrice: '15,200 DZD',
    savings: '4,600 DZD',
    procedures: '15+ procedures',
    popular: false
  },
  {
    id: '3',
    name: 'Monthly Essentials',
    nameAr: 'الأساسيات الشهرية',
    nameFr: 'Essentiels mensuels',
    description: 'Monthly supply of consumables',
    items: [
      'Disposable gloves (500 pieces)',
      'Face masks (100 pieces)',
      'Surface disinfectant',
      'Impression materials',
      'Cotton rolls & pellets'
    ],
    originalPrice: '8,900 DZD',
    bundlePrice: '7,200 DZD',
    savings: '1,700 DZD',
    procedures: 'Month supply',
    popular: false
  }
];

export const categories = [
  {
    id: 'restoratives',
    name: 'Restoratives',
    nameAr: 'مواد الترميم',
    nameFr: 'Matériaux de restauration',
    description: 'Composites, amalgams, cements',
    icon: '🦷',
    color: 'from-blue-100 to-blue-200'
  },
  {
    id: 'surgical',
    name: 'Surgical Tools',
    nameAr: 'أدوات الجراحة',
    nameFr: 'Instruments chirurgicaux',
    description: 'Forceps, elevators, scissors',
    icon: '⚕️',
    color: 'from-green-100 to-green-200'
  },
  {
    id: 'disposables',
    name: 'Disposables',
    nameAr: 'المواد المستهلكة',
    nameFr: 'Matériel jetable',
    description: 'Gloves, masks, syringes',
    icon: '🧤',
    color: 'from-purple-100 to-purple-200'
  },
  {
    id: 'equipment',
    name: 'Equipment',
    nameAr: 'المعدات',
    nameFr: 'Équipement',
    description: 'Units, compressors, lights',
    icon: '🔧',
    color: 'from-orange-100 to-orange-200'
  },
  {
    id: 'orthodontics',
    name: 'Orthodontics',
    nameAr: 'تقويم الأسنان',
    nameFr: 'Orthodontie',
    description: 'Brackets, wires, bands',
    icon: '🦾',
    color: 'from-teal-100 to-teal-200'
  },
  {
    id: 'endodontics',
    name: 'Endodontics',
    nameAr: 'علاج الجذور',
    nameFr: 'Endodontie',
    description: 'Files, sealers, irrigants',
    icon: '🔍',
    color: 'from-pink-100 to-pink-200'
  }
];
