import { motion } from "framer-motion";
import DesktopSidebar from "@/components/layout/DesktopSidebar";
import { Receipt, Globe, ChevronRight, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { api } from "@/lib/api";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";

const Staff = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const menuItems = [
    {
      title: "Record Sale / Billing",
      description: "Log a sale from the physical shop",
      icon: Receipt,
      path: "/staff/billing",
      color: "bg-success/10 text-success",
      gradient: "from-success/5 to-success/10",
    },
    {
      title: "Online Inventory",
      description: "Manage what customers see on the website",
      icon: Globe,
      path: "/staff/inventory",
      color: "bg-primary/10 text-primary",
      gradient: "from-primary/5 to-primary/10",
    },
    {
      title: "Dues Management",
      description: "Manage customer dues and payments",
      icon: Globe,
      path: "/staff/dues",
      color: "bg-primary/10 text-primary",
      gradient: "from-primary/5 to-primary/10",
    },
  ];

  return (
    <div className="min-h-screen bg-secondary">
      {/* Desktop Sidebar */}
      <DesktopSidebar role="staff" />

      {/* Mobile Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="lg:hidden sticky top-0 z-30 glass px-4 py-4 flex justify-between items-center"
      >
        <div>
          <h1 className="font-display text-xl font-bold">Staff Dashboard</h1>
          <p className="text-sm text-muted-foreground">Hi, {user?.name || 'Staff'}</p>
        </div>
        <button
          onClick={logout}
          className="p-2 text-muted-foreground hover:text-destructive transition-colors"
        >
          <LogOut className="w-5 h-5" />
        </button>
      </motion.header>

      {/* Main Content */}
      <main className="lg:ml-64 p-4 lg:p-8 pb-24 lg:pb-8">
        {/* Desktop Header (MODIFIED) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="hidden lg:block mb-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <h1 className="font-display text-2xl font-bold text-foreground">
                Hi, {user?.name?.split(" ")[0]}
              </h1>
              <p className="text-muted-foreground text-sm">
                Sales & Inventory
              </p>
            </div>

            {/* Logout Button */}
            <button
              onClick={logout}
              className="p-2.5 bg-white border border-border rounded-xl shadow-sm active:scale-95 transition-transform"
            >
              <LogOut className="w-5 h-5 text-red-500" />
            </button>
          </div>
        </motion.div>

        {/* Menu Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl">
          {menuItems.map((item, index) => (
            <motion.button
              key={item.path}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate(item.path)}
              className={`p-6 rounded-2xl bg-gradient-to-br ${item.gradient} border border-border text-left transition-all hover:shadow-lg`}
            >
              <div className="flex items-start justify-between">
                <div
                  className={`w-12 h-12 rounded-xl ${item.color} flex items-center justify-center mb-4`}
                >
                  <item.icon className="w-6 h-6" />
                </div>
                <ChevronRight className="w-5 h-5 text-muted-foreground" />
              </div>
              <h3 className="font-display text-lg font-semibold text-foreground mb-1">
                {item.title}
              </h3>
              <p className="text-sm text-muted-foreground">
                {item.description}
              </p>
            </motion.button>
          ))}
        </div>
      </main>
    </div>
  );
};

export default Staff;
