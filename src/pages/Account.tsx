import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { toast } from 'sonner';

const WILAYAS = ['Alger', 'Blida', 'Tipaza', 'Boumerdès'];

const Account = () => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [profile, setProfile] = useState<any>(null);
  const [formData, setFormData] = useState({
    full_name: '',
    dental_office_name: '',
    phone: '',
    email: '',
    wilaya: '',
    address: ''
  });

  useEffect(() => {
    if (user) {
      fetchProfile();
    }
  }, [user]);

  const fetchProfile = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error) {
        console.error('Error fetching profile:', error);
        return;
      }

      if (data) {
        setProfile(data);
        setFormData({
          full_name: data.full_name || '',
          dental_office_name: data.dental_office_name || '',
          phone: data.phone || '',
          email: data.email || '',
          wilaya: data.wilaya || '',
          address: data.address || ''
        });
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen">
        <Header />
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold mb-4">Accès refusé</h1>
          <p>Vous devez être connecté pour accéder à cette page.</p>
        </div>
        <Footer />
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: formData.full_name,
          dental_office_name: formData.dental_office_name,
          phone: formData.phone,
          email: formData.email,
          wilaya: formData.wilaya,
          address: formData.address
        })
        .eq('id', user.id);

      if (error) {
        console.error('Error updating profile:', error);
        toast.error('Erreur lors de la mise à jour');
        return;
      }

      toast.success('Informations mises à jour avec succès');
      fetchProfile(); // Refresh profile data
    } catch (error) {
      console.error('Error:', error);
      toast.error('Erreur lors de la mise à jour');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Informations de compte</h1>

        <div className="max-w-2xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle>Modifier mes informations</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="full_name">Nom complet *</Label>
                    <Input
                      id="full_name"
                      value={formData.full_name}
                      onChange={(e) => handleChange('full_name', e.target.value)}
                      required
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="dental_office_name">Nom du cabinet dentaire *</Label>
                    <Input
                      id="dental_office_name"
                      value={formData.dental_office_name}
                      onChange={(e) => handleChange('dental_office_name', e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="phone">Numéro de téléphone *</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => handleChange('phone', e.target.value)}
                      required
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleChange('email', e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="wilaya">Wilaya *</Label>
                  <Select value={formData.wilaya} onValueChange={(value) => handleChange('wilaya', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionnez votre wilaya" />
                    </SelectTrigger>
                    <SelectContent>
                      {WILAYAS.map((wilaya) => (
                        <SelectItem key={wilaya} value={wilaya}>
                          {wilaya}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="address">Adresse de livraison *</Label>
                  <Input
                    id="address"
                    value={formData.address}
                    onChange={(e) => handleChange('address', e.target.value)}
                    placeholder="Adresse complète pour la livraison"
                    required
                  />
                </div>

                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? 'Mise à jour...' : 'Mettre à jour mes informations'}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Account;
