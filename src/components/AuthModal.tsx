import { useState, useEffect } from "react";
import { X, Mail, Lock, User as UserIcon, Sparkles } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/hooks/use-toast";

const AuthModal = () => {
  const { authModalOpen, authModalMode, closeAuthModal, login, signup, authReason } = useAuth();
  const [mode, setMode] = useState<"login" | "signup">(authModalMode);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => { setMode(authModalMode); }, [authModalMode, authModalOpen]);

  if (!authModalOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (mode === "login") {
        await login(email, password);
        toast({ title: "Welcome back!", description: "You're now signed in." });
      } else {
        await signup(name || email.split("@")[0], email, password);
        toast({ title: "Account created", description: "Welcome to Online Dynamics & BSB!" });
      }
      setName(""); setEmail(""); setPassword("");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="fixed inset-0 z-[90] bg-foreground/60 backdrop-blur-sm" onClick={closeAuthModal} />
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 pointer-events-none">
        <div className="bg-background rounded-xl border border-border shadow-2xl max-w-md w-full pointer-events-auto max-h-[90vh] overflow-y-auto">
          <div className="relative p-8">
            <button
              onClick={closeAuthModal}
              className="absolute top-4 right-4 text-foreground hover:text-secondary transition-colors"
              aria-label="Close"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="text-center mb-6">
              <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-secondary/20 flex items-center justify-center">
                <Sparkles className="h-6 w-6 text-secondary" />
              </div>
              <h2 className="font-display text-2xl font-bold text-foreground mb-1">
                {mode === "login" ? "Welcome back" : "Create your account"}
              </h2>
              <p className="text-sm text-muted-foreground font-body">
                {authReason ?? (mode === "login" ? "Sign in to access your dashboard." : "Join thousands shaping their global future.")}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {mode === "signup" && (
                <div className="relative">
                  <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="Full name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="w-full pl-10 pr-4 py-3 bg-muted border border-border rounded-lg text-foreground font-body text-sm focus:outline-none focus:ring-2 focus:ring-secondary"
                  />
                </div>
              )}
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type="email"
                  placeholder="Email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full pl-10 pr-4 py-3 bg-muted border border-border rounded-lg text-foreground font-body text-sm focus:outline-none focus:ring-2 focus:ring-secondary"
                />
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                  className="w-full pl-10 pr-4 py-3 bg-muted border border-border rounded-lg text-foreground font-body text-sm focus:outline-none focus:ring-2 focus:ring-secondary"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-secondary text-secondary-foreground font-semibold py-3.5 rounded-full hover:bg-secondary/90 transition-colors font-body disabled:opacity-60"
              >
                {loading ? "Please wait…" : mode === "login" ? "Sign In" : "Create Account"}
              </button>
            </form>

            <div className="mt-6 text-center text-sm text-muted-foreground font-body">
              {mode === "login" ? (
                <>Don't have an account?{" "}
                  <button onClick={() => setMode("signup")} className="text-secondary font-semibold hover:underline">Sign up</button>
                </>
              ) : (
                <>Already have an account?{" "}
                  <button onClick={() => setMode("login")} className="text-secondary font-semibold hover:underline">Sign in</button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AuthModal;
