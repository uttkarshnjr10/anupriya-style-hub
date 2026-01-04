import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import HeroBanner from "@/components/shop/HeroBanner";
import ProductCard from "@/components/shop/ProductCard";
import ProductDrawer from "@/components/shop/ProductDrawer";
import CategoryFilter from "@/components/shop/CategoryFilter";
import { products, shopAddress, type Product } from "@/data/mockData";
import { ArrowLeft, MapPin, Search, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const PRODUCTS_PER_PAGE = 8;

const Shop = () => {
  const [activeCategory, setActiveCategory] = useState("All");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [displayCount, setDisplayCount] = useState(PRODUCTS_PER_PAGE);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const navigate = useNavigate();

  const categories = ["All", "New Arrivals", "Best Sellers", "Men", "Women", "Kids"];

  // TODO: BACKEND_API - GET /api/products?search={query}&page={page}
  const filteredProducts = useMemo(() => {
    let filtered = products.filter(p => p.showOnWebsite);
    
    // Apply category filter
    if (activeCategory === "New Arrivals") {
      filtered = filtered.filter(p => p.badge === 'New Arrival');
    } else if (activeCategory === "Best Sellers") {
      filtered = filtered.filter(p => p.badge === 'Best Seller');
    } else if (activeCategory !== "All") {
      filtered = filtered.filter(p => p.category === activeCategory);
    }
    
    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(p => 
        p.name.toLowerCase().includes(query) ||
        p.category.toLowerCase().includes(query) ||
        p.subCategory.toLowerCase().includes(query) ||
        p.description?.toLowerCase().includes(query)
      );
    }
    
    return filtered;
  }, [activeCategory, searchQuery]);

  const displayedProducts = filteredProducts.slice(0, displayCount);
  const hasMore = displayCount < filteredProducts.length;

  const handleLoadMore = async () => {
    setIsLoadingMore(true);
    // TODO: BACKEND_API - Fetch next page (page=x, limit=8)
    await new Promise(resolve => setTimeout(resolve, 500)); // Simulate loading
    setDisplayCount(prev => prev + PRODUCTS_PER_PAGE);
    setIsLoadingMore(false);
  };

  const handleProductClick = (product: Product) => {
    setSelectedProduct(product);
    setIsDrawerOpen(true);
  };

  const handleCategoryChange = (category: string) => {
    setActiveCategory(category);
    setDisplayCount(PRODUCTS_PER_PAGE); // Reset pagination on category change
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setDisplayCount(PRODUCTS_PER_PAGE); // Reset pagination on search
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Back Button */}
      <motion.button
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        onClick={() => navigate('/')}
        className="fixed top-4 left-4 z-50 p-3 rounded-full glass shadow-lg btn-pressed"
      >
        <ArrowLeft className="w-5 h-5" />
      </motion.button>

      {/* Hero Banner */}
      <HeroBanner />

      {/* Main Content */}
      <main className="container px-4 py-8">
        {/* Sticky Search Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="sticky top-0 z-30 bg-background/95 backdrop-blur-sm py-4 -mx-4 px-4 mb-4"
        >
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={handleSearchChange}
              className="pl-12 h-12 rounded-xl border-border bg-card text-base"
            />
          </div>
        </motion.div>

        {/* Category Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <CategoryFilter
            categories={categories}
            activeCategory={activeCategory}
            onCategoryChange={handleCategoryChange}
          />
        </motion.div>

        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-6"
        >
          <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground">
            {activeCategory === "All" ? "Our Collection" : 
             activeCategory === "New Arrivals" ? "New Arrivals ✨" :
             activeCategory === "Best Sellers" ? "Best Sellers ⭐" :
             `${activeCategory}'s Collection`}
          </h2>
          <p className="text-muted-foreground mt-1">
            {filteredProducts.length} products available
            {searchQuery && ` for "${searchQuery}"`}
          </p>
        </motion.div>

        {/* Product Grid */}
        {displayedProducts.length > 0 ? (
          <>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {displayedProducts.map((product, index) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  index={index}
                  onClick={() => handleProductClick(product)}
                />
              ))}
            </div>

            {/* Load More Button */}
            {hasMore && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="mt-8 flex justify-center"
              >
                <Button
                  onClick={handleLoadMore}
                  disabled={isLoadingMore}
                  className="w-full md:w-auto min-w-[200px] h-14 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 font-semibold text-base btn-pressed"
                >
                  {isLoadingMore ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Loading...
                    </>
                  ) : (
                    `Load More Products (${filteredProducts.length - displayCount} remaining)`
                  )}
                </Button>
              </motion.div>
            )}
          </>
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground">
              {searchQuery ? `No products found for "${searchQuery}"` : 'No products in this category'}
            </p>
          </div>
        )}

        {/* Footer with Address */}
        <motion.footer
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-16 pt-8 border-t border-border"
        >
          <div className="text-center space-y-3">
            <h3 className="font-display text-xl font-bold text-foreground">
              Visit Our Store
            </h3>
            <div className="flex flex-col items-center gap-1 text-muted-foreground">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-gold" />
                <span className="font-medium">{shopAddress.name}</span>
              </div>
              <p className="text-sm">{shopAddress.complex}</p>
              <p className="text-xs">{shopAddress.fullAddress}</p>
            </div>
          </div>
        </motion.footer>
      </main>

      {/* Product Drawer */}
      <ProductDrawer
        product={selectedProduct}
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
      />
    </div>
  );
};

export default Shop;
