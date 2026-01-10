import React, { useEffect } from "react";
import { User, Phone, Calendar, Banknote, CreditCard, Wallet, AlertCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// ── TYPES ─────────────────────────────
export interface PaymentState {
  status: "PAID" | "DUE";
  mode: "CASH" | "ONLINE";
  partialAmount: string;
  customerName: string;
  customerPhone: string;
  dueDate: string;
}

interface PaymentSectionProps {
  totalAmount: number;
  paymentState: PaymentState;
  onChange: (newState: PaymentState) => void;
}

// ── HELPER COMPONENTS (Internal to keep file self-contained) ──

// Styled Input Field
const StyledInput = ({ 
  icon: Icon, 
  className = "", 
  ...props 
}: React.InputHTMLAttributes<HTMLInputElement> & { icon?: any }) => (
  <div className="relative">
    {Icon && (
      <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground/50">
        <Icon className="w-4 h-4" />
      </div>
    )}
    <input
      className={`flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${Icon ? "pl-9" : ""} ${className}`}
      {...props}
    />
  </div>
);

// Selection Card (Radio-like)
const SelectionCard = ({ 
  selected, 
  onClick, 
  title, 
  icon: Icon 
}: { selected: boolean; onClick: () => void; title: string; icon?: any }) => (
  <div
    onClick={onClick}
    className={`cursor-pointer flex items-center justify-center gap-2 p-3 rounded-lg border text-sm font-medium transition-all duration-200 ${
      selected
        ? "border-primary bg-primary/10 text-primary shadow-sm"
        : "border-input bg-background hover:bg-muted/50 text-muted-foreground"
    }`}
  >
    {Icon && <Icon className="w-4 h-4" />}
    {title}
  </div>
);

// ── MAIN COMPONENT ─────────────────────────────

export const PaymentSection: React.FC<PaymentSectionProps> = ({
  totalAmount,
  paymentState,
  onChange,
}) => {
  // Helper to update state
  const update = (field: keyof PaymentState, value: any) => {
    onChange({ ...paymentState, [field]: value });
  };

  // Calculate remaining due for display
  const partial = parseFloat(paymentState.partialAmount) || 0;
  const remainingDue = Math.max(0, totalAmount - partial);
  const isPartialPayment = paymentState.status === "DUE" && partial > 0;

  return (
    <div className="space-y-6 p-5 rounded-xl border border-border bg-card/50 shadow-sm">
      
      {/* 1. STATUS SELECTION */}
      <div className="space-y-3">
        <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
          Payment Status
        </label>
        <div className="grid grid-cols-2 gap-3">
          <SelectionCard
            title="PAID (Full)"
            selected={paymentState.status === "PAID"}
            onClick={() => update("status", "PAID")}
            icon={Banknote}
          />
          <SelectionCard
            title="DUE (Credit)"
            selected={paymentState.status === "DUE"}
            onClick={() => update("status", "DUE")}
            icon={Wallet}
          />
        </div>
      </div>

      <AnimatePresence mode="wait">
        {/* 2. DUES LOGIC (Partial Payment) */}
        {paymentState.status === "DUE" && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-4 overflow-hidden"
          >
            <div className="space-y-2">
              <label className="text-sm font-medium">Amount Paid Now (₹)</label>
              <StyledInput
                type="number"
                placeholder="0"
                value={paymentState.partialAmount}
                onChange={(e) => update("partialAmount", e.target.value)}
                className="font-semibold"
              />
              <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                <AlertCircle className="w-3 h-3" />
                <span>Remaining Due: <span className="text-destructive font-bold">₹{remainingDue.toFixed(2)}</span></span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        {/* 3. PAYMENT MODE (Show if PAID or Partial > 0) */}
        {(paymentState.status === "PAID" || isPartialPayment) && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-3 overflow-hidden pt-2"
          >
             <label className="text-sm font-medium">Payment Mode</label>
             <div className="grid grid-cols-2 gap-3">
              <SelectionCard
                title="CASH"
                selected={paymentState.mode === "CASH"}
                onClick={() => update("mode", "CASH")}
                icon={Banknote}
              />
              <SelectionCard
                title="ONLINE"
                selected={paymentState.mode === "ONLINE"}
                onClick={() => update("mode", "ONLINE")}
                icon={CreditCard}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        {/* 4. CUSTOMER DETAILS (Required for DUE) */}
        {paymentState.status === "DUE" && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-4 pt-4 border-t border-border mt-2 overflow-hidden"
          >
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Customer Details</span>
              <span className="text-[10px] bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full font-bold uppercase">
                Required
              </span>
            </div>

            <div className="grid gap-3">
              <StyledInput
                placeholder="Customer Name"
                icon={User}
                value={paymentState.customerName}
                onChange={(e) => update("customerName", e.target.value)}
              />
              
              <StyledInput
                placeholder="Phone Number (10 digits)"
                icon={Phone}
                type="tel"
                maxLength={10}
                value={paymentState.customerPhone}
                onChange={(e) => {
                  const val = e.target.value.replace(/\D/g, '').slice(0, 10);
                  update("customerPhone", val);
                }}
              />

              <div className="grid gap-1.5">
                 <label className="text-xs text-muted-foreground ml-1">Due Date (Optional)</label>
                 <StyledInput
                  type="date"
                  icon={Calendar}
                  min={new Date().toISOString().split('T')[0]}
                  value={paymentState.dueDate}
                  onChange={(e) => update("dueDate", e.target.value)}
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};