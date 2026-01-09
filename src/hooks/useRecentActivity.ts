import { useState, useMemo, useEffect } from "react";

// Types
export type SortOption = 'newest' | 'oldest' | 'high_amount' | 'low_amount';
export type FilterOption = 'all' | 'paid' | 'due';

export const useRecentActivity = (initialSales: any[]) => {
  // 1. Data State (Local copy for optimistic updates)
  const [localSales, setLocalSales] = useState<any[]>([]);

  // 2. Filter & Sort State
  const [activeFilter, setActiveFilter] = useState<FilterOption>('all');
  const [sortOption, setSortOption] = useState<SortOption>('newest');

  // 3. Selection & Modal State
  const [selectedSale, setSelectedSale] = useState<any | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);

  // Sync props to local state when they change
  useEffect(() => {
    if (initialSales) setLocalSales(initialSales);
  }, [initialSales]);

  // --- LOGIC: Filter & Sort ---
  const processedSales = useMemo(() => {
    let result = [...localSales];

    // Filter
    if (activeFilter === 'paid') {
      result = result.filter(s => s.status === 'paid' || (!s.status && (s.price > 0 || s.amount > 0)));
    } else if (activeFilter === 'due') {
      result = result.filter(s => s.status === 'due');
    }

    // Sort
    result.sort((a, b) => {
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

  // --- LOGIC: Update Payment ---
  const updatePayment = async (amount: number) => {
    if (!selectedSale) return;
    setIsUpdating(true);

    // ------------------------------------------------------------------
    // TODO: BACKEND INTEGRATION
    // Call your API here: await api.post(`/transactions/${selectedSale.id}/pay`, { amount });
    // ------------------------------------------------------------------

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));

    // Optimistic UI Update
    const updatedSales = localSales.map(sale => {
      // Check both ID types (MongoDB _id or string id)
      if (sale.id === selectedSale.id || sale._id === selectedSale.id) {
        const newPaid = (sale.amountPaid || 0) + amount;
        const currentTotal = sale.price || sale.amount || 0;
        // Recalculate due. Note: using currentTotal instead of old due ensures accuracy
        const newDue = Math.max(0, currentTotal - newPaid);
        const isFullyPaid = newDue <= 0;

        return {
          ...sale,
          amountPaid: newPaid,
          dueAmount: newDue,
          status: isFullyPaid ? 'paid' : 'due'
        };
      }
      return sale;
    });

    setLocalSales(updatedSales);
    setIsUpdating(false);
    setSelectedSale(null); // Close modal
  };

  return {
    // Data
    processedSales,
    // Filter Controls
    activeFilter,
    setActiveFilter,
    sortOption,
    setSortOption,
    // Modal Controls
    selectedSale,
    setSelectedSale,
    // Actions
    updatePayment,
    isUpdating
  };
};