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
  const [form, setForm] = useState({ nom: '', email: '', sujet: '', message: '', phone: '' });
  const [sending, setSending] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const { user, profile } = useAuth();
  const [conversation, setConversation] = useState<any[]>([]);
  const [reply, setReply] = useState<{ [key: string]: string }>({});
  const [activeTab, setActiveTab] = useState<'open' | 'closed'>('open');

  const sb: any = supabase;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const fetchConversation = async () => {
    if (!user) return;
    // Fetch messages for this user, including responses
    const { data: messages, error } = await sb.from('messages')
      .select('*, message_responses(*)')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });
    if (error) {
      console.error('Fetch error:', error);
      setConversation([]);
      return;
    }
    // Gather all unique responder_ids from all responses
    const allResponses = (messages || []).flatMap((msg: any) => msg.message_responses || []);
    const responderIds = Array.from(new Set(allResponses.map((r: any) => r.responder_id)));
    // Fetch all responder profiles in one query
    let profilesById: Record<string, any> = {};
    if (responderIds.length > 0) {
      const { data: profiles, error: profileError } = await sb.from('profiles')
        .select('id, full_name, is_admin')
        .in('id', responderIds);
      if (!profileError && profiles) {
        profilesById = Object.fromEntries(profiles.map((p: any) => [p.id, p]));
      }
    }
    // Attach profile to each response
    const messagesWithProfiles = (messages || []).map((msg: any) => ({
      ...msg,
      message_responses: (msg.message_responses || []).map((resp: any) => ({
        ...resp,
        responder_profile: profilesById[resp.responder_id] || null,
      })),
    }));
    setConversation(messagesWithProfiles);
  };

  useEffect(() => {
    if (user && profile) {
      setForm(form => ({
        ...form,
        nom: profile.full_name || '',
        email: profile.email || '',
        phone: profile.phone || '',
      }));
    }
  }, [user, profile]);

  useEffect(() => { fetchConversation(); }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    setError('');
    setSuccess(false);
    try {
      if (!user) throw new Error('Vous devez être connecté.');
      const insertData = { ...form, user_id: user.id, cabinet_name: profile?.dental_office_name || '' };
      const { error } = await sb.from('messages').insert([insertData]);
      if (error) {
        console.error('Insert error:', error);
        throw error;
      }
      setSuccess(true);
      setForm({ nom: '', email: '', sujet: '', message: '', phone: '' });
      fetchConversation();
    } catch (err) {
      console.error('Submit error:', err);
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

  const handleClientReply = async (messageId: string) => {
    if (!user) return;
    const content = reply[messageId]?.trim();
    if (!content) return;
    const { error } = await sb.from('message_responses').insert([
      { message_id: messageId, responder_id: user.id, response: content }
    ]);
    if (!error) {
      setReply(r => ({ ...r, [messageId]: '' }));
      fetchConversation();
    }
  };

  const handleCloseTicket = async (messageId: string) => {
    await sb.from('messages').update({ status: 'closed' }).eq('id', messageId);
    fetchConversation();
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
                {user && profile && (
                  <>
                    <div>
                      <Label>Nom du cabinet</Label>
                      <Input value={profile.dental_office_name || ''} disabled className="border-border" />
                    </div>
                    <div>
                      <Label htmlFor="phone">Numéro de téléphone</Label>
                      <Input
                        id="phone"
                        name="phone"
                        value={form.phone}
                        onChange={handleChange}
                        required
                        className="border-border"
                      />
                    </div>
                  </>
                )}
                <div>
                  <Label htmlFor="nom">Nom *</Label>
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
                  <Label htmlFor="email">Email *</Label>
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
          <h2 className="text-xl font-bold mb-2">Vos tickets de support</h2>
          <div className="flex gap-4 mb-4">
            <Button variant={activeTab === 'open' ? 'default' : 'outline'} onClick={() => setActiveTab('open')}>Tickets ouverts</Button>
            <Button variant={activeTab === 'closed' ? 'default' : 'outline'} onClick={() => setActiveTab('closed')}>Tickets fermés</Button>
          </div>
          {conversation.filter(msg => (activeTab === 'open' ? msg.status !== 'closed' : msg.status === 'closed')).length === 0 && (
            <p>Aucun ticket {activeTab === 'open' ? 'ouvert' : 'fermé'}.</p>
          )}
          {conversation.filter(msg => (activeTab === 'open' ? msg.status !== 'closed' : msg.status === 'closed')).map(msg => (
            <div key={msg.id} className="mb-8 p-4 border rounded bg-gray-50">
              <div className="flex justify-between items-center mb-2">
                <div className="font-bold">Sujet: {msg.sujet}</div>
                {activeTab === 'open' && (
                  <Button size="sm" variant="destructive" onClick={async () => { await handleCloseTicket(msg.id); }} disabled={msg.status === 'closed'}>
                    Fermer le ticket
                  </Button>
                )}
              </div>
              <div className="text-xs text-gray-500 mb-4">Créé le {new Date(msg.created_at).toLocaleString()}</div>
              <div className="space-y-2">
                {/* Initial client message */}
                <div className="flex gap-2 items-end">
                  <div className="bg-blue-100 text-blue-900 rounded-lg px-4 py-2 max-w-[70%] self-start">
                    <div className="font-semibold">Vous</div>
                    <div>{msg.message}</div>
                    <div className="text-xs text-gray-500 mt-1">{new Date(msg.created_at).toLocaleString()}</div>
                  </div>
                </div>
                {/* All responses (admin and client) */}
                {msg.message_responses && msg.message_responses.map((resp: any) => (
                  <div key={resp.id} className={`flex gap-2 items-end ${resp.responder_id === user?.id ? 'justify-end' : 'justify-start'}`}>
                    <div className={`${resp.responder_id === user?.id ? 'bg-green-100 text-green-900 self-end' : 'bg-gray-200 text-gray-900 self-start'} rounded-lg px-4 py-2 max-w-[70%]`}>
                      <div className="font-semibold">
                        {resp.responder_id === user?.id
                          ? 'Vous'
                          : resp.responder_profile?.is_admin
                            ? `Admin: ${resp.responder_profile?.full_name || 'Admin'}`
                            : resp.responder_profile?.full_name || 'Utilisateur'}
                      </div>
                      <div>{resp.response}</div>
                      <div className="text-xs text-gray-500 mt-1">{new Date(resp.created_at).toLocaleString()}</div>
                    </div>
                  </div>
                ))}
              </div>
              {user && activeTab === 'open' && msg.status !== 'closed' && (
                <div className="mt-4 flex gap-2 items-end">
                  <Textarea
                    value={reply[msg.id] || ''}
                    onChange={e => setReply(r => ({ ...r, [msg.id]: e.target.value }))}
                    placeholder="Votre réponse..."
                    className="mb-2 flex-1"
                  />
                  <Button size="sm" onClick={async () => { await handleClientReply(msg.id); }} disabled={!reply[msg.id]?.trim()}>
                    Envoyer
                  </Button>
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
