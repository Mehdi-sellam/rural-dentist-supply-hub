import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { MapPin, Phone, Mail, Clock, MessageCircle, Send } from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { toast } from 'sonner';

const Contact = () => {
  const { t } = useLanguage();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('Message envoyé avec succès !');
    setFormData({ name: '', email: '', subject: '', message: '' });
  };

  const handleWhatsAppSubmit = () => {
    const message = `Bonjour! 
    
Nom: ${formData.name}
Email: ${formData.email}
Sujet: ${formData.subject}

Message: ${formData.message}`;
    
    const url = `https://wa.me/213XXXXXXXXX?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  };

  const handleTelegramSubmit = () => {
    const message = `Bonjour! 
    
Nom: ${formData.name}
Email: ${formData.email}
Sujet: ${formData.subject}

Message: ${formData.message}`;
    
    const url = `https://t.me/+213XXXXXXXXX?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // Scroll to top when component mounts
  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4 heading-professional">
            {t('contact.title')}
          </h1>
          <p className="text-xl text-muted-foreground text-professional">
            Notre équipe est à votre disposition pour répondre à toutes vos questions
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <Card className="border-border">
            <CardHeader>
              <CardTitle className="heading-professional">Envoyez-nous un message</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="name">{t('contact.name')} *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleChange('name', e.target.value)}
                    required
                    className="border-border"
                  />
                </div>

                <div>
                  <Label htmlFor="email">{t('contact.email')} *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleChange('email', e.target.value)}
                    required
                    className="border-border"
                  />
                </div>

                <div>
                  <Label htmlFor="subject">Sujet *</Label>
                  <Input
                    id="subject"
                    value={formData.subject}
                    onChange={(e) => handleChange('subject', e.target.value)}
                    required
                    className="border-border"
                  />
                </div>

                <div>
                  <Label htmlFor="message">{t('contact.message')} *</Label>
                  <Textarea
                    id="message"
                    value={formData.message}
                    onChange={(e) => handleChange('message', e.target.value)}
                    required
                    rows={5}
                    className="border-border"
                  />
                </div>

                <div className="space-y-3">
                  <Button type="submit" className="w-full btn-professional">
                    {t('contact.send')}
                  </Button>
                  
                  <div className="flex gap-2">
                    <Button 
                      type="button"
                      variant="outline" 
                      className="flex-1 gap-2 border-border"
                      onClick={handleWhatsAppSubmit}
                    >
                      <MessageCircle className="w-4 h-4" />
                      {t('contact.sendWhatsApp')}
                    </Button>
                    <Button 
                      type="button"
                      variant="outline" 
                      className="flex-1 gap-2 border-border"
                      onClick={handleTelegramSubmit}
                    >
                      <Send className="w-4 h-4" />
                      {t('contact.sendTelegram')}
                    </Button>
                  </div>
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <div className="space-y-6">
            <Card className="border-border">
              <CardHeader>
                <CardTitle className="heading-professional">Informations de contact</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-primary" />
                  <div>
                    <p className="font-medium text-professional">Téléphone</p>
                    <p className="text-muted-foreground">+213 XXX XXX XXX</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-primary" />
                  <div>
                    <p className="font-medium text-professional">Email</p>
                    <p className="text-muted-foreground">contact@dentgo.dz</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <MapPin className="w-5 h-5 text-primary" />
                  <div>
                    <p className="font-medium text-professional">Adresse</p>
                    <p className="text-muted-foreground">Alger, Algérie</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Clock className="w-5 h-5 text-primary" />
                  <div>
                    <p className="font-medium text-professional">Horaires</p>
                    <p className="text-muted-foreground">Dimanche - Jeudi: 8h00 - 17h00</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-border">
              <CardHeader>
                <CardTitle className="heading-professional">Contact direct</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-muted-foreground text-professional mb-4">
                  Pour une réponse rapide, contactez-nous directement :
                </p>
                <Button 
                  variant="outline" 
                  className="w-full gap-2 border-border"
                  onClick={() => window.open('https://wa.me/213XXXXXXXXX?text=Bonjour! J\'aimerais obtenir des informations sur vos produits dentaires.', '_blank')}
                >
                  <MessageCircle className="w-4 h-4 text-green-600" />
                  Contacter via WhatsApp
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full gap-2 border-border"
                  onClick={() => window.open('https://t.me/+213XXXXXXXXX?text=Bonjour! J\'aimerais obtenir des informations sur vos produits dentaires.', '_blank')}
                >
                  <Send className="w-4 h-4 text-blue-600" />
                  Contacter via Telegram
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-primary/5 border-primary/20">
              <CardContent className="p-6">
                <h3 className="font-bold text-lg mb-3 heading-professional text-primary">
                  Zones de livraison
                </h3>
                <div className="space-y-2 text-sm text-professional">
                  <p>🚚 <strong>Alger:</strong> Livraison chaque Lundi</p>
                  <p>🚚 <strong>Blida:</strong> Livraison chaque Mardi</p>
                  <p>🚚 <strong>Tipaza:</strong> Livraison chaque Mercredi</p>
                  <p>🚚 <strong>Boumerdès:</strong> Livraison chaque Jeudi</p>
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
