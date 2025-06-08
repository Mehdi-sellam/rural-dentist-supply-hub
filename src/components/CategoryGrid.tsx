
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

const CategoryGrid = () => {
  const categories = [
    {
      name: 'Restoratives',
      nameAr: 'مواد الترميم',
      nameFr: 'Matériaux de restauration',
      description: 'Composites, amalgams, cements',
      icon: '🦷',
      itemCount: '150+ items',
      color: 'from-blue-100 to-blue-200'
    },
    {
      name: 'Surgical Tools',
      nameAr: 'أدوات الجراحة',
      nameFr: 'Instruments chirurgicaux',
      description: 'Forceps, elevators, scissors',
      icon: '⚕️',
      itemCount: '80+ items',
      color: 'from-green-100 to-green-200'
    },
    {
      name: 'Disposables',
      nameAr: 'المواد المستهلكة',
      nameFr: 'Matériel jetable',
      description: 'Gloves, masks, syringes',
      icon: '🧤',
      itemCount: '200+ items',
      color: 'from-purple-100 to-purple-200'
    },
    {
      name: 'Equipment',
      nameAr: 'المعدات',
      nameFr: 'Équipement',
      description: 'Units, compressors, lights',
      icon: '🔧',
      itemCount: '45+ items',
      color: 'from-orange-100 to-orange-200'
    },
    {
      name: 'Orthodontics',
      nameAr: 'تقويم الأسنان',
      nameFr: 'Orthodontie',
      description: 'Brackets, wires, bands',
      icon: '🦾',
      itemCount: '120+ items',
      color: 'from-teal-100 to-teal-200'
    },
    {
      name: 'Endodontics',
      nameAr: 'علاج الجذور',
      nameFr: 'Endodontie',
      description: 'Files, sealers, irrigants',
      icon: '🔍',
      itemCount: '90+ items',
      color: 'from-pink-100 to-pink-200'
    }
  ];

  return (
    <section className="py-16 px-4 bg-gray-50">
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Shop by Category
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Find exactly what you need from our comprehensive collection of dental supplies
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category, index) => (
            <Card key={index} className="group hover:shadow-lg transition-all duration-300 cursor-pointer border-0 bg-white">
              <CardContent className="p-0">
                <div className={`bg-gradient-to-br ${category.color} p-6 rounded-t-lg`}>
                  <div className="text-4xl mb-3">{category.icon}</div>
                  <h3 className="text-xl font-bold text-gray-900 mb-1">{category.name}</h3>
                  <p className="text-sm text-gray-600 mb-2">{category.description}</p>
                  <p className="text-xs text-primary font-medium">{category.itemCount}</p>
                </div>
                
                <div className="p-6">
                  <div className="space-y-2 mb-4">
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">العربية:</span> {category.nameAr}
                    </p>
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">Français:</span> {category.nameFr}
                    </p>
                  </div>
                  
                  <Button className="w-full group-hover:bg-primary group-hover:text-white transition-colors">
                    Browse Category
                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <Button variant="outline" size="lg" className="px-8">
            View All Categories
          </Button>
        </div>
      </div>
    </section>
  );
};

export default CategoryGrid;
