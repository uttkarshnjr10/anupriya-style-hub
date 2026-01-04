import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Search, Filter } from "lucide-react";
import { useNavigate } from "react-router-dom";
import DesktopSidebar from "@/components/layout/DesktopSidebar";
import MobileBottomNav from "@/components/layout/MobileBottomNav";
import { recentSales, type SaleRecord } from "@/data/mockData";
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
const allSales: SaleRecord[] = [
  ...recentSales,
  { id: '6', productName: 'Silk Kurta Set', price: 4299, category: 'Men', subCategory: 'Silk Kurta', time: '4 hours ago', soldBy: 'Priya' },
  { id: '7', productName: 'Chikankari Kurti', price: 2199, category: 'Women', subCategory: 'Chikankari Kurti', time: '5 hours ago', soldBy: 'Rahul' },
  { id: '8', productName: 'Kids Ethnic Set', price: 1899, category: 'Kids', subCategory: 'Ethnic Kurta', time: '6 hours ago', soldBy: 'Priya' },
  { id: '9', productName: 'Formal Trousers', price: 1899, category: 'Men', subCategory: 'Formal Trousers', time: 'Yesterday', soldBy: 'Rahul' },
  { id: '10', productName: 'Georgette Saree', price: 6499, category: 'Women', subCategory: 'Georgette Saree', time: 'Yesterday', soldBy: 'Priya' },
  { id: '11', productName: 'Cotton Shirt', price: 1299, category: 'Men', subCategory: 'Cotton Shirt', time: 'Yesterday', soldBy: 'Rahul' },
  { id: '12', productName: 'Party Lehenga', price: 8999, category: 'Women', subCategory: 'Party Lehenga', time: '2 days ago', soldBy: 'Priya' },
];

const OwnerSalesHistory = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);

  const filteredSales = useMemo(() => {
    let filtered = allSales;

    if (categoryFilter !== "all") {
      filtered = filtered.filter(sale => sale.category === categoryFilter);
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(sale =>
        sale.productName.toLowerCase().includes(query) ||
        sale.category.toLowerCase().includes(query) ||
        sale.soldBy.toLowerCase().includes(query)
      );
    }

    return filtered;
  }, [searchQuery, categoryFilter]);

  const totalPages = Math.ceil(filteredSales.length / ITEMS_PER_PAGE);
  const paginatedSales = filteredSales.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const totalRevenue = filteredSales.reduce((sum, sale) => sum + sale.price, 0);

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
            <h1 className="font-display text-xl font-bold">Sales History</h1>
            <p className="text-sm text-muted-foreground">All recorded sales</p>
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
              <h1 className="font-display text-3xl font-bold text-foreground">Sales History</h1>
              <p className="text-muted-foreground mt-1">View and search all recorded sales</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm text-muted-foreground">Total Revenue (filtered)</p>
            <p className="text-2xl font-bold text-success">₹{totalRevenue.toLocaleString('en-IN')}</p>
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
              placeholder="Search sales..."
              value={searchQuery}
              onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
              className="pl-12 h-12 rounded-xl"
            />
          </div>
          <Select value={categoryFilter} onValueChange={(v) => { setCategoryFilter(v); setCurrentPage(1); }}>
            <SelectTrigger className="w-full sm:w-[180px] h-12 rounded-xl">
              <Filter className="w-4 h-4 mr-2" />
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="Men">Men</SelectItem>
              <SelectItem value="Women">Women</SelectItem>
              <SelectItem value="Kids">Kids</SelectItem>
            </SelectContent>
          </Select>
        </motion.div>

        {/* Sales Table */}
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
                  <th className="text-left p-4 font-medium text-muted-foreground">Product</th>
                  <th className="text-left p-4 font-medium text-muted-foreground">Category</th>
                  <th className="text-left p-4 font-medium text-muted-foreground hidden sm:table-cell">Sold By</th>
                  <th className="text-left p-4 font-medium text-muted-foreground hidden md:table-cell">Time</th>
                  <th className="text-right p-4 font-medium text-muted-foreground">Amount</th>
                </tr>
              </thead>
              <tbody>
                {paginatedSales.map((sale, index) => (
                  <motion.tr
                    key={sale.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="border-t border-border hover:bg-muted/30 transition-colors"
                  >
                    <td className="p-4">
                      <p className="font-medium">{sale.productName}</p>
                      <p className="text-xs text-muted-foreground sm:hidden">{sale.soldBy} • {sale.time}</p>
                    </td>
                    <td className="p-4">
                      <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${
                        sale.category === 'Men' ? 'bg-primary/10 text-primary' :
                        sale.category === 'Women' ? 'bg-gold/20 text-gold' :
                        'bg-success/10 text-success'
                      }`}>
                        {sale.category}
                      </span>
                    </td>
                    <td className="p-4 text-muted-foreground hidden sm:table-cell">{sale.soldBy}</td>
                    <td className="p-4 text-muted-foreground hidden md:table-cell">{sale.time}</td>
                    <td className="p-4 text-right font-semibold text-success">₹{sale.price.toLocaleString('en-IN')}</td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between p-4 border-t border-border">
              <p className="text-sm text-muted-foreground">
                Showing {((currentPage - 1) * ITEMS_PER_PAGE) + 1} to {Math.min(currentPage * ITEMS_PER_PAGE, filteredSales.length)} of {filteredSales.length}
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

export default OwnerSalesHistory;