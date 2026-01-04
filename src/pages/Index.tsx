import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ShoppingBag, Users, Crown, Sparkles, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";

const Index = () => {
  const navigate = useNavigate();

  const roles = [
    {
      title: "Enter as Customer",
      subtitle: "Browse & shop our collection",
      icon: ShoppingBag,
      path: "/shop",
      variant: "customer" as const,
    },
    {
      title: "Login as Staff",
      subtitle: "Manage sales & inventory",
      icon: Users,
      path: "/login?role=staff",
      variant: "staff" as const,
    },
    {
      title: "Login as Owner",
      subtitle: "View analytics & reports",
      icon: Crown,
      path: "/login?role=owner",
      variant: "owner" as const,
    },
  ];

  return (
    <div className="min-h-screen gradient-hero flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-gold/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gold/5 rounded-full blur-3xl" />
        <div className="absolute top-1/3 right-1/4 w-64 h-64 bg-primary/20 rounded-full blur-3xl" />
      </div>

      {/* Pattern overlay */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23D4AF37' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-md w-full text-center">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-4 py-2 mb-6 rounded-full bg-gold/20 border border-gold/30"
        >
          <Sparkles className="w-4 h-4 text-gold" />
          <span className="text-sm font-medium text-gold">Premium Fashion</span>
        </motion.div>

        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <h1 className="font-display text-5xl md:text-6xl font-bold text-white mb-2">
            Anupriya
          </h1>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-gold mb-4">
            Fashion Hub
          </h2>
          <p className="text-lg text-white/80 mb-2">Where Tradition Meets Trend</p>
          <div className="flex items-center justify-center gap-2 text-white/60">
            <MapPin className="w-4 h-4" />
            <span className="text-sm">Station Rd, Barh</span>
          </div>
        </motion.div>

        {/* Decorative line */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="h-px w-32 mx-auto mb-10 bg-gradient-to-r from-transparent via-gold to-transparent"
        />

        {/* Role Selection */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="space-y-4"
        >
          {roles.map((role, index) => (
            <motion.div
              key={role.title}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 + index * 0.1 }}
            >
              <Button
                onClick={() => navigate(role.path)}
                className={`w-full h-auto py-4 px-6 rounded-2xl flex items-center gap-4 transition-all btn-pressed ${
                  role.variant === 'customer' 
                    ? 'gradient-gold text-foreground hover:shadow-glow' 
                    : role.variant === 'owner'
                    ? 'bg-white/10 text-white border border-white/20 hover:bg-white/20'
                    : 'bg-white/5 text-white/90 border border-white/10 hover:bg-white/10'
                }`}
              >
                <div className={`p-3 rounded-xl ${
                  role.variant === 'customer' 
                    ? 'bg-white/20' 
                    : 'bg-white/10'
                }`}>
                  <role.icon className="w-6 h-6" />
                </div>
                <div className="text-left flex-1">
                  <p className="font-semibold text-base">{role.title}</p>
                  <p className={`text-sm ${
                    role.variant === 'customer' 
                      ? 'text-foreground/70' 
                      : 'text-white/60'
                  }`}>
                    {role.subtitle}
                  </p>
                </div>
              </Button>
            </motion.div>
          ))}
        </motion.div>

        {/* Footer */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="mt-10 text-sm text-white/40"
        >
          © 2024 Anupriya Fashion Hub. All rights reserved.
        </motion.p>
      </div>
    </div>
  );
};

export default Index;
