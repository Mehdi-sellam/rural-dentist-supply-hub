
import React from 'react';
import { MapPin, Phone, Mail, MessageCircle, Clock, Truck, Shield, Award } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white">
      {/* Main footer content */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center">
                  <div className="w-3 h-3 bg-primary rounded-full"></div>
                </div>
              </div>
              <div>
                <h3 className="text-xl font-bold">DentGo</h3>
                <p className="text-sm text-gray-400">Supplies that travel to you</p>
              </div>
            </div>
            <p className="text-gray-300 text-sm leading-relaxed">
              Empowering dentists across Algeria with quality supplies and reliable delivery, from Algiers to the most remote villages.
            </p>
            <div className="flex items-center gap-4 pt-2">
              <Award className="w-5 h-5 text-green-400" />
              <span className="text-sm text-gray-300">ISO Certified Supplier</span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="/shop" className="text-gray-300 hover:text-primary transition-colors">Shop All Products</a></li>
              <li><a href="/bundles" className="text-gray-300 hover:text-primary transition-colors">Procedure Bundles</a></li>
              <li><a href="/loyalty" className="text-gray-300 hover:text-primary transition-colors">Loyalty Program</a></li>
              <li><a href="/about" className="text-gray-300 hover:text-primary transition-colors">About Us</a></li>
              <li><a href="/contact" className="text-gray-300 hover:text-primary transition-colors">Contact Support</a></li>
              <li><a href="/faq" className="text-gray-300 hover:text-primary transition-colors">FAQ</a></li>
            </ul>
          </div>

          {/* Categories */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold">Categories</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="/category/restoratives" className="text-gray-300 hover:text-primary transition-colors">Restoratives</a></li>
              <li><a href="/category/surgical" className="text-gray-300 hover:text-primary transition-colors">Surgical Tools</a></li>
              <li><a href="/category/disposables" className="text-gray-300 hover:text-primary transition-colors">Disposables</a></li>
              <li><a href="/category/equipment" className="text-gray-300 hover:text-primary transition-colors">Equipment</a></li>
              <li><a href="/category/orthodontics" className="text-gray-300 hover:text-primary transition-colors">Orthodontics</a></li>
              <li><a href="/category/endodontics" className="text-gray-300 hover:text-primary transition-colors">Endodontics</a></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold">Contact Us</h4>
            <div className="space-y-3 text-sm">
              <div className="flex items-start gap-3">
                <MessageCircle className="w-5 h-5 text-green-400 mt-0.5" />
                <div>
                  <p className="font-medium text-green-400">WhatsApp Orders</p>
                  <p className="text-gray-300">+213 XXX XXX XXX</p>
                  <p className="text-xs text-gray-400">Available 24/7</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <Phone className="w-5 h-5 text-primary mt-0.5" />
                <div>
                  <p className="font-medium">Phone Support</p>
                  <p className="text-gray-300">+213 XXX XXX XXX</p>
                  <p className="text-xs text-gray-400">8AM - 8PM (AR/FR/EN)</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-primary mt-0.5" />
                <div>
                  <p className="font-medium">Email</p>
                  <p className="text-gray-300">support@dentgo.dz</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-primary mt-0.5" />
                <div>
                  <p className="font-medium">Warehouse</p>
                  <p className="text-gray-300">Algiers, Algeria</p>
                  <p className="text-xs text-gray-400">Serving all 48 wilayas</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Service highlights */}
      <div className="border-t border-gray-800">
        <div className="container mx-auto px-4 py-6">
          <div className="grid md:grid-cols-3 gap-4 text-center">
            <div className="flex items-center justify-center gap-3">
              <Truck className="w-5 h-5 text-green-400" />
              <span className="text-sm text-gray-300">Free delivery to rural areas</span>
            </div>
            <div className="flex items-center justify-center gap-3">
              <Clock className="w-5 h-5 text-blue-400" />
              <span className="text-sm text-gray-300">48h delivery nationwide</span>
            </div>
            <div className="flex items-center justify-center gap-3">
              <Shield className="w-5 h-5 text-purple-400" />
              <span className="text-sm text-gray-300">Quality guarantee</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom footer */}
      <div className="border-t border-gray-800">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-sm text-gray-400">
              © 2024 DentGo. All rights reserved. | Serving dental professionals across Algeria
            </div>
            <div className="flex items-center gap-6 text-sm text-gray-400">
              <a href="/privacy" className="hover:text-primary transition-colors">Privacy Policy</a>
              <a href="/terms" className="hover:text-primary transition-colors">Terms of Service</a>
              <a href="/shipping" className="hover:text-primary transition-colors">Shipping Info</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
