import { motion, AnimatePresence } from "framer-motion";
import { Clock, ArrowUpDown } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

// Components
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import SaleDetailModal from "./SaleDetailModal";

// Logic Hook
import { useRecentActivity, FilterOption, SortOption } from "@/hooks/useRecentActivity";

const RecentActivity = () => {
  const {
    sales,
    isLoading,
    activeFilter,
    setActiveFilter,
    sortOption,
    setSortOption,
    selectedSale,
    setSelectedSale,
    updatePayment,
    isUpdating
  } = useRecentActivity();

  if (isLoading) {
    return (
       <div className="bg-card rounded-2xl p-6 shadow-soft border border-border h-[400px] flex items-center justify-center">
         <div className="animate-pulse text-muted-foreground">Loading activity...</div>
       </div>
    );
  }

  return (
    <div className="bg-card rounded-2xl p-6 shadow-soft border border-border h-full flex flex-col">
      {/* --- HEADER --- */}
      <div className="flex flex-col gap-4 mb-6">
        <h3 className="font-display text-xl font-semibold">Recent Activity</h3>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <Tabs defaultValue="all" value={activeFilter} onValueChange={(v) => setActiveFilter(v as FilterOption)} className="w-full sm:w-auto">
            <TabsList className="grid w-full sm:w-[240px] grid-cols-3">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="paid" className="data-[state=active]:text-green-600">Paid</TabsTrigger>
              <TabsTrigger value="due" className="data-[state=active]:text-red-600">Due</TabsTrigger>
            </TabsList>
          </Tabs>

          <Select value={sortOption} onValueChange={(v) => setSortOption(v as SortOption)}>
            <SelectTrigger className="w-full sm:w-[160px] h-9 text-xs">
              <div className="flex items-center gap-2">
                <ArrowUpDown className="w-3 h-3" />
                <SelectValue placeholder="Sort by" />
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Newest First</SelectItem>
              <SelectItem value="oldest">Oldest First</SelectItem>
              <SelectItem value="high_amount">Highest Amount</SelectItem>
              <SelectItem value="low_amount">Lowest Amount</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* --- LIST AREA --- */}
      <div className="flex-1 overflow-y-auto max-h-[500px] pr-1 scrollbar-thin scrollbar-thumb-muted">
        
        {!sales || sales.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-8 text-muted-foreground border border-dashed border-border rounded-xl bg-muted/20">
              <p className="text-sm">No activity found in this category.</p>
            </div>
        ) : (
          <AnimatePresence mode="popLayout">
            {sales.map((sale, index) => {
              // ----------------------------------------------------
              // FIX: UPDATED LOGIC FOR NEW BACKEND SCHEMA
              // ----------------------------------------------------
              const staffInitial = sale.staffId?.name?.charAt(0) || "S";
              
              // New schema uses 'dueAmount' directly, not 'paymentBreakdown.dues'
              const dueAmount = sale.dueAmount || 0; 
              const isDue = sale.paymentStatus === "DUE" || dueAmount > 0;
              
              let timeDisplay = "Recently";
              try {
                 timeDisplay = formatDistanceToNow(new Date(sale.createdAt), { addSuffix: true });
              } catch (e) { /* ignore */ }
  
              return (
                <motion.div
                  key={sale._id || index}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  onClick={() => setSelectedSale(sale)}
                  className={`
                    mb-3 relative flex items-center gap-4 p-3 rounded-xl transition-all border cursor-pointer group
                    ${isDue 
                      ? 'bg-red-50/50 border-red-100 hover:bg-red-50 hover:border-red-200 dark:bg-red-900/10 dark:border-red-900/20' 
                      : 'bg-card hover:bg-muted/50 border-transparent hover:border-border/50'}
                  `}
                >
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 shadow-sm text-white font-bold text-sm ${isDue ? 'bg-red-400' : 'gradient-royal'}`}>
                    {staffInitial}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-foreground truncate text-sm sm:text-base">
                        {sale.productSnapshot?.name || "Unknown Product"}
                      </p>
                      {/* Show Badge if DUE */}
                      {isDue && (
                        <Badge variant="destructive" className="h-5 px-1.5 text-[10px] uppercase tracking-wider">
                          Due: ₹{dueAmount}
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span>{sale.productSnapshot?.category || "General"}</span>
                      <span className="w-1 h-1 rounded-full bg-border" />
                      <span>{sale.staffId?.name || "Staff"}</span>
                    </div>
                  </div>
                  
                  <div className="text-right flex-shrink-0">
                    <p className={`font-semibold text-sm sm:text-base ${isDue ? 'text-red-600' : 'text-success'}`}>
                      ₹{sale.amount.toLocaleString('en-IN')}
                    </p>
                    <p className="text-xs text-muted-foreground flex items-center justify-end gap-1">
                      <Clock className="w-3 h-3" />
                      {timeDisplay.replace("about ", "")}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        )}
      </div>

      {/* --- MODAL --- */}
      {selectedSale && (
          <SaleDetailModal 
            sale={selectedSale}
            isOpen={!!selectedSale}
            onClose={() => setSelectedSale(null)}
            onUpdatePayment={updatePayment}
            isUpdating={isUpdating}
          />
      )}
    </div>
  );
};

export default RecentActivity;