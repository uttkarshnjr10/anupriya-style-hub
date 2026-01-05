import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { LogOut, User as UserIcon } from "lucide-react";
import DesktopSidebar from "@/components/layout/DesktopSidebar";
// import MobileBottomNav from "@/components/layout/MobileBottomNav"; // REMOVED
import StatsCard from "@/components/dashboard/StatsCard";
import { WeeklySalesChart } from "@/components/dashboard/SalesChart";
import RecentActivity from "@/components/dashboard/RecentActivity";
import StickyNotes from "@/components/dashboard/StickyNotes";
import { RegisterStaffDialog } from "@/components/dashboard/RegisterStaffDialog";
import { api, ApiResponse } from "@/lib/api";
import { toast } from "sonner";
import { ownerNotes } from "@/data/mockData";
import { useAuth } from "@/context/AuthContext";

// Dashboard stats contract
interface DashboardStats {
  totalRevenue: number;
  totalExpenses: number;
  netProfit: number;
}

const Owner = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

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
        const [statsRes, chartRes, activityRes] = await Promise.all([
          api.get<ApiResponse<DashboardStats>>("/dashboard/stats").catch(() => null),
          api.get("/dashboard/sales-chart").catch(() => null),
          api.get("/transactions/history?limit=5&type=SALE").catch(() => null),
        ]);

        if (statsRes?.data?.success) setStats(statsRes.data.data);
        if (chartRes?.data?.success) setChartData(chartRes.data.data);

        if (activityRes?.data?.success) {
          setRecentSales(activityRes.data.data.transactions);
        }
      } catch (err) {
        console.error("Dashboard fetch error:", err);
        setError("Failed to load dashboard data");
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
      localStorage.removeItem("afh_user");
      window.location.href = "/";
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <DesktopSidebar />

      <main className="md:pl-72 p-4 space-y-6">
        {/* --- HEADER --- */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-display text-2xl font-bold text-foreground">
              Hi, {user?.name?.split(" ")[0]} 👋
            </h1>
            <p className="text-muted-foreground text-sm">Owner Dashboard</p>
          </div>

          <div className="flex items-center gap-2">
            <RegisterStaffDialog />

            <button
              onClick={() => navigate("/account")}
              className="p-2.5 bg-white border border-border rounded-xl shadow-sm active:scale-95 transition-transform"
            >
              <UserIcon className="w-5 h-5 text-foreground" />
            </button>

            <button
              onClick={handleLogout}
              className="p-2.5 bg-white border border-border rounded-xl shadow-sm active:scale-95 transition-transform"
            >
              <LogOut className="w-5 h-5 text-red-500" />
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
            value={isLoading ? "..." : `₹${stats.totalRevenue.toLocaleString()}`}
            trendUp
            icon="revenue"
          />
          <StatsCard
            title="Total Expenses"
            value={isLoading ? "..." : `₹${stats.totalExpenses.toLocaleString()}`}
            // trend="-4.2%"
            trendUp={false}
            icon="expense"
          />
          <StatsCard
            title="Net Profit"
            value={isLoading ? "..." : `₹${stats.netProfit.toLocaleString()}`}
            // trend="+8.1%"
            trendUp
            icon="wallet"
          />
        </div>

        <WeeklySalesChart data={chartData} />

        <RecentActivity transactions={recentSales} />

        <StickyNotes initialNotes={ownerNotes} />
      </main>
    </div>
  );
};

export default Owner;
