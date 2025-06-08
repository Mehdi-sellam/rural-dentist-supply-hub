
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Heart, ShoppingCart, MessageCircle, Star } from 'lucide-react';

const FeaturedProducts = () => {
  const products = [
    {
      id: 1,
      name: 'Premium Composite Kit',
      nameAr: 'مجموعة الحشوات المركبة المتميزة',
      nameFr: 'Kit composite premium',
      price: '15,900 DZD',
      originalPrice: '18,500 DZD',
      image: '🦷',
      badge: 'Best Seller',
      rating: 4.8,
      reviews: 126,
      description: 'Complete restoration kit with 8 shades'
    },
    {
      id: 2,
      name: 'Surgical Instruments Set',
      nameAr: 'مجموعة الأدوات الجراحية',
      nameFr: 'Set d\'instruments chirurgicaux',
      price: '8,750 DZD',
      originalPrice: null,
      image: '⚕️',
      badge: 'New Arrival',
      rating: 4.9,
      reviews: 89,
      description: 'Professional grade stainless steel'
    },
    {
      id: 3,
      name: 'Nitril Gloves (100 Box)',
      nameAr: 'قفازات نيتريل (صندوق 100)',
      nameFr: 'Gants nitrile (boîte 100)',
      price: '2,300 DZD',
      originalPrice: '2,800 DZD',
      image: '🧤',
      badge: 'Rural Favorite',
      rating: 4.7,
      reviews: 203,
      description: 'Powder-free, latex-free protection'
    },
    {
      id: 4,
      name: 'LED Curing Light',
      nameAr: 'ضوء المعالجة LED',
      nameFr: 'Lampe de polymérisation LED',
      price: '12,400 DZD',
      originalPrice: '14,900 DZD',
      image: '💡',
      badge: 'Limited Offer',
      rating: 4.6,
      reviews: 67,
      description: 'High intensity, cordless design'
    }
  ];

  const getBadgeColor = (badge: string) => {
    switch (badge) {
      case 'Best Seller': return 'bg-green-500 text-white';
      case 'New Arrival': return 'bg-blue-500 text-white';
      case 'Rural Favorite': return 'bg-purple-500 text-white';
      case 'Limited Offer': return 'bg-red-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  return (
    <section className="py-16 px-4">
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Featured Products
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Hand-picked supplies trusted by dentists across Algeria
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <Card key={product.id} className="group hover:shadow-xl transition-all duration-300 overflow-hidden">
              <CardContent className="p-0">
                {/* Product Image Area */}
                <div className="relative bg-gradient-to-br from-gray-50 to-gray-100 aspect-square flex items-center justify-center">
                  <div className="text-6xl">{product.image}</div>
                  
                  {/* Badge */}
                  <Badge className={`absolute top-3 left-3 ${getBadgeColor(product.badge)}`}>
                    {product.badge}
                  </Badge>
                  
                  {/* Wishlist button */}
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="absolute top-3 right-3 h-8 w-8 p-0 bg-white/80 hover:bg-white"
                  >
                    <Heart className="w-4 h-4" />
                  </Button>
                  
                  {/* Quick actions on hover */}
                  <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <Button size="sm" className="gap-2">
                      <ShoppingCart className="w-4 h-4" />
                      Add to Cart
                    </Button>
                  </div>
                </div>

                {/* Product Info */}
                <div className="p-4 space-y-3">
                  {/* Rating */}
                  <div className="flex items-center gap-1 text-sm">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-3 h-3 ${
                            i < Math.floor(product.rating) 
                              ? 'fill-yellow-400 text-yellow-400' 
                              : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-gray-600">({product.reviews})</span>
                  </div>

                  {/* Product Name */}
                  <div>
                    <h3 className="font-bold text-gray-900 mb-1">{product.name}</h3>
                    <p className="text-xs text-gray-600">{product.description}</p>
                  </div>

                  {/* Multilingual names */}
                  <div className="text-xs text-gray-500 space-y-1">
                    <p className="rtl">{product.nameAr}</p>
                    <p className="italic">{product.nameFr}</p>
                  </div>

                  {/* Price */}
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-bold text-primary">{product.price}</span>
                    {product.originalPrice && (
                      <span className="text-sm text-gray-400 line-through">{product.originalPrice}</span>
                    )}
                  </div>

                  {/* Action buttons */}
                  <div className="flex gap-2">
                    <Button className="flex-1 text-sm">
                      <ShoppingCart className="w-4 h-4 mr-1" />
                      Add to Cart
                    </Button>
                    <Button variant="outline" size="sm" className="px-3">
                      <MessageCircle className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <Button variant="outline" size="lg" className="px-8">
            View All Products
          </Button>
        </div>
      </div>
    </section>
  );
};

export default FeaturedProducts;
