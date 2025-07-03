
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Loader2, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

const WILAYAS = ['Alger', 'Blida', 'Tipaza', 'Boumerdès'];

const Auth = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [signupForm, setSignupForm] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    full_name: '',
    dental_office_name: '',
    phone: '',
    wilaya: '',
    address: ''
  });

  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

  const getErrorMessage = (error: any) => {
    if (!error) return null;
    
    switch (error.message) {
      case 'Invalid login credentials':
        return 'Email ou mot de passe incorrect. Vérifiez vos identifiants.';
      case 'Email not confirmed':
        return 'Email non confirmé. Vérifiez votre boîte mail ou contactez l\'administrateur.';
      case 'User already registered':
        return 'Un compte avec cet email existe déjà. Essayez de vous connecter.';
      case 'Signup not allowed for this instance':
        return 'L\'inscription n\'est pas autorisée. Contactez l\'administrateur.';
      default:
        return error.message || 'Une erreur est survenue. Veuillez réessayer.';
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setAuthError(null);

    try {
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email: loginForm.email,
        password: loginForm.password,
      });

      if (error) {
        console.error('Login error:', error);
        const errorMsg = getErrorMessage(error);
        setAuthError(errorMsg);
        toast.error(errorMsg);
        return;
      }

      if (data.user) {
        toast.success('Connexion réussie');
        navigate('/');
      }
    } catch (error: any) {
      console.error('Login exception:', error);
      const errorMsg = 'Erreur de connexion. Vérifiez votre connexion internet.';
      setAuthError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    
    if (signupForm.password !== signupForm.confirmPassword) {
      const errorMsg = 'Les mots de passe ne correspondent pas';
      setAuthError(errorMsg);
      toast.error(errorMsg);
      return;
    }

    if (signupForm.password.length < 6) {
      const errorMsg = 'Le mot de passe doit contenir au moins 6 caractères';
      setAuthError(errorMsg);
      toast.error(errorMsg);
      return;
    }

    setIsLoading(true);

    try {
      
      const { data, error } = await supabase.auth.signUp({
        email: signupForm.email,
        password: signupForm.password,
        options: {
          emailRedirectTo: `${window.location.origin}/`,
          data: {
            full_name: signupForm.full_name,
            dental_office_name: signupForm.dental_office_name,
            phone: signupForm.phone,
            wilaya: signupForm.wilaya,
            address: signupForm.address
          }
        }
      });

      if (error) {
        console.error('Signup error:', error);
        const errorMsg = getErrorMessage(error);
        setAuthError(errorMsg);
        toast.error(errorMsg);
        return;
      }

      if (data.user) {
        
        // Special handling for admin account
        if (signupForm.email === 'admin@dentgo.dz') {
          try {
            const { error: adminError } = await supabase.rpc('ensure_admin_profile', {
              admin_user_id: data.user.id,
              admin_email: signupForm.email
            });
            
            if (adminError) {
              console.error('Error setting admin privileges:', adminError);
            } else {
              console.log('Admin privileges set successfully');
            }
          } catch (adminErr) {
            console.error('Exception setting admin privileges:', adminErr);
          }
        }

        if (data.user.email_confirmed_at) {
          toast.success('Compte créé avec succès! Vous êtes maintenant connecté.');
          navigate('/');
        } else {
          toast.success('Compte créé avec succès! Vérifiez votre email pour confirmer votre compte.');
        }
      }
    } catch (error: any) {
      console.error('Signup exception:', error);
      const errorMsg = 'Erreur lors de la création du compte. Vérifiez votre connexion internet.';
      setAuthError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLoginChange = (field: string, value: string) => {
    setLoginForm(prev => ({ ...prev, [field]: value }));
    if (authError) setAuthError(null);
  };

  const handleSignupChange = (field: string, value: string) => {
    setSignupForm(prev => ({ ...prev, [field]: value }));
    if (authError) setAuthError(null);
  };

  return (
    <div className="min-h-screen dental-gradient flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <Card className="shadow-2xl">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold">DentGo</CardTitle>
            <p className="text-muted-foreground">Votre partenaire dentaire de confiance</p>
          </CardHeader>
          <CardContent>
            {authError && (
              <Alert className="mb-4 border-red-200 bg-red-50">
                <AlertCircle className="h-4 w-4 text-red-600" />
                <AlertDescription className="text-red-800">
                  {authError}
                </AlertDescription>
              </Alert>
            )}
            
            <Tabs defaultValue="login" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="login">Connexion</TabsTrigger>
                <TabsTrigger value="signup">Inscription</TabsTrigger>
              </TabsList>
              
              <TabsContent value="login">
                <form onSubmit={handleLogin} className="space-y-4">
                  <div>
                    <Label htmlFor="login-email">Email</Label>
                    <Input
                      id="login-email"
                      type="email"
                      value={loginForm.email}
                      onChange={(e) => handleLoginChange('email', e.target.value)}
                      required
                      disabled={isLoading}
                    />
                  </div>
                  <div>
                    <Label htmlFor="login-password">Mot de passe</Label>
                    <Input
                      id="login-password"
                      type="password"
                      value={loginForm.password}
                      onChange={(e) => handleLoginChange('password', e.target.value)}
                      required
                      disabled={isLoading}
                    />
                  </div>
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Se connecter
                  </Button>
                </form>
                
                <div className="mt-4 p-3 bg-blue-50 rounded-md text-sm">
                  <p className="font-medium text-blue-900 mb-1">Compte administrateur:</p>
                  <p className="text-blue-800">Email: admin@dentgo.dz</p>
                  <p className="text-blue-800">Mot de passe: admin123</p>
                  <p className="text-xs text-blue-600 mt-1">
                    Si ce compte n'existe pas, créez-le via l'inscription avec ces identifiants.
                  </p>
                </div>
              </TabsContent>
              
              <TabsContent value="signup">
                <form onSubmit={handleSignup} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="signup-name">Nom complet *</Label>
                      <Input
                        id="signup-name"
                        value={signupForm.full_name}
                        onChange={(e) => handleSignupChange('full_name', e.target.value)}
                        required
                        disabled={isLoading}
                      />
                    </div>
                    <div>
                      <Label htmlFor="signup-office">Cabinet dentaire *</Label>
                      <Input
                        id="signup-office"
                        value={signupForm.dental_office_name}
                        onChange={(e) => handleSignupChange('dental_office_name', e.target.value)}
                        required
                        disabled={isLoading}
                      />
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="signup-email">Email *</Label>
                    <Input
                      id="signup-email"
                      type="email"
                      value={signupForm.email}
                      onChange={(e) => handleSignupChange('email', e.target.value)}
                      required
                      disabled={isLoading}
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="signup-password">Mot de passe *</Label>
                      <Input
                        id="signup-password"
                        type="password"
                        value={signupForm.password}
                        onChange={(e) => handleSignupChange('password', e.target.value)}
                        required
                        disabled={isLoading}
                        minLength={6}
                      />
                    </div>
                    <div>
                      <Label htmlFor="signup-confirm">Confirmer *</Label>
                      <Input
                        id="signup-confirm"
                        type="password"
                        value={signupForm.confirmPassword}
                        onChange={(e) => handleSignupChange('confirmPassword', e.target.value)}
                        required
                        disabled={isLoading}
                        minLength={6}
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="signup-phone">Téléphone *</Label>
                      <Input
                        id="signup-phone"
                        type="tel"
                        value={signupForm.phone}
                        onChange={(e) => handleSignupChange('phone', e.target.value)}
                        required
                        disabled={isLoading}
                      />
                    </div>
                    <div>
                      <Label htmlFor="signup-wilaya">Wilaya *</Label>
                      <Select 
                        value={signupForm.wilaya} 
                        onValueChange={(value) => handleSignupChange('wilaya', value)}
                        disabled={isLoading}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Choisir" />
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
                  </div>
                  
                  <div>
                    <Label htmlFor="signup-address">Adresse de livraison *</Label>
                    <Input
                      id="signup-address"
                      value={signupForm.address}
                      onChange={(e) => handleSignupChange('address', e.target.value)}
                      required
                      disabled={isLoading}
                    />
                  </div>
                  
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Créer mon compte
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Auth;
