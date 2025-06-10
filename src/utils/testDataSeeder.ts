
import { supabase } from '@/integrations/supabase/client';

// Test categories data
const testCategories = [
  {
    name: 'Dental Instruments',
    name_fr: 'Instruments Dentaires',
    description_fr: 'Instruments de base pour soins dentaires',
    icon: '🦷',
    color: 'from-blue-50 to-indigo-100'
  },
  {
    name: 'Orthodontics',
    name_fr: 'Orthodontie',
    description_fr: 'Équipements pour orthodontie',
    icon: '🔧',
    color: 'from-green-50 to-emerald-100'
  },
  {
    name: 'Consumables',
    name_fr: 'Consommables',
    description_fr: 'Produits consommables dentaires',
    icon: '📦',
    color: 'from-purple-50 to-violet-100'
  },
  {
    name: 'Equipment',
    name_fr: 'Équipements',
    description_fr: 'Équipements dentaires professionnels',
    icon: '⚙️',
    color: 'from-orange-50 to-amber-100'
  }
];

// Test products data
const testProducts = [
  {
    product_id: 'DENT001',
    product_code: 'DN001',
    name: 'Dental Mirror',
    name_fr: 'Miroir Dentaire',
    description_fr: 'Miroir dentaire professionnel en acier inoxydable',
    price: 2500,
    image: '/placeholder.svg',
    rating: 4.5,
    reviews: 23,
    in_stock: true,
    badge: 'Best Seller'
  },
  {
    product_id: 'DENT002',
    product_code: 'DN002',
    name: 'Dental Probe',
    name_fr: 'Sonde Dentaire',
    description_fr: 'Sonde dentaire de précision',
    price: 1800,
    original_price: 2200,
    image: '/placeholder.svg',
    rating: 4.3,
    reviews: 18,
    in_stock: true,
    badge: 'Professional'
  },
  {
    product_id: 'ORTH001',
    product_code: 'OR001',
    name: 'Orthodontic Pliers',
    name_fr: 'Pince Orthodontique',
    description_fr: 'Pince spécialisée pour orthodontie',
    price: 8500,
    image: '/placeholder.svg',
    rating: 4.7,
    reviews: 31,
    in_stock: true,
    badge: 'New Arrival'
  },
  {
    product_id: 'CONS001',
    product_code: 'CS001',
    name: 'Disposable Gloves',
    name_fr: 'Gants Jetables',
    description_fr: 'Gants en nitrile pour usage médical',
    price: 3200,
    image: '/placeholder.svg',
    rating: 4.1,
    reviews: 45,
    in_stock: true
  },
  {
    product_id: 'EQUIP001',
    product_code: 'EQ001',
    name: 'LED Dental Light',
    name_fr: 'Éclairage LED Dentaire',
    description_fr: 'Éclairage LED professionnel pour cabinet dentaire',
    price: 45000,
    image: '/placeholder.svg',
    rating: 4.8,
    reviews: 12,
    in_stock: false,
    badge: 'Limited Offer'
  }
];

// Test bundles data
const testBundles = [
  {
    name: 'Starter Kit',
    name_fr: 'Kit de Démarrage',
    description_fr: 'Kit complet pour débuter en dentisterie',
    items: ['Miroir Dentaire', 'Sonde Dentaire', 'Gants Jetables'],
    original_price: '8500 DZD',
    bundle_price: '6500 DZD',
    savings: '2000 DZD',
    procedures: '50+',
    popular: true
  },
  {
    name: 'Professional Kit',
    name_fr: 'Kit Professionnel',
    description_fr: 'Kit avancé pour professionnels',
    items: ['Pince Orthodontique', 'Éclairage LED', 'Instruments variés'],
    original_price: '55000 DZD',
    bundle_price: '48000 DZD',
    savings: '7000 DZD',
    procedures: '100+',
    popular: false
  }
];

export const seedTestData = async () => {
  try {
    console.log('Starting test data seeding...');

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

    // 2. Insert products with category references
    console.log('Inserting products...');
    const productsWithCategories = testProducts.map((product, index) => ({
      ...product,
      category_id: categoriesData[index % categoriesData.length]?.id
    }));

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

    console.log('Test data seeding completed successfully!');
    return { categoriesData, productsData, bundlesData };

  } catch (error) {
    console.error('Exception during test data seeding:', error);
    throw error;
  }
};

export const clearTestData = async () => {
  try {
    console.log('Clearing test data...');

    // Clear in reverse order of dependencies
    await supabase.from('bundles').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    await supabase.from('products').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    await supabase.from('categories').delete().neq('id', '00000000-0000-0000-0000-000000000000');

    console.log('Test data cleared successfully!');
  } catch (error) {
    console.error('Error clearing test data:', error);
    throw error;
  }
};
