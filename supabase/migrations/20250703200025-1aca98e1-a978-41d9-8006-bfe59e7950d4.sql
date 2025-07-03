-- Insert sample categories
INSERT INTO categories (name, name_fr, name_ar, description, description_fr, description_ar, icon, color) VALUES
('Produits Dentaires', 'Produits Dentaires', 'منتجات الأسنان', 'Équipements et matériaux dentaires professionnels', 'Équipements et matériaux dentaires professionnels', 'معدات ومواد طب الأسنان المهنية', '🦷', 'from-blue-50 to-indigo-100'),
('Consommables Chirurgicaux', 'Consommables Chirurgicaux', 'المواد الاستهلاكية الجراحية', 'Matériaux et outils chirurgicaux usage unique', 'Matériaux et outils chirurgicaux usage unique', 'أدوات ومواد جراحية للاستخدام الواحد', '🔧', 'from-green-50 to-emerald-100'),
('Implants Orthopédiques', 'Implants Orthopédiques', 'الغرسات العظمية', 'Implants et prothèses orthopédiques', 'Implants et prothèses orthopédiques', 'الغرسات والأطراف الصناعية العظمية', '🦴', 'from-purple-50 to-violet-100')
ON CONFLICT (name) DO NOTHING;

-- Insert sample products with category references
INSERT INTO products (name, name_fr, name_ar, description, description_fr, description_ar, product_code, product_id, price, original_price, category_id, image_url, specifications, badge, in_stock, stock_status, rating, reviews) 
SELECT 
  'Fraise Carbure Manche 3',
  'Fraise Carbure Manche 3',
  'مثقاب كربايد مقبض 3',
  'Fraise carbure pour contre-angle, forme conique pointue, dents taillées',
  'Fraise carbure pour contre-angle, forme conique pointue, dents taillées',
  'مثقاب كربايد للزاوية المقابلة، شكل مخروطي مدبب، أسنان مقطوعة',
  'BURR-003',
  'BURR-003',
  850,
  1200,
  c.id,
  'https://actual-med.com/wp-content/uploads/woocommerce-placeholder.png',
  '{"Manche 3", "Forme conique", "Carbure de tungstène", "Usage dentaire"}',
  'Nouveau',
  true,
  true,
  4.5,
  12
FROM categories c WHERE c.name = 'Produits Dentaires'
ON CONFLICT (product_code) DO NOTHING;

INSERT INTO products (name, name_fr, name_ar, description, description_fr, description_ar, product_code, product_id, price, original_price, category_id, image_url, specifications, in_stock, stock_status, rating, reviews) 
SELECT 
  'Disque Diamanté Laboratoire Dentaire',
  'Disque Diamanté Laboratoire Dentaire',
  'قرص ماسي لمختبر الأسنان',
  'Disque diamanté fin pour laboratoire dentaire, précision optimale',
  'Disque diamanté fin pour laboratoire dentaire, précision optimale',
  'قرص ماسي رفيع لمختبر الأسنان، دقة مثلى',
  'DISC-001',
  'DISC-001',
  450,
  650,
  c.id,
  'https://actual-med.com/wp-content/uploads/2023/08/01_38b14573-b1a3-49b3-85a1-ed2e285d4574_480x480.jpg',
  '{"Disque diamanté", "Usage laboratoire", "Haute précision", "Durabilité"}',
  true,
  true,
  4.7,
  8
FROM categories c WHERE c.name = 'Produits Dentaires'
ON CONFLICT (product_code) DO NOTHING;

INSERT INTO products (name, name_fr, name_ar, description, description_fr, description_ar, product_code, product_id, price, original_price, category_id, image_url, specifications, badge, in_stock, stock_status, rating, reviews) 
SELECT 
  'Matrices Sectionnelles Dentaires',
  'Matrices Sectionnelles Dentaires',
  'مصفوفات قسمية للأسنان',
  'Bandes matrices sectionnelles contournées avec coins',
  'Bandes matrices sectionnelles contournées avec coins',
  'شرائط مصفوفة قسمية محيطة مع أوتاد',
  'MATRIX-001',
  'MATRIX-001',
  1250,
  1800,
  c.id,
  'https://actual-med.com/wp-content/uploads/2023/08/2bc3fb23a5.jpg',
  '{"Matrices sectionnelles", "Coins inclus", "Contournées", "Restauration composite"}',
  'Populaire',
  true,
  true,
  4.6,
  15
FROM categories c WHERE c.name = 'Produits Dentaires'
ON CONFLICT (product_code) DO NOTHING;

INSERT INTO products (name, name_fr, name_ar, description, description_fr, description_ar, product_code, product_id, price, original_price, category_id, image_url, specifications, in_stock, stock_status, rating, reviews) 
SELECT 
  'Robinet d''arrêt 3 voies',
  'Robinet d''arrêt 3 voies',
  'صنبور إيقاف ثلاثي الاتجاهات',
  'Robinet d''arrêt stérile à 3 voies pour usage chirurgical',
  'Robinet d''arrêt stérile à 3 voies pour usage chirurgical',
  'صنبور إيقاف معقم ثلاثي الاتجاهات للاستخدام الجراحي',
  'STOP-003',
  'STOP-003',
  75,
  120,
  c.id,
  'https://actual-med.com/wp-content/uploads/2023/08/3-way-stop-cock.jpg',
  '{"3 voies", "Stérile", "Usage unique", "Matériau médical"}',
  true,
  true,
  4.3,
  25
FROM categories c WHERE c.name = 'Consommables Chirurgicaux'
ON CONFLICT (product_code) DO NOTHING;

INSERT INTO products (name, name_fr, name_ar, description, description_fr, description_ar, product_code, product_id, price, original_price, category_id, image_url, specifications, badge, in_stock, stock_status, rating, reviews) 
SELECT 
  'Plaque Tube 1/3',
  'Plaque Tube 1/3',
  'لوحة أنبوب 1/3',
  'Plaque tubulaire 1/3 pour fixation orthopédique',
  'Plaque tubulaire 1/3 pour fixation orthopédique',
  'لوحة أنبوبية 1/3 للتثبيت العظمي',
  'TUBE-13',
  'TUBE-13',
  8500,
  12000,
  c.id,
  'https://actual-med.com/wp-content/uploads/2023/08/13-TUBE-PLATE.jpg',
  '{"Plaque 1/3", "Titane médical", "Vis incluses", "Stérile"}',
  'Professionnel',
  true,
  true,
  4.8,
  5
FROM categories c WHERE c.name = 'Implants Orthopédiques'
ON CONFLICT (product_code) DO NOTHING;

INSERT INTO products (name, name_fr, name_ar, description, description_fr, description_ar, product_code, product_id, price, original_price, category_id, image_url, specifications, badge, in_stock, stock_status, rating, reviews) 
SELECT 
  'Plaque DHS 135°',
  'Plaque DHS 135°',
  'لوحة DHS 135°',
  'Plaque DHS à 135° pour fixation de hanche',
  'Plaque DHS à 135° pour fixation de hanche',
  'لوحة DHS بزاوية 135° لتثبيت الورك',
  'DHS-135',
  'DHS-135',
  15000,
  22000,
  c.id,
  'https://actual-med.com/wp-content/uploads/2023/08/135%C2%B0-DHS-PLATE.jpg',
  '{"Angle 135°", "Titane médical", "Système DHS", "Chirurgie hanche"}',
  'Premium',
  true,
  true,
  4.9,
  3
FROM categories c WHERE c.name = 'Implants Orthopédiques'
ON CONFLICT (product_code) DO NOTHING;

-- Insert sample bundles
INSERT INTO bundles (name, name_fr, name_ar, description, description_fr, description_ar, sub_description, items, bundle_price, original_price, calculated_savings, savings, badge, procedures, popular) VALUES
('Kit Fraises Dentaires Complet', 'Kit Fraises Dentaires Complet', 'طقم مثاقب الأسنان الكامل', 'Kit complet de fraises dentaires pour tous types d''interventions', 'Kit complet de fraises dentaires pour tous types d''interventions', 'طقم كامل من مثاقب الأسنان لجميع أنواع التدخلات', 'Idéal pour cabinet dentaire moderne', '{"Fraise Carbure Manche 3", "Disque Diamanté Laboratoire", "Matrices Sectionnelles"}', '2800 DA', '4200 DA', 1400, '1400 DA', 'Économique', '15+', true),
('Kit Chirurgie Orthopédique Basic', 'Kit Chirurgie Orthopédique Basic', 'طقم الجراحة العظمية الأساسي', 'Kit de base pour chirurgie orthopédique', 'Kit de base pour chirurgie orthopédique', 'طقم أساسي لجراحة العظام', 'Pour interventions courantes', '{"Plaque Tube 1/3", "Robinet 3 voies", "Vis de fixation"}', '9500 DA', '14000 DA', 4500, '4500 DA', 'Professionnel', '8+', false)
ON CONFLICT (name) DO NOTHING;