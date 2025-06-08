
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Truck, Clock, Shield, MessageCircle } from 'lucide-react';

const HeroSection = () => {
  return (
    <section className="bg-gradient-to-br from-blue-50 to-green-50 py-16 px-4">
      <div className="container mx-auto">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Text content */}
          <div className="space-y-6">
            <div className="space-y-4">
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
                Professional Dental Supplies
                <span className="text-primary block">Delivered Anywhere</span>
              </h1>
              <p className="text-xl text-gray-600 leading-relaxed">
                Empowering dentists in rural Algeria with fast, reliable access to quality dental materials and equipment. From Algiers to the most remote villages.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/shop">
                <Button size="lg" className="text-lg px-8 py-6">
                  Start Shopping
                </Button>
              </Link>
              <Button 
                variant="outline" 
                size="lg" 
                className="text-lg px-8 py-6 gap-2"
                onClick={() => window.open('https://wa.me/213XXXXXXXXX?text=Hello! I would like to place an order for dental supplies.', '_blank')}
              >
                <MessageCircle className="w-5 h-5" />
                Order via WhatsApp
              </Button>
            </div>

            {/* Trust indicators */}
            <div className="grid grid-cols-3 gap-4 mt-8">
              <Card className="p-4 text-center border-primary/20 bg-white/50">
                <Truck className="w-8 h-8 text-primary mx-auto mb-2" />
                <p className="text-sm font-medium">Rural Delivery</p>
                <p className="text-xs text-muted-foreground">48h anywhere</p>
              </Card>
              <Card className="p-4 text-center border-primary/20 bg-white/50">
                <Shield className="w-8 h-8 text-primary mx-auto mb-2" />
                <p className="text-sm font-medium">Quality Assured</p>
                <p className="text-xs text-muted-foreground">EU/Asia sourced</p>
              </Card>
              <Card className="p-4 text-center border-primary/20 bg-white/50">
                <Clock className="w-8 h-8 text-primary mx-auto mb-2" />
                <p className="text-sm font-medium">24/7 Support</p>
                <p className="text-xs text-muted-foreground">AR/FR/EN</p>
              </Card>
            </div>
          </div>

          {/* Image/Visual */}
          <div className="relative">
            <div className="bg-white rounded-2xl shadow-xl p-8 medical-shadow">
              <div className="aspect-square bg-gradient-to-br from-primary/10 to-accent/20 rounded-xl mb-6 flex items-center justify-center">
                <div className="text-6xl">🦷</div>
              </div>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                  <span className="text-sm font-medium">Composite Fillings Kit</span>
                  <span className="text-primary font-bold">In Stock</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                  <span className="text-sm font-medium">Surgical Instruments</span>
                  <span className="text-primary font-bold">Fast Ship</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                  <span className="text-sm font-medium">Disposable Gloves</span>
                  <span className="text-primary font-bold">Bulk Available</span>
                </div>
              </div>
            </div>
            
            {/* Floating testimonial */}
            <Card className="absolute -bottom-4 -left-4 p-4 bg-white shadow-lg max-w-xs">
              <p className="text-sm italic">"Finally, quality supplies reach our clinic in Ouargla!"</p>
              <p className="text-xs text-muted-foreground mt-2">- Dr. Amina K., Rural Dentist</p>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
