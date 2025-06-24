import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, Session } from '@supabase/supabase-js';

// Try to import supabase client, but don't crash if it fails
let supabase: any = null;

interface Profile {
  id: string;
  full_name: string;
  dental_office_name: string;
  phone: string;
  email: string;
  wilaya: string;
  address: string;
  is_admin: boolean;
}

interface AuthContextType {
  user: User | null;
  session: Session | null;
  profile: Profile | null;
  loading: boolean;
  isAuthenticated: boolean;
  signOut: () => Promise<void>;
  login: (email: string, password: string) => Promise<{ error: any }>;
  register: (email: string, password: string, userData: any) => Promise<{ error: any }>;
  logout: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  console.log('AuthProvider: Initializing...');
  
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  console.log('AuthProvider: State initialized');

  // Initialize Supabase client
  useEffect(() => {
    const initSupabase = async () => {
      try {
        const { supabase: supabaseClient } = await import('@/integrations/supabase/client');
        supabase = supabaseClient;
        console.log('Supabase client loaded successfully');
      } catch (error) {
        console.error('Failed to load Supabase client:', error);
        // Create a mock supabase client for development
        supabase = {
          auth: {
            onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
            getSession: () => Promise.resolve({ data: { session: null } }),
            signOut: () => Promise.resolve({ error: null }),
            signInWithPassword: () => Promise.resolve({ error: null }),
            signUp: () => Promise.resolve({ error: null })
          },
          from: () => ({
            select: () => ({ eq: () => ({ single: () => Promise.resolve({ data: null, error: null }) }) })
          })
        };
      }
    };
    
    initSupabase();
  }, []);

  const fetchProfile = async (userId: string) => {
    try {
      console.log('Fetching profile for user:', userId);
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Error fetching profile:', error);
        return;
      }

      console.log('Profile fetched successfully:', data);
      setProfile(data);
    } catch (error) {
      console.error('Exception fetching profile:', error);
    }
  };

  const refreshProfile = async () => {
    if (user) {
      await fetchProfile(user.id);
    }
  };

  useEffect(() => {
    console.log('AuthProvider: Setting up auth state listener');
    
    if (!supabase) {
      console.log('Supabase not ready yet, skipping auth setup');
      setLoading(false);
      return;
    }
    
    try {
      // Set up auth state listener
      const { data: { subscription } } = supabase.auth.onAuthStateChange(
        async (event, session) => {
          console.log('Auth state changed:', event, session?.user?.email);
          setSession(session);
          setUser(session?.user ?? null);
          
          if (session?.user) {
            // Defer profile fetching to avoid blocking auth state updates
            setTimeout(() => {
              fetchProfile(session.user.id);
            }, 0);
          } else {
            setProfile(null);
          }
          
          setLoading(false);
        }
      );

      // Get initial session
      supabase.auth.getSession().then(({ data: { session } }) => {
        console.log('Initial session check:', session?.user?.email);
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          fetchProfile(session.user.id);
        }
        
        setLoading(false);
      });

      return () => {
        console.log('Cleaning up auth subscription');
        subscription.unsubscribe();
      };
    } catch (error) {
      console.error('AuthProvider: Error in useEffect:', error);
      setLoading(false);
    }
  }, [supabase]);

  const login = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      return { error };
    } catch (error) {
      console.error('Login exception:', error);
      return { error };
    }
  };

  const register = async (email: string, password: string, userData: any) => {
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/`,
          data: userData
        }
      });
      return { error };
    } catch (error) {
      console.error('Register exception:', error);
      return { error };
    }
  };

  const signOut = async () => {
    try {
      console.log('Signing out user');
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('Error signing out:', error);
      } else {
        console.log('User signed out successfully');
        // Clear local state
        setUser(null);
        setSession(null);
        setProfile(null);
      }
    } catch (error) {
      console.error('Exception signing out:', error);
    }
  };

  const logout = signOut; // Alias for consistency

  const value = {
    user,
    session,
    profile,
    loading,
    isAuthenticated: !!user,
    signOut,
    login,
    register,
    logout,
    refreshProfile
  };

  console.log('AuthProvider: Rendering with value:', { user: !!user, loading, isAuthenticated: !!user });

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
