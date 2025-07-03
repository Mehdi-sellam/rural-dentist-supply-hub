import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { MessageCircle, X, Send, Minimize2 } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const SupportBubble = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [form, setForm] = useState({ nom: '', email: '', sujet: '', message: '', phone: '' });
  const [sending, setSending] = useState(false);
  const [conversation, setConversation] = useState<any[]>([]);
  const [reply, setReply] = useState<{ [key: string]: string }>({});
  const [activeTab, setActiveTab] = useState<'open' | 'closed'>('open');
  const [selectedConversation, setSelectedConversation] = useState<any>(null);
  const [showConversations, setShowConversations] = useState(false);
  const { user, profile } = useAuth();

  const sb: any = supabase;

  const fetchConversation = async () => {
    if (!user) return;
    const { data: messages, error } = await sb.from('messages')
      .select('*, message_responses(*)')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Fetch error:', error);
      setConversation([]);
      return;
    }
    
    const allResponses = (messages || []).flatMap((msg: any) => msg.message_responses || []);
    const responderIds = Array.from(new Set(allResponses.map((r: any) => r.responder_id)));
    
    let profilesById: Record<string, any> = {};
    if (responderIds.length > 0) {
      const { data: profiles, error: profileError } = await sb.from('profiles')
        .select('id, full_name, is_admin')
        .in('id', responderIds);
      if (!profileError && profiles) {
        profilesById = Object.fromEntries(profiles.map((p: any) => [p.id, p]));
      }
    }
    
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

  useEffect(() => { 
    if (user) fetchConversation(); 
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    
    try {
      if (!user) throw new Error('Vous devez être connecté.');
      const insertData = { ...form, user_id: user.id, cabinet_name: profile?.dental_office_name || '' };
      const { error } = await sb.from('messages').insert([insertData]);
      if (error) throw error;
      
      toast.success('Message envoyé avec succès !');
      setForm({ nom: '', email: '', sujet: '', message: '', phone: '' });
      fetchConversation();
      setShowConversations(true);
    } catch (err) {
      console.error('Submit error:', err);
      toast.error('Erreur lors de l\'envoi du message.');
    } finally {
      setSending(false);
    }
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

  if (!user) return null;

  return (
    <div className="fixed bottom-20 right-4 z-50">
      {!isOpen ? (
        <Button
          onClick={() => setIsOpen(true)}
          className="rounded-full w-14 h-14 shadow-lg bg-primary hover:bg-primary/90"
        >
          <MessageCircle className="w-6 h-6" />
        </Button>
      ) : (
        <Card className={`w-96 ${isMinimized ? 'h-12' : 'h-[500px]'} border-border shadow-xl transition-all duration-300`}>
          <CardHeader className="flex flex-row items-center justify-between p-3 bg-primary text-white rounded-t-lg">
            <CardTitle className="text-sm">Support Client</CardTitle>
            <div className="flex gap-2">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setIsMinimized(!isMinimized)}
                className="text-white hover:bg-white/20 p-1 h-6 w-6"
              >
                <Minimize2 className="w-4 h-4" />
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setIsOpen(false)}
                className="text-white hover:bg-white/20 p-1 h-6 w-6"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </CardHeader>
          
          {!isMinimized && (
            <CardContent className="p-3 h-[440px] overflow-y-auto">
              {!showConversations ? (
                <div className="space-y-4">
                  <div className="flex gap-2 mb-4">
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => setShowConversations(true)}
                      className="flex-1"
                    >
                      Mes tickets
                    </Button>
                  </div>
                  
                  <form onSubmit={handleSubmit} className="space-y-3">
                    <div>
                      <Label htmlFor="sujet" className="text-xs">Sujet *</Label>
                      <Input
                        id="sujet"
                        name="sujet"
                        value={form.sujet}
                        onChange={handleChange}
                        required
                        className="text-xs"
                        placeholder="Objet de votre demande"
                      />
                    </div>

                    <div>
                      <Label htmlFor="message" className="text-xs">Message *</Label>
                      <Textarea
                        id="message"
                        name="message"
                        value={form.message}
                        onChange={handleChange}
                        required
                        rows={3}
                        className="text-xs"
                        placeholder="Décrivez votre demande..."
                      />
                    </div>

                    <Button type="submit" className="w-full text-xs" disabled={sending}>
                      {sending ? 'Envoi...' : 'Envoyer'}
                    </Button>
                  </form>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => setShowConversations(false)}
                      className="text-xs"
                    >
                      ← Nouveau ticket
                    </Button>
                    <div className="flex gap-1">
                      <Button 
                        size="sm" 
                        variant={activeTab === 'open' ? 'default' : 'outline'} 
                        onClick={() => setActiveTab('open')}
                        className="text-xs px-2"
                      >
                        Ouverts
                      </Button>
                      <Button 
                        size="sm" 
                        variant={activeTab === 'closed' ? 'default' : 'outline'} 
                        onClick={() => setActiveTab('closed')}
                        className="text-xs px-2"
                      >
                        Fermés
                      </Button>
                    </div>
                  </div>

                  {selectedConversation ? (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between pb-2 border-b">
                        <Button 
                          size="sm" 
                          variant="ghost"
                          onClick={() => setSelectedConversation(null)}
                          className="text-xs p-1"
                        >
                          ← Retour
                        </Button>
                        <div className="text-xs font-semibold">{selectedConversation.sujet}</div>
                      </div>
                      
                      <div className="space-y-2 max-h-72 overflow-y-auto">
                        <div className="bg-blue-50 p-2 rounded text-xs">
                          <div className="font-semibold">Vous</div>
                          <div>{selectedConversation.message}</div>
                          <div className="text-gray-500 text-xs mt-1">
                            {new Date(selectedConversation.created_at).toLocaleString()}
                          </div>
                        </div>
                        
                        {selectedConversation.message_responses?.map((resp: any) => (
                          <div key={resp.id} className={`p-2 rounded text-xs ${
                            resp.responder_id === user?.id 
                              ? 'bg-green-50 ml-4' 
                              : 'bg-gray-100 mr-4'
                          }`}>
                            <div className="font-semibold">
                              {resp.responder_id === user?.id
                                ? 'Vous'
                                : resp.responder_profile?.is_admin
                                  ? `Support: ${resp.responder_profile?.full_name || 'Admin'}`
                                  : resp.responder_profile?.full_name || 'Utilisateur'}
                            </div>
                            <div>{resp.response}</div>
                            <div className="text-gray-500 text-xs mt-1">
                              {new Date(resp.created_at).toLocaleString()}
                            </div>
                          </div>
                        ))}
                      </div>
                      
                      {selectedConversation.status !== 'closed' && (
                        <div className="flex gap-2 pt-2 border-t">
                          <Textarea
                            value={reply[selectedConversation.id] || ''}
                            onChange={e => setReply(r => ({ ...r, [selectedConversation.id]: e.target.value }))}
                            placeholder="Votre réponse..."
                            className="flex-1 text-xs"
                            rows={2}
                          />
                          <Button 
                            size="sm" 
                            onClick={() => handleClientReply(selectedConversation.id)} 
                            disabled={!reply[selectedConversation.id]?.trim()}
                            className="self-end"
                          >
                            <Send className="w-3 h-3" />
                          </Button>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {conversation.filter(msg => (activeTab === 'open' ? msg.status !== 'closed' : msg.status === 'closed')).length === 0 && (
                        <p className="text-xs text-gray-500 text-center py-4">
                          Aucun ticket {activeTab === 'open' ? 'ouvert' : 'fermé'}.
                        </p>
                      )}
                      
                      {conversation.filter(msg => (activeTab === 'open' ? msg.status !== 'closed' : msg.status === 'closed')).map(msg => (
                        <div 
                          key={msg.id} 
                          className="p-2 border rounded cursor-pointer hover:bg-gray-50 transition-colors"
                          onClick={() => setSelectedConversation(msg)}
                        >
                          <div className="font-semibold text-xs">{msg.sujet}</div>
                          <div className="text-xs text-gray-600 truncate">{msg.message}</div>
                          <div className="text-xs text-gray-400 mt-1">
                            {new Date(msg.created_at).toLocaleDateString()}
                          </div>
                          {activeTab === 'open' && (
                            <Button 
                              size="sm" 
                              variant="destructive" 
                              onClick={(e) => {
                                e.stopPropagation();
                                handleCloseTicket(msg.id);
                              }}
                              className="mt-1 text-xs h-6"
                            >
                              Fermer
                            </Button>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          )}
        </Card>
      )}
    </div>
  );
};

export default SupportBubble;