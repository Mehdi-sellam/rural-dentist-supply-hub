
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
                <p className="text-sm text-gray-400">Des fournitures qui voyagent jusqu'à vous</p>
              </div>
            </div>
            <p className="text-gray-300 text-sm leading-relaxed">
              Nous responsabilisons les dentistes à travers l'Algérie avec des fournitures de qualité et une livraison fiable, d'Alger aux villages les plus reculés.
            </p>
            <div className="flex items-center gap-4 pt-2">
              <Award className="w-5 h-5 text-green-400" />
              <span className="text-sm text-gray-300">Fournisseur Certifié ISO</span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold">Liens Rapides</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="/shop" className="text-gray-300 hover:text-primary transition-colors">Tous les Produits</a></li>
              <li><a href="/bundles" className="text-gray-300 hover:text-primary transition-colors">Kits de Procédures</a></li>
              <li><a href="/loyalty" className="text-gray-300 hover:text-primary transition-colors">Programme de Fidélité</a></li>
              <li><a href="/about" className="text-gray-300 hover:text-primary transition-colors">À Propos</a></li>
              <li><a href="/contact" className="text-gray-300 hover:text-primary transition-colors">Support Contact</a></li>
              <li><a href="/faq" className="text-gray-300 hover:text-primary transition-colors">FAQ</a></li>
            </ul>
          </div>

          {/* Categories */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold">Catégories</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="/category/restoratives" className="text-gray-300 hover:text-primary transition-colors">Restaurations</a></li>
              <li><a href="/category/surgical" className="text-gray-300 hover:text-primary transition-colors">Instruments Chirurgicaux</a></li>
              <li><a href="/category/disposables" className="text-gray-300 hover:text-primary transition-colors">Jetables</a></li>
              <li><a href="/category/equipment" className="text-gray-300 hover:text-primary transition-colors">Équipements</a></li>
              <li><a href="/category/orthodontics" className="text-gray-300 hover:text-primary transition-colors">Orthodontie</a></li>
              <li><a href="/category/endodontics" className="text-gray-300 hover:text-primary transition-colors">Endodontie</a></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold">Contactez-nous</h4>
            <div className="space-y-3 text-sm">
              <div className="flex items-start gap-3">
                <MessageCircle className="w-5 h-5 text-green-400 mt-0.5" />
                <div>
                  <p className="font-medium text-green-400">Commandes WhatsApp</p>
                  <p className="text-gray-300">+213 XXX XXX XXX</p>
                  <p className="text-xs text-gray-400">Disponible 24/7</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <Phone className="w-5 h-5 text-primary mt-0.5" />
                <div>
                  <p className="font-medium">Support Téléphonique</p>
                  <p className="text-gray-300">+213 XXX XXX XXX</p>
                  <p className="text-xs text-gray-400">8h - 20h (AR/FR/EN)</p>
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
                  <p className="font-medium">Entrepôt</p>
                  <p className="text-gray-300">Alger, Algérie</p>
                  <p className="text-xs text-gray-400">Desservant les 48 wilayas</p>
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
              <span className="text-sm text-gray-300">Livraison gratuite en zones rurales</span>
            </div>
            <div className="flex items-center justify-center gap-3">
              <Clock className="w-5 h-5 text-blue-400" />
              <span className="text-sm text-gray-300">Livraison 48h à l'échelle nationale</span>
            </div>
            <div className="flex items-center justify-center gap-3">
              <Shield className="w-5 h-5 text-purple-400" />
              <span className="text-sm text-gray-300">Garantie de qualité</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom footer */}
      <div className="border-t border-gray-800">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-sm text-gray-400">
              © 2024 DentGo. Tous droits réservés. | Au service des professionnels dentaires à travers l'Algérie
            </div>
            <div className="flex items-center gap-6 text-sm text-gray-400">
              <a href="/privacy" className="hover:text-primary transition-colors">Politique de Confidentialité</a>
              <a href="/terms" className="hover:text-primary transition-colors">Conditions de Service</a>
              <a href="/shipping" className="hover:text-primary transition-colors">Info Livraison</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
