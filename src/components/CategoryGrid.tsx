
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useQuery } from '@tanstack/react-query';

const CategoryGrid = () => {
  const { data: categories = [], isLoading, error } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('name_fr');
      
      if (error) throw error;
      return data;
    }
  });

  if (isLoading) {
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
            {[...Array(6)].map((_, index) => (
              <Card key={index} className="animate-pulse">
                <CardContent className="p-6">
                  <div className="h-20 bg-gray-200 rounded mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-16 px-4 bg-gray-50">
        <div className="container mx-auto text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Unable to load categories
          </h2>
          <p className="text-gray-600">Please try again later.</p>
        </div>
      </section>
    );
  }

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
          {categories.map((category) => (
            <Card key={category.id} className="group hover:shadow-lg transition-all duration-300 cursor-pointer border-0 bg-white">
              <CardContent className="p-0">
                <div className={`bg-gradient-to-br ${category.color} p-6 rounded-t-lg`}>
                  <div className="text-4xl mb-3">{category.icon}</div>
                  <h3 className="text-xl font-bold text-gray-900 mb-1">{category.name_fr}</h3>
                  <p className="text-sm text-gray-600 mb-2">{category.description_fr}</p>
                  <p className="text-xs text-primary font-medium">Items available</p>
                </div>
                
                <div className="p-6">
                  <div className="space-y-2 mb-4">
                    {category.name_ar && (
                      <p className="text-sm text-gray-600">
                        <span className="font-medium">العربية:</span> {category.name_ar}
                      </p>
                    )}
                    {category.name && (
                      <p className="text-sm text-gray-600">
                        <span className="font-medium">English:</span> {category.name}
                      </p>
                    )}
                  </div>
                  
                  <Link to={`/shop?category=${category.id}`}>
                    <Button className="w-full group-hover:bg-primary group-hover:text-white transition-colors">
                      Browse Category
                      <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link to="/shop">
            <Button variant="outline" size="lg" className="px-8">
              View All Categories
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default CategoryGrid;
