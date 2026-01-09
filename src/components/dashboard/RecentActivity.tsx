import { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Clock, Filter, ArrowUpDown, IndianRupee, CheckCircle2, AlertCircle, X } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { SaleRecord } from "@/data/mockData"; // Ensure this import matches your path

// UI Components (Assumed to be in your components/ui folder)
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

interface RecentActivityProps {
  sales: any[]; // Using any[] to be safe, but ideally SaleRecord[]
}

type SortOption = 'newest' | 'oldest' | 'high_amount' | 'low_amount';
type FilterOption = 'all' | 'paid' | 'due';

const RecentActivity = ({ sales }: RecentActivityProps) => {
  // Local state to manage sales (so we can update UI instantly before backend refreshes)
  const [localSales, setLocalSales] = useState<any[]>([]);

  // Filter & Sort States
  const [activeFilter, setActiveFilter] = useState<FilterOption>('all');
  const [sortOption, setSortOption] = useState<SortOption>('newest');

  // Modal States
  const [selectedSale, setSelectedSale] = useState<any | null>(null);
  const [paymentInput, setPaymentInput] = useState<string>("");
  const [isUpdating, setIsUpdating] = useState(false);

  // Sync props to local state
  useEffect(() => {
    if (sales) setLocalSales(sales);
  }, [sales]);

  // --- LOGIC: Filter & Sort ---
  const processedSales = useMemo(() => {
    let result = [...localSales];

    // 1. Filter
    if (activeFilter === 'paid') {
      result = result.filter(s => s.status === 'paid' || (!s.status && s.price > 0)); // Fallback for old data
    } else if (activeFilter === 'due') {
      result = result.filter(s => s.status === 'due');
    }

    // 2. Sort
    result.sort((a, b) => {
      // Robust Date Parsing
      const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      const amountA = a.amount || a.price || 0;
      const amountB = b.amount || b.price || 0;

      switch (sortOption) {
        case 'oldest': return dateA - dateB;
        case 'high_amount': return amountB - amountA;
        case 'low_amount': return amountA - amountB;
        case 'newest': default: return dateB - dateA;
      }
    });

    return result;
  }, [localSales, activeFilter, sortOption]);

  // --- LOGIC: Handle Payment Update ---
  const handlePaymentUpdate = async () => {
    if (!selectedSale) return;

    const enteredAmount = parseFloat(paymentInput);
    const currentDue = selectedSale.dueAmount || selectedSale.price || 0;

    if (isNaN(enteredAmount) || enteredAmount <= 0) {
      alert("Please enter a valid amount");
      return;
    }

    setIsUpdating(true);

    // ------------------------------------------------------------------
    // BACKEND DEVELOPER NOTE:
    // ------------------------------------------------------------------
    // Here is where you call the API to update the payment.
    // Endpoint might look like: POST /api/sales/{selectedSale.id}/pay
    // Body: { amount: enteredAmount }
    // ------------------------------------------------------------------
    
    // Simulating API delay
    setTimeout(() => {
      // UI LOGIC (Optimistic Update)
      const updatedSales = localSales.map(sale => {
        if (sale.id === selectedSale.id || sale._id === selectedSale.id) {
          const newPaid = (sale.amountPaid || 0) + enteredAmount;
          const newDue = (sale.dueAmount || sale.price) - enteredAmount;
          
          // Logic: If Paid >= Total Price, mark as Paid. Else, keep as Due.
          const isFullyPaid = newDue <= 0;
          
          return {
            ...sale,
            amountPaid: newPaid,
            dueAmount: Math.max(0, newDue),
            status: isFullyPaid ? 'paid' : 'due'
          };
        }
        return sale;
      });

      setLocalSales(updatedSales);
      setIsUpdating(false);
      setSelectedSale(null); // Close modal
      setPaymentInput(""); // Reset input
    }, 800);
  };

  // Helper to open modal
  const openSaleDetails = (sale: any) => {
    setSelectedSale(sale);
    // Pre-fill input with remaining due amount for convenience
    setPaymentInput(sale.dueAmount ? sale.dueAmount.toString() : "0");
  };

  if (!localSales || localSales.length === 0) {
    return (
      <div className="p-8 text-center text-muted-foreground text-sm bg-muted/20 rounded-xl border border-dashed border-border">
        No recent sales recorded today.
      </div>
    );
  }

  return (
    <div className="bg-card rounded-2xl p-6 shadow-soft border border-border h-full flex flex-col">
      {/* --- HEADER SECTION --- */}
      <div className="flex flex-col gap-4 mb-6">
        <div className="flex items-center justify-between">
          <h3 className="font-display text-xl font-semibold">Recent Activity</h3>
        </div>

        {/* Controls: Tabs & Sort */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          
          {/* Tabs: All / Paid / Due */}
          <Tabs defaultValue="all" value={activeFilter} onValueChange={(v) => setActiveFilter(v as FilterOption)} className="w-full sm:w-auto">
            <TabsList className="grid w-full sm:w-[240px] grid-cols-3">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="paid" className="data-[state=active]:text-green-600">Paid</TabsTrigger>
              <TabsTrigger value="due" className="data-[state=active]:text-red-600">Due</TabsTrigger>
            </TabsList>
          </Tabs>

          {/* Sort Dropdown */}
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

      {/* --- LIST SECTION --- */}
      <div className="space-y-3 overflow-y-auto max-h-[500px] pr-1">
        <AnimatePresence mode="popLayout">
          {processedSales.map((sale, index) => {
            // Data Fallbacks
            const productName = sale.productSnapshot?.name || sale.productName || "Unknown Product";
            const category = sale.productSnapshot?.category || sale.category || "General";
            const amount = sale.amount || sale.price || 0;
            const staffName = sale.staffId?.name || sale.soldBy || "Unknown";
            const staffInitial = staffName.charAt(0);
            const isDue = sale.status === 'due';
            
            let timeDisplay = "Recently";
            try {
               // Handle both 'createdAt' (DB) and 'time' (Mock)
               const dateVal = sale.createdAt || (sale.time?.includes('ago') ? new Date() : sale.time); 
               if(dateVal) timeDisplay = formatDistanceToNow(new Date(dateVal), { addSuffix: true });
            } catch (e) { timeDisplay = sale.time || "Recently"; }

            return (
              <motion.div
                key={sale._id || sale.id || index}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                onClick={() => openSaleDetails(sale)}
                className={`
                  relative flex items-center gap-4 p-3 rounded-xl transition-all border cursor-pointer group
                  ${isDue 
                    ? 'bg-red-50/50 border-red-100 hover:bg-red-50 hover:border-red-200 dark:bg-red-900/10 dark:border-red-900/20' 
                    : 'bg-card hover:bg-muted/50 border-transparent hover:border-border/50'}
                `}
              >
                {/* Avatar */}
                <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 shadow-sm text-white font-bold text-sm ${isDue ? 'bg-red-400' : 'gradient-royal'}`}>
                  {staffInitial}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="font-medium text-foreground truncate text-sm sm:text-base">{productName}</p>
                    {/* Badge only shows in 'All' tab if item is due */}
                    {activeFilter === 'all' && isDue && (
                      <Badge variant="destructive" className="h-5 px-1.5 text-[10px] uppercase tracking-wider">Due</Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span>{category}</span>
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
            No sales found for this filter.
          </div>
        )}
      </div>

      {/* --- MODAL: PRODUCT DETAILS & PAYMENT --- */}
      <Dialog open={!!selectedSale} onOpenChange={(open) => !open && setSelectedSale(null)}>
        <DialogContent className="sm:max-w-md bg-background/95 backdrop-blur-md">
          <DialogHeader>
            <DialogTitle>Sale Details</DialogTitle>
          </DialogHeader>

          {selectedSale && (
            <div className="space-y-6">
              {/* Product Info */}
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 rounded-lg bg-muted flex items-center justify-center overflow-hidden">
                   {/* Fallback image logic */}
                   {selectedSale.image ? (
                     <img src={selectedSale.image} alt="" className="w-full h-full object-cover" />
                   ) : (
                     <div className="text-2xl font-bold text-muted-foreground">{selectedSale.productName?.charAt(0)}</div>
                   )}
                </div>
                <div>
                  <h4 className="font-semibold text-lg">{selectedSale.productName}</h4>
                  <div className="flex flex-wrap gap-2 text-sm text-muted-foreground mt-1">
                     <span className="bg-secondary px-2 py-0.5 rounded text-xs text-secondary-foreground">
                       {selectedSale.category || "General"}
                     </span>
                     <span>• Sold by {selectedSale.soldBy || selectedSale.staffId?.name}</span>
                  </div>
                  {selectedSale.customerName && (
                     <p className="text-xs text-muted-foreground mt-1">Customer: {selectedSale.customerName}</p>
                  )}
                </div>
              </div>

              <Separator />

              {/* Payment Status Section */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-muted-foreground">Payment Status</span>
                  {selectedSale.status === 'due' ? (
                    <Badge variant="destructive" className="flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" /> Payment Due
                    </Badge>
                  ) : (
                    <Badge variant="default" className="bg-green-600 hover:bg-green-700 flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" /> Fully Paid
                    </Badge>
                  )}
                </div>

                {/* Amount Breakdown */}
                <div className="grid grid-cols-3 gap-2 p-3 bg-muted/30 rounded-lg border border-border/50">
                  <div className="text-center">
                    <p className="text-xs text-muted-foreground mb-1">Total</p>
                    <p className="font-semibold">₹{(selectedSale.price || selectedSale.amount).toLocaleString()}</p>
                  </div>
                  <div className="text-center border-l border-border/50">
                    <p className="text-xs text-muted-foreground mb-1">Paid</p>
                    <p className="font-semibold text-green-600">₹{(selectedSale.amountPaid || 0).toLocaleString()}</p>
                  </div>
                  <div className="text-center border-l border-border/50">
                    <p className="text-xs text-muted-foreground mb-1">Due</p>
                    <p className="font-semibold text-red-600">₹{(selectedSale.dueAmount || 0).toLocaleString()}</p>
                  </div>
                </div>

                {/* PAY LATER SECTION (Only visible if Due) */}
                {selectedSale.status === 'due' && (
                  <div className="pt-2 animate-in fade-in slide-in-from-top-2">
                    <Label className="text-xs mb-2 block">Record Payment</Label>
                    <div className="flex gap-2">
                      <div className="relative flex-1">
                        <IndianRupee className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input 
                          type="number" 
                          placeholder="Enter amount"
                          className="pl-9"
                          value={paymentInput}
                          onChange={(e) => setPaymentInput(e.target.value)}
                        />
                      </div>
                      <Button 
                        onClick={handlePaymentUpdate} 
                        disabled={isUpdating}
                        className="bg-primary text-primary-foreground"
                      >
                        {isUpdating ? "Updating..." : "Update"}
                      </Button>
                    </div>
                    <p className="text-[10px] text-muted-foreground mt-2">
                      * Entering full amount will mark status as Paid. Partial amount will reduce the due balance.
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default RecentActivity;