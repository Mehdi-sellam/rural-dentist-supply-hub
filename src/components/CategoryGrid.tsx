import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const CategoryGrid = () => {
  // Static categories data instead of fetching from Supabase
  const categories = [
    {
      id: '1',
      name_fr: 'Restaurations',
      description_fr: 'Composites, amalgames et matériaux de restauration',
      icon: '🦷',
      color: 'from-blue-50 to-blue-100'
    },
    {
      id: '2',
      name_fr: 'Instruments Chirurgicaux',
      description_fr: 'Scalpels, pinces et instruments de chirurgie',
      icon: '🔪',
      color: 'from-green-50 to-green-100'
    },
    {
      id: '3',
      name_fr: 'Jetables',
      description_fr: 'Gants, masques et produits à usage unique',
      icon: '🧤',
      color: 'from-purple-50 to-purple-100'
    },
    {
      id: '4',
      name_fr: 'Équipements',
      description_fr: 'Fauteuils, lampes et équipements de cabinet',
      icon: '🪑',
      color: 'from-orange-50 to-orange-100'
    },
    {
      id: '5',
      name_fr: 'Orthodontie',
      description_fr: 'Brackets, fils et matériaux orthodontiques',
      icon: '🦿',
      color: 'from-pink-50 to-pink-100'
    },
    {
      id: '6',
      name_fr: 'Endodontie',
      description_fr: 'Limes, cônes et matériaux endodontiques',
      icon: '🔧',
      color: 'from-indigo-50 to-indigo-100'
    }
  ];

  return (
    <section className="py-16 px-4 bg-gray-50">
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Acheter par Catégorie
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
            Trouvez exactement ce dont vous avez besoin dans notre collection complète de fournitures dentaires
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {categories.map((category) => (
            <Link key={category.id} to={`/category/${category.id}`}>
              <Card className={`transition-all duration-300 hover:shadow-lg cursor-pointer bg-gradient-to-br ${category.color}`}>
                <CardContent className="p-6 text-center">
                  <div className="text-4xl mb-4">{category.icon}</div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    {category.name_fr}
                  </h3>
                  <p className="text-gray-600 text-sm">
                    {category.description_fr}
                  </p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        <div className="text-center">
          <Link to="/shop">
            <Button size="lg" className="text-lg px-8 py-6">
              Voir Toutes les Catégories
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default CategoryGrid;
