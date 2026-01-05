import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import DesktopSidebar from "@/components/layout/DesktopSidebar";
import OnlineInventoryForm from "@/components/dashboard/OnlineInventoryForm";
import OnlineInventoryList, { Product } from "@/components/dashboard/OnlineInventoryList";
import { ArrowLeft, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { api } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";

const StaffInventory = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  // Explicitly type the state array
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

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

  // Fetch Logic
  const fetchInventory = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await api.get('/products', {
        params: { limit: 100, sort: 'newest' } 
      });
      if (response.data.success) {
        setProducts(response.data.data.products);
      }
    } catch (error) {
      console.error("Fetch failed:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchInventory();
  }, [fetchInventory]);

  return (
    <div className="min-h-screen bg-secondary">
      <DesktopSidebar role="staff" />

      {/* Mobile Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="lg:hidden sticky top-0 z-30 glass px-4 py-4 flex justify-between items-center"
      >
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/staff')}
            className="p-2 rounded-full hover:bg-muted transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="font-display text-xl font-bold">Online Inventory</h1>
            <p className="text-sm text-muted-foreground">Hi, {user?.name || 'Staff'}</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="p-2 text-muted-foreground hover:text-destructive transition-colors"
        >
          <LogOut className="w-5 h-5" />
        </button>
      </motion.header>

      <main className="lg:ml-64 p-4 lg:p-8 pb-24 lg:pb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="hidden lg:block mb-8"
        >
          <h1 className="font-display text-3xl font-bold text-foreground">Online Inventory</h1>
          <p className="text-muted-foreground mt-1">Manage products visible to customers</p>
        </motion.div>

        {/* Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Left Column: Form */}
          <div className="lg:col-span-1">
            <OnlineInventoryForm onSuccess={fetchInventory} />
          </div>

          {/* Right Column: List (Removed Log Section) */}
          <div className="lg:col-span-2 space-y-6">
            <OnlineInventoryList 
               products={products} 
               isLoading={isLoading} 
               onRefresh={fetchInventory}
            />
          </div>
        </div>
      </main>
    </div>
  );
};

export default StaffInventory;

