import { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Calendar, User, Filter } from "lucide-react"; 
import { useNavigate } from "react-router-dom";
import DesktopSidebar from "@/components/layout/DesktopSidebar";
import MobileBottomNav from "@/components/layout/MobileBottomNav";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { api, Transaction, PaginationData } from "@/lib/api";
import { formatDistanceToNow } from "date-fns";

const OwnerSalesHistory = () => {
  const navigate = useNavigate();
  
  // State
  const [dateFilter, setDateFilter] = useState<string>("today"); // Default: Today
  const [currentPage, setCurrentPage] = useState(1);
  const [staffFilter, setStaffFilter] = useState<string>("all");
  
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [pagination, setPagination] = useState<PaginationData | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch Data
  useEffect(() => {
    const fetchHistory = async () => {
      setIsLoading(true);
      try {
        // Fetch a larger limit (50) so client-side staff filtering feels responsive
        const response = await api.get('/transactions/history', {
          params: {
            page: currentPage,
            limit: 50, 
            filter: dateFilter, 
            type: 'SALE'
          }
        });

        if (response.data.success) {
          setTransactions(response.data.data.transactions);
          setPagination(response.data.data.pagination);
        }
      } catch (error) {
        console.error("Failed to fetch history", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchHistory();
  }, [currentPage, dateFilter]);

  // Create Unique Staff List for Filter
  const uniqueStaff = useMemo(() => {
    const staffNames = new Set(transactions.map(t => t.staffId?.name).filter(Boolean));
    return Array.from(staffNames);
  }, [transactions]);

  // Apply Client-Side Filter
  const displayedTransactions = useMemo(() => {
    if (staffFilter === "all") return transactions;
    return transactions.filter(t => t.staffId?.name === staffFilter);
  }, [transactions, staffFilter]);

  const totalRevenue = displayedTransactions.reduce((acc, t) => acc + t.amount, 0);

  return (
    <div className="min-h-screen bg-secondary">
      <DesktopSidebar role="owner" />
      
      {/* Mobile Header (Sticky & Glassmorphism) */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="lg:hidden sticky top-0 z-30 glass px-4 py-4 flex items-center gap-4 border-b border-border/40"
      >
        <button 
          onClick={() => navigate('/owner')} 
          className="p-2 rounded-full hover:bg-muted/80 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-foreground" />
        </button>
        <div>
          <h1 className="font-display text-lg font-bold text-foreground">Sales History</h1>
          <p className="text-xs text-muted-foreground">
            {dateFilter === 'today' ? "Today's Sales" : "All Records"}
          </p>
        </div>
      </motion.header>

      <main className="lg:ml-64 p-4 lg:p-8 pb-24 lg:pb-8">
        {/* Desktop Header */}
        <motion.div className="hidden lg:flex lg:items-center lg:justify-between mb-8">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => navigate('/owner')} 
              className="p-2 rounded-full hover:bg-muted transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="font-display text-3xl font-bold text-foreground">Sales History</h1>
              <p className="text-muted-foreground mt-1">
                Viewing {dateFilter === 'today' ? "Today's" : dateFilter} records
              </p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm text-muted-foreground">Revenue (Filtered)</p>
            <p className="text-2xl font-bold text-success">
              {isLoading ? "..." : `₹${totalRevenue.toLocaleString('en-IN')}`}
            </p>
          </div>
        </motion.div>

        {/* Filters Row - Stacks on Mobile, Row on Desktop */}
        <motion.div className="flex flex-col sm:flex-row gap-3 mb-6">
          {/* Backend Date Filter */}
          <Select value={dateFilter} onValueChange={(v) => { setDateFilter(v); setCurrentPage(1); }}>
            <SelectTrigger className="w-full sm:w-[200px] h-11 rounded-xl bg-card border-border shadow-sm">
              <Calendar className="w-4 h-4 mr-2 text-muted-foreground" />
              <SelectValue placeholder="Select Period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="today">Today</SelectItem>
              <SelectItem value="week">This Week</SelectItem>
              <SelectItem value="month">This Month</SelectItem>
              <SelectItem value="all">All Time</SelectItem>
            </SelectContent>
          </Select>

          {/* Client-Side Staff Filter */}
          <Select value={staffFilter} onValueChange={setStaffFilter}>
            <SelectTrigger className="w-full sm:w-[200px] h-11 rounded-xl bg-card border-border shadow-sm">
              <User className="w-4 h-4 mr-2 text-muted-foreground" />
              <SelectValue placeholder="Filter by Staff" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Staff</SelectItem>
              {uniqueStaff.map((name) => (
                <SelectItem key={name as string} value={name as string}>
                  {name as string}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </motion.div>

        {/* Table Card */}
        <motion.div className="bg-card rounded-2xl shadow-soft border border-border overflow-hidden min-h-[400px]">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted/50 border-b border-border">
                <tr>
                  <th className="text-left p-4 font-medium text-muted-foreground whitespace-nowrap">Product</th>
                  <th className="text-left p-4 font-medium text-muted-foreground whitespace-nowrap">Category</th>
                  <th className="text-left p-4 font-medium text-muted-foreground hidden sm:table-cell whitespace-nowrap">Sold By</th>
                  <th className="text-left p-4 font-medium text-muted-foreground hidden md:table-cell whitespace-nowrap">Time</th>
                  <th className="text-right p-4 font-medium text-muted-foreground whitespace-nowrap">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {isLoading ? (
                  <tr><td colSpan={5} className="p-8 text-center text-muted-foreground">Loading transactions...</td></tr>
                ) : displayedTransactions.length === 0 ? (
                  <tr><td colSpan={5} className="p-8 text-center text-muted-foreground">No sales found for this period.</td></tr>
                ) : (
                  displayedTransactions.map((sale, index) => (
                    <motion.tr
                      key={sale._id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: index * 0.05 }}
                      className="hover:bg-muted/30 transition-colors"
                    >
                      <td className="p-4">
                        <p className="font-medium text-foreground">{sale.productSnapshot?.name || "Unknown Item"}</p>
                        {/* Mobile Only: Show Staff Name & Date here since columns are hidden */}
                        <div className="flex flex-col gap-0.5 mt-1 sm:hidden">
                          <p className="text-xs text-muted-foreground flex items-center gap-1">
                             <User className="w-3 h-3" /> {sale.staffId?.name || "N/A"}
                          </p>
                          <p className="text-xs text-muted-foreground">
                             {formatDistanceToNow(new Date(sale.createdAt))} ago
                          </p>
                        </div>
                      </td>
                      <td className="p-4 align-top">
                        <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${
                           sale.productSnapshot?.category === 'Men' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300' :
                           sale.productSnapshot?.category === 'Women' ? 'bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-300' :
                           'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300'
                        }`}>
                          {sale.productSnapshot?.category || "General"}
                        </span>
                      </td>
                      <td className="p-4 text-muted-foreground hidden sm:table-cell align-top">
                        {sale.staffId?.name || "Unknown Staff"}
                      </td>
                      <td className="p-4 text-muted-foreground hidden md:table-cell align-top">
                        {formatDistanceToNow(new Date(sale.createdAt), { addSuffix: true })}
                      </td>
                      <td className="p-4 text-right font-semibold text-success align-top whitespace-nowrap">
                        ₹{sale.amount.toLocaleString('en-IN')}
                      </td>
                    </motion.tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          
           {/* Pagination */}
          {pagination && pagination.totalPages > 1 && (
            <div className="flex items-center justify-between p-4 border-t border-border bg-muted/20">
              <p className="text-sm text-muted-foreground">
                Page {pagination.page} of {pagination.totalPages}
              </p>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={pagination.page === 1}
                  className="h-8"
                >
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(p => p + 1)}
                  disabled={pagination.page >= pagination.totalPages}
                  className="h-8"
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </motion.div>
      </main>
      <MobileBottomNav role="owner" />
    </div>
  );
};

export default OwnerSalesHistory;