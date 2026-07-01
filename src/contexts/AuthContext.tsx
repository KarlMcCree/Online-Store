import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import type { Session, User as SupabaseUser } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase/client";
import { toast } from "@/hooks/use-toast";

export type User = {
  id: string;
  name: string;
  email: string;
  createdAt: string;
};

type AuthContextType = {
  user: User | null;
  loading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  // Auth gate modal
  authModalOpen: boolean;
  authModalMode: "login" | "signup";
  openAuthModal: (mode?: "login" | "signup", reason?: string) => void;
  closeAuthModal: () => void;
  authReason: string | null;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const mapUser = (su: SupabaseUser | null | undefined): User | null => {
  if (!su) return null;
  const name =
    (su.user_metadata?.name as string | undefined) ||
    (su.user_metadata?.full_name as string | undefined) ||
    su.email?.split("@")[0] ||
    "Member";
  return {
    id: su.id,
    name,
    email: su.email ?? "",
    createdAt: su.created_at ?? new Date().toISOString(),
  };
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<"login" | "signup">("signup");
  const [authReason, setAuthReason] = useState<string | null>(null);

  useEffect(() => {
    // Subscribe FIRST so we don't miss the initial event.
    const { data: sub } = supabase.auth.onAuthStateChange((_event, session: Session | null) => {
      setUser(mapUser(session?.user));
      setLoading(false);
    });

    // Then hydrate from any existing session.
    supabase.auth.getSession().then(({ data }) => {
      setUser(mapUser(data.session?.user));
      setLoading(false);
    });

    return () => {
      sub.subscription.unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      toast({ title: "Sign in failed", description: error.message, variant: "destructive" });
      throw error;
    }
    setAuthModalOpen(false);
    setAuthReason(null);
  };

  const signup = async (name: string, email: string, password: string) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { name },
        emailRedirectTo: `${window.location.origin}/`,
      },
    });
    if (error) {
      toast({ title: "Sign up failed", description: error.message, variant: "destructive" });
      throw error;
    }
    setAuthModalOpen(false);
    setAuthReason(null);
  };

  const logout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast({ title: "Sign out failed", description: error.message, variant: "destructive" });
    }
  };

  const openAuthModal = (mode: "login" | "signup" = "signup", reason?: string) => {
    setAuthModalMode(mode);
    setAuthReason(reason ?? null);
    setAuthModalOpen(true);
  };
  const closeAuthModal = () => {
    setAuthModalOpen(false);
    setAuthReason(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuthenticated: !!user,
        login,
        signup,
        logout,
        authModalOpen,
        authModalMode,
        openAuthModal,
        closeAuthModal,
        authReason,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
