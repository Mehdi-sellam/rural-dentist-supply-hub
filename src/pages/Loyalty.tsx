
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Gift, Star, Crown, MessageCircle, CheckCircle } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const Loyalty = () => {
  const tiers = [
    {
      name: "Bronze Member",
      nameAr: "العضو البرونزي",
      nameFr: "Membre Bronze",
      icon: "🥉",
      minSpend: "0",
      benefits: ["Free delivery on orders over 5,000 DZD", "Basic customer support", "Order tracking"],
      color: "from-amber-100 to-amber-200"
    },
    {
      name: "Silver Member", 
      nameAr: "العضو الفضي",
      nameFr: "Membre Argent",
      icon: "🥈",
      minSpend: "25,000",
      benefits: ["All Bronze benefits", "5% discount on all orders", "Priority customer support", "Extended return period"],
      color: "from-gray-100 to-gray-200"
    },
    {
      name: "Gold Member",
      nameAr: "العضو الذهبي", 
      nameFr: "Membre Or",
      icon: "🥇",
      minSpend: "50,000",
      benefits: ["All Silver benefits", "10% discount on all orders", "Free express delivery", "Early access to new products", "Dedicated account manager"],
      color: "from-yellow-100 to-yellow-200"
    },
    {
      name: "Platinum Member",
      nameAr: "العضو البلاتيني",
      nameFr: "Membre Platine", 
      icon: "💎",
      minSpend: "100,000",
      benefits: ["All Gold benefits", "15% discount on all orders", "Custom bundle creation", "Training material access", "Annual clinic visit"],
      color: "from-purple-100 to-purple-200"
    }
  ];

  const rewards = [
    {
      title: "Buy 5 Kits, Get 1 Free",
      description: "Purchase any 5 procedure kits and receive the 6th one absolutely free",
      icon: Gift,
      color: "bg-green-500"
    },
    {
      title: "Referral Bonus",
      description: "Refer another dentist and both get 1,000 DZD credit on next order",
      icon: Star,
      color: "bg-blue-500"
    },
    {
      title: "Birthday Special",
      description: "Enjoy 20% off during your birthday month plus a special gift",
      icon: Crown,
      color: "bg-purple-500"
    }
  ];

  return (
    <div className="min-h-screen">
      <Header />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 to-green-50 py-16 px-4">
        <div className="container mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Loyalty Rewards Program
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            The more you order, the more you save. Join thousands of dentists enjoying exclusive benefits.
          </p>
        </div>
      </section>

      <div className="container mx-auto px-4 py-16">
        {/* Membership Tiers */}
        <section className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Membership Tiers</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Unlock better benefits as your annual spending increases
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {tiers.map((tier, index) => (
              <Card key={index} className="overflow-hidden hover:shadow-xl transition-all duration-300">
                <CardContent className="p-0">
                  <div className={`bg-gradient-to-br ${tier.color} p-6 text-center`}>
                    <div className="text-4xl mb-3">{tier.icon}</div>
                    <h3 className="text-xl font-bold text-gray-900 mb-1">{tier.name}</h3>
                    <div className="text-xs text-gray-600 space-y-1 mb-3">
                      <p className="rtl">{tier.nameAr}</p>
                      <p className="italic">{tier.nameFr}</p>
                    </div>
                    <Badge variant="outline" className="bg-white">
                      {tier.minSpend} DZD+ / year
                    </Badge>
                  </div>
                  
                  <div className="p-6">
                    <ul className="space-y-3">
                      {tier.benefits.map((benefit, benefitIndex) => (
                        <li key={benefitIndex} className="flex items-start gap-2 text-sm">
                          <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                          <span>{benefit}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Special Rewards */}
        <section className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Special Rewards</h2>
            <p className="text-gray-600">Extra benefits for our valued customers</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {rewards.map((reward, index) => (
              <Card key={index} className="text-center border-0 bg-white shadow-lg">
                <CardContent className="p-8">
                  <div className={`w-16 h-16 ${reward.color} rounded-full flex items-center justify-center mx-auto mb-4`}>
                    <reward.icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{reward.title}</h3>
                  <p className="text-gray-600">{reward.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* How It Works */}
        <section className="mb-16 bg-gray-50 rounded-2xl p-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">How It Works</h2>
            <p className="text-gray-600">Simple steps to start earning rewards</p>
          </div>
          
          <div className="grid md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center mx-auto mb-3 text-white font-bold">
                1
              </div>
              <h4 className="font-bold mb-2">Create Account</h4>
              <p className="text-sm text-gray-600">Sign up and start tracking your purchases automatically</p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center mx-auto mb-3 text-white font-bold">
                2
              </div>
              <h4 className="font-bold mb-2">Make Purchases</h4>
              <p className="text-sm text-gray-600">Every order counts towards your annual spending tier</p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center mx-auto mb-3 text-white font-bold">
                3
              </div>
              <h4 className="font-bold mb-2">Earn Benefits</h4>
              <p className="text-sm text-gray-600">Unlock discounts and perks as you reach higher tiers</p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center mx-auto mb-3 text-white font-bold">
                4
              </div>
              <h4 className="font-bold mb-2">Enjoy Rewards</h4>
              <p className="text-sm text-gray-600">Save money and get VIP treatment on future orders</p>
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="text-center">
          <Card className="max-w-2xl mx-auto bg-gradient-to-br from-primary/10 to-accent/20">
            <CardContent className="p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Ready to Start Earning Rewards?
              </h3>
              <p className="text-gray-600 mb-6">
                Join our loyalty program today and start saving on your dental supplies
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg">
                  Create Account
                </Button>
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="gap-2"
                  onClick={() => window.open('https://wa.me/213XXXXXXXXX?text=Hello! I want to learn more about your loyalty program.', '_blank')}
                >
                  <MessageCircle className="w-4 h-4" />
                  Ask Questions
                </Button>
              </div>
            </CardContent>
          </Card>
        </section>
      </div>

      <Footer />
    </div>
  );
};

export default Loyalty;
