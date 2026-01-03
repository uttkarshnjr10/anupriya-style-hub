import { useState } from "react";
import { motion } from "framer-motion";
import HeroBanner from "@/components/shop/HeroBanner";
import ProductCard from "@/components/shop/ProductCard";
import ProductDrawer from "@/components/shop/ProductDrawer";
import CategoryFilter from "@/components/shop/CategoryFilter";
import MobileBottomNav from "@/components/layout/MobileBottomNav";
import { products, shopAddress, type Product } from "@/data/mockData";
import { ArrowLeft, MapPin } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Shop = () => {
  const [activeCategory, setActiveCategory] = useState("All");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const navigate = useNavigate();

  const categories = ["All", "New Arrivals", "Best Sellers", "Men", "Women", "Kids"];

  const filteredProducts = (() => {
    if (activeCategory === "All") return products.filter(p => p.showOnWebsite);
    if (activeCategory === "New Arrivals") return products.filter(p => p.showOnWebsite && p.badge === 'New Arrival');
    if (activeCategory === "Best Sellers") return products.filter(p => p.showOnWebsite && p.badge === 'Best Seller');
    return products.filter(p => p.showOnWebsite && p.category === activeCategory);
  })();

  const handleProductClick = (product: Product) => {
    setSelectedProduct(product);
    setIsDrawerOpen(true);
  };

  return (
    <div className="min-h-screen bg-background pb-24 lg:pb-0">
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
            onCategoryChange={setActiveCategory}
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
          </p>
        </motion.div>

        {/* Product Grid */}
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {filteredProducts.map((product, index) => (
              <ProductCard
                key={product.id}
                product={product}
                index={index}
                onClick={() => handleProductClick(product)}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No products in this category</p>
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

      {/* Mobile Bottom Navigation */}
      <MobileBottomNav role="customer" />
    </div>
  );
};

export default Shop;
