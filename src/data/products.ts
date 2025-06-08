import { Product, Bundle } from '@/types/product';

export const products = [
  // Restoratives
  {
    id: 'rest-001',
    productId: '001',
    name: 'Premium Composite Kit',
    nameAr: 'طقم الحشوات المركبة المتميز',
    nameFr: 'Kit Composite Premium',
    description: 'Complete composite filling kit with 8 shades',
    descriptionAr: 'طقم حشوات مركبة كامل مع 8 درجات لونية',
    descriptionFr: 'Kit de composite complet avec 8 teintes',
    price: 15000,
    originalPrice: 18000,
    image: 'https://images.unsplash.com/photo-1609840114035-3c981b782dfe?w=400&h=400&fit=crop',
    category: 'restoratives',
    rating: 4.8,
    reviews: 124,
    inStock: true,
    badge: 'Best Seller'
  },
  {
    id: 'rest-002',
    productId: '002',
    name: 'Glass Ionomer Cement',
    nameAr: 'أسمنت الأيونومر الزجاجي',
    nameFr: 'Ciment Verre Ionomère',
    description: 'High-strength glass ionomer for restorations',
    descriptionAr: 'أيونومر زجاجي عالي القوة للحشوات',
    descriptionFr: 'Ionomère de verre haute résistance',
    price: 8500,
    image: 'https://images.unsplash.com/photo-1584362917165-526f9605e31a?w=400&h=400&fit=crop',
    category: 'restoratives',
    rating: 4.6,
    reviews: 89,
    inStock: true
  },
  {
    id: 'rest-003',
    productId: '003',
    name: 'Bonding Agent Set',
    nameAr: 'مجموعة مواد الربط',
    nameFr: 'Kit Agent de Liaison',
    description: 'Universal bonding system for all substrates',
    descriptionAr: 'نظام ربط شامل لجميع الأسطح',
    descriptionFr: 'Système de collage universel',
    price: 12000,
    originalPrice: 14000,
    image: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=400&fit=crop',
    category: 'restoratives',
    rating: 4.7,
    reviews: 156,
    inStock: true,
    badge: 'New Arrival'
  },

  // Surgical Instruments
  {
    id: 'surg-001',
    productId: '004',
    name: 'Extraction Forceps Set',
    nameAr: 'مجموعة ملاقط القلع',
    nameFr: 'Set de Daviers d\'Extraction',
    description: 'Complete set of 8 extraction forceps',
    descriptionAr: 'مجموعة كاملة من 8 ملاقط قلع',
    descriptionFr: 'Set complet de 8 daviers',
    price: 25000,
    image: 'https://images.unsplash.com/photo-1551601651-2a8555f1a136?w=400&h=400&fit=crop',
    category: 'surgical',
    rating: 4.9,
    reviews: 78,
    inStock: true,
    badge: 'Professional Grade'
  },
  {
    id: 'surg-002',
    productId: '005',
    name: 'Surgical Handpiece',
    nameAr: 'قبضة جراحية',
    nameFr: 'Pièce à Main Chirurgicale',
    description: 'High-speed surgical handpiece with LED',
    descriptionAr: 'قبضة جراحية عالية السرعة مع إضاءة LED',
    descriptionFr: 'Turbine chirurgicale haute vitesse avec LED',
    price: 45000,
    originalPrice: 55000,
    image: 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=400&h=400&fit=crop',
    category: 'surgical',
    rating: 4.8,
    reviews: 45,
    inStock: true,
    badge: 'Limited Offer'
  },
  {
    id: 'surg-003',
    productId: '006',
    name: 'Scaler Set Professional',
    nameAr: 'مجموعة أدوات التنظيف المهنية',
    nameFr: 'Set Détartreurs Professionnels',
    description: 'Professional scaling instruments set',
    descriptionAr: 'مجموعة أدوات تنظيف مهنية',
    descriptionFr: 'Instruments de détartrage professionnels',
    price: 18000,
    image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=400&h=400&fit=crop',
    category: 'surgical',
    rating: 4.7,
    reviews: 92,
    inStock: true
  },

  // Disposables
  {
    id: 'disp-001',
    productId: '007',
    name: 'Nitrile Gloves (Box of 100)',
    nameAr: 'قفازات نيتريل (علبة 100 قطعة)',
    nameFr: 'Gants Nitrile (Boîte de 100)',
    description: 'Powder-free nitrile examination gloves',
    descriptionAr: 'قفازات فحص نيتريل خالية من المسحوق',
    descriptionFr: 'Gants d\'examen nitrile sans poudre',
    price: 2800,
    image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400&h=400&fit=crop',
    category: 'disposables',
    rating: 4.5,
    reviews: 234,
    inStock: true,
    badge: 'Bulk Available'
  },
  {
    id: 'disp-002',
    productId: '008',
    name: 'Disposable Masks (Box of 50)',
    nameAr: 'أقنعة يستعمل لمرة واحدة (علبة 50 قطعة)',
    nameFr: 'Masques Jetables (Boîte de 50)',
    description: 'Type IIR surgical masks with ear loops',
    descriptionAr: 'أقنعة جراحية نوع IIR مع أربطة أذن',
    descriptionFr: 'Masques chirurgicaux Type IIR avec élastiques',
    price: 1200,
    image: 'https://images.unsplash.com/photo-1584467735871-8dd03827ad20?w=400&h=400&fit=crop',
    category: 'disposables',
    rating: 4.4,
    reviews: 189,
    inStock: true
  },
  {
    id: 'disp-003',
    productId: '009',
    name: 'Disposable Syringes 3ml',
    nameAr: 'حقن يستعمل لمرة واحدة 3مل',
    nameFr: 'Seringues Jetables 3ml',
    description: 'Sterile disposable syringes with needles',
    descriptionAr: 'حقن معقمة يستعمل لمرة واحدة مع إبر',
    descriptionFr: 'Seringues stériles jetables avec aiguilles',
    price: 850,
    image: 'https://images.unsplash.com/photo-1559757175-0eb30cd8c063?w=400&h=400&fit=crop',
    category: 'disposables',
    rating: 4.6,
    reviews: 167,
    inStock: true
  },

  // Equipment
  {
    id: 'equip-001',
    productId: '010',
    name: 'LED Curing Light',
    nameAr: 'ضوء التصليب LED',
    nameFr: 'Lampe à Polymériser LED',
    description: 'Wireless LED curing light 1500mW/cm²',
    descriptionAr: 'ضوء تصليب LED لاسلكي 1500mW/cm²',
    descriptionFr: 'Lampe LED sans fil 1500mW/cm²',
    price: 32000,
    originalPrice: 38000,
    image: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=400&h=400&fit=crop',
    category: 'equipment',
    rating: 4.8,
    reviews: 67,
    inStock: true,
    badge: 'Popular'
  },
  {
    id: 'equip-002',
    productId: '011',
    name: 'Ultrasonic Scaler',
    nameAr: 'منظف بالموجات فوق الصوتية',
    nameFr: 'Détartreur Ultrasonique',
    description: 'Professional ultrasonic scaling unit',
    descriptionAr: 'وحدة تنظيف بالموجات فوق الصوتية مهنية',
    descriptionFr: 'Unité de détartrage ultrasonique professionnelle',
    price: 85000,
    image: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=400&fit=crop',
    category: 'equipment',
    rating: 4.9,
    reviews: 34,
    inStock: true
  },

  // Orthodontics
  {
    id: 'ortho-001',
    productId: '012',
    name: 'Metal Brackets Set',
    nameAr: 'مجموعة براكيت معدنية',
    nameFr: 'Set Brackets Métalliques',
    description: 'Complete metal bracket system',
    descriptionAr: 'نظام براكيت معدني كامل',
    descriptionFr: 'Système de brackets métalliques complet',
    price: 22000,
    image: 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=400&h=400&fit=crop',
    category: 'orthodontics',
    rating: 4.7,
    reviews: 56,
    inStock: true
  },
  {
    id: 'ortho-002',
    productId: '013',
    name: 'Orthodontic Wires Kit',
    nameAr: 'مجموعة أسلاك التقويم',
    nameFr: 'Kit Fils Orthodontiques',
    description: 'Variety pack of orthodontic wires',
    descriptionAr: 'حزمة متنوعة من أسلاك التقويم',
    descriptionFr: 'Pack varié de fils orthodontiques',
    price: 15500,
    originalPrice: 18000,
    image: 'https://images.unsplash.com/photo-1609840114035-3c981b782dfe?w=400&h=400&fit=crop',
    category: 'orthodontics',
    rating: 4.6,
    reviews: 43,
    inStock: true
  },

  // Endodontics
  {
    id: 'endo-001',
    productId: '014',
    name: 'Rotary Files Set',
    nameAr: 'مجموعة مبارد دوارة',
    nameFr: 'Set Limes Rotatives',
    description: 'NiTi rotary files complete set',
    descriptionAr: 'مجموعة مبارد دوارة NiTi كاملة',
    descriptionFr: 'Set complet de limes rotatives NiTi',
    price: 28000,
    image: 'https://images.unsplash.com/photo-1551601651-2a8555f1a136?w=400&h=400&fit=crop',
    category: 'endodontics',
    rating: 4.8,
    reviews: 78,
    inStock: true,
    badge: 'Professional'
  },
  {
    id: 'endo-002',
    productId: '015',
    name: 'Gutta Percha Points',
    nameAr: 'نقاط الجوتا بيرشا',
    nameFr: 'Pointes de Gutta Percha',
    description: 'Standardized gutta percha points',
    descriptionAr: 'نقاط جوتا بيرشا معيارية',
    descriptionFr: 'Pointes de gutta percha standardisées',
    price: 5500,
    image: 'https://images.unsplash.com/photo-1584362917165-526f9605e31a?w=400&h=400&fit=crop',
    category: 'endodontics',
    rating: 4.5,
    reviews: 91,
    inStock: true
  },

  // Sterilization
  {
    id: 'steril-001',
    productId: '016',
    name: 'Autoclave Pouches',
    nameAr: 'أكياس التعقيم',
    nameFr: 'Sachets d\'Autoclave',
    description: 'Self-sealing sterilization pouches',
    descriptionAr: 'أكياس تعقيم ذاتية الإغلاق',
    descriptionFr: 'Sachets de stérilisation auto-scellants',
    price: 3200,
    image: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=400&fit=crop',
    category: 'sterilization',
    rating: 4.4,
    reviews: 123,
    inStock: true
  },
  {
    id: 'steril-002',
    productId: '017',
    name: 'Instrument Cassette',
    nameAr: 'كاسيت الأدوات',
    nameFr: 'Cassette d\'Instruments',
    description: 'Stainless steel instrument cassette',
    descriptionAr: 'كاسيت أدوات من الستانلس ستيل',
    descriptionFr: 'Cassette d\'instruments en acier inoxydable',
    price: 12500,
    image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=400&h=400&fit=crop',
    category: 'sterilization',
    rating: 4.7,
    reviews: 67,
    inStock: true
  }
];

export const bundles: Bundle[] = [
  {
    id: '1',
    name: 'Complete Cavity Treatment Kit',
    nameAr: 'مجموعة علاج التسوس الكاملة',
    nameFr: 'Kit traitement carie complet',
    description: 'Everything needed for cavity treatment procedures',
    items: [
      'Premium Composite Kit Z350',
      'Dental Bonding Agent Universal',
      'LED Curing Light Pro',
      'Dental Impression Alginate',
      'Disposable Brushes (50 pcs)',
      'Isolation Materials'
    ],
    originalPrice: '42,300 DZD',
    bundlePrice: '32,900 DZD',
    savings: '9,400 DZD',
    procedures: '25+ procedures',
    popular: true
  },
  {
    id: '2',
    name: 'Surgical Extraction Kit',
    nameAr: 'حزمة الجراحة والخلع',
    nameFr: 'Kit extraction chirurgicale',
    description: 'Complete kit for tooth extractions and minor surgery',
    items: [
      'Surgical Instruments Set Premium',
      'Extraction Forceps Set',
      'Dental Elevators Set',
      'Surgical Suture Kit',
      'Hemostatic Agents Kit',
      'Sterile Gloves (50 pairs)'
    ],
    originalPrice: '38,800 DZD',
    bundlePrice: '29,500 DZD',
    savings: '9,300 DZD',
    procedures: '20+ procedures',
    popular: false
  },
  {
    id: '3',
    name: 'Monthly Consumables Package',
    nameAr: 'حزمة المستهلكات الشهرية',
    nameFr: 'Package consommables mensuels',
    description: 'Monthly supply of essential disposable items',
    items: [
      'Nitrile Gloves Premium (500 pieces)',
      'Surgical Face Masks (200 pieces)',
      'Disposable Syringes 3ml (100 pcs)',
      'Cotton Rolls & Pellets Set',
      'Surface Disinfectant (2L)',
      'Sterilization Pouches (200 pcs)'
    ],
    originalPrice: '11,200 DZD',
    bundlePrice: '8,900 DZD',
    savings: '2,300 DZD',
    procedures: 'Month supply',
    popular: false
  },
  {
    id: '4',
    name: 'Endodontic Treatment Kit',
    nameAr: 'مجموعة علاج الجذور',
    nameFr: 'Kit traitement endodontique',
    description: 'Complete root canal treatment supplies',
    items: [
      'Endodontic Files Set',
      'Root Canal Sealer',
      'Irrigation Solutions',
      'Gutta Percha Points',
      'Paper Points (200 pcs)',
      'Temporary Filling Material'
    ],
    originalPrice: '18,600 DZD',
    bundlePrice: '14,200 DZD',
    savings: '4,400 DZD',
    procedures: '15+ procedures',
    popular: false
  },
  {
    id: '5',
    name: 'Orthodontic Starter Kit',
    nameAr: 'مجموعة بداية تقويم الأسنان',
    nameFr: 'Kit de démarrage orthodontique',
    description: 'Essential orthodontic materials for new practices',
    items: [
      'Orthodontic Brackets Set',
      'Orthodontic Wires (Complete Set)',
      'Orthodontic Adhesive',
      'Elastic Ligatures',
      'Orthodontic Pliers Set',
      'Patient Education Materials'
    ],
    originalPrice: '16,800 DZD',
    bundlePrice: '12,900 DZD',
    savings: '3,900 DZD',
    procedures: '10+ procedures',
    popular: false
  },
  {
    id: '6',
    name: 'Clinic Setup Complete Package',
    nameAr: 'حزمة إعداد العيادة الكاملة',
    nameFr: 'Package installation clinique complète',
    description: 'Everything needed to start a new dental practice',
    items: [
      'Autoclave Sterilizer',
      'Dental Compressor',
      'Ultrasonic Scaler',
      'LED Curing Light Pro',
      'Surgical Instruments Set Premium',
      'Complete Consumables Package',
      'Installation & Training'
    ],
    originalPrice: '145,000 DZD',
    bundlePrice: '119,000 DZD',
    savings: '26,000 DZD',
    procedures: 'Complete setup',
    popular: true
  }
];

export const categories = [
  {
    id: 'restoratives',
    name: 'Fillings & Restoratives',
    nameAr: 'الحشوات والترميم',
    nameFr: 'Obturations et restaurations',
    description: 'Composites, cements, bonding agents',
    icon: '🦷',
    color: 'from-blue-100 to-blue-200'
  },
  {
    id: 'surgical',
    name: 'Surgical Instruments',
    nameAr: 'الأدوات الجراحية',
    nameFr: 'Instruments chirurgicaux',
    description: 'Forceps, elevators, scissors, sutures',
    icon: '⚕️',
    color: 'from-green-100 to-green-200'
  },
  {
    id: 'equipment',
    name: 'Dental Equipment',
    nameAr: 'المعدات السنية',
    nameFr: 'Équipement dentaire',
    description: 'Lights, compressors, scalers, X-ray',
    icon: '🔧',
    color: 'from-orange-100 to-orange-200'
  },
  {
    id: 'disposables',
    name: 'Disposables & PPE',
    nameAr: 'المستهلكات ومعدات الحماية',
    nameFr: 'Jetables et EPI',
    description: 'Gloves, masks, syringes, cotton',
    icon: '🧤',
    color: 'from-purple-100 to-purple-200'
  },
  {
    id: 'endodontics',
    name: 'Endodontics',
    nameAr: 'علاج الجذور',
    nameFr: 'Endodontie',
    description: 'Files, sealers, irrigants, gutta percha',
    icon: '🔍',
    color: 'from-pink-100 to-pink-200'
  },
  {
    id: 'orthodontics',
    name: 'Orthodontics',
    nameAr: 'تقويم الأسنان',
    nameFr: 'Orthodontie',
    description: 'Brackets, wires, elastics, adhesives',
    icon: '🦾',
    color: 'from-teal-100 to-teal-200'
  },
  {
    id: 'sterilization',
    name: 'Sterilization',
    nameAr: 'التعقيم',
    nameFr: 'Stérilisation',
    description: 'Autoclaves, pouches, indicators',
    icon: '🧼',
    color: 'from-cyan-100 to-cyan-200'
  }
];
