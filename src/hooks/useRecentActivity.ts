import { useState, useMemo, useEffect, useCallback } from "react";
import { api } from "@/lib/api";
import { toast } from "sonner";
// Ensure APITransaction type is imported. If you don't have it, use 'any' temporarily.
import { APITransaction } from "@/types/api";

export type SortOption = 'newest' | 'oldest' | 'high_amount' | 'low_amount';
export type FilterOption = 'all' | 'paid' | 'due';

export const useRecentActivity = () => {
  const [sales, setSales] = useState<APITransaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState<FilterOption>('all');
  const [sortOption, setSortOption] = useState<SortOption>('newest');
  
  // Modal State
  const [selectedSale, setSelectedSale] = useState<APITransaction | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);

  // ── 1. FETCHING
  const fetchSales = useCallback(async () => {
    // Only show loading spinner on initial load to avoid UI flickering during updates
    if (sales.length === 0) setIsLoading(true);
    
    try {
      const response = await api.get('/transactions/history?limit=50&type=SALE');
      
      // Safety check: Ensure we actually got an array
      if (response.data?.success && Array.isArray(response.data.data.transactions)) {
        setSales(response.data.data.transactions);
      } else {
        setSales([]); // Fallback to empty array on malformed response
      }
    } catch (error) {
      console.error("Failed to fetch activity:", error);
      // We don't toast error here to avoid annoying the user if it's just a background refresh
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Initial load
  useEffect(() => {
    fetchSales();
  }, [fetchSales]);

  // ── 2. FILTERING & SORTING (Schema Aligned) ────────────────────────
  const processedSales = useMemo(() => {
    if (!sales) return [];

    let result = [...sales];

    // Filter Logic using the correct 'paymentStatus' field
    if (activeFilter === 'paid') {
      result = result.filter(s => s.paymentStatus === 'PAID');
    } else if (activeFilter === 'due') {
      result = result.filter(s => s.paymentStatus === 'DUE');
    }

    // Sort Logic
    result.sort((a, b) => {
      const dateA = new Date(a.createdAt).getTime();
      const dateB = new Date(b.createdAt).getTime();
      
      // Handle missing amounts safely
      const amountA = a.amount || 0;
      const amountB = b.amount || 0;

      switch (sortOption) {
        case 'oldest': return dateA - dateB;
        case 'high_amount': return amountB - amountA;
        case 'low_amount': return amountA - amountB;
        case 'newest': default: return dateB - dateA;
      }
    });

    return result;
  }, [sales, activeFilter, sortOption]);

  // ── 3. PAYMENT UPDATE LOGIC ────────────────────────────────────────
  const updatePayment = async (amount: number, mode: "CASH" | "ONLINE") => {
    if (!selectedSale) return;
    
    setIsUpdating(true);
    try {
      const res = await api.post(`/dues/${selectedSale._id}/collect`, {
        amount: amount,
        paymentMode: mode
      });

      if (res.data.success) {
        toast.success(`Received ₹${amount} via ${mode}`);
        
        // 1. Close Modal immediately
        setSelectedSale(null);
        
        // 2. Refresh list to update UI (Move from Due -> Paid)
        await fetchSales();
      }
    } catch (error: any) {
      console.error("Payment failed", error);
      toast.error(error.response?.data?.message || "Payment processing failed");
    } finally {
      setIsUpdating(false);
    }
  };

  return {
    sales: processedSales,
    isLoading,
    activeFilter,
    setActiveFilter,
    sortOption,
    setSortOption,
    selectedSale,
    setSelectedSale,
    updatePayment,
    isUpdating,
    refresh: fetchSales // Exposed if you need to manually refresh elsewhere
  };
};