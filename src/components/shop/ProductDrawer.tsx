import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Minus, Plus, ShoppingBag, Check, Heart } from "lucide-react";
import confetti from "canvas-confetti";
import type { Product } from "@/data/mockData";
import { Button } from "@/components/ui/button";

interface ProductDrawerProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
}

const ProductDrawer = ({ product, isOpen, onClose }: ProductDrawerProps) => {
  const [quantity, setQuantity] = useState(1);
  const [buyState, setBuyState] = useState<'idle' | 'loading' | 'success'>('idle');
  const [isWishlisted, setIsWishlisted] = useState(false);

  const handleBuyNow = async () => {
    setBuyState('loading');
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setBuyState('success');
    
    // Trigger confetti
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#1E3A8A', '#D4AF37', '#10B981'],
    });
    
    // Reset after showing success
    setTimeout(() => {
      setBuyState('idle');
      setQuantity(1);
      onClose();
    }, 2000);
  };

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
                    Exquisite craftsmanship meets contemporary design. This piece is perfect for 
                    special occasions and festive celebrations. Made with premium quality fabric 
                    and intricate detailing.
                  </p>

                  {/* Quantity Selector */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Quantity</label>
                    <div className="flex items-center gap-4">
                      <button
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        className="p-2 rounded-lg border hover:bg-muted transition-colors btn-pressed"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="text-xl font-semibold w-12 text-center">{quantity}</span>
                      <button
                        onClick={() => setQuantity(quantity + 1)}
                        className="p-2 rounded-lg border hover:bg-muted transition-colors btn-pressed"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Total */}
                  <div className="flex items-center justify-between py-4 border-t">
                    <span className="text-muted-foreground">Total</span>
                    <span className="text-2xl font-bold text-primary">
                      ₹{(product.price * quantity).toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="p-4 border-t bg-muted/30">
                <Button
                  onClick={handleBuyNow}
                  disabled={buyState !== 'idle'}
                  className="w-full h-14 text-lg font-semibold rounded-xl btn-pressed relative overflow-hidden"
                  style={{
                    background: buyState === 'success' 
                      ? 'hsl(var(--success))' 
                      : 'linear-gradient(135deg, hsl(var(--gold)) 0%, hsl(38 80% 45%) 100%)',
                  }}
                >
                  <AnimatePresence mode="wait">
                    {buyState === 'idle' && (
                      <motion.span
                        key="idle"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="flex items-center gap-2 text-foreground"
                      >
                        <ShoppingBag className="w-5 h-5" />
                        Buy Now
                      </motion.span>
                    )}
                    {buyState === 'loading' && (
                      <motion.div
                        key="loading"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        className="w-6 h-6 border-2 border-foreground/30 border-t-foreground rounded-full animate-spin"
                      />
                    )}
                    {buyState === 'success' && (
                      <motion.span
                        key="success"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        className="flex items-center gap-2 text-white"
                      >
                        <Check className="w-6 h-6" />
                        Order Placed!
                      </motion.span>
                    )}
                  </AnimatePresence>
                </Button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default ProductDrawer;
