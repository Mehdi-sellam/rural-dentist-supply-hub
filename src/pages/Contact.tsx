
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { MessageCircle, Phone, Mail, MapPin, Clock } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    clinic: '',
    location: '',
    subject: '',
    message: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const generateWhatsAppMessage = () => {
    const message = `Hello! Contact form submission:
    
Name: ${formData.name}
Email: ${formData.email}
Phone: ${formData.phone}
Clinic: ${formData.clinic}
Location: ${formData.location}
Subject: ${formData.subject}

Message: ${formData.message}`;
    
    return `https://wa.me/213XXXXXXXXX?text=${encodeURIComponent(message)}`;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    window.open(generateWhatsAppMessage(), '_blank');
  };

  return (
    <div className="min-h-screen">
      <Header />
      
      {/* Header */}
      <section className="bg-gradient-to-br from-blue-50 to-green-50 py-16 px-4">
        <div className="container mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Contact Us
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            We're here to help you get the dental supplies you need, wherever you are in Algeria
          </p>
        </div>
      </section>

      <div className="container mx-auto px-4 py-16">
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <div>
            <Card>
              <CardContent className="p-8">
                <h2 className="text-2xl font-bold mb-6">Send us a Message</h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name">Full Name *</Label>
                      <Input
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                        placeholder="Dr. Your Name"
                      />
                    </div>
                    <div>
                      <Label htmlFor="email">Email Address *</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        placeholder="doctor@clinic.com"
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        placeholder="+213 XXX XXX XXX"
                      />
                    </div>
                    <div>
                      <Label htmlFor="clinic">Clinic/Practice Name</Label>
                      <Input
                        id="clinic"
                        name="clinic"
                        value={formData.clinic}
                        onChange={handleInputChange}
                        placeholder="Your Dental Clinic"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="location">Location/City *</Label>
                    <Input
                      id="location"
                      name="location"
                      value={formData.location}
                      onChange={handleInputChange}
                      required
                      placeholder="City, Wilaya"
                    />
                  </div>

                  <div>
                    <Label htmlFor="subject">Subject *</Label>
                    <Input
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleInputChange}
                      required
                      placeholder="Product inquiry, delivery question, etc."
                    />
                  </div>

                  <div>
                    <Label htmlFor="message">Message *</Label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      required
                      rows={5}
                      className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="Tell us how we can help you..."
                    />
                  </div>

                  <Button type="submit" className="w-full gap-2" size="lg">
                    <MessageCircle className="w-4 h-4" />
                    Send via WhatsApp
                  </Button>
                </form>

                <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                  <p className="text-sm text-blue-800">
                    💡 For urgent orders or immediate assistance, you can also contact us directly via WhatsApp
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Contact Information */}
          <div className="space-y-6">
            {/* Direct Contact */}
            <Card>
              <CardContent className="p-6">
                <h3 className="text-xl font-bold mb-4">Direct Contact</h3>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <MessageCircle className="w-5 h-5 text-green-600" />
                    <div>
                      <p className="font-medium">WhatsApp</p>
                      <p className="text-sm text-gray-600">+213 XXX XXX XXX</p>
                      <p className="text-xs text-green-600">Fastest response (24/7)</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <Phone className="w-5 h-5 text-blue-600" />
                    <div>
                      <p className="font-medium">Phone</p>
                      <p className="text-sm text-gray-600">+213 XXX XXX XXX</p>
                      <p className="text-xs text-blue-600">Business hours</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <Mail className="w-5 h-5 text-purple-600" />
                    <div>
                      <p className="font-medium">Email</p>
                      <p className="text-sm text-gray-600">info@dentgo.dz</p>
                      <p className="text-xs text-purple-600">48h response time</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Business Hours */}
            <Card>
              <CardContent className="p-6">
                <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  Business Hours
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Sunday - Thursday</span>
                    <span className="font-medium">8:00 AM - 6:00 PM</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Friday</span>
                    <span className="font-medium">8:00 AM - 12:00 PM</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Saturday</span>
                    <span className="text-red-600">Closed</span>
                  </div>
                  <hr className="my-3" />
                  <div className="text-green-600 font-medium">
                    WhatsApp: Available 24/7 for urgent orders
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Service Areas */}
            <Card>
              <CardContent className="p-6">
                <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <MapPin className="w-5 h-5" />
                  Service Areas
                </h3>
                <div className="space-y-3 text-sm">
                  <div>
                    <p className="font-medium text-blue-600">Northern Algeria</p>
                    <p className="text-gray-600">Algiers, Oran, Constantine, Annaba</p>
                    <p className="text-xs text-blue-600">24-48h delivery</p>
                  </div>
                  <div>
                    <p className="font-medium text-green-600">Highlands & Interior</p>
                    <p className="text-gray-600">Batna, Sétif, M'Sila, Djelfa</p>
                    <p className="text-xs text-green-600">48h delivery</p>
                  </div>
                  <div>
                    <p className="font-medium text-purple-600">Southern Algeria</p>
                    <p className="text-gray-600">Ouargla, Ghardaïa, Tamanrasset</p>
                    <p className="text-xs text-purple-600">48h guaranteed</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="bg-gradient-to-br from-primary/10 to-accent/20">
              <CardContent className="p-6">
                <h3 className="text-xl font-bold mb-4">Quick Actions</h3>
                <div className="space-y-3">
                  <Button 
                    className="w-full gap-2" 
                    onClick={() => window.open('https://wa.me/213XXXXXXXXX?text=Hello! I need help with ordering dental supplies.', '_blank')}
                  >
                    <MessageCircle className="w-4 h-4" />
                    Chat on WhatsApp
                  </Button>
                  <Button variant="outline" className="w-full" onClick={() => window.location.href = 'tel:+213XXXXXXXXX'}>
                    <Phone className="w-4 h-4 mr-2" />
                    Call Now
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Contact;
