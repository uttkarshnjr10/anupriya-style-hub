import { motion } from "framer-motion";
import { Home, ShoppingBag, BarChart3, Settings, LogOut, Store, Users, Package } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";

interface SidebarProps {
  role: 'staff' | 'owner';
}

const DesktopSidebar = ({ role }: SidebarProps) => {
  const location = useLocation();
  const navigate = useNavigate();

  const staffLinks = [
    { icon: Home, label: 'Dashboard', path: '/staff' },
    { icon: Package, label: 'Quick Sell', path: '/staff' },
    { icon: Store, label: 'Visit Shop', path: '/shop' },
  ];

  const ownerLinks = [
    { icon: BarChart3, label: 'Analytics', path: '/owner' },
    { icon: ShoppingBag, label: 'Sales', path: '/owner' },
    { icon: Users, label: 'Staff', path: '/owner' },
    { icon: Store, label: 'Visit Shop', path: '/shop' },
    { icon: Settings, label: 'Settings', path: '/owner' },
  ];

  const links = role === 'staff' ? staffLinks : ownerLinks;

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

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {links.map((link) => {
          const isActive = location.pathname === link.path;
          return (
            <motion.button
              key={link.label}
              whileHover={{ x: 4 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate(link.path)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
                isActive 
                  ? 'bg-white/20 text-white' 
                  : 'text-white/70 hover:bg-white/10 hover:text-white'
              }`}
            >
              <link.icon className="w-5 h-5" />
              <span className="font-medium">{link.label}</span>
            </motion.button>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-white/10">
        <motion.button
          whileHover={{ x: 4 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => navigate('/')}
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
