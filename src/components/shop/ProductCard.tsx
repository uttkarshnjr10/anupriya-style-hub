// import { motion } from "framer-motion";
// import type { Product } from "@/data/mockData";

// interface ProductCardProps {
//   product: Product;
//   index: number;
//   onClick: () => void;
// }

// const ProductCard = ({ product, index, onClick }: ProductCardProps) => {
//   return (
//     <motion.div
//       initial={{ opacity: 0, y: 20 }}
//       animate={{ opacity: 1, y: 0 }}
//       transition={{ delay: index * 0.1, duration: 0.4 }}
//       whileHover={{ y: -8 }}
//       whileTap={{ scale: 0.98 }}
//       onClick={onClick}
//       className="group cursor-pointer"
//     >
//       <div className="relative bg-card rounded-2xl overflow-hidden shadow-soft card-hover">
//         {/* Image Container */}
//         <div className="relative aspect-[3/4] overflow-hidden">
//           <img
//             src={product.image}
//             alt={product.name}
//             className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
//           />
          
//           {/* Badge */}
//           {product.badge && (
//             <div className="absolute top-3 left-3">
//               <span className={product.badge === 'New Arrival' ? 'badge-new' : 'badge-bestseller'}>
//                 {product.badge}
//               </span>
//             </div>
//           )}

//           {/* Overlay on hover */}
//           <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          
//           {/* Quick View Button */}
//           <div className="absolute bottom-4 left-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-4 group-hover:translate-y-0">
//             <button className="w-full py-3 bg-white/90 backdrop-blur-sm rounded-xl font-semibold text-primary hover:bg-white transition-colors btn-pressed">
//               Quick View
//             </button>
//           </div>
//         </div>

//         {/* Content */}
//         <div className="p-4">
//           <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">
//             {product.category} - {product.subCategory}
//           </p>
//           <h3 className="font-semibold text-foreground mb-2 line-clamp-1 group-hover:text-primary transition-colors">
//             {product.name}
//           </h3>
//           <div className="flex items-center justify-between">
//             <p className="text-lg font-bold text-primary">
//               ₹{product.price.toLocaleString('en-IN')}
//             </p>
//             <div className="w-2 h-2 rounded-full bg-success animate-pulse" title="In Stock" />
//           </div>
//         </div>
//       </div>
//     </motion.div>
//   );
// };

// export default ProductCard;

import { motion } from "framer-motion";

// FIXED: Define interface locally instead of importing from mockData
// This allows 'category' to be any string, fixing the TypeScript error.
export interface Product {
  id: string;
  name: string;
  category: string;
  subCategory: string;
  price: number;
  image: string;
  badge?: string;
  description?: string;
}

interface ProductCardProps {
  product: Product;
  index: number;
  onClick: () => void;
}

const ProductCard = ({ product, index, onClick }: ProductCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.4 }}
      whileHover={{ y: -8 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className="group cursor-pointer"
    >
      <div className="relative bg-card rounded-2xl overflow-hidden shadow-soft card-hover border border-border/50">
        {/* Image Container */}
        <div className="relative aspect-[3/4] overflow-hidden bg-muted">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            loading="lazy"
          />
          
          {/* Badge */}
          {product.badge && (
            <div className="absolute top-3 left-3 z-10">
              <span className={`px-2 py-1 text-[10px] font-bold uppercase tracking-wider rounded-sm text-white shadow-sm ${
                product.badge === 'New Arrival' ? 'bg-emerald-500' : 'bg-amber-500'
              }`}>
                {product.badge}
              </span>
            </div>
          )}

          {/* Overlay on hover */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          
          {/* Quick View Button */}
          <div className="absolute bottom-4 left-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-4 group-hover:translate-y-0">
            <button 
              onClick={(e) => {
                e.stopPropagation(); // Prevent card click
                onClick();
              }}
              className="w-full py-3 bg-white/90 backdrop-blur-sm rounded-xl font-semibold text-primary hover:bg-white transition-colors text-sm shadow-lg"
            >
              Quick View
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-4">
          <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wide mb-1">
            {product.category} - {product.subCategory}
          </p>
          <h3 className="font-semibold text-foreground mb-2 line-clamp-1 group-hover:text-primary transition-colors text-sm md:text-base">
            {product.name}
          </h3>
          <div className="flex items-center justify-between">
            <p className="text-base md:text-lg font-bold text-primary">
              ₹{product.price.toLocaleString('en-IN')}
            </p>
            {/* Stock Indicator */}
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" title="In Stock" />
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;