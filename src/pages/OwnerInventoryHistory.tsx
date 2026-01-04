import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Search, Filter, ArrowDownCircle, ArrowUpCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import DesktopSidebar from "@/components/layout/DesktopSidebar";
import MobileBottomNav from "@/components/layout/MobileBottomNav";
import { inventoryLog, type InventoryEntry } from "@/data/mockData";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const ITEMS_PER_PAGE = 10;

// Generate more mock data for pagination demo
const allInventory: InventoryEntry[] = [
  ...inventoryLog,
  { id: '5', description: 'Staff Salary - January', amount: 25000, date: '2024-01-05', type: 'expense' },
  { id: '6', description: 'Kurta Collection from Lucknow', amount: 45000, date: '2024-01-03', type: 'purchase' },
  { id: '7', description: 'Electricity Bill', amount: 3500, date: '2024-01-01', type: 'expense' },
  { id: '8', description: 'Lehenga Set from Mumbai', amount: 80000, date: '2023-12-28', type: 'purchase' },
  { id: '9', description: 'Shop Decoration', amount: 8000, date: '2023-12-25', type: 'expense' },
  { id: '10', description: 'Winter Collection from Delhi', amount: 55000, date: '2023-12-20', type: 'purchase' },
];

const OwnerInventoryHistory = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);

  const filteredInventory = useMemo(() => {
    let filtered = allInventory;

    if (typeFilter !== "all") {
      filtered = filtered.filter(entry => entry.type === typeFilter);
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(entry =>
        entry.description.toLowerCase().includes(query)
      );
    }

    return filtered;
  }, [searchQuery, typeFilter]);

  const totalPages = Math.ceil(filteredInventory.length / ITEMS_PER_PAGE);
  const paginatedInventory = filteredInventory.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const totalPurchases = filteredInventory
    .filter(e => e.type === 'purchase')
    .reduce((sum, e) => sum + e.amount, 0);
  const totalExpenses = filteredInventory
    .filter(e => e.type === 'expense')
    .reduce((sum, e) => sum + e.amount, 0);

  return (
    <div className="min-h-screen bg-secondary">
      <DesktopSidebar role="owner" />

      {/* Mobile Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="lg:hidden sticky top-0 z-30 glass px-4 py-4"
      >
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/owner')}
            className="p-2 rounded-full hover:bg-muted transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="font-display text-xl font-bold">Inventory History</h1>
            <p className="text-sm text-muted-foreground">Purchases & Expenses</p>
          </div>
        </div>
      </motion.header>

      <main className="lg:ml-64 p-4 lg:p-8 pb-24 lg:pb-8">
        {/* Desktop Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="hidden lg:flex lg:items-center lg:justify-between mb-8"
        >
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/owner')}
              className="p-2 rounded-full hover:bg-muted transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="font-display text-3xl font-bold text-foreground">Inventory History</h1>
              <p className="text-muted-foreground mt-1">Track all purchases and expenses</p>
            </div>
          </div>
          <div className="flex gap-6 text-right">
            <div>
              <p className="text-sm text-muted-foreground">Purchases</p>
              <p className="text-xl font-bold text-primary">₹{totalPurchases.toLocaleString('en-IN')}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Expenses</p>
              <p className="text-xl font-bold text-destructive">₹{totalExpenses.toLocaleString('en-IN')}</p>
            </div>
          </div>
        </motion.div>

        {/* Mobile Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="lg:hidden grid grid-cols-2 gap-4 mb-6"
        >
          <div className="bg-card p-4 rounded-xl border border-border">
            <p className="text-xs text-muted-foreground">Purchases</p>
            <p className="text-lg font-bold text-primary">₹{totalPurchases.toLocaleString('en-IN')}</p>
          </div>
          <div className="bg-card p-4 rounded-xl border border-border">
            <p className="text-xs text-muted-foreground">Expenses</p>
            <p className="text-lg font-bold text-destructive">₹{totalExpenses.toLocaleString('en-IN')}</p>
          </div>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex flex-col sm:flex-row gap-4 mb-6"
        >
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search entries..."
              value={searchQuery}
              onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
              className="pl-12 h-12 rounded-xl"
            />
          </div>
          <Select value={typeFilter} onValueChange={(v) => { setTypeFilter(v); setCurrentPage(1); }}>
            <SelectTrigger className="w-full sm:w-[180px] h-12 rounded-xl">
              <Filter className="w-4 h-4 mr-2" />
              <SelectValue placeholder="Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="purchase">Purchases (Income)</SelectItem>
              <SelectItem value="expense">Expenses</SelectItem>
            </SelectContent>
          </Select>
        </motion.div>

        {/* Inventory Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-card rounded-2xl shadow-soft border border-border overflow-hidden"
        >
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted/50">
                <tr>
                  <th className="text-left p-4 font-medium text-muted-foreground">Type</th>
                  <th className="text-left p-4 font-medium text-muted-foreground">Description</th>
                  <th className="text-left p-4 font-medium text-muted-foreground hidden sm:table-cell">Date</th>
                  <th className="text-right p-4 font-medium text-muted-foreground">Amount</th>
                </tr>
              </thead>
              <tbody>
                {paginatedInventory.map((entry, index) => (
                  <motion.tr
                    key={entry.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="border-t border-border hover:bg-muted/30 transition-colors"
                  >
                    <td className="p-4">
                      <div className={`inline-flex items-center gap-2 px-2 py-1 rounded-full text-xs font-medium ${
                        entry.type === 'purchase' 
                          ? 'bg-primary/10 text-primary' 
                          : 'bg-destructive/10 text-destructive'
                      }`}>
                        {entry.type === 'purchase' ? (
                          <ArrowDownCircle className="w-3 h-3" />
                        ) : (
                          <ArrowUpCircle className="w-3 h-3" />
                        )}
                        {entry.type === 'purchase' ? 'Purchase' : 'Expense'}
                      </div>
                    </td>
                    <td className="p-4">
                      <p className="font-medium">{entry.description}</p>
                      <p className="text-xs text-muted-foreground sm:hidden">
                        {new Date(entry.date).toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </p>
                    </td>
                    <td className="p-4 text-muted-foreground hidden sm:table-cell">
                      {new Date(entry.date).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </td>
                    <td className="p-4 text-right font-semibold">
                      ₹{entry.amount.toLocaleString('en-IN')}
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between p-4 border-t border-border">
              <p className="text-sm text-muted-foreground">
                Showing {((currentPage - 1) * ITEMS_PER_PAGE) + 1} to {Math.min(currentPage * ITEMS_PER_PAGE, filteredInventory.length)} of {filteredInventory.length}
              </p>
              <div className="flex gap-2">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                  <Button
                    key={page}
                    variant={page === currentPage ? "default" : "outline"}
                    size="sm"
                    onClick={() => setCurrentPage(page)}
                    className="w-9 h-9 rounded-lg"
                  >
                    {page}
                  </Button>
                ))}
              </div>
            </div>
          )}
        </motion.div>
      </main>

      <MobileBottomNav role="owner" />
    </div>
  );
};

export default OwnerInventoryHistory;