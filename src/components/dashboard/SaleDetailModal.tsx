import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { AlertCircle, CheckCircle2, IndianRupee } from "lucide-react";

interface SaleDetailModalProps {
  sale: any | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdatePayment: (amount: number) => Promise<void>;
  isUpdating: boolean;
}

const SaleDetailModal = ({ sale, isOpen, onClose, onUpdatePayment, isUpdating }: SaleDetailModalProps) => {
  const [paymentInput, setPaymentInput] = useState("");

  // Reset input when modal opens or sale changes
  useEffect(() => {
    if (sale && sale.dueAmount) {
      setPaymentInput(sale.dueAmount.toString());
    } else {
      setPaymentInput("");
    }
  }, [sale]);

  const handleUpdateClick = () => {
    const amount = parseFloat(paymentInput);
    if (!isNaN(amount) && amount > 0) {
      onUpdatePayment(amount);
    } else {
      alert("Please enter a valid positive amount");
    }
  };

  if (!sale) return null;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md bg-background/95 backdrop-blur-md">
        <DialogHeader>
          <DialogTitle>Sale Details</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Product Info */}
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 rounded-lg bg-muted flex items-center justify-center overflow-hidden">
              {sale.image ? (
                <img src={sale.image} alt="" className="w-full h-full object-cover" />
              ) : (
                <div className="text-2xl font-bold text-muted-foreground">
                  {sale.productName?.charAt(0) || "?"}
                </div>
              )}
            </div>
            <div>
              <h4 className="font-semibold text-lg">{sale.productName || "Unknown Product"}</h4>
              <div className="flex flex-wrap gap-2 text-sm text-muted-foreground mt-1">
                <span className="bg-secondary px-2 py-0.5 rounded text-xs text-secondary-foreground">
                  {sale.category || "General"}
                </span>
                <span>• Sold by {sale.soldBy || sale.staffId?.name || "Staff"}</span>
              </div>
              {sale.customerName && (
                <p className="text-xs text-muted-foreground mt-1">Customer: {sale.customerName}</p>
              )}
            </div>
          </div>

          <Separator />

          {/* Payment Status Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-muted-foreground">Payment Status</span>
              {sale.status === 'due' ? (
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
                <p className="font-semibold">₹{(sale.price || sale.amount || 0).toLocaleString()}</p>
              </div>
              <div className="text-center border-l border-border/50">
                <p className="text-xs text-muted-foreground mb-1">Paid</p>
                <p className="font-semibold text-green-600">₹{(sale.amountPaid || 0).toLocaleString()}</p>
              </div>
              <div className="text-center border-l border-border/50">
                <p className="text-xs text-muted-foreground mb-1">Due</p>
                <p className="font-semibold text-red-600">₹{(sale.dueAmount || 0).toLocaleString()}</p>
              </div>
            </div>

            {/* Pay Later Input (Only if Due) */}
            {sale.status === 'due' && (
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
                    onClick={handleUpdateClick}
                    disabled={isUpdating}
                    className="bg-primary text-primary-foreground"
                  >
                    {isUpdating ? "Updating..." : "Update"}
                  </Button>
                </div>
                <p className="text-[10px] text-muted-foreground mt-2">
                  * Entering full amount marks as Paid. Partial reduces due.
                </p>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SaleDetailModal;