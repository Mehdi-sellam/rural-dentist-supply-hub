import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // First, let's create categories
    const categories = [
      {
        name: 'Produits Dentaires',
        name_fr: 'Produits Dentaires',
        name_ar: 'منتجات الأسنان',
        description: 'Équipements et matériaux dentaires professionnels',
        description_fr: 'Équipements et matériaux dentaires professionnels',
        description_ar: 'معدات ومواد طب الأسنان المهنية',
        icon: '🦷',
        color: 'from-blue-50 to-indigo-100'
      },
      {
        name: 'Consommables Chirurgicaux',
        name_fr: 'Consommables Chirurgicaux',
        name_ar: 'المواد الاستهلاكية الجراحية',
        description: 'Matériaux et outils chirurgicaux usage unique',
        description_fr: 'Matériaux et outils chirurgicaux usage unique',
        description_ar: 'أدوات ومواد جراحية للاستخدام الواحد',
        icon: '🔧',
        color: 'from-green-50 to-emerald-100'
      },
      {
        name: 'Implants Orthopédiques',
        name_fr: 'Implants Orthopédiques',
        name_ar: 'الغرسات العظمية',
        description: 'Implants et prothèses orthopédiques',
        description_fr: 'Implants et prothèses orthopédiques',
        description_ar: 'الغرسات والأطراف الصناعية العظمية',
        icon: '🦴',
        color: 'from-purple-50 to-violet-100'
      }
    ]

    // Insert categories
    const { data: insertedCategories, error: categoryError } = await supabaseClient
      .from('categories')
      .upsert(categories, { onConflict: 'name' })
      .select()

    if (categoryError) {
      console.error('Error inserting categories:', categoryError)
      throw categoryError
    }

    // Sample products based on the scraped data
    const products = [
      // Dental Products
      {
        name: 'Fraise Carbure Manche 3',
        name_fr: 'Fraise Carbure Manche 3',
        name_ar: 'مثقاب كربايد مقبض 3',
        description: 'Fraise carbure pour contre-angle, forme conique pointue, dents taillées',
        description_fr: 'Fraise carbure pour contre-angle, forme conique pointue, dents taillées',
        description_ar: 'مثقاب كربايد للزاوية المقابلة، شكل مخروطي مدبب، أسنان مقطوعة',
        product_code: 'BURR-003',
        product_id: 'BURR-003',
        price: 850,
        original_price: 1200,
        category_id: insertedCategories?.find(c => c.name === 'Produits Dentaires')?.id,
        image_url: 'https://actual-med.com/wp-content/uploads/woocommerce-placeholder.png',
        specifications: ['Manche 3', 'Forme conique', 'Carbure de tungstène', 'Usage dentaire'],
        badge: 'Nouveau',
        in_stock: true,
        stock_status: true,
        rating: 4.5,
        reviews: 12
      },
      {
        name: 'Disque Diamanté Laboratoire Dentaire',
        name_fr: 'Disque Diamanté Laboratoire Dentaire',
        name_ar: 'قرص ماسي لمختبر الأسنان',
        description: 'Disque diamanté fin pour laboratoire dentaire, précision optimale',
        description_fr: 'Disque diamanté fin pour laboratoire dentaire, précision optimale',
        description_ar: 'قرص ماسي رفيع لمختبر الأسنان، دقة مثلى',
        product_code: 'DISC-001',
        product_id: 'DISC-001',
        price: 450,
        original_price: 650,
        category_id: insertedCategories?.find(c => c.name === 'Produits Dentaires')?.id,
        image_url: 'https://actual-med.com/wp-content/uploads/2023/08/01_38b14573-b1a3-49b3-85a1-ed2e285d4574_480x480.jpg',
        specifications: ['Disque diamanté', 'Usage laboratoire', 'Haute précision', 'Durabilité'],
        in_stock: true,
        stock_status: true,
        rating: 4.7,
        reviews: 8
      },
      {
        name: 'Matrices Sectionnelles Dentaires',
        name_fr: 'Matrices Sectionnelles Dentaires',
        name_ar: 'مصفوفات قسمية للأسنان',
        description: 'Bandes matrices sectionnelles contournées avec coins',
        description_fr: 'Bandes matrices sectionnelles contournées avec coins',
        description_ar: 'شرائط مصفوفة قسمية محيطة مع أوتاد',
        product_code: 'MATRIX-001',
        product_id: 'MATRIX-001',
        price: 1250,
        original_price: 1800,
        category_id: insertedCategories?.find(c => c.name === 'Produits Dentaires')?.id,
        image_url: 'https://actual-med.com/wp-content/uploads/2023/08/2bc3fb23a5.jpg',
        specifications: ['Matrices sectionnelles', 'Coins inclus', 'Contournées', 'Restauration composite'],
        badge: 'Populaire',
        in_stock: true,
        stock_status: true,
        rating: 4.6,
        reviews: 15
      },
      // Surgical Consumables
      {
        name: 'Robinet d\'arrêt 3 voies',
        name_fr: 'Robinet d\'arrêt 3 voies',
        name_ar: 'صنبور إيقاف ثلاثي الاتجاهات',
        description: 'Robinet d\'arrêt stérile à 3 voies pour usage chirurgical',
        description_fr: 'Robinet d\'arrêt stérile à 3 voies pour usage chirurgical',
        description_ar: 'صنبور إيقاف معقم ثلاثي الاتجاهات للاستخدام الجراحي',
        product_code: 'STOP-003',
        product_id: 'STOP-003',
        price: 75,
        original_price: 120,
        category_id: insertedCategories?.find(c => c.name === 'Consommables Chirurgicaux')?.id,
        image_url: 'https://actual-med.com/wp-content/uploads/2023/08/3-way-stop-cock.jpg',
        specifications: ['3 voies', 'Stérile', 'Usage unique', 'Matériau médical'],
        in_stock: true,
        stock_status: true,
        rating: 4.3,
        reviews: 25
      },
      // Orthopedic Implants
      {
        name: 'Plaque Tube 1/3',
        name_fr: 'Plaque Tube 1/3',
        name_ar: 'لوحة أنبوب 1/3',
        description: 'Plaque tubulaire 1/3 pour fixation orthopédique',
        description_fr: 'Plaque tubulaire 1/3 pour fixation orthopédique',
        description_ar: 'لوحة أنبوبية 1/3 للتثبيت العظمي',
        product_code: 'TUBE-13',
        product_id: 'TUBE-13',
        price: 8500,
        original_price: 12000,
        category_id: insertedCategories?.find(c => c.name === 'Implants Orthopédiques')?.id,
        image_url: 'https://actual-med.com/wp-content/uploads/2023/08/13-TUBE-PLATE.jpg',
        specifications: ['Plaque 1/3', 'Titane médical', 'Vis incluses', 'Stérile'],
        badge: 'Professionnel',
        in_stock: true,
        stock_status: true,
        rating: 4.8,
        reviews: 5
      },
      {
        name: 'Plaque DHS 135°',
        name_fr: 'Plaque DHS 135°',
        name_ar: 'لوحة DHS 135°',
        description: 'Plaque DHS à 135° pour fixation de hanche',
        description_fr: 'Plaque DHS à 135° pour fixation de hanche',
        description_ar: 'لوحة DHS بزاوية 135° لتثبيت الورك',
        product_code: 'DHS-135',
        product_id: 'DHS-135',
        price: 15000,
        original_price: 22000,
        category_id: insertedCategories?.find(c => c.name === 'Implants Orthopédiques')?.id,
        image_url: 'https://actual-med.com/wp-content/uploads/2023/08/135%C2%B0-DHS-PLATE.jpg',
        specifications: ['Angle 135°', 'Titane médical', 'Système DHS', 'Chirurgie hanche'],
        badge: 'Premium',
        in_stock: true,
        stock_status: true,
        rating: 4.9,
        reviews: 3
      },
      {
        name: 'Clou Tibial Verrouillé 14°',
        name_fr: 'Clou Tibial Verrouillé 14°',
        name_ar: 'مسمار عظم الساق المقفل 14°',
        description: 'Clou intramédullaire tibial avec système de verrouillage',
        description_fr: 'Clou intramédullaire tibial avec système de verrouillage',
        description_ar: 'مسمار داخل النخاع الشوكي للساق مع نظام قفل',
        product_code: 'NAIL-T14',
        product_id: 'NAIL-T14',
        price: 25000,
        original_price: 35000,
        category_id: insertedCategories?.find(c => c.name === 'Implants Orthopédiques')?.id,
        image_url: 'https://actual-med.com/wp-content/uploads/2023/08/14%C2%B0-LOCKED-TIBIAL-NAIL-2048x745.jpg',
        specifications: ['Angle 14°', 'Verrouillage', 'Intramédullaire', 'Titane Grade 5'],
        badge: 'Avancé',
        in_stock: true,
        stock_status: true,
        rating: 4.7,
        reviews: 2
      },
      {
        name: 'Plaque Radius en L 20°',
        name_fr: 'Plaque Radius en L 20°',
        name_ar: 'لوحة الكعبرة على شكل L 20°',
        description: 'Plaque en forme de L pour radius, angle de 20°',
        description_fr: 'Plaque en forme de L pour radius, angle de 20°',
        description_ar: 'لوحة على شكل L للكعبرة، بزاوية 20°',
        product_code: 'RAD-L20',
        product_id: 'RAD-L20',
        price: 12000,
        original_price: 18000,
        category_id: insertedCategories?.find(c => c.name === 'Implants Orthopédiques')?.id,
        image_url: 'https://actual-med.com/wp-content/uploads/2023/08/20%C2%B0-L-SHAPED-RADIUS-PLATE.jpg',
        specifications: ['Forme L', 'Angle 20°', 'Radius distal', 'Vis autotaraudeuses'],
        in_stock: true,
        stock_status: true,
        rating: 4.5,
        reviews: 7
      }
    ]

    // Insert products
    const { error: productError } = await supabaseClient
      .from('products')
      .upsert(products, { onConflict: 'product_code' })

    if (productError) {
      console.error('Error inserting products:', productError)
      throw productError
    }

    // Create some bundles
    const bundles = [
      {
        name: 'Kit Fraises Dentaires Complet',
        name_fr: 'Kit Fraises Dentaires Complet',
        name_ar: 'طقم مثاقب الأسنان الكامل',
        description: 'Kit complet de fraises dentaires pour tous types d\'interventions',
        description_fr: 'Kit complet de fraises dentaires pour tous types d\'interventions',
        description_ar: 'طقم كامل من مثاقب الأسنان لجميع أنواع التدخلات',
        sub_description: 'Idéal pour cabinet dentaire moderne',
        items: ['Fraise Carbure Manche 3', 'Disque Diamanté Laboratoire', 'Matrices Sectionnelles'],
        bundle_price: '2800 DA',
        original_price: '4200 DA',
        calculated_savings: 1400,
        savings: '1400 DA',
        badge: 'Économique',
        procedures: '15+',
        popular: true
      },
      {
        name: 'Kit Chirurgie Orthopédique Basic',
        name_fr: 'Kit Chirurgie Orthopédique Basic',
        name_ar: 'طقم الجراحة العظمية الأساسي',
        description: 'Kit de base pour chirurgie orthopédique',
        description_fr: 'Kit de base pour chirurgie orthopédique',
        description_ar: 'طقم أساسي لجراحة العظام',
        sub_description: 'Pour interventions courantes',
        items: ['Plaque Tube 1/3', 'Robinet 3 voies', 'Vis de fixation'],
        bundle_price: '9500 DA',
        original_price: '14000 DA',
        calculated_savings: 4500,
        savings: '4500 DA',
        badge: 'Professionnel',
        procedures: '8+',
        popular: false
      },
      {
        name: 'Kit Traumatologie Avancé',
        name_fr: 'Kit Traumatologie Avancé',
        name_ar: 'طقم الصدمات المتقدم',
        description: 'Kit avancé pour traumatologie et urgences orthopédiques',
        description_fr: 'Kit avancé pour traumatologie et urgences orthopédiques',
        description_ar: 'طقم متقدم لطب الصدمات وحالات الطوارئ العظمية',
        sub_description: 'Pour cas complexes et urgences',
        items: ['Clou Tibial Verrouillé', 'Plaque DHS 135°', 'Plaque Radius L'],
        bundle_price: '48000 DA',
        original_price: '70000 DA',
        calculated_savings: 22000,
        savings: '22000 DA',
        badge: 'Premium',
        procedures: '5+',
        popular: true
      }
    ]

    // Insert bundles
    const { error: bundleError } = await supabaseClient
      .from('bundles')
      .upsert(bundles, { onConflict: 'name' })

    if (bundleError) {
      console.error('Error inserting bundles:', bundleError)
      throw bundleError
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Database populated successfully',
        categories: insertedCategories?.length || 0,
        products: products.length,
        bundles: bundles.length
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
    )
  }
})