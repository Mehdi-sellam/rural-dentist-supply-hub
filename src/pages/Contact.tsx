import React, { useState, useEffect } from 'react';
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
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';

const Contact = () => {
  const { t } = useLanguage();
  const [form, setForm] = useState({ nom: '', email: '', sujet: '', message: '' });
  const [sending, setSending] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const { user } = useAuth();
  const [conversation, setConversation] = useState<any[]>([]);

  const sb: any = supabase;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const fetchConversation = async () => {
    if (!user) return;
    // Fetch messages for this user
    const { data: messages, error } = await sb.from('messages')
      .select('*, message_responses(*)')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });
    if (!error) setConversation(messages || []);
  };

  useEffect(() => { fetchConversation(); }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    setError('');
    setSuccess(false);
    try {
      if (!user) throw new Error('Vous devez être connecté.');
      const { error } = await sb.from('messages').insert([
        { ...form, user_id: user.id }
      ]);
      if (error) throw error;
      setSuccess(true);
      setForm({ nom: '', email: '', sujet: '', message: '' });
      fetchConversation();
    } catch (err) {
      setError('Erreur lors de l\'envoi du message.');
    } finally {
      setSending(false);
    }
  };

  const handleWhatsAppSubmit = () => {
    const message = `Bonjour! 
    
Nom: ${form.nom}
Email: ${form.email}
Sujet: ${form.sujet}

Message: ${form.message}`;
    
    const url = `https://wa.me/213XXXXXXXXX?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  };

  const handleTelegramSubmit = () => {
    const message = `Bonjour! 
    
Nom: ${form.nom}
Email: ${form.email}
Sujet: ${form.sujet}

Message: ${form.message}`;
    
    const url = `https://t.me/+213XXXXXXXXX?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
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
                  <Label htmlFor="nom">{t('contact.name')} *</Label>
                  <Input
                    id="nom"
                    name="nom"
                    value={form.nom}
                    onChange={handleChange}
                    required
                    className="border-border"
                  />
                </div>

                <div>
                  <Label htmlFor="email">{t('contact.email')} *</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={handleChange}
                    required
                    className="border-border"
                  />
                </div>

                <div>
                  <Label htmlFor="sujet">Sujet *</Label>
                  <Input
                    id="sujet"
                    name="sujet"
                    value={form.sujet}
                    onChange={handleChange}
                    required
                    className="border-border"
                  />
                </div>

                <div>
                  <Label htmlFor="message">{t('contact.message')} *</Label>
                  <Textarea
                    id="message"
                    name="message"
                    value={form.message}
                    onChange={handleChange}
                    required
                    rows={5}
                    className="border-border"
                  />
                </div>

                <div className="space-y-3">
                  <Button type="submit" className="w-full btn-professional" disabled={sending}>
                    {sending ? 'Envoi...' : t('contact.send')}
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

                {success && <p className="text-green-600">Message envoyé avec succès !</p>}
                {error && <p className="text-red-600">{error}</p>}
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

        {/* Below the form, add a section for conversation history */}
        <div className="mt-8">
          <h2 className="text-xl font-bold mb-2">Vos messages et réponses de l'administration</h2>
          {conversation.length === 0 && <p>Aucun message envoyé.</p>}
          {conversation.map(msg => (
            <div key={msg.id} className="mb-4 p-4 border rounded">
              <div><b>Sujet:</b> {msg.sujet}</div>
              <div><b>Message:</b> {msg.message}</div>
              <div className="text-xs text-gray-500">Envoyé le {new Date(msg.created_at).toLocaleString()}</div>
              {msg.message_responses && msg.message_responses.length > 0 && (
                <div className="mt-2 pl-4 border-l">
                  {msg.message_responses.map((resp: any) => (
                    <div key={resp.id} className="mb-2">
                      <div><b>Réponse admin:</b> {resp.response}</div>
                      <div className="text-xs text-gray-500">Répondu le {new Date(resp.created_at).toLocaleString()}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Contact;
