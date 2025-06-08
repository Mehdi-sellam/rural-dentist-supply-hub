
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Truck, Heart, Users, Award, MapPin, Phone } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const About = () => {
  return (
    <div className="min-h-screen">
      <Header />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 to-green-50 py-16 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              About <span className="text-primary">DentGo</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Empowering dentists in rural Algeria with fast, reliable access to quality dental supplies. 
              We believe every patient deserves excellent dental care, regardless of location.
            </p>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Mission</h2>
              <p className="text-gray-600 mb-4 leading-relaxed">
                Rural dentists face unique challenges in accessing quality dental supplies. Long distances, 
                limited suppliers, and unreliable delivery services can compromise patient care.
              </p>
              <p className="text-gray-600 mb-6 leading-relaxed">
                DentGo bridges this gap by providing a comprehensive online platform specifically designed 
                for dental professionals in underserved areas. We ensure that distance never compromises 
                the quality of dental care.
              </p>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4">
                  <div className="text-2xl font-bold text-primary">48h</div>
                  <p className="text-sm text-gray-600">Delivery anywhere</p>
                </div>
                <div className="text-center p-4">
                  <div className="text-2xl font-bold text-primary">500+</div>
                  <p className="text-sm text-gray-600">Products available</p>
                </div>
              </div>
            </div>
            <div className="bg-gradient-to-br from-primary/10 to-accent/20 rounded-2xl p-8 text-center">
              <div className="text-6xl mb-4">🦷</div>
              <h3 className="text-xl font-bold mb-2">Quality Care Everywhere</h3>
              <p className="text-gray-600">From Algiers to the most remote villages</p>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="bg-gray-50 py-16 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Values</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Built on the foundation of accessibility, quality, and reliability
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="text-center border-0 bg-white shadow-md">
              <CardContent className="p-6">
                <Truck className="w-12 h-12 text-primary mx-auto mb-4" />
                <h3 className="font-bold mb-2">Rural Delivery</h3>
                <p className="text-sm text-gray-600">
                  Specialized logistics for remote areas with guaranteed 48-hour delivery
                </p>
              </CardContent>
            </Card>
            
            <Card className="text-center border-0 bg-white shadow-md">
              <CardContent className="p-6">
                <Award className="w-12 h-12 text-primary mx-auto mb-4" />
                <h3 className="font-bold mb-2">Quality Assured</h3>
                <p className="text-sm text-gray-600">
                  Products sourced from trusted EU and Asian manufacturers
                </p>
              </CardContent>
            </Card>
            
            <Card className="text-center border-0 bg-white shadow-md">
              <CardContent className="p-6">
                <Users className="w-12 h-12 text-primary mx-auto mb-4" />
                <h3 className="font-bold mb-2">Expert Support</h3>
                <p className="text-sm text-gray-600">
                  24/7 assistance in Arabic, French, and English
                </p>
              </CardContent>
            </Card>
            
            <Card className="text-center border-0 bg-white shadow-md">
              <CardContent className="p-6">
                <Heart className="w-12 h-12 text-primary mx-auto mb-4" />
                <h3 className="font-bold mb-2">Patient First</h3>
                <p className="text-sm text-gray-600">
                  Every supply decision impacts patient care and outcomes
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Coverage Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Serving All of Algeria
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              From major cities to remote villages, we deliver everywhere
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="bg-blue-50 border-blue-200">
              <CardContent className="p-6 text-center">
                <MapPin className="w-8 h-8 text-blue-600 mx-auto mb-3" />
                <h3 className="font-bold mb-2">Northern Algeria</h3>
                <p className="text-sm text-gray-600 mb-3">
                  Algiers, Oran, Constantine, and surrounding areas
                </p>
                <p className="text-xs text-blue-600">24-48h delivery</p>
              </CardContent>
            </Card>
            
            <Card className="bg-green-50 border-green-200">
              <CardContent className="p-6 text-center">
                <MapPin className="w-8 h-8 text-green-600 mx-auto mb-3" />
                <h3 className="font-bold mb-2">Highlands & South</h3>
                <p className="text-sm text-gray-600 mb-3">
                  Ouargla, Ghardaïa, Tamanrasset, and remote regions
                </p>
                <p className="text-xs text-green-600">48h guaranteed</p>
              </CardContent>
            </Card>
            
            <Card className="bg-purple-50 border-purple-200">
              <CardContent className="p-6 text-center">
                <Phone className="w-8 h-8 text-purple-600 mx-auto mb-3" />
                <h3 className="font-bold mb-2">Special Locations</h3>
                <p className="text-sm text-gray-600 mb-3">
                  Remote villages, mountain areas, desert communities
                </p>
                <p className="text-xs text-purple-600">Custom arrangements</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="bg-gray-50 py-16 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Commitment</h2>
            <p className="text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Founded by healthcare professionals who understand the challenges of rural practice, 
              DentGo is more than a supply company—we're your partners in providing excellent patient care.
            </p>
          </div>
          
          <div className="bg-white rounded-2xl p-8 shadow-lg max-w-4xl mx-auto">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <h3 className="text-xl font-bold mb-4">Why Choose DentGo?</h3>
                <ul className="space-y-3">
                  <li className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                    <span className="text-gray-600">Direct partnerships with manufacturers for better prices</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                    <span className="text-gray-600">Specialized rural logistics network</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                    <span className="text-gray-600">Multilingual customer support</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                    <span className="text-gray-600">Flexible payment options including cash on delivery</span>
                  </li>
                </ul>
              </div>
              <div className="text-center">
                <div className="text-4xl mb-4">🤝</div>
                <p className="text-gray-600 italic">
                  "Together, we ensure that every Algerian has access to quality dental care, 
                  regardless of where they live."
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default About;
