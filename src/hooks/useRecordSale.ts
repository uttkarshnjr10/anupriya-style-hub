import { useState, useEffect } from "react";
import { toast } from "sonner";
import { api } from "@/lib/api";

export interface Product {
  _id: string;
  name: string;
  price: number;
  stockStatus: string;
  images?: { url: string }[];
}

export type PaymentTab = "full" | "due";
export type PaymentMode = "CASH" | "ONLINE";

export const useRecordSale = (onSuccess?: () => void) => {
  // --- STATE ---
  // Product Search
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  
  // Submission
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Payment Logic
  const [paymentTab, setPaymentTab] = useState<PaymentTab>("full");
  const [paymentMode, setPaymentMode] = useState<PaymentMode>("CASH");
  
  // Due / Partial Logic
  const [partialAmount, setPartialAmount] = useState<string>("0");
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [dueDate, setDueDate] = useState("");

  // --- SEARCH EFFECT ---
  useEffect(() => {
    const searchProducts = async () => {
      if (query.length < 2) {
        setResults([]);
        return;
      }
      setIsSearching(true);
      try {
        // Assuming your backend has a search endpoint or filter
        const response = await api.get(`/products?search=${query}&limit=5`);
        // Filter only In-Stock items
        const available = response.data.data.products.filter((p: any) => p.stockStatus === 'IN_STOCK');
        setResults(available);
      } catch (error) {
        console.error("Search failed", error);
      } finally {
        setIsSearching(false);
      }
    };

    const debounce = setTimeout(searchProducts, 300);
    return () => clearTimeout(debounce);
  }, [query]);

  // --- CALCULATIONS ---
  const totalAmount = selectedProduct?.price || 0;
  const payingNow = parseFloat(partialAmount) || 0;
  const dueRemaining = Math.max(0, totalAmount - payingNow);

  // --- ACTIONS ---
  const handleProductSelect = (product: Product) => {
    setSelectedProduct(product);
    setQuery("");
    setResults([]);
    setPartialAmount("0"); // Reset partial amount
    setPaymentTab("full"); // Default to full pay
  };

  const clearSelection = () => {
    setSelectedProduct(null);
    setQuery("");
  };

  const submitSale = async () => {
    if (!selectedProduct) {
      toast.error("Please select a product first");
      return;
    }

    let payloadPaymentMethods = [];

    // SCENARIO A: Full Payment
    if (paymentTab === "full") {
      payloadPaymentMethods.push({
        type: paymentMode,
        amount: totalAmount
      });
    } 
    // SCENARIO B: Due / Split Payment
    else {
      if (payingNow > totalAmount) {
        toast.error("Paying amount cannot be greater than product price");
        return;
      }

      // Validation
      if (!customerName || !customerPhone || !dueDate) {
        toast.error("Customer Name, Phone, and Due Date are required.");
        return;
      }
      if (customerPhone.length !== 10) {
        toast.error("Phone number must be 10 digits");
        return;
      }

      // 1. Down Payment (if any)
      if (payingNow > 0) {
        payloadPaymentMethods.push({
          type: paymentMode,
          amount: payingNow
        });
      }

      // 2. Remaining Dues
      if (dueRemaining > 0) {
        payloadPaymentMethods.push({
          type: "DUES",
          amount: dueRemaining,
          duesDetails: {
            name: customerName,
            phoneNumber: customerPhone,
            dueDate: new Date(dueDate).toISOString()
          }
        });
      }
    }

    // API CALL
    setIsSubmitting(true);
    try {
      const response = await api.post("/transactions/sale", {
        productId: selectedProduct._id,
        salePrice: totalAmount,
        paymentMethods: payloadPaymentMethods
      });

      if (response.data.success) {
        toast.success("Sale recorded successfully!");
        // Reset Form
        setSelectedProduct(null);
        setPartialAmount("0");
        setCustomerName("");
        setCustomerPhone("");
        setDueDate("");
        setPaymentTab("full");
        
        if (onSuccess) onSuccess();
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to record sale");
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    // State
    query, setQuery,
    results,
    isSearching,
    selectedProduct,
    isSubmitting,
    paymentTab, setPaymentTab,
    paymentMode, setPaymentMode,
    partialAmount, setPartialAmount,
    customerName, setCustomerName,
    customerPhone, setCustomerPhone,
    dueDate, setDueDate,
    
    // Calculated Values
    totalAmount,
    payingNow,
    dueRemaining,

    // Actions
    handleProductSelect,
    clearSelection,
    submitSale
  };
};