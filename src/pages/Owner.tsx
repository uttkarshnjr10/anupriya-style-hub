import { useState } from "react";
import { motion } from "framer-motion";
import { IndianRupee, ShoppingCart, TrendingUp, ChevronLeft, ChevronRight, ArrowLeft, ExternalLink } from "lucide-react";
import DesktopSidebar from "@/components/layout/DesktopSidebar";
import MobileBottomNav from "@/components/layout/MobileBottomNav";
import StatsCard from "@/components/dashboard/StatsCard";
import { WeeklySalesChart, CategoryPieChart } from "@/components/dashboard/SalesChart";
import StickyNotes from "@/components/dashboard/StickyNotes";
import InventoryLog from "@/components/dashboard/InventoryLog";
import RecentActivity from "@/components/dashboard/RecentActivity";
import { weeklySales, categorySales, ownerNotes, inventoryLog, recentSales } from "@/data/mockData";
import { useNavigate } from "react-router-dom";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";

type DateRange = 'today' | 'yesterday' | 'week' | 'month';

// Mock data for different date ranges
const statsData: Record<DateRange, { revenue: string; items: string; monthly: string; trends: [number, number, number] }> = {
  today: { revenue: "₹12,500", items: "14", monthly: "₹4.2L", trends: [12, 8, 15] },
  yesterday: { revenue: "₹9,800", items: "11", monthly: "₹4.2L", trends: [8, 5, 15] },
  week: { revenue: "₹78,500", items: "87", monthly: "₹4.2L", trends: [22, 18, 15] },
  month: { revenue: "₹4,20,000", items: "412", monthly: "₹4.2L", trends: [15, 12, 15] },
};

const Owner = () => {
  const navigate = useNavigate();
  const [dateRange, setDateRange] = useState<DateRange>('today');
  const [weekOffset, setWeekOffset] = useState(0);

  // TODO: BACKEND_API - GET /api/stats/dashboard?dateRange={range}
  const currentStats = statsData[dateRange];

  const stats = [
    { title: dateRange === 'today' ? "Today's Revenue" : dateRange === 'yesterday' ? "Yesterday's Revenue" : dateRange === 'week' ? "This Week's Revenue" : "This Month's Revenue", value: currentStats.revenue, trend: currentStats.trends[0], icon: IndianRupee, variant: 'gold' as const },
    { title: "Items Sold", value: currentStats.items, trend: currentStats.trends[1], icon: ShoppingCart, variant: 'default' as const },
    { title: "Monthly Total", value: currentStats.monthly, trend: currentStats.trends[2], icon: TrendingUp, variant: 'success' as const },
  ];

  const getWeekLabel = () => {
    if (weekOffset === 0) return "This Week";
    if (weekOffset === -1) return "Last Week";
    if (weekOffset === -2) return "2 Weeks Ago";
    return `${Math.abs(weekOffset)} Weeks Ago`;
  };

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
          <div className="flex-1">
            <h1 className="font-display text-xl font-bold">Owner Dashboard</h1>
            <p className="text-sm text-muted-foreground">Welcome back!</p>
          </div>
          {/* Mobile Date Filter */}
          <Select value={dateRange} onValueChange={(v) => setDateRange(v as DateRange)}>
            <SelectTrigger className="w-[120px] h-9 rounded-xl text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="today">Today</SelectItem>
              <SelectItem value="yesterday">Yesterday</SelectItem>
              <SelectItem value="week">This Week</SelectItem>
              <SelectItem value="month">This Month</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </motion.header>

      {/* Main Content */}
      <main className="lg:ml-64 p-4 lg:p-8 pb-24 lg:pb-8">
        {/* Desktop Header with Date Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="hidden lg:flex lg:items-center lg:justify-between mb-8"
        >
          <div>
            <h1 className="font-display text-3xl font-bold text-foreground">
              Welcome back, Mr. Vijay Sharma
            </h1>
            <p className="text-muted-foreground mt-1">Here's what's happening with your store today.</p>
          </div>
          <Select value={dateRange} onValueChange={(v) => setDateRange(v as DateRange)}>
            <SelectTrigger className="w-[180px] rounded-xl">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="today">Today</SelectItem>
              <SelectItem value="yesterday">Yesterday</SelectItem>
              <SelectItem value="week">This Week</SelectItem>
              <SelectItem value="month">This Month</SelectItem>
            </SelectContent>
          </Select>
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
          {/* Weekly Sales Chart with Navigation */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.4 }}
            className="bg-card rounded-2xl p-6 shadow-soft border border-border"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-display text-xl font-semibold">Weekly Sales</h3>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setWeekOffset(prev => prev - 1)}
                  className="h-8 w-8 rounded-lg"
                >
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <span className="text-sm text-muted-foreground min-w-[100px] text-center">
                  {getWeekLabel()}
                </span>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setWeekOffset(prev => Math.min(prev + 1, 0))}
                  disabled={weekOffset === 0}
                  className="h-8 w-8 rounded-lg"
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
            <WeeklySalesChart data={weeklySales} />
          </motion.div>
          <CategoryPieChart data={categorySales} />
        </div>

        {/* Recent Activity & Inventory Summary */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Recent Sales Summary */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-card rounded-2xl p-6 shadow-soft border border-border"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-display text-xl font-semibold">Recent Sales</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/owner/sales-history')}
                className="text-primary hover:text-primary/80 gap-1"
              >
                View All
                <ExternalLink className="w-3 h-3" />
              </Button>
            </div>
            <RecentActivity sales={recentSales.slice(0, 5)} />
          </motion.div>

          {/* Inventory Log Summary */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-card rounded-2xl p-6 shadow-soft border border-border"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-display text-xl font-semibold">Inventory Log</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/owner/inventory-history')}
                className="text-primary hover:text-primary/80 gap-1"
              >
                View All
                <ExternalLink className="w-3 h-3" />
              </Button>
            </div>
            <InventoryLog entries={inventoryLog.slice(0, 5)} />
          </motion.div>
        </div>

        {/* Management Tools */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <StickyNotes initialNotes={ownerNotes} />
        </div>
      </main>

      {/* Mobile Bottom Navigation */}
      <MobileBottomNav role="owner" />
    </div>
  );
};

export default Owner;
