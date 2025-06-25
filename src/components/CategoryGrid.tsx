
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';

const CategoryGrid = () => {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .limit(6);

      if (error) {
        console.error('Error fetching categories:', error);
        return;
      }

      setCategories(data || []);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <section className="py-16 px-4 bg-gray-50">
        <div className="container mx-auto text-center">
          <p>Chargement des catégories...</p>
        </div>
      </section>
    );
  }

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
                    {category.name_fr || category.name}
                  </h3>
                  <p className="text-gray-600 text-sm">
                    {category.description_fr || category.description || 'Découvrez notre sélection'}
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
