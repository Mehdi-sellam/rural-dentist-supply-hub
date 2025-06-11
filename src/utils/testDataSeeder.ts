
import { supabase } from '@/integrations/supabase/client';

// Comprehensive categories data from frontend
const testCategories = [
  {
    name: 'Fillings & Restoratives',
    name_fr: 'Obturations et restaurations',
    name_ar: 'الحشوات والترميم',
    description: 'Composites, cements, bonding agents',
    description_fr: 'Composites, ciments, agents de liaison',
    description_ar: 'مواد مركبة، أسمنت، مواد ربط',
    icon: '🦷',
    color: 'from-blue-100 to-blue-200'
  },
  {
    name: 'Surgical Instruments',
    name_fr: 'Instruments chirurgicaux',
    name_ar: 'الأدوات الجراحية',
    description: 'Forceps, elevators, scissors, sutures',
    description_fr: 'Forceps, élévateurs, ciseaux, sutures',
    description_ar: 'ملاقط، روافع، مقصات، خيوط جراحية',
    icon: '⚕️',
    color: 'from-green-100 to-green-200'
  },
  {
    name: 'Dental Equipment',
    name_fr: 'Équipement dentaire',
    name_ar: 'المعدات السنية',
    description: 'Lights, compressors, scalers, X-ray',
    description_fr: 'Éclairages, compresseurs, détartreurs, rayons X',
    description_ar: 'إضاءة، ضواغط، منظفات، أشعة سينية',
    icon: '🔧',
    color: 'from-orange-100 to-orange-200'
  },
  {
    name: 'Disposables & PPE',
    name_fr: 'Jetables et EPI',
    name_ar: 'المستهلكات ومعدات الحماية',
    description: 'Gloves, masks, syringes, cotton',
    description_fr: 'Gants, masques, seringues, coton',
    description_ar: 'قفازات، أقنعة، حقن، قطن',
    icon: '🧤',
    color: 'from-purple-100 to-purple-200'
  },
  {
    name: 'Endodontics',
    name_fr: 'Endodontie',
    name_ar: 'علاج الجذور',
    description: 'Files, sealers, irrigants, gutta percha',
    description_fr: 'Limes, obturateurs, irrigants, gutta percha',
    description_ar: 'مبارد، سدادات، مروية، جوتا بيرشا',
    icon: '🔍',
    color: 'from-pink-100 to-pink-200'
  },
  {
    name: 'Orthodontics',
    name_fr: 'Orthodontie',
    name_ar: 'تقويم الأسنان',
    description: 'Brackets, wires, elastics, adhesives',
    description_fr: 'Brackets, fils, élastiques, adhésifs',
    description_ar: 'براكيت، أسلاك، مطاطية، لاصقات',
    icon: '🦾',
    color: 'from-teal-100 to-teal-200'
  },
  {
    name: 'Sterilization',
    name_fr: 'Stérilisation',
    name_ar: 'التعقيم',
    description: 'Autoclaves, pouches, indicators',
    description_fr: 'Autoclaves, sachets, indicateurs',
    description_ar: 'أوتوكلاف، أكياس، مؤشرات',
    icon: '🧼',
    color: 'from-cyan-100 to-cyan-200'
  }
];

// Comprehensive products data from frontend
const testProducts = [
  // Restoratives
  {
    product_id: 'rest-001',
    product_code: '001',
    name: 'Premium Composite Kit Z350',
    name_fr: 'Kit Composite Premium Z350',
    name_ar: 'طقم الحشوات المركبة المتميز',
    description: 'Complete composite filling kit with 8 shades, universal bonding system',
    description_fr: 'Kit de composite complet avec 8 teintes, système de collage universel',
    description_ar: 'طقم حشوات مركبة كامل مع 8 درجات لونية',
    price: 15000,
    original_price: 18000,
    image: 'https://images.unsplash.com/photo-1609840114035-3c981b782dfe?w=500&h=500&fit=crop',
    rating: 4.8,
    reviews: 124,
    in_stock: true,
    badge: 'Best Seller'
  },
  {
    product_id: 'rest-002',
    product_code: '002',
    name: 'Glass Ionomer Cement GC Fuji',
    name_fr: 'Ciment Verre Ionomère GC Fuji',
    name_ar: 'أسمنت الأيونومر الزجاجي',
    description: 'High-strength glass ionomer cement for permanent restorations',
    description_fr: 'Ciment ionomère de verre haute résistance pour restaurations permanentes',
    description_ar: 'أيونومر زجاجي عالي القوة للحشوات',
    price: 8500,
    image: 'https://images.unsplash.com/photo-1584362917165-526f9605e31a?w=500&h=500&fit=crop',
    rating: 4.6,
    reviews: 89,
    in_stock: true
  },
  {
    product_id: 'rest-003',
    product_code: '003',
    name: 'Universal Bonding Agent OptiBond',
    name_fr: 'Agent de Liaison Universel OptiBond',
    name_ar: 'مجموعة مواد الربط',
    description: 'Universal bonding system compatible with all dental substrates',
    description_fr: 'Système de collage universel compatible avec tous les substrats dentaires',
    description_ar: 'نظام ربط شامل لجميع الأسطح',
    price: 12000,
    original_price: 14000,
    image: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=500&h=500&fit=crop',
    rating: 4.7,
    reviews: 156,
    in_stock: true,
    badge: 'New Arrival'
  },
  {
    product_id: 'rest-004',
    product_code: '004',
    name: 'Dental Amalgam Capsules',
    name_fr: 'Capsules d\'Amalgame Dentaire',
    name_ar: 'كبسولات الملغم السني',
    description: 'Pre-measured amalgam capsules for posterior restorations',
    description_fr: 'Capsules d\'amalgame pré-dosées pour restaurations postérieures',
    description_ar: 'كبسولات ملغم مقاسة مسبقاً للحشوات الخلفية',
    price: 5500,
    image: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=500&h=500&fit=crop',
    rating: 4.4,
    reviews: 67,
    in_stock: true
  },
  
  // Surgical Instruments
  {
    product_id: 'surg-001',
    product_code: '005',
    name: 'Extraction Forceps Set Premium',
    name_fr: 'Set de Daviers d\'Extraction Premium',
    name_ar: 'مجموعة ملاقط القلع المتميزة',
    description: 'Complete set of 8 extraction forceps for all tooth types, German steel',
    description_fr: 'Set complet de 8 daviers pour tous types de dents, acier allemand',
    description_ar: 'مجموعة كاملة من 8 ملاقط قلع لجميع أنواع الأسنان',
    price: 25000,
    image: 'https://images.unsplash.com/photo-1551601651-2a8555f1a136?w=500&h=500&fit=crop',
    rating: 4.9,
    reviews: 78,
    in_stock: true,
    badge: 'Professional Grade'
  },
  {
    product_id: 'surg-002',
    product_code: '006',
    name: 'High-Speed Surgical Handpiece',
    name_fr: 'Turbine Chirurgicale Haute Vitesse',
    name_ar: 'قبضة جراحية عالية السرعة',
    description: 'High-speed surgical handpiece with LED light and water spray cooling',
    description_fr: 'Turbine chirurgicale haute vitesse avec éclairage LED et refroidissement par spray',
    description_ar: 'قبضة جراحية عالية السرعة مع إضاءة LED وتبريد مائي',
    price: 45000,
    original_price: 55000,
    image: 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=500&h=500&fit=crop',
    rating: 4.8,
    reviews: 45,
    in_stock: true,
    badge: 'Limited Offer'
  },
  {
    product_id: 'surg-003',
    product_code: '007',
    name: 'Professional Scaler Set',
    name_fr: 'Set Détartreurs Professionnels',
    name_ar: 'مجموعة أدوات التنظيف المهنية',
    description: 'Complete set of manual scaling instruments with ergonomic handles',
    description_fr: 'Set complet d\'instruments de détartrage manuel avec manches ergonomiques',
    description_ar: 'مجموعة أدوات تنظيف يدوية كاملة مع مقابض مريحة',
    price: 18000,
    image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=500&h=500&fit=crop',
    rating: 4.7,
    reviews: 92,
    in_stock: true
  },
  {
    product_id: 'surg-004',
    product_code: '008',
    name: 'Surgical Suture Kit',
    name_fr: 'Kit de Suture Chirurgicale',
    name_ar: 'مجموعة الخياطة الجراحية',
    description: 'Complete suture kit with various needle sizes and thread types',
    description_fr: 'Kit de suture complet avec différentes tailles d\'aiguilles et types de fils',
    description_ar: 'مجموعة خياطة كاملة بأحجام إبر وأنواع خيوط متنوعة',
    price: 12500,
    image: 'https://images.unsplash.com/photo-1559757175-0eb30cd8c063?w=500&h=500&fit=crop',
    rating: 4.6,
    reviews: 54,
    in_stock: true
  },

  // Disposables
  {
    product_id: 'disp-001',
    product_code: '009',
    name: 'Nitrile Gloves Premium (Box 100)',
    name_fr: 'Gants Nitrile Premium (Boîte 100)',
    name_ar: 'قفازات نيتريل متميزة (علبة 100)',
    description: 'Powder-free nitrile examination gloves, textured fingertips',
    description_fr: 'Gants d\'examen nitrile sans poudre, bout des doigts texturé',
    description_ar: 'قفازات فحص نيتريل خالية من المسحوق مع أطراف أصابع محززة',
    price: 2800,
    image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=500&h=500&fit=crop',
    rating: 4.5,
    reviews: 234,
    in_stock: true,
    badge: 'Bulk Available'
  },
  {
    product_id: 'disp-002',
    product_code: '010',
    name: 'Type IIR Surgical Masks (Box 50)',
    name_fr: 'Masques Chirurgicaux Type IIR (Boîte 50)',
    name_ar: 'أقنعة جراحية نوع IIR (علبة 50)',
    description: 'Type IIR surgical masks with fluid resistance and high filtration',
    description_fr: 'Masques chirurgicaux Type IIR résistants aux fluides et haute filtration',
    description_ar: 'أقنعة جراحية نوع IIR مقاومة للسوائل وذات ترشيح عالي',
    price: 1200,
    image: 'https://images.unsplash.com/photo-1584467735871-8dd03827ad20?w=500&h=500&fit=crop',
    rating: 4.4,
    reviews: 189,
    in_stock: true
  },
  {
    product_id: 'disp-003',
    product_code: '011',
    name: 'Disposable Syringes 3ml Sterile',
    name_fr: 'Seringues Jetables Stériles 3ml',
    name_ar: 'حقن معقمة يستعمل لمرة واحدة 3مل',
    description: 'Sterile disposable syringes with safety needles, Luer-lock',
    description_fr: 'Seringues jetables stériles avec aiguilles de sécurité, Luer-lock',
    description_ar: 'حقن معقمة يستعمل لمرة واحدة مع إبر آمنة ونظام لوير لوك',
    price: 850,
    image: 'https://images.unsplash.com/photo-1559757175-0eb30cd8c063?w=500&h=500&fit=crop',
    rating: 4.6,
    reviews: 167,
    in_stock: true
  },
  {
    product_id: 'disp-004',
    product_code: '012',
    name: 'Cotton Rolls & Pellets Set',
    name_fr: 'Set Rouleaux et Boulettes de Coton',
    name_ar: 'مجموعة لفائف وكرات القطن',
    description: 'Sterile cotton rolls and pellets for isolation and hemostasis',
    description_fr: 'Rouleaux et boulettes de coton stériles pour isolation et hémostase',
    description_ar: 'لفائف وكرات قطن معقمة للعزل ووقف النزيف',
    price: 950,
    image: 'https://images.unsplash.com/photo-1584362917165-526f9605e31a?w=500&h=500&fit=crop',
    rating: 4.3,
    reviews: 98,
    in_stock: true
  },

  // Equipment
  {
    product_id: 'equip-001',
    product_code: '013',
    name: 'LED Curing Light Professional',
    name_fr: 'Lampe à Polymériser LED Professionnelle',
    name_ar: 'ضوء التصليب LED المهني',
    description: 'Wireless LED curing light 1500mW/cm², 10-second cure mode',
    description_fr: 'Lampe LED sans fil 1500mW/cm², mode de polymérisation 10 secondes',
    description_ar: 'ضوء تصليب LED لاسلكي 1500mW/cm² مع وضع تصليب 10 ثوان',
    price: 32000,
    original_price: 38000,
    image: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=500&h=500&fit=crop',
    rating: 4.8,
    reviews: 67,
    in_stock: true,
    badge: 'Popular'
  },
  {
    product_id: 'equip-002',
    product_code: '014',
    name: 'Ultrasonic Scaler Professional',
    name_fr: 'Détartreur Ultrasonique Professionnel',
    name_ar: 'منظف بالموجات فوق الصوتية مهني',
    description: 'Professional ultrasonic scaling unit with multiple tips and power control',
    description_fr: 'Unité de détartrage ultrasonique avec embouts multiples et contrôle de puissance',
    description_ar: 'وحدة تنظيف بالموجات فوق الصوتية مع رؤوس متعددة وتحكم في القوة',
    price: 85000,
    image: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=500&h=500&fit=crop',
    rating: 4.9,
    reviews: 34,
    in_stock: true
  },
  {
    product_id: 'equip-003',
    product_code: '015',
    name: 'Dental Compressor Silent',
    name_fr: 'Compresseur Dentaire Silencieux',
    name_ar: 'ضاغط هواء صامت للأسنان',
    description: 'Oil-free silent dental compressor, 50L tank, automatic pressure control',
    description_fr: 'Compresseur dentaire silencieux sans huile, réservoir 50L, contrôle automatique',
    description_ar: 'ضاغط أسنان صامت خالي من الزيت، خزان 50 لتر، تحكم تلقائي في الضغط',
    price: 125000,
    original_price: 145000,
    image: 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=500&h=500&fit=crop',
    rating: 4.7,
    reviews: 28,
    in_stock: true,
    badge: 'Professional'
  },

  // Orthodontics
  {
    product_id: 'ortho-001',
    product_code: '016',
    name: 'Metal Brackets System Complete',
    name_fr: 'Système Brackets Métalliques Complet',
    name_ar: 'نظام براكيت معدني كامل',
    description: 'Complete metal bracket system with all sizes, MBT prescription',
    description_fr: 'Système de brackets métalliques complet toutes tailles, prescription MBT',
    description_ar: 'نظام براكيت معدني كامل بجميع الأحجام، وصفة MBT',
    price: 22000,
    image: 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=500&h=500&fit=crop',
    rating: 4.7,
    reviews: 56,
    in_stock: true
  },
  {
    product_id: 'ortho-002',
    product_code: '017',
    name: 'Orthodontic Wires Kit NiTi',
    name_fr: 'Kit Fils Orthodontiques NiTi',
    name_ar: 'مجموعة أسلاك التقويم NiTi',
    description: 'Complete NiTi wire kit, round and rectangular, temperature activated',
    description_fr: 'Kit complet de fils NiTi, ronds et rectangulaires, thermosensibles',
    description_ar: 'مجموعة أسلاك NiTi كاملة، مستديرة ومستطيلة، منشطة حرارياً',
    price: 15500,
    original_price: 18000,
    image: 'https://images.unsplash.com/photo-1609840114035-3c981b782dfe?w=500&h=500&fit=crop',
    rating: 4.6,
    reviews: 43,
    in_stock: true
  },

  // Endodontics
  {
    product_id: 'endo-001',
    product_code: '018',
    name: 'NiTi Rotary Files ProTaper',
    name_fr: 'Limes Rotatives NiTi ProTaper',
    name_ar: 'مبارد دوارة NiTi بروتيبر',
    description: 'Complete NiTi rotary file system ProTaper Gold, all sizes',
    description_fr: 'Système complet de limes rotatives NiTi ProTaper Gold, toutes tailles',
    description_ar: 'نظام مبارد دوارة NiTi بروتيبر الذهبي كامل، جميع الأحجام',
    price: 28000,
    image: 'https://images.unsplash.com/photo-1551601651-2a8555f1a136?w=500&h=500&fit=crop',
    rating: 4.8,
    reviews: 78,
    in_stock: true,
    badge: 'Professional'
  },
  {
    product_id: 'endo-002',
    product_code: '019',
    name: 'Gutta Percha Points ISO',
    name_fr: 'Pointes de Gutta Percha ISO',
    name_ar: 'نقاط الجوتا بيرشا ISO',
    description: 'ISO standardized gutta percha points, all sizes 15-140',
    description_fr: 'Pointes de gutta percha standardisées ISO, toutes tailles 15-140',
    description_ar: 'نقاط جوتا بيرشا معيارية ISO، جميع الأحجام 15-140',
    price: 5500,
    image: 'https://images.unsplash.com/photo-1584362917165-526f9605e31a?w=500&h=500&fit=crop',
    rating: 4.5,
    reviews: 91,
    in_stock: true
  },

  // Sterilization
  {
    product_id: 'steril-001',
    product_code: '020',
    name: 'Autoclave Sterilization Pouches',
    name_fr: 'Sachets de Stérilisation Autoclave',
    name_ar: 'أكياس التعقيم بالبخار',
    description: 'Self-sealing sterilization pouches with indicators, various sizes',
    description_fr: 'Sachets de stérilisation auto-scellants avec indicateurs, tailles variées',
    description_ar: 'أكياس تعقيم ذاتية الإغلاق مع مؤشرات، أحجام متنوعة',
    price: 3200,
    image: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=500&h=500&fit=crop',
    rating: 4.4,
    reviews: 123,
    in_stock: true
  },
  {
    product_id: 'steril-002',
    product_code: '021',
    name: 'Stainless Steel Instrument Cassette',
    name_fr: 'Cassette d\'Instruments Acier Inoxydable',
    name_ar: 'كاسيت أدوات من الستانلس ستيل',
    description: 'Perforated stainless steel instrument cassette for autoclave sterilization',
    description_fr: 'Cassette d\'instruments perforée en acier inoxydable pour stérilisation autoclave',
    description_ar: 'كاسيت أدوات مثقب من الستانلس ستيل للتعقيم بالبخار',
    price: 12500,
    image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=500&h=500&fit=crop',
    rating: 4.7,
    reviews: 67,
    in_stock: true
  }
];

// Comprehensive bundles data from frontend
const testBundles = [
  {
    name: 'Complete Cavity Treatment Kit',
    name_fr: 'Kit traitement carie complet',
    name_ar: 'مجموعة علاج التسوس الكاملة',
    description: 'Everything needed for cavity treatment procedures',
    description_fr: 'Tout ce qui est nécessaire pour les procédures de traitement des caries',
    description_ar: 'كل ما هو مطلوب لإجراءات علاج التسوس',
    items: [
      'Premium Composite Kit Z350',
      'Universal Bonding Agent OptiBond',
      'LED Curing Light Professional',
      'Disposable Syringes 3ml Sterile',
      'Cotton Rolls & Pellets Set',
      'Autoclave Sterilization Pouches'
    ],
    original_price: '42,300 DZD',
    bundle_price: '32,900 DZD',
    savings: '9,400 DZD',
    procedures: '25+ procedures',
    popular: true
  },
  {
    name: 'Surgical Extraction Kit',
    name_fr: 'Kit extraction chirurgicale',
    name_ar: 'حزمة الجراحة والخلع',
    description: 'Complete kit for tooth extractions and minor surgery',
    description_fr: 'Kit complet pour extractions dentaires et chirurgie mineure',
    description_ar: 'مجموعة كاملة لقلع الأسنان والجراحة الصغرى',
    items: [
      'Extraction Forceps Set Premium',
      'High-Speed Surgical Handpiece',
      'Professional Scaler Set',
      'Surgical Suture Kit',
      'Nitrile Gloves Premium (Box 100)',
      'Type IIR Surgical Masks (Box 50)'
    ],
    original_price: '38,800 DZD',
    bundle_price: '29,500 DZD',
    savings: '9,300 DZD',
    procedures: '20+ procedures',
    popular: false
  },
  {
    name: 'Monthly Consumables Package',
    name_fr: 'Package consommables mensuels',
    name_ar: 'حزمة المستهلكات الشهرية',
    description: 'Monthly supply of essential disposable items',
    description_fr: 'Approvisionnement mensuel d\'articles jetables essentiels',
    description_ar: 'إمداد شهري من العناصر المستهلكة الأساسية',
    items: [
      'Nitrile Gloves Premium (Box 100)',
      'Type IIR Surgical Masks (Box 50)',
      'Disposable Syringes 3ml Sterile',
      'Cotton Rolls & Pellets Set',
      'Autoclave Sterilization Pouches',
      'Glass Ionomer Cement GC Fuji'
    ],
    original_price: '11,200 DZD',
    bundle_price: '8,900 DZD',
    savings: '2,300 DZD',
    procedures: 'Month supply',
    popular: false
  },
  {
    name: 'Endodontic Treatment Kit',
    name_fr: 'Kit traitement endodontique',
    name_ar: 'مجموعة علاج الجذور',
    description: 'Complete root canal treatment supplies',
    description_fr: 'Fournitures complètes de traitement de canal radiculaire',
    description_ar: 'مواد علاج قناة الجذر الكاملة',
    items: [
      'NiTi Rotary Files ProTaper',
      'Gutta Percha Points ISO',
      'Universal Bonding Agent OptiBond',
      'Disposable Syringes 3ml Sterile',
      'Cotton Rolls & Pellets Set',
      'Dental Amalgam Capsules'
    ],
    original_price: '18,600 DZD',
    bundle_price: '14,200 DZD',
    savings: '4,400 DZD',
    procedures: '15+ procedures',
    popular: false
  },
  {
    name: 'Orthodontic Starter Kit',
    name_fr: 'Kit de démarrage orthodontique',
    name_ar: 'مجموعة بداية تقويم الأسنان',
    description: 'Essential orthodontic materials for new practices',
    description_fr: 'Matériaux orthodontiques essentiels pour nouvelles pratiques',
    description_ar: 'مواد تقويم الأسنان الأساسية للممارسات الجديدة',
    items: [
      'Metal Brackets System Complete',
      'Orthodontic Wires Kit NiTi',
      'Universal Bonding Agent OptiBond',
      'LED Curing Light Professional',
      'Nitrile Gloves Premium (Box 100)',
      'Autoclave Sterilization Pouches'
    ],
    original_price: '16,800 DZD',
    bundle_price: '12,900 DZD',
    savings: '3,900 DZD',
    procedures: '10+ procedures',
    popular: false
  },
  {
    name: 'Clinic Setup Complete Package',
    name_fr: 'Package installation clinique complète',
    name_ar: 'حزمة إعداد العيادة الكاملة',
    description: 'Everything needed to start a new dental practice',
    description_fr: 'Tout ce qui est nécessaire pour démarrer une nouvelle pratique dentaire',
    description_ar: 'كل ما هو مطلوب لبدء ممارسة طب الأسنان الجديدة',
    items: [
      'Dental Compressor Silent',
      'Ultrasonic Scaler Professional',
      'LED Curing Light Professional',
      'Extraction Forceps Set Premium',
      'Professional Scaler Set',
      'Stainless Steel Instrument Cassette',
      'Monthly Consumables Package'
    ],
    original_price: '145,000 DZD',
    bundle_price: '119,000 DZD',
    savings: '26,000 DZD',
    procedures: 'Complete setup',
    popular: true
  }
];

export const seedTestData = async () => {
  try {
    console.log('Starting comprehensive data seeding...');

    // 1. Insert categories
    console.log('Inserting categories...');
    const { data: categoriesData, error: categoriesError } = await supabase
      .from('categories')
      .insert(testCategories)
      .select();

    if (categoriesError) {
      console.error('Error inserting categories:', categoriesError);
      return;
    }
    console.log('Categories inserted:', categoriesData);

    // Create category mapping for products
    const categoryMap: { [key: string]: string } = {};
    const categoryNames = ['restoratives', 'surgical', 'disposables', 'equipment', 'orthodontics', 'endodontics', 'sterilization'];
    categoriesData.forEach((cat, index) => {
      if (index < categoryNames.length) {
        categoryMap[categoryNames[index]] = cat.id;
      }
    });

    // 2. Insert products with correct category references
    console.log('Inserting products...');
    const productsWithCategories = testProducts.map((product) => {
      let categoryId = null;
      
      // Map products to categories based on product_id prefix
      if (product.product_id.startsWith('rest-')) {
        categoryId = categoryMap.restoratives;
      } else if (product.product_id.startsWith('surg-')) {
        categoryId = categoryMap.surgical;
      } else if (product.product_id.startsWith('disp-')) {
        categoryId = categoryMap.disposables;
      } else if (product.product_id.startsWith('equip-')) {
        categoryId = categoryMap.equipment;
      } else if (product.product_id.startsWith('ortho-')) {
        categoryId = categoryMap.orthodontics;
      } else if (product.product_id.startsWith('endo-')) {
        categoryId = categoryMap.endodontics;
      } else if (product.product_id.startsWith('steril-')) {
        categoryId = categoryMap.sterilization;
      }

      return {
        ...product,
        category_id: categoryId
      };
    });

    const { data: productsData, error: productsError } = await supabase
      .from('products')
      .insert(productsWithCategories)
      .select();

    if (productsError) {
      console.error('Error inserting products:', productsError);
      return;
    }
    console.log('Products inserted:', productsData);

    // 3. Insert bundles
    console.log('Inserting bundles...');
    const { data: bundlesData, error: bundlesError } = await supabase
      .from('bundles')
      .insert(testBundles)
      .select();

    if (bundlesError) {
      console.error('Error inserting bundles:', bundlesError);
      return;
    }
    console.log('Bundles inserted:', bundlesData);

    console.log('Comprehensive data seeding completed successfully!');
    return { categoriesData, productsData, bundlesData };

  } catch (error) {
    console.error('Exception during comprehensive data seeding:', error);
    throw error;
  }
};

export const clearTestData = async () => {
  try {
    console.log('Clearing all data...');

    // Clear in reverse order of dependencies
    await supabase.from('bundles').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    await supabase.from('products').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    await supabase.from('categories').delete().neq('id', '00000000-0000-0000-0000-000000000000');

    console.log('All data cleared successfully!');
  } catch (error) {
    console.error('Error clearing data:', error);
    throw error;
  }
};
