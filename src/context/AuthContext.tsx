import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import type { Profile } from '../types/database';

interface AuthUser {
  id: string;
  email: string;
}

interface AuthContextType {
  user: AuthUser | null;
  profile: Profile | null;
  loading: boolean;
  isConfigured: boolean;
  signUp: (email: string, password: string, fullName: string) => Promise<{ error?: string }>;
  signIn: (email: string, password: string) => Promise<{ error?: string }>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ error?: string; success?: boolean }>;
  updateProfile: (updates: Partial<Profile>) => Promise<{ error?: string; profile?: Profile }>;
  completeOnboarding: (data: {
    fullName: string;
    phone?: string;
    city?: string;
    bio?: string;
    subjects?: string[];
  }) => Promise<{ error?: string }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const LOCAL_STORAGE_USER_KEY = 'tutorflow_local_user';
const LOCAL_STORAGE_PROFILE_KEY = 'tutorflow_local_profile';
const LOCAL_STORAGE_USERS_DB = 'tutorflow_local_users_db';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Initial session loader
  useEffect(() => {
    let isMounted = true;

    async function initializeAuth() {
      try {
        if (isSupabaseConfigured) {
          const { data: { session } } = await supabase.auth.getSession();
          if (session?.user && isMounted) {
            setUser({ id: session.user.id, email: session.user.email || '' });
            await fetchProfile(session.user.id);
          }
        } else {
          // Local fallback mode when Supabase credentials aren't supplied in .env
          const localUserStr = localStorage.getItem(LOCAL_STORAGE_USER_KEY);
          const localProfileStr = localStorage.getItem(LOCAL_STORAGE_PROFILE_KEY);
          if (localUserStr && isMounted) {
            setUser(JSON.parse(localUserStr));
          }
          if (localProfileStr && isMounted) {
            setProfile(JSON.parse(localProfileStr));
          }
        }
      } catch (err) {
        console.error('Auth initialization error:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    initializeAuth();

    // Listen to Supabase auth state changes if configured
    if (isSupabaseConfigured) {
      const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
        if (!isMounted) return;
        if (session?.user) {
          setUser({ id: session.user.id, email: session.user.email || '' });
          await fetchProfile(session.user.id);
        } else {
          setUser(null);
          setProfile(null);
        }
        setLoading(false);
      });

      return () => {
        isMounted = false;
        subscription.unsubscribe();
      };
    }

    return () => {
      isMounted = false;
    };
  }, []);

  async function fetchProfile(userId: string) {
    if (!isSupabaseConfigured) return;
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching profile:', error);
      } else if (data) {
        setProfile(data as Profile);
      }
    } catch (e) {
      console.error('Fetch profile exception:', e);
    }
  }

  const signUp = async (email: string, password: string, fullName: string): Promise<{ error?: string }> => {
    setLoading(true);
    try {
      if (isSupabaseConfigured) {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { full_name: fullName }
          }
        });

        if (error) return { error: error.message };

        if (data.user) {
          const authUser: AuthUser = { id: data.user.id, email: data.user.email || email };
          setUser(authUser);
          
          // Wait for trigger or explicitly upsert profile
          const initialProfile: Profile = {
            id: data.user.id,
            full_name: fullName,
            email,
            onboarding_completed: false,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          };

          await supabase.from('profiles').upsert(initialProfile);
          setProfile(initialProfile);
        }
        return {};
      } else {
        // Fallback simulated persistence in browser
        const existingUsers = JSON.parse(localStorage.getItem(LOCAL_STORAGE_USERS_DB) || '[]');
        if (existingUsers.some((u: { email: string }) => u.email.toLowerCase() === email.toLowerCase())) {
          return { error: 'An account with this email already exists.' };
        }

        const newId = 'tutor_' + Math.random().toString(36).substring(2, 11);
        const newUser: AuthUser = { id: newId, email };
        const newProfile: Profile = {
          id: newId,
          full_name: fullName,
          email,
          onboarding_completed: false,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };

        existingUsers.push({ email, password, user: newUser, profile: newProfile });
        localStorage.setItem(LOCAL_STORAGE_USERS_DB, JSON.stringify(existingUsers));
        localStorage.setItem(LOCAL_STORAGE_USER_KEY, JSON.stringify(newUser));
        localStorage.setItem(LOCAL_STORAGE_PROFILE_KEY, JSON.stringify(newProfile));

        setUser(newUser);
        setProfile(newProfile);
        return {};
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'An unexpected error occurred during signup';
      return { error: message };
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (email: string, password: string): Promise<{ error?: string }> => {
    setLoading(true);
    try {
      if (isSupabaseConfigured) {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) return { error: error.message };

        if (data.user) {
          setUser({ id: data.user.id, email: data.user.email || email });
          await fetchProfile(data.user.id);
        }
        return {};
      } else {
        // Fallback local authentication
        const existingUsers = JSON.parse(localStorage.getItem(LOCAL_STORAGE_USERS_DB) || '[]');
        const found = existingUsers.find(
          (u: { email: string; password: string }) => 
            u.email.toLowerCase() === email.toLowerCase() && u.password === password
        );

        if (!found) {
          return { error: 'Invalid email or password.' };
        }

        localStorage.setItem(LOCAL_STORAGE_USER_KEY, JSON.stringify(found.user));
        localStorage.setItem(LOCAL_STORAGE_PROFILE_KEY, JSON.stringify(found.profile));
        setUser(found.user);
        setProfile(found.profile);
        return {};
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'An unexpected error occurred during sign in';
      return { error: message };
    } finally {
      setLoading(false);
    }
  };

  const signOut = async (): Promise<void> => {
    try {
      if (isSupabaseConfigured) {
        await supabase.auth.signOut();
      }
    } catch (err) {
      console.error('Sign out error:', err);
    } finally {
      localStorage.removeItem(LOCAL_STORAGE_USER_KEY);
      localStorage.removeItem(LOCAL_STORAGE_PROFILE_KEY);
      setUser(null);
      setProfile(null);
    }
  };

  const resetPassword = async (email: string): Promise<{ error?: string; success?: boolean }> => {
    try {
      if (isSupabaseConfigured) {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: `${window.location.origin}/reset-password`,
        });
        if (error) return { error: error.message };
        return { success: true };
      } else {
        // Fallback mode simulation
        return { success: true };
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to send password reset email';
      return { error: message };
    }
  };

  const updateProfile = async (updates: Partial<Profile>): Promise<{ error?: string; profile?: Profile }> => {
    if (!user) return { error: 'User not authenticated' };
    try {
      const updatedData: Profile = {
        ...(profile || {
          id: user.id,
          full_name: '',
          email: user.email,
          onboarding_completed: false,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        }),
        ...updates,
        updated_at: new Date().toISOString(),
      };

      if (isSupabaseConfigured) {
        const { error } = await supabase
          .from('profiles')
          .update(updatedData)
          .eq('id', user.id);

        if (error) return { error: error.message };
      } else {
        // Update local storage
        localStorage.setItem(LOCAL_STORAGE_PROFILE_KEY, JSON.stringify(updatedData));
        const users = JSON.parse(localStorage.getItem(LOCAL_STORAGE_USERS_DB) || '[]');
        const userIndex = users.findIndex((u: { user: AuthUser }) => u.user.id === user.id);
        if (userIndex !== -1) {
          users[userIndex].profile = updatedData;
          localStorage.setItem(LOCAL_STORAGE_USERS_DB, JSON.stringify(users));
        }
      }

      setProfile(updatedData);
      return { profile: updatedData };
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to update profile';
      return { error: message };
    }
  };

  const completeOnboarding = async (data: {
    fullName: string;
    phone?: string;
    city?: string;
    bio?: string;
    subjects?: string[];
  }): Promise<{ error?: string }> => {
    if (!user) return { error: 'User not authenticated' };
    
    // 1. Update profile with onboarding_completed = true
    const result = await updateProfile({
      full_name: data.fullName,
      phone: data.phone || null,
      city: data.city || null,
      bio: data.bio || null,
      onboarding_completed: true,
    });

    if (result.error) return { error: result.error };

    // 2. If subjects were selected, insert into subjects table
    if (data.subjects && data.subjects.length > 0) {
      if (isSupabaseConfigured) {
        const rows = data.subjects.map(sub => ({
          tutor_id: user.id,
          name: sub,
        }));
        await supabase.from('subjects').insert(rows);
      } else {
        const localSubjectsKey = `tutorflow_subjects_${user.id}`;
        const existing = JSON.parse(localStorage.getItem(localSubjectsKey) || '[]');
        data.subjects.forEach(sub => {
          existing.push({
            id: 'sub_' + Math.random().toString(36).substring(2, 9),
            tutor_id: user.id,
            name: sub,
            created_at: new Date().toISOString(),
          });
        });
        localStorage.setItem(localSubjectsKey, JSON.stringify(existing));
      }
    }

    return {};
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        loading,
        isConfigured: isSupabaseConfigured,
        signUp,
        signIn,
        signOut,
        resetPassword,
        updateProfile,
        completeOnboarding,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
