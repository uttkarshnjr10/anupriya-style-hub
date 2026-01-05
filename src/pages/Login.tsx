import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Crown, Users, Lock, Mail, KeyRound, ArrowLeft, Eye, EyeOff } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { api } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";

const Login = () => {
  const [searchParams] = useSearchParams();
  const role = (searchParams.get("role") as "staff" | "owner") || "staff";
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [staffId, setStaffId] = useState("");
  const [pin, setPin] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // ... imports and setup

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const payload = role === "owner" ? { email, password } : { staffId, pin };
      const response = await api.post("/auth/login", payload);

      if (response.data.success) {
        const user = response.data.data.user;

        // 1. Normalize Role (Fixes the Case Sensitivity Issue)
        let safeRole = user.role.trim().toLowerCase();
        if (safeRole === 'admin') {
            safeRole = 'owner';
        }

        // 2. Save to Context & LocalStorage - await to prevent race condition
        await login({
          id: user._id,
          name: user.name,
          role: safeRole, 
          email: user.email,
        });

        toast.success(response.data.message || "Login successful!");

        // --- CRITICAL FIX FOR PRODUCTION ---
        // Use window.location.href to force full reload after state is saved
        // This prevents race conditions in incognito/other devices
        const targetPath = safeRole === "owner" ? "/owner" : "/staff";
        window.location.href = targetPath;
        // -----------------------------------
      }
    } catch (error: any) {
      console.error("Login failed", error);
    } finally {
      setIsLoading(false);
    }
  };

  const isOwner = role === "owner";

  return (
    <div className="min-h-screen gradient-hero flex flex-col items-center justify-center p-6 relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-gold/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gold/5 rounded-full blur-3xl" />
        <div className="absolute top-1/3 right-1/4 w-64 h-64 bg-primary/20 rounded-full blur-3xl" />
      </div>

      <motion.button
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        onClick={() => navigate('/')}
        className="fixed top-4 left-4 z-50 p-3 rounded-full glass shadow-lg btn-pressed"
      >
        <ArrowLeft className="w-5 h-5 text-white" />
      </motion.button>

      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 w-full max-w-md"
      >
        <div className="bg-card/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-border p-8">
          <div className="text-center mb-8">
            <div className={`w-16 h-16 mx-auto mb-4 rounded-2xl flex items-center justify-center ${
              isOwner ? 'gradient-gold' : 'gradient-royal'
            }`}>
              {isOwner ? (
                <Crown className="w-8 h-8 text-foreground" />
              ) : (
                <Users className="w-8 h-8 text-white" />
              )}
            </div>
            <h1 className="font-display text-2xl font-bold text-foreground mb-1">
              {isOwner ? 'Owner Login' : 'Staff Login'}
            </h1>
            <p className="text-muted-foreground text-sm">
              {isOwner ? 'Access your dashboard & analytics' : 'Access billing & inventory'}
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            {isOwner ? (
              <>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Email</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input
                      type="email"
                      placeholder="admin@afh.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-12 h-12 rounded-xl"
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Password</label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-12 pr-12 h-12 rounded-xl"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Staff ID</label>
                  <div className="relative">
                    <Users className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input
                      type="text"
                      placeholder="STF001"
                      value={staffId}
                      onChange={(e) => setStaffId(e.target.value)}
                      className="pl-12 h-12 rounded-xl"
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">PIN</label>
                  <div className="relative">
                    <KeyRound className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter 4-digit PIN"
                      value={pin}
                      onChange={(e) => setPin(e.target.value)}
                      className="pl-12 pr-12 h-12 rounded-xl tracking-[0.5em] text-center"
                      maxLength={4}
                      inputMode="numeric"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>
              </>
            )}

            <Button
              type="submit"
              disabled={isLoading}
              className={`w-full h-14 rounded-xl font-semibold text-lg btn-pressed ${
                isOwner ? 'gradient-gold text-foreground' : 'gradient-royal text-white'
              }`}
            >
              {isLoading ? (
                <div className="w-6 h-6 border-2 border-current/30 border-t-current rounded-full animate-spin" />
              ) : (
                'Login'
              )}
            </Button>
          </form>

          <div className="mt-6 p-4 rounded-xl bg-muted/50 border border-border">
             <p className="text-xs text-muted-foreground text-center">
               Use the credentials provided by the store owner.
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;