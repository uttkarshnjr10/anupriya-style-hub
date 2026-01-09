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

interface RecentActivityProps {
  sales: any[]; 
}

const RecentActivity = ({ sales }: RecentActivityProps) => {
  // Use our custom hook to get all logic and state
  const {
    processedSales,
    activeFilter,
    setActiveFilter,
    sortOption,
    setSortOption,
    selectedSale,
    setSelectedSale,
    updatePayment,
    isUpdating
  } = useRecentActivity(sales);

  if (!sales || sales.length === 0) {
    return (
      <div className="p-8 text-center text-muted-foreground text-sm bg-muted/20 rounded-xl border border-dashed border-border">
        No recent sales recorded today.
      </div>
    );
  }

  return (
    <div className="bg-card rounded-2xl p-6 shadow-soft border border-border h-full flex flex-col">
      {/* --- HEADER: Title & Controls --- */}
      <div className="flex flex-col gap-4 mb-6">
        <h3 className="font-display text-xl font-semibold">Recent Activity</h3>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          {/* Tabs */}
          <Tabs defaultValue="all" value={activeFilter} onValueChange={(v) => setActiveFilter(v as FilterOption)} className="w-full sm:w-auto">
            <TabsList className="grid w-full sm:w-[240px] grid-cols-3">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="paid" className="data-[state=active]:text-green-600">Paid</TabsTrigger>
              <TabsTrigger value="due" className="data-[state=active]:text-red-600">Due</TabsTrigger>
            </TabsList>
          </Tabs>

          {/* Sort */}
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

      {/* --- LIST: Sales Items --- */}
      <div className="space-y-3 overflow-y-auto max-h-[500px] pr-1">
        <AnimatePresence mode="popLayout">
          {processedSales.map((sale, index) => {
            // Display Helpers
            const productName = sale.productSnapshot?.name || sale.productName || "Unknown";
            const staffName = sale.staffId?.name || sale.soldBy || "Unknown";
            const staffInitial = staffName.charAt(0);
            const amount = sale.amount || sale.price || 0;
            const isDue = sale.status === 'due';
            
            let timeDisplay = "Recently";
            try {
               const dateVal = sale.createdAt || (sale.time?.includes('ago') ? new Date() : sale.time); 
               if(dateVal) timeDisplay = formatDistanceToNow(new Date(dateVal), { addSuffix: true });
            } catch (e) { /* ignore */ }

            return (
              <motion.div
                key={sale._id || sale.id || index}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                onClick={() => setSelectedSale(sale)}
                className={`
                  relative flex items-center gap-4 p-3 rounded-xl transition-all border cursor-pointer group
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
                    <p className="font-medium text-foreground truncate text-sm sm:text-base">{productName}</p>
                    {activeFilter === 'all' && isDue && (
                      <Badge variant="destructive" className="h-5 px-1.5 text-[10px] uppercase tracking-wider">Due</Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span>{sale.category || "General"}</span>
                    <span className="w-1 h-1 rounded-full bg-border" />
                    <span>{staffName}</span>
                  </div>
                </div>
                
                <div className="text-right flex-shrink-0">
                  <p className={`font-semibold text-sm sm:text-base ${isDue ? 'text-red-600' : 'text-success'}`}>
                    ₹{amount.toLocaleString('en-IN')}
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
        
        {processedSales.length === 0 && (
          <div className="py-10 text-center text-muted-foreground text-sm">
            No sales found.
          </div>
        )}
      </div>

      {/* --- MODAL: Detached Component --- */}
      <SaleDetailModal 
        sale={selectedSale}
        isOpen={!!selectedSale}
        onClose={() => setSelectedSale(null)}
        onUpdatePayment={updatePayment}
        isUpdating={isUpdating}
      />
    </div>
  );
};

export default RecentActivity;