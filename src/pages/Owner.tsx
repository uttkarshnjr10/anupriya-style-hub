import { motion } from "framer-motion";
import { IndianRupee, ShoppingCart, TrendingUp } from "lucide-react";
import DesktopSidebar from "@/components/layout/DesktopSidebar";
import MobileBottomNav from "@/components/layout/MobileBottomNav";
import StatsCard from "@/components/dashboard/StatsCard";
import { WeeklySalesChart, CategoryPieChart } from "@/components/dashboard/SalesChart";
import StickyNotes from "@/components/dashboard/StickyNotes";
import InventoryLog from "@/components/dashboard/InventoryLog";
import { weeklySales, categorySales, ownerNotes, inventoryLog } from "@/data/mockData";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Owner = () => {
  const navigate = useNavigate();

  const stats = [
    { title: "Today's Revenue", value: "₹12,500", trend: 12, icon: IndianRupee, variant: 'gold' as const },
    { title: "Items Sold", value: "14", trend: 8, icon: ShoppingCart, variant: 'default' as const },
    { title: "Monthly Total", value: "₹4.2L", trend: 15, icon: TrendingUp, variant: 'success' as const },
  ];

  return (
    <div className="min-h-screen bg-secondary">
      {/* Desktop Sidebar */}
      <DesktopSidebar role="owner" />

      {/* Mobile Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="lg:hidden sticky top-0 z-30 glass px-4 py-4"
      >
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/')}
            className="p-2 rounded-full hover:bg-muted transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="font-display text-xl font-bold">Owner Dashboard</h1>
            <p className="text-sm text-muted-foreground">Welcome back!</p>
          </div>
        </div>
      </motion.header>

      {/* Main Content */}
      <main className="lg:ml-64 p-4 lg:p-8 pb-24 lg:pb-8">
        {/* Desktop Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="hidden lg:block mb-8"
        >
          <h1 className="font-display text-3xl font-bold text-foreground">
            Welcome back, Mr. Vijay Sharma
          </h1>
          <p className="text-muted-foreground mt-1">Here's what's happening with your store today.</p>
        </motion.div>

        {/* Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {stats.map((stat, index) => (
            <StatsCard
              key={stat.title}
              title={stat.title}
              value={stat.value}
              trend={stat.trend}
              icon={stat.icon}
              index={index}
              variant={stat.variant}
            />
          ))}
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <WeeklySalesChart data={weeklySales} />
          <CategoryPieChart data={categorySales} />
        </div>

        {/* Management Tools */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <StickyNotes initialNotes={ownerNotes} />
          <InventoryLog entries={inventoryLog} />
        </div>
      </main>

      {/* Mobile Bottom Navigation */}
      <MobileBottomNav role="owner" />
    </div>
  );
};

export default Owner;
