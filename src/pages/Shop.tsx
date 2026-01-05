// import { useState, useMemo } from "react";
// import { motion } from "framer-motion";
// import HeroBanner from "@/components/shop/HeroBanner";
// import ProductCard from "@/components/shop/ProductCard";
// import ProductDrawer from "@/components/shop/ProductDrawer";
// import CategoryFilter from "@/components/shop/CategoryFilter";
// import { products, shopAddress, type Product } from "@/data/mockData";
// import { ArrowLeft, MapPin, Search, Loader2 } from "lucide-react";
// import { useNavigate } from "react-router-dom";
// import { Input } from "@/components/ui/input";
// import { Button } from "@/components/ui/button";

// const PRODUCTS_PER_PAGE = 8;

// const Shop = () => {
//   const [activeCategory, setActiveCategory] = useState("All");
//   const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
//   const [isDrawerOpen, setIsDrawerOpen] = useState(false);
//   const [searchQuery, setSearchQuery] = useState("");
//   const [displayCount, setDisplayCount] = useState(PRODUCTS_PER_PAGE);
//   const [isLoadingMore, setIsLoadingMore] = useState(false);
//   const navigate = useNavigate();

//   const categories = ["All", "New Arrivals", "Best Sellers", "Men", "Women", "Kids"];

//   // TODO: BACKEND_API - GET /api/products?search={query}&page={page}
//   const filteredProducts = useMemo(() => {
//     let filtered = products.filter(p => p.showOnWebsite);
    
//     // Apply category filter
//     if (activeCategory === "New Arrivals") {
//       filtered = filtered.filter(p => p.badge === 'New Arrival');
//     } else if (activeCategory === "Best Sellers") {
//       filtered = filtered.filter(p => p.badge === 'Best Seller');
//     } else if (activeCategory !== "All") {
//       filtered = filtered.filter(p => p.category === activeCategory);
//     }
    
//     // Apply search filter
//     if (searchQuery.trim()) {
//       const query = searchQuery.toLowerCase();
//       filtered = filtered.filter(p => 
//         p.name.toLowerCase().includes(query) ||
//         p.category.toLowerCase().includes(query) ||
//         p.subCategory.toLowerCase().includes(query) ||
//         p.description?.toLowerCase().includes(query)
//       );
//     }
    
//     return filtered;
//   }, [activeCategory, searchQuery]);

//   const displayedProducts = filteredProducts.slice(0, displayCount);
//   const hasMore = displayCount < filteredProducts.length;

//   const handleLoadMore = async () => {
//     setIsLoadingMore(true);
//     // TODO: BACKEND_API - Fetch next page (page=x, limit=8)
//     await new Promise(resolve => setTimeout(resolve, 500)); // Simulate loading
//     setDisplayCount(prev => prev + PRODUCTS_PER_PAGE);
//     setIsLoadingMore(false);
//   };

//   const handleProductClick = (product: Product) => {
//     setSelectedProduct(product);
//     setIsDrawerOpen(true);
//   };

//   const handleCategoryChange = (category: string) => {
//     setActiveCategory(category);
//     setDisplayCount(PRODUCTS_PER_PAGE); // Reset pagination on category change
//   };

//   const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     setSearchQuery(e.target.value);
//     setDisplayCount(PRODUCTS_PER_PAGE); // Reset pagination on search
//   };

//   return (
//     <div className="min-h-screen bg-background">
//       {/* Back Button */}
//       <motion.button
//         initial={{ opacity: 0, x: -20 }}
//         animate={{ opacity: 1, x: 0 }}
//         onClick={() => navigate('/')}
//         className="fixed top-4 left-4 z-50 p-3 rounded-full glass shadow-lg btn-pressed"
//       >
//         <ArrowLeft className="w-5 h-5" />
//       </motion.button>

//       {/* Hero Banner */}
//       <HeroBanner />

//       {/* Main Content */}
//       <main className="container px-4 py-8">
//         {/* Sticky Search Bar */}
//         <motion.div
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ delay: 0.1 }}
//           className="sticky top-0 z-30 bg-background/95 backdrop-blur-sm py-4 -mx-4 px-4 mb-4"
//         >
//           <div className="relative">
//             <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
//             <Input
//               type="text"
//               placeholder="Search products..."
//               value={searchQuery}
//               onChange={handleSearchChange}
//               className="pl-12 h-12 rounded-xl border-border bg-card text-base"
//             />
//           </div>
//         </motion.div>

//         {/* Category Filter */}
//         <motion.div
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ delay: 0.2 }}
//           className="mb-8"
//         >
//           <CategoryFilter
//             categories={categories}
//             activeCategory={activeCategory}
//             onCategoryChange={handleCategoryChange}
//           />
//         </motion.div>

//         {/* Section Header */}
//         <motion.div
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ delay: 0.3 }}
//           className="mb-6"
//         >
//           <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground">
//             {activeCategory === "All" ? "Our Collection" : 
//              activeCategory === "New Arrivals" ? "New Arrivals ✨" :
//              activeCategory === "Best Sellers" ? "Best Sellers ⭐" :
//              `${activeCategory}'s Collection`}
//           </h2>
//           <p className="text-muted-foreground mt-1">
//             {filteredProducts.length} products available
//             {searchQuery && ` for "${searchQuery}"`}
//           </p>
//         </motion.div>

//         {/* Product Grid */}
//         {displayedProducts.length > 0 ? (
//           <>
//             <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
//               {displayedProducts.map((product, index) => (
//                 <ProductCard
//                   key={product.id}
//                   product={product}
//                   index={index}
//                   onClick={() => handleProductClick(product)}
//                 />
//               ))}
//             </div>

//             {/* Load More Button */}
//             {hasMore && (
//               <motion.div
//                 initial={{ opacity: 0 }}
//                 animate={{ opacity: 1 }}
//                 transition={{ delay: 0.2 }}
//                 className="mt-8 flex justify-center"
//               >
//                 <Button
//                   onClick={handleLoadMore}
//                   disabled={isLoadingMore}
//                   className="w-full md:w-auto min-w-[200px] h-14 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 font-semibold text-base btn-pressed"
//                 >
//                   {isLoadingMore ? (
//                     <>
//                       <Loader2 className="w-5 h-5 mr-2 animate-spin" />
//                       Loading...
//                     </>
//                   ) : (
//                     `Load More Products (${filteredProducts.length - displayCount} remaining)`
//                   )}
//                 </Button>
//               </motion.div>
//             )}
//           </>
//         ) : (
//           <div className="text-center py-12">
//             <p className="text-muted-foreground">
//               {searchQuery ? `No products found for "${searchQuery}"` : 'No products in this category'}
//             </p>
//           </div>
//         )}

//         {/* Footer with Address */}
//         <motion.footer
//           initial={{ opacity: 0 }}
//           animate={{ opacity: 1 }}
//           transition={{ delay: 0.5 }}
//           className="mt-16 pt-8 border-t border-border"
//         >
//           <div className="text-center space-y-3">
//             <h3 className="font-display text-xl font-bold text-foreground">
//               Visit Our Store
//             </h3>
//             <div className="flex flex-col items-center gap-1 text-muted-foreground">
//               <div className="flex items-center gap-2">
//                 <MapPin className="w-4 h-4 text-gold" />
//                 <span className="font-medium">{shopAddress.name}</span>
//               </div>
//               <p className="text-sm">{shopAddress.complex}</p>
//               <p className="text-xs">{shopAddress.fullAddress}</p>
//             </div>
//           </div>
//         </motion.footer>
//       </main>

//       {/* Product Drawer */}
//       <ProductDrawer
//         product={selectedProduct}
//         isOpen={isDrawerOpen}
//         onClose={() => setIsDrawerOpen(false)}
//       />
//     </div>
//   );
// };

// export default Shop;

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Search, SlidersHorizontal, ShoppingBag } from "lucide-react";
import HeroBanner from "@/components/shop/HeroBanner";
import CategoryFilter from "@/components/shop/CategoryFilter";
import ProductCard from "@/components/shop/ProductCard";
import ProductDrawer from "@/components/shop/ProductDrawer";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { api } from "@/lib/api";

// 1. Define Product Interface locally to match ProductCard
export interface Product {
  id: string;
  name: string;
  // category: 'Men' | 'Women' | 'Kids' | string;
  // Changed from strict union to string to match ProductCard
  category: string;
  subCategory: string;
  price: number;
  image: string;
  badge?: 'New Arrival' | 'Best Seller' | string;
  description?: string;
}

// 2. Hardcoded Fallback Data (5 Items)
const HARDCODED_PRODUCTS: Product[] = [
  { id: '101', name: 'Royal Silk Sherwani', category: 'Men', subCategory: 'Sherwani', price: 15999, image: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=400', badge: 'Best Seller' },
  { id: '102', name: 'Banarasi Silk Saree', category: 'Women', subCategory: 'Saree', price: 8999, image: 'https://images.unsplash.com/photo-1610030469668-bd4ec3c4e2e7?w=400', badge: 'New Arrival' },
  { id: '103', name: 'Kids Party Suit', category: 'Kids', subCategory: 'Suit', price: 2499, image: 'https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?w=400' },
  { id: '104', name: 'Cotton Casual Shirt', category: 'Men', subCategory: 'Shirt', price: 1299, image: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=400' },
  { id: '105', name: 'Anarkali Kurti', category: 'Women', subCategory: 'Kurti', price: 3499, image: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=400' }
];

const Shop = () => {
  // Initialize with hardcoded data so page isn't empty initially
  const [products, setProducts] = useState<Product[]>(HARDCODED_PRODUCTS);
  const [isLoading, setIsLoading] = useState(true);
  
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [priceRange, setPriceRange] = useState([0, 50000]);
  const [sortBy, setSortBy] = useState("newest");
  
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      try {
        const params: any = {
          limit: 50,
          minPrice: priceRange[0],
          maxPrice: priceRange[1],
          sort: sortBy,
        };
        if (activeCategory !== "All") params.category = activeCategory;
        if (searchQuery) params.search = searchQuery;

        const response = await api.get("/products", { params });

        if (response.data.success && response.data.data.products.length > 0) {
          // Map Backend Data to Frontend Interface
          const realProducts = response.data.data.products.map((item: any) => ({
            id: item._id,
            name: item.name,
            category: item.category,
            subCategory: item.subCategory || item.category,
            price: item.price,
            image: item.images?.[0]?.url || "https://via.placeholder.com/400x500?text=No+Image",
            badge: item.isNewArrival ? "New Arrival" : item.isBestSeller ? "Best Seller" : undefined,
            description: item.description
          }));
          setProducts(realProducts);
        } else {
          // If backend has no data, fallback to hardcoded (filtered manually)
          const filtered = HARDCODED_PRODUCTS.filter(p => 
            (activeCategory === "All" || p.category === activeCategory) &&
            p.name.toLowerCase().includes(searchQuery.toLowerCase())
          );
          setProducts(filtered);
        }
      } catch (error) {
        console.error("Shop fetch failed, using fallback");
        // Fallback filter on error
        const filtered = HARDCODED_PRODUCTS.filter(p => 
            (activeCategory === "All" || p.category === activeCategory)
        );
        setProducts(filtered);
      } finally {
        setIsLoading(false);
      }
    };

    const timer = setTimeout(fetchProducts, 400);
    return () => clearTimeout(timer);
  }, [activeCategory, searchQuery, priceRange, sortBy]);

  const handleProductClick = (product: Product) => {
    setSelectedProduct(product);
    setIsDrawerOpen(true);
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      <HeroBanner />

      <main className="max-w-7xl mx-auto px-4 py-8 space-y-8">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between sticky top-4 z-30 bg-background/80 backdrop-blur-md p-4 rounded-2xl border border-border shadow-sm">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search for clothes..."
              className="pl-10 h-11 rounded-xl"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="flex items-center gap-2 w-full md:w-auto">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" className="h-11 px-4 rounded-xl gap-2 flex-1 md:flex-none">
                  <SlidersHorizontal className="w-4 h-4" /> Filters
                </Button>
              </SheetTrigger>
              <SheetContent>
                <SheetHeader><SheetTitle>Filters</SheetTitle><SheetDescription>Refine search</SheetDescription></SheetHeader>
                <div className="py-6 space-y-6">
                  <div className="space-y-4">
                    <h4 className="font-medium text-sm">Price Range</h4>
                    <Slider defaultValue={[0, 50000]} max={50000} step={500} value={priceRange} onValueChange={setPriceRange} className="py-4" />
                    <div className="flex items-center justify-between text-sm text-muted-foreground"><span>₹{priceRange[0]}</span><span>₹{priceRange[1]}</span></div>
                  </div>
                </div>
              </SheetContent>
            </Sheet>

            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-[160px] h-11 rounded-xl"><SelectValue placeholder="Sort By" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest First</SelectItem>
                <SelectItem value="price_low">Price: Low to High</SelectItem>
                <SelectItem value="price_high">Price: High to Low</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <CategoryFilter activeCategory={activeCategory} onSelectCategory={setActiveCategory} />

        {/* Product Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {products.map((product, index) => (
            <ProductCard
              key={product.id}
              index={index} // Added index prop
              product={product}
              onClick={() => handleProductClick(product)}
            />
          ))}
        </div>
      </main>

      <ProductDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        product={selectedProduct}
      />
    </div>
  );
};

export default Shop;