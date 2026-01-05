// import { useState } from "react";
// import { motion, AnimatePresence } from "framer-motion";
// import { Trash2, Sparkles, Star, Eye, EyeOff } from "lucide-react";
// import { onlineInventory as initialInventory, type OnlineInventoryItem } from "@/data/mockData";
// import { toast } from "sonner";

// const OnlineInventoryList = () => {
//   const [items, setItems] = useState<OnlineInventoryItem[]>(initialInventory);

//   const handleRemove = (id: string, name: string) => {
//     setItems(items.filter(item => item.id !== id));
//     toast.success(`"${name}" removed from online catalog`);
//   };

//   return (
//     <motion.div
//       initial={{ opacity: 0, y: 20 }}
//       animate={{ opacity: 1, y: 0 }}
//       transition={{ delay: 0.1 }}
//       className="bg-card rounded-2xl p-6 shadow-soft border border-border"
//     >
//       <div className="flex items-center justify-between mb-6">
//         <div>
//           <h3 className="font-display text-xl font-semibold">Online Catalog</h3>
//           <p className="text-sm text-muted-foreground">{items.length} items currently online</p>
//         </div>
//       </div>

//       {items.length === 0 ? (
//         <div className="text-center py-8 text-muted-foreground">
//           <Eye className="w-10 h-10 mx-auto mb-2 opacity-50" />
//           <p>No items in online catalog</p>
//           <p className="text-sm">Add items above to show them on the website</p>
//         </div>
//       ) : (
//         <div className="space-y-3 max-h-[400px] overflow-y-auto">
//           <AnimatePresence>
//             {items.map((item) => (
//               <motion.div
//                 key={item.id}
//                 layout
//                 initial={{ opacity: 0, x: -20 }}
//                 animate={{ opacity: 1, x: 0 }}
//                 exit={{ opacity: 0, x: 20, height: 0 }}
//                 className="flex items-center gap-4 p-3 rounded-xl bg-muted/50 hover:bg-muted transition-colors"
//               >
//                 {/* Image */}
//                 <img
//                   src={item.image}
//                   alt={item.name}
//                   className="w-14 h-14 rounded-lg object-cover"
//                 />

//                 {/* Details */}
//                 <div className="flex-1 min-w-0">
//                   <div className="flex items-center gap-2">
//                     <p className="font-medium text-foreground truncate">{item.name}</p>
//                     {item.isNewArrival && (
//                       <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-success/10 text-success text-xs">
//                         <Sparkles className="w-3 h-3" />
//                         New
//                       </span>
//                     )}
//                     {item.isBestSeller && (
//                       <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-gold/10 text-gold text-xs">
//                         <Star className="w-3 h-3" />
//                         Best
//                       </span>
//                     )}
//                   </div>
//                   <p className="text-sm text-muted-foreground">
//                     {item.category} • {item.subCategory}
//                   </p>
//                   <p className="text-sm font-semibold text-primary">
//                     ₹{item.price.toLocaleString('en-IN')}
//                   </p>
//                 </div>

//                 {/* Delete Button */}
//                 <motion.button
//                   whileHover={{ scale: 1.1 }}
//                   whileTap={{ scale: 0.9 }}
//                   onClick={() => handleRemove(item.id, item.name)}
//                   className="p-2 rounded-lg text-red-500 hover:bg-red-500/10 transition-colors"
//                 >
//                   <Trash2 className="w-5 h-5" />
//                 </motion.button>
//               </motion.div>
//             ))}
//           </AnimatePresence>
//         </div>
//       )}
//     </motion.div>
//   );
// };

// export default OnlineInventoryList;

import { motion, AnimatePresence } from "framer-motion";
import { Trash2, Sparkles, Star, Eye, ShoppingBag, ExternalLink } from "lucide-react";
import { toast } from "sonner";
import { api } from "@/lib/api";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

// Export this interface
export interface Product {
  _id: string;
  name: string;
  price: number;
  category: string;
  subCategory?: string;
  images: { url: string }[];
  isNewArrival?: boolean;
  isBestSeller?: boolean;
}

// Export this interface
export interface OnlineInventoryListProps {
  products: Product[];
  isLoading: boolean;
  onRefresh?: () => void;
}

const OnlineInventoryList = ({ products, isLoading, onRefresh }: OnlineInventoryListProps) => {

  const handleRemove = async (id: string, name: string) => {
    try {
      await api.delete(`/products/${id}`);
      toast.success(`"${name}" removed from online catalog`);
      if (onRefresh) onRefresh();
    } catch (error) {
      toast.error("Failed to delete product");
    }
  };

  if (isLoading) {
    return (
       <div className="bg-card rounded-2xl p-6 shadow-soft border border-border min-h-[300px] flex items-center justify-center text-muted-foreground">
          Loading inventory...
       </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="bg-card rounded-2xl p-6 shadow-soft border border-border"
    >
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="font-display text-xl font-semibold">Online Catalog</h3>
          <p className="text-sm text-muted-foreground">{products.length} items currently online</p>
        </div>
      </div>

      {products.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          <Eye className="w-10 h-10 mx-auto mb-2 opacity-50" />
          <p>No items in online catalog</p>
          <p className="text-sm">Add items on the left to show them on the website</p>
        </div>
      ) : (
        <div className="space-y-3 max-h-[600px] overflow-y-auto custom-scrollbar">
          <AnimatePresence>
            {products.map((item) => (
              <motion.div
                key={item._id}
                layout
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20, height: 0 }}
                className="flex items-center gap-4 p-3 rounded-xl bg-muted/50 hover:bg-muted transition-colors"
              >
                {/* Image */}
                <img
                  src={item.images?.[0]?.url || "https://via.placeholder.com/150"}
                  alt={item.name}
                  className="w-14 h-14 rounded-lg object-cover bg-background"
                />

                {/* Details */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="font-medium text-foreground truncate">{item.name}</p>
                    {item.isNewArrival && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-success/10 text-success text-xs">
                        <Sparkles className="w-3 h-3" />
                        New
                      </span>
                    )}
                    {item.isBestSeller && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-gold/10 text-gold text-xs">
                        <Star className="w-3 h-3" />
                        Best
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {item.category} • {item.subCategory || "General"}
                  </p>
                  <p className="text-sm font-semibold text-primary">
                    ₹{item.price.toLocaleString('en-IN')}
                  </p>
                </div>

                {/* Delete Button */}
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => handleRemove(item._id, item.name)}
                  className="p-2 rounded-lg text-red-500 hover:bg-red-500/10 transition-colors"
                >
                  <Trash2 className="w-5 h-5" />
                </motion.button>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </motion.div>
  );
};

export default OnlineInventoryList;
