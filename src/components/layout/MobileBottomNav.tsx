import { motion } from "framer-motion";
import { Home, ShoppingBag, BarChart3, User, Store, Receipt, Globe } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";

interface MobileNavProps {
  role: 'customer' | 'staff' | 'owner';
}

const MobileBottomNav = ({ role }: MobileNavProps) => {
  const location = useLocation();
  const navigate = useNavigate();

  const customerLinks = [
    { icon: Home, label: 'Home', path: '/shop' },
    { icon: ShoppingBag, label: 'Shop', path: '/shop' },
    { icon: User, label: 'Profile', path: '/shop' },
  ];

  const staffLinks = [
    { icon: Receipt, label: 'Billing', path: '/staff/billing' },
    { icon: Globe, label: 'Inventory', path: '/staff/inventory' },
    { icon: Store, label: 'Shop', path: '/shop' },
    { icon: User, label: 'Account', path: '/' },
  ];

  const ownerLinks = [
    { icon: BarChart3, label: 'Analytics', path: '/owner' },
    { icon: Store, label: 'Shop', path: '/shop' },
    { icon: User, label: 'Account', path: '/' },
  ];

  const links = role === 'customer' ? customerLinks : role === 'staff' ? staffLinks : ownerLinks;

  return (
    <motion.nav
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bottom-nav-glass"
    >
      <div className="flex items-center justify-around py-2 px-4 safe-bottom">
        {links.map((link) => {
          const isActive = location.pathname === link.path;
          return (
            <motion.button
              key={link.label}
              whileTap={{ scale: 0.9 }}
              onClick={() => navigate(link.path)}
              className="flex flex-col items-center gap-1 py-2 px-3 rounded-2xl transition-colors"
            >
              <div className={`p-2 rounded-xl transition-colors ${
                isActive ? 'bg-primary text-primary-foreground' : 'text-muted-foreground'
              }`}>
                <link.icon className="w-5 h-5" />
              </div>
              <span className={`text-xs font-medium ${
                isActive ? 'text-primary' : 'text-muted-foreground'
              }`}>
                {link.label}
              </span>
            </motion.button>
          );
        })}
      </div>
    </motion.nav>
  );
};

export default MobileBottomNav;
