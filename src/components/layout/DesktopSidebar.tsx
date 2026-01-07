import { useAuth } from "@/context/AuthContext";
import { motion } from "framer-motion";
import { Home, ShoppingBag, BarChart3, Settings, LogOut, Store, Users, Receipt, Globe } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";

interface SidebarProps {
  role: 'staff' | 'owner';
}

const DesktopSidebar = ({ role }: SidebarProps) => {
  const { logout } = useAuth();
  // Only logout - all other navigation removed as per request
  const staffLinks: { icon: typeof Home; label: string; path: string }[] = [];
  const ownerLinks: { icon: typeof Home; label: string; path: string }[] = [];

  const links = role === 'staff' ? staffLinks : ownerLinks;

  const handleLogout = async () => {
  await logout(); // Wait for logout to complete
  // Navigation happens automatically via window.location.href
};
  return (
    <motion.aside
      initial={{ x: -100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      className="hidden lg:flex flex-col w-64 h-screen gradient-royal text-white fixed left-0 top-0"
    >
      {/* Logo */}
      <div className="p-6 border-b border-white/10">
        <h1 className="font-display text-xl font-bold">Anupriya</h1>
        <p className="text-sm text-white/70">Fashion Hub</p>
      </div>

      {/* Empty nav space - only logout below */}
      <nav className="flex-1 p-4" />

      {/* Logout */}
      <div className="p-4 border-t border-white/10">
        <motion.button
          whileHover={{ x: 4 }}
          whileTap={{ scale: 0.98 }}
          onClick={logout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-white/70 hover:bg-white/10 hover:text-white transition-colors"
        >
          <LogOut className="w-5 h-5" />
          <span className="font-medium">Logout</span>
        </motion.button>
      </div>
    </motion.aside>
  );
};

export default DesktopSidebar;
