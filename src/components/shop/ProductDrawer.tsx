import { motion, AnimatePresence } from "framer-motion";
import { X, Heart, MapPin } from "lucide-react";
import { shopAddress } from "@/data/mockData";
import { useState } from "react";

// Flexible Product type to match Shop.tsx
interface DrawerProduct {
  id: string;
  name: string;
  category: string;
  subCategory: string;
  price: number;
  image: string;
  badge?: string;
  description?: string;
}

interface ProductDrawerProps {
  product: DrawerProduct | null;
  isOpen: boolean;
  onClose: () => void;
}

const ProductDrawer = ({ product, isOpen, onClose }: ProductDrawerProps) => {
  const [isWishlisted, setIsWishlisted] = useState(false);

  if (!product) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-background shadow-2xl z-50 overflow-hidden"
          >
            <div className="h-full flex flex-col">
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b">
                <h2 className="font-display text-xl font-semibold">Product Details</h2>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-muted rounded-full transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Content */}
              <div className="flex-1 overflow-y-auto">
                {/* Image */}
                <div className="relative aspect-square">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                  {product.badge && (
                    <div className="absolute top-4 left-4">
                      <span className={product.badge === 'New Arrival' ? 'badge-new' : 'badge-bestseller'}>
                        {product.badge}
                      </span>
                    </div>
                  )}
                  <button
                    onClick={() => setIsWishlisted(!isWishlisted)}
                    className="absolute top-4 right-4 p-3 bg-white/80 backdrop-blur-sm rounded-full shadow-lg transition-transform hover:scale-110 btn-pressed"
                  >
                    <Heart
                      className={`w-5 h-5 transition-colors ${
                        isWishlisted ? 'fill-red-500 text-red-500' : 'text-gray-600'
                      }`}
                    />
                  </button>
                </div>

                {/* Details */}
                <div className="p-6 space-y-6">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground uppercase tracking-wide mb-2">
                      {product.category} - {product.subCategory}
                    </p>
                    <h3 className="font-display text-2xl font-bold text-foreground mb-2">
                      {product.name}
                    </h3>
                    <p className="text-3xl font-bold text-primary">
                      ₹{product.price.toLocaleString('en-IN')}
                    </p>
                  </div>

                  {/* Description */}
                  <p className="text-muted-foreground leading-relaxed">
                    {product.description || 
                      'Exquisite craftsmanship meets contemporary design. This piece is perfect for special occasions and festive celebrations. Made with premium quality fabric and intricate detailing.'}
                  </p>

                  {/* Features */}
                  <div className="space-y-2">
                    <h4 className="font-medium text-foreground">Features:</h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• Premium quality fabric</li>
                      <li>• Handcrafted detailing</li>
                      <li>• Available in multiple sizes</li>
                      <li>• Perfect for festive occasions</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Footer - Visit Store CTA */}
              <div className="p-4 border-t bg-gradient-to-r from-primary/5 to-gold/5">
                <div className="flex items-center gap-3 p-4 rounded-xl bg-background border border-gold/20">
                  <div className="p-3 rounded-full bg-gold/10">
                    <MapPin className="w-5 h-5 text-gold" />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-foreground text-sm">
                      Want to grab this?
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Visit {shopAddress.name} at {shopAddress.shortAddress}
                    </p>
                  </div>
                </div>
                <p className="text-center text-xs text-muted-foreground mt-3">
                  {shopAddress.complex} • {shopAddress.fullAddress}
                </p>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default ProductDrawer;
