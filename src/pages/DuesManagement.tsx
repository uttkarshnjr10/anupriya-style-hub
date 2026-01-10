import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  AlertCircle,
  CheckCircle,
  Clock,
  Phone,
  Calendar,
  Search,
  ArrowUpRight,
  CreditCard,
  MoreHorizontal
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import { api } from "@/lib/api";

// Reuse the modal we built earlier
import SaleDetailModal from "@/components/dashboard/SaleDetailModal";

// --- Types ---
interface DuesRecord {
  _id: string;
  type: "SALE"; 
  amount: number;
  paymentStatus: "PAID" | "DUE";
  dueAmount: number;
  amountPaid: number;
  customer: {
    name: string;
    phoneNumber: string;
  };
  dueDate?: string;
  productSnapshot?: {
    name: string;
    category: string;
    url?: string;
  };
  staffId: {
    name: string;
    staffId: string;
  };
  createdAt: string;
}

interface DuesStats {
  totalDuesRecords: number;
  totalOutstandingAmount: number;
  totalCollectedOnDues: number;
  statusBreakdown: {
    PENDING: { count: number; amount: number };
    PARTIAL: { count: number; amount: number };
  };
}

const DuesManagement = () => {
  const [dues, setDues] = useState<DuesRecord[]>([]);
  const [stats, setStats] = useState<DuesStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // Pagination & Filters
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [showOverdue, setShowOverdue] = useState(false);
  
  // Modal State
  const [selectedDue, setSelectedDue] = useState<DuesRecord | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);

  // --- 1. Debounce Logic ---
  useEffect(() => {
    const handler = setTimeout(() => {
      if (searchTerm.length >= 3 || searchTerm.length === 0) {
        setDebouncedSearchTerm(searchTerm);
      }
    }, 500);
    return () => clearTimeout(handler);
  }, [searchTerm]);

  // --- 2. Fetch Logic ---
  const fetchDues = useCallback(async () => {
    setIsLoading(true);
    try {
      const endpoint = showOverdue ? "/dues/overdue" : "/dues";
      const response = await api.get(endpoint, {
        params: { page, limit, searchTerm: debouncedSearchTerm }
      });

      if (response.data.success) {
        const data = showOverdue ? response.data.data.overdueDues : response.data.data.dues;
        setDues(data);
        setTotalPages(response.data.data.pagination.totalPages);
      }
    } catch (error) {
      console.error("Error fetching dues:", error);
      toast.error("Failed to fetch dues list");
    } finally {
      setIsLoading(false);
    }
  }, [page, limit, debouncedSearchTerm, showOverdue]);

  const fetchStats = useCallback(async () => {
    try {
      const response = await api.get("/dues/statistics");
      if (response.data.success) {
        setStats(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching statistics:", error);
    }
  }, []);

  useEffect(() => {
    fetchDues();
    fetchStats();
  }, [fetchDues, fetchStats]);

  // --- 3. Payment Action ---
  const handleCollectPayment = async (amount: number, mode: "CASH" | "ONLINE") => {
    if (!selectedDue) return;
    
    setIsUpdating(true);
    try {
      const res = await api.post(`/dues/${selectedDue._id}/collect`, {
        amount: amount,
        paymentMode: mode
      });

      if (res.data.success) {
        toast.success(`Collected ₹${amount} via ${mode}`);
        setSelectedDue(null); // Close modal
        fetchDues();          // Refresh list
        fetchStats();         // Refresh stats card
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Payment failed");
    } finally {
      setIsUpdating(false);
    }
  };

  // --- 4. Helpers ---
  const isOverdue = (dueDate?: string) => {
    if (!dueDate) return false;
    const today = new Date();
    today.setHours(0,0,0,0);
    return new Date(dueDate) < today;
  };

  const getStatusBadge = (due: DuesRecord) => {
     if (due.amountPaid === 0) {
        return <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 border border-red-200 dark:border-red-800">Pending</span>;
     }
     return <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 border border-amber-200 dark:border-amber-800">Partial</span>;
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-amber-100 to-orange-100 flex items-center justify-center border border-amber-200 shadow-sm">
            <AlertCircle className="w-6 h-6 text-amber-600" />
          </div>
          <div>
            <h2 className="font-display text-2xl font-bold tracking-tight">Dues Management</h2>
            <p className="text-sm text-muted-foreground">Monitor outstanding payments and collect dues</p>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-card p-4 rounded-xl border shadow-sm">
             <p className="text-xs font-medium text-muted-foreground uppercase">Total Outstanding</p>
             <div className="mt-2 flex items-baseline gap-2">
                <span className="text-2xl font-bold">₹{stats.totalOutstandingAmount?.toLocaleString() || 0}</span>
                <span className="text-xs text-muted-foreground">from {stats.totalDuesRecords} sales</span>
             </div>
          </motion.div>
          
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-red-50 dark:bg-red-950/20 p-4 rounded-xl border border-red-100 dark:border-red-900/50">
             <p className="text-xs font-medium text-red-600 dark:text-red-400 uppercase">Unpaid (Pending)</p>
             <div className="mt-2 flex items-baseline gap-2">
                <span className="text-2xl font-bold text-red-700 dark:text-red-400">₹{stats.statusBreakdown?.PENDING.amount?.toLocaleString() || 0}</span>
             </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-amber-50 dark:bg-amber-950/20 p-4 rounded-xl border border-amber-100 dark:border-amber-900/50">
             <p className="text-xs font-medium text-amber-600 dark:text-amber-400 uppercase">Partial Payment</p>
             <div className="mt-2 flex items-baseline gap-2">
                <span className="text-2xl font-bold text-amber-700 dark:text-amber-400">₹{stats.statusBreakdown?.PARTIAL.amount?.toLocaleString() || 0}</span>
             </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="bg-green-50 dark:bg-green-950/20 p-4 rounded-xl border border-green-100 dark:border-green-900/50">
             <p className="text-xs font-medium text-green-600 dark:text-green-400 uppercase">Recovered Amount</p>
             <div className="mt-2 flex items-baseline gap-2">
                <span className="text-2xl font-bold text-green-700 dark:text-green-400">₹{stats.totalCollectedOnDues?.toLocaleString() || 0}</span>
             </div>
          </motion.div>
        </div>
      )}

      {/* Controls */}
      <div className="flex flex-col md:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search customer name or phone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9 bg-background"
          />
        </div>
        <Button
          variant={showOverdue ? "destructive" : "outline"}
          onClick={() => { setShowOverdue(!showOverdue); setPage(1); }}
          className="gap-2 border-dashed"
        >
          <Clock className="w-4 h-4" />
          {showOverdue ? "Clear Filter" : "Show Overdue Only"}
        </Button>
      </div>

      {/* Table */}
      <div className="bg-card rounded-xl border shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="h-64 flex items-center justify-center">
             <div className="flex flex-col items-center gap-2">
                <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                <span className="text-xs text-muted-foreground">Loading dues...</span>
             </div>
          </div>
        ) : dues.length === 0 ? (
          <div className="h-64 flex flex-col items-center justify-center text-center p-4">
            <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-2">
                <CheckCircle className="w-6 h-6 text-muted-foreground" />
            </div>
            <p className="font-medium">No dues found</p>
            <p className="text-sm text-muted-foreground">Great job! All payments are clear.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-muted/50 border-b">
                <tr>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">Customer</th>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">Amount Due</th>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">Status</th>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">Due Date</th>
                  <th className="px-4 py-3 text-right font-medium text-muted-foreground">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                <AnimatePresence>
                {dues.map((due) => (
                  <motion.tr 
                    key={due._id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="group hover:bg-muted/30 transition-colors"
                  >
                    <td className="px-4 py-3">
                      <div className="flex flex-col">
                        <span className="font-semibold text-foreground">{due.customer?.name || "Unknown"}</span>
                        <a href={`tel:${due.customer?.phoneNumber}`} className="text-xs text-muted-foreground hover:text-primary flex items-center gap-1 mt-0.5">
                           <Phone className="w-3 h-3" /> {due.customer?.phoneNumber || "N/A"}
                        </a>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-col">
                         <span className="font-bold text-red-600">₹{due.dueAmount.toLocaleString()}</span>
                         <span className="text-[10px] text-muted-foreground">of ₹{due.amount.toLocaleString()}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      {getStatusBadge(due)}
                    </td>
                    <td className="px-4 py-3">
                       <div className="flex items-center gap-2">
                          {due.dueDate ? (
                             <>
                                <span className={`text-xs ${isOverdue(due.dueDate) ? "text-red-600 font-medium" : "text-foreground"}`}>
                                   {new Date(due.dueDate).toLocaleDateString()}
                                </span>
                                {isOverdue(due.dueDate) && (
                                   <span className="text-[10px] px-1.5 py-0.5 rounded bg-red-100 text-red-700 font-bold">OVERDUE</span>
                                )}
                             </>
                          ) : (
                             <span className="text-xs text-muted-foreground">-</span>
                          )}
                       </div>
                    </td>
                    <td className="px-4 py-3 text-right">
                       <Button 
                          size="sm" 
                          variant="default" 
                          onClick={() => setSelectedDue(due)}
                          className="h-8 px-3 shadow-sm bg-indigo-600 hover:bg-indigo-700 text-white"
                       >
                          <CreditCard className="w-3.5 h-3.5 mr-1.5" />
                          Pay Now
                       </Button>
                    </td>
                  </motion.tr>
                ))}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Pagination */}
      {!isLoading && totalPages > 1 && (
        <div className="flex items-center justify-end gap-2">
          <Button variant="outline" size="sm" onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}>
            Previous
          </Button>
          <span className="text-sm font-medium">Page {page} of {totalPages}</span>
          <Button variant="outline" size="sm" onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}>
            Next
          </Button>
        </div>
      )}

      {/* Reuse the Modal */}
      {selectedDue && (
        <SaleDetailModal
          sale={selectedDue as any} // Cast safely as types align
          isOpen={!!selectedDue}
          onClose={() => setSelectedDue(null)}
          onUpdatePayment={handleCollectPayment}
          isUpdating={isUpdating}
        />
      )}
    </div>
  );
};

export default DuesManagement;