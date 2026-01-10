import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { AlertCircle, CheckCircle2, IndianRupee, User, Phone, Calendar, Banknote, CreditCard } from "lucide-react";

// Use 'any' temporarily to bypass strict type errors during migration
// In production, update this to your actual interface
interface SaleDetailModalProps {
  sale: any | null; 
  isOpen: boolean;
  onClose: () => void;
  // Updated signature to support Partial Payments + Mode
  onUpdatePayment: (amount: number, mode: "CASH" | "ONLINE") => Promise<void>;
  isUpdating: boolean;
}

const SaleDetailModal = ({ sale, isOpen, onClose, onUpdatePayment, isUpdating }: SaleDetailModalProps) => {
  const [payAmount, setPayAmount] = useState("");
  const [payMode, setPayMode] = useState<"CASH" | "ONLINE">("ONLINE");

  // Reset form when modal opens or sale changes
  useEffect(() => {
    if (sale && sale.paymentStatus === "DUE") {
      setPayAmount(sale.dueAmount.toString()); // Default to paying full due
    } else {
      setPayAmount("");
    }
    setPayMode("ONLINE");
  }, [sale]);

  const handleUpdateClick = () => {
    const amount = parseFloat(payAmount);
    if (!isNaN(amount) && amount > 0) {
      onUpdatePayment(amount, payMode);
    }
  };

  if (!sale) return null;

  // ── DERIVED VALUES (New Schema Compatible) ──
  const isDue = sale.paymentStatus === "DUE" || sale.dueAmount > 0;
  const customer = sale.customer || {}; 
  const paidAmount = sale.amountPaid || 0;
  const dueAmount = sale.dueAmount || 0;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md bg-card border-border shadow-lg">
        <DialogHeader>
          <DialogTitle>Sale Details</DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground">
             Transaction ID: {sale._id?.slice(-6).toUpperCase()}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* 1. PRODUCT INFO */}
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 rounded-lg bg-muted flex items-center justify-center overflow-hidden border border-border">
              {sale.productSnapshot?.url ? (
                <img src={sale.productSnapshot.url} alt="" className="w-full h-full object-cover" />
              ) : (
                <div className="text-2xl font-bold text-muted-foreground">
                  {sale.productSnapshot?.name?.charAt(0) || "P"}
                </div>
              )}
            </div>
            <div>
              <h4 className="font-semibold text-lg leading-tight">{sale.productSnapshot?.name || "Unknown Product"}</h4>
              <div className="flex flex-wrap gap-2 text-xs text-muted-foreground mt-1.5">
                <span className="bg-secondary px-1.5 py-0.5 rounded text-secondary-foreground font-medium">
                  {sale.productSnapshot?.category || "General"}
                </span>
                <span>• Sold by {sale.staffId?.name}</span>
              </div>
            </div>
          </div>

          <Separator />

          {/* 2. CUSTOMER SECTION (Only if Dues exist) */}
          {isDue && (
            <div className="bg-amber-50 dark:bg-amber-950/20 p-3 rounded-lg border border-amber-200 dark:border-amber-900/50 space-y-2">
               <div className="flex items-center justify-between">
                 <div className="flex items-center gap-2 text-sm font-medium text-amber-900 dark:text-amber-100">
                    <User className="w-4 h-4" />
                    <span>{customer.name || "Unknown Customer"}</span>
                 </div>
                 {sale.dueDate && (
                    <div className="flex items-center gap-1 text-[10px] text-red-600 font-semibold bg-white dark:bg-black/20 px-2 py-1 rounded-full border border-red-100">
                        <Calendar className="w-3 h-3" />
                        Due: {new Date(sale.dueDate).toLocaleDateString()}
                    </div>
                 )}
               </div>
               
               {customer.phoneNumber && (
                 <div className="flex items-center gap-2 text-xs text-amber-700 dark:text-amber-400 pl-6">
                    <Phone className="w-3 h-3" />
                    <span>{customer.phoneNumber}</span>
                 </div>
               )}
            </div>
          )}

          {/* 3. FINANCIAL SUMMARY */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-muted-foreground">Payment Status</span>
              {isDue ? (
                <Badge variant="destructive" className="flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" /> Payment Due
                </Badge>
              ) : (
                <Badge className="bg-green-600 hover:bg-green-700 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> Fully Paid
                </Badge>
              )}
            </div>

            <div className="grid grid-cols-3 gap-2 p-3 bg-muted/30 rounded-lg border border-border/50">
              <div className="text-center">
                <p className="text-[10px] uppercase text-muted-foreground mb-1">Total Sale</p>
                <p className="font-semibold text-sm">₹{sale.amount.toLocaleString()}</p>
              </div>
              <div className="text-center border-l border-border/50">
                <p className="text-[10px] uppercase text-muted-foreground mb-1">Paid Amount</p>
                <p className="font-semibold text-sm text-green-600">
                  ₹{paidAmount.toLocaleString()}
                </p>
              </div>
              <div className="text-center border-l border-border/50">
                <p className="text-[10px] uppercase text-muted-foreground mb-1">Balance Due</p>
                <p className="font-semibold text-sm text-red-600">₹{dueAmount.toLocaleString()}</p>
              </div>
            </div>

            {/* 4. COLLECT PAYMENT SECTION */}
            {isDue && (
              <div className="pt-2 animate-in fade-in slide-in-from-top-2 space-y-3">
                <div className="flex items-center justify-between">
                    <Label className="text-xs font-semibold">Collect Payment</Label>
                    <span className="text-[10px] text-muted-foreground">
                        Remaining: ₹{(dueAmount - (parseFloat(payAmount) || 0)).toFixed(2)}
                    </span>
                </div>
                
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <IndianRupee className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input 
                      type="number" 
                      placeholder="Amount"
                      className="pl-9"
                      value={payAmount}
                      onChange={(e) => setPayAmount(e.target.value)}
                      max={dueAmount}
                    />
                  </div>
                  
                  {/* Mode Toggle */}
                  <div className="flex bg-muted rounded-md p-1 border border-input">
                      <button
                        onClick={() => setPayMode("CASH")}
                        className={`px-3 rounded-sm flex items-center justify-center transition-all ${payMode === 'CASH' ? 'bg-background shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
                        title="Cash"
                      >
                         <Banknote className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setPayMode("ONLINE")}
                        className={`px-3 rounded-sm flex items-center justify-center transition-all ${payMode === 'ONLINE' ? 'bg-background shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
                        title="Online"
                      >
                         <CreditCard className="w-4 h-4" />
                      </button>
                  </div>

                  <Button 
                    onClick={handleUpdateClick} 
                    disabled={isUpdating || !payAmount || parseFloat(payAmount) <= 0}
                    className="bg-primary text-primary-foreground min-w-[80px]"
                  >
                    {isUpdating ? "..." : "Pay"}
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SaleDetailModal;