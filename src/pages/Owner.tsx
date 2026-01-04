import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { LogOut, DollarSign, Wallet, CreditCard } from "lucide-react";
import DesktopSidebar from "@/components/layout/DesktopSidebar";
import MobileBottomNav from "@/components/layout/MobileBottomNav";
import StatsCard from "@/components/dashboard/StatsCard";
import { WeeklySalesChart } from "@/components/dashboard/SalesChart";
import RecentActivity from "@/components/dashboard/RecentActivity";
import StickyNotes from "@/components/dashboard/StickyNotes";
import { RegisterStaffDialog } from "@/components/dashboard/RegisterStaffDialog";
import { api, ApiResponse } from "@/lib/api";
import { toast } from "sonner";
import { ownerNotes } from "@/data/mockData"; // Notes are still local for now

// Dashboard stats contract
interface DashboardStats {
  totalRevenue: number;
  totalExpenses: number;
  netProfit: number;
}

const Owner = () => {
  const navigate = useNavigate();

  // 1. Stats State
  const [stats, setStats] = useState<DashboardStats>({
    totalRevenue: 0,
    totalExpenses: 0,
    netProfit: 0,
  });

  // 2. Chart State
  const [chartData, setChartData] = useState<any[]>([]);

  // 3. Activity State
  const [recentSales, setRecentSales] = useState<any[]>([]);

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAllData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        // Parallel Fetching for speed
        const [statsRes, chartRes, activityRes] = await Promise.all([
           api.get<ApiResponse<DashboardStats>>("/dashboard/stats").catch(e => null),
           api.get("/dashboard/sales-chart").catch(e => null),
           // For Recent Activity, we reuse the history endpoint with a small limit
           api.get("/transactions/history?limit=5&type=SALE").catch(e => null)
        ]);

        if (statsRes?.data?.success) setStats(statsRes.data.data);
        if (chartRes?.data?.success) setChartData(chartRes.data.data);
        
        // Handle Activity response (it has nested transactions array)
        if (activityRes?.data?.success) {
           setRecentSales(activityRes.data.data.transactions);
        }

      } catch (err) {
        console.error("Dashboard fetch error:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAllData();
  }, []);

  const handleLogout = async () => {
    try {
      await api.post("/auth/logout");
      toast.success("Logged out successfully");
    } catch {
      toast.error("Logout failed, but redirecting anyway.");
    } finally {
      navigate("/login");
    }
  };

  return (
    <div className="min-h-screen bg-secondary">
      <DesktopSidebar role="owner" />

      {/* Mobile Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="lg:hidden sticky top-0 z-30 glass px-4 py-4 flex justify-between items-center border-b border-border/40"
      >
        <div>
          <h1 className="font-display text-xl font-bold text-foreground">Dashboard</h1>
          <p className="text-xs text-muted-foreground">Overview</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="scale-90 origin-right">
             <RegisterStaffDialog />
          </div>
          <button
            onClick={handleLogout}
            className="p-2 text-muted-foreground hover:text-destructive transition-colors"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </motion.header>

      <main className="lg:ml-64 p-4 lg:p-8 pb-24 lg:pb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-7xl mx-auto space-y-6 lg:space-y-8"
        >
          {/* Desktop Header */}
          <div className="hidden lg:flex items-center justify-between">
            <div>
              <h1 className="font-display text-3xl font-bold text-foreground">Dashboard</h1>
              <p className="text-muted-foreground mt-1">Welcome back, Vijay Sharma</p>
            </div>
            <div className="flex items-center gap-4">
              <RegisterStaffDialog />
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-card border border-border hover:border-destructive/50 hover:text-destructive transition-colors shadow-sm"
              >
                <LogOut className="w-4 h-4" />
                <span className="font-medium">Logout</span>
              </button>
            </div>
          </div>

          {error && (
            <div className="p-4 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-sm">
              {error}
            </div>
          )}

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <StatsCard
              title="Total Revenue"
              value={isLoading ? "..." : `₹${stats.totalRevenue.toLocaleString("en-IN")}`}
              trend={12.5}
              icon={DollarSign}
              index={0}
              variant="default"
            />
            <StatsCard
              title="Total Expenses"
              value={isLoading ? "..." : `₹${stats.totalExpenses.toLocaleString("en-IN")}`}
              trend={-4.2}
              icon={Wallet}
              index={1}
              variant="default"
            />
            <StatsCard
              title="Net Profit"
              value={isLoading ? "..." : `₹${stats.netProfit.toLocaleString("en-IN")}`}
              trend={8.1}
              icon={CreditCard}
              index={2}
              variant="success"
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
            <div className="lg:col-span-2">
               {/* Real Chart Data */}
              <WeeklySalesChart data={chartData} />
            </div>
            <div>
               {/* Real Activity Data */}
              <RecentActivity sales={recentSales} />
            </div>
          </div>

          <StickyNotes initialNotes={ownerNotes} />
        </motion.div>
      </main>

      <MobileBottomNav role="owner" />
    </div>
  );
};

export default Owner;