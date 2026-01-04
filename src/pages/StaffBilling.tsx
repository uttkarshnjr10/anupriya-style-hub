import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import DesktopSidebar from "@/components/layout/DesktopSidebar";
import MobileBottomNav from "@/components/layout/MobileBottomNav";
import RecordSaleForm from "@/components/dashboard/RecordSaleForm";
import RecentActivity from "@/components/dashboard/RecentActivity";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { api } from "@/lib/api";

const StaffBilling = () => {
  const navigate = useNavigate();
  const [realRecentSales, setRealRecentSales] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Function to fetch real data
  const fetchRecentSales = useCallback(async () => {
    try {
      // Fetch last 10 sales
      const response = await api.get('/transactions/history?limit=10&type=SALE');
      if (response.data.success) {
        setRealRecentSales(response.data.data.transactions);
      }
    } catch (error) {
      console.error("Failed to fetch recent sales:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Fetch on mount
  useEffect(() => {
    fetchRecentSales();
  }, [fetchRecentSales]);

  return (
    <div className="min-h-screen bg-secondary">
      <DesktopSidebar role="staff" />

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
            <h1 className="font-display text-xl font-bold">Record Sale</h1>
            <p className="text-sm text-muted-foreground">Log a sale from the shop</p>
          </div>
        </div>
      </motion.header>

      <main className="lg:ml-64 p-4 lg:p-8 pb-24 lg:pb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="hidden lg:block mb-8"
        >
          <h1 className="font-display text-3xl font-bold text-foreground">Record Sale / Billing Entry</h1>
          <p className="text-muted-foreground mt-1">Log sales from the physical shop</p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Pass the refresh function to the form */}
          <RecordSaleForm onSaleSuccess={fetchRecentSales} />

          {/* Pass the REAL data here */}
          <RecentActivity sales={realRecentSales} />
        </div>
      </main>

      <MobileBottomNav role="staff" />
    </div>
  );
};

export default StaffBilling;