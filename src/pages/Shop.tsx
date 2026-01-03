import { useState } from "react";
import { motion } from "framer-motion";
import HeroBanner from "@/components/shop/HeroBanner";
import ProductCard from "@/components/shop/ProductCard";
import ProductDrawer from "@/components/shop/ProductDrawer";
import CategoryFilter from "@/components/shop/CategoryFilter";
import MobileBottomNav from "@/components/layout/MobileBottomNav";
import { products, type Product } from "@/data/mockData";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Shop = () => {
  const [activeCategory, setActiveCategory] = useState("All");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const navigate = useNavigate();

  const categories = ["All", "Men", "Women", "Kids"];

  const filteredProducts = activeCategory === "All" 
    ? products 
    : products.filter(p => p.category === activeCategory);

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
            {activeCategory === "All" ? "All Collections" : `${activeCategory}'s Collection`}
          </h2>
          <p className="text-muted-foreground mt-1">
            {filteredProducts.length} products available
          </p>
        </motion.div>

        {/* Product Grid */}
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
