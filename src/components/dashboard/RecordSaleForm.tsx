import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { Camera, Check, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { categories } from "@/data/mockData";
import { toast } from "sonner";

const RecordSaleForm = () => {
  const [selectedCategory, setSelectedCategory] = useState<'Men' | 'Women' | 'Kids'>('Men');
  const [selectedSubCategory, setSelectedSubCategory] = useState('');
  const [price, setPrice] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageCapture = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerCamera = () => {
    fileInputRef.current?.click();
  };

  const clearImage = () => {
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async () => {
    if (!price || !selectedSubCategory) {
      toast.error("Please fill in all required fields");
      return;
    }

    setIsSubmitting(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    toast.success(`Sale recorded: ₹${price} - ${selectedSubCategory}`);
    
    // Reset form
    setPrice('');
    setSelectedSubCategory('');
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    setIsSubmitting(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-card rounded-2xl p-6 shadow-soft border border-border"
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-full bg-success/10 flex items-center justify-center">
          <Check className="w-5 h-5 text-success" />
        </div>
        <div>
          <h3 className="font-display text-xl font-semibold">Record Sale</h3>
          <p className="text-sm text-muted-foreground">Log a sale from the physical shop</p>
        </div>
      </div>

      {/* Hidden file input for camera */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={handleImageCapture}
        className="hidden"
      />

      {/* Camera/Upload Area */}
      <div className="mb-6">
        {imagePreview ? (
          <div className="relative rounded-xl overflow-hidden">
            <img 
              src={imagePreview} 
              alt="Captured item" 
              className="w-full h-48 object-cover"
            />
            <button
              onClick={clearImage}
              className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full shadow-lg btn-pressed"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <motion.button
            whileTap={{ scale: 0.98 }}
            onClick={triggerCamera}
            className="w-full h-40 rounded-xl border-2 border-dashed border-primary/30 bg-primary/5 flex flex-col items-center justify-center gap-3 transition-colors hover:border-primary/50 hover:bg-primary/10 btn-pressed"
          >
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
              <Camera className="w-8 h-8 text-primary" />
            </div>
            <p className="font-medium text-foreground">Tap to Take Photo</p>
            <p className="text-sm text-muted-foreground">Quick snap of the sold item</p>
          </motion.button>
        )}
      </div>

      {/* Price Input - Large for mobile */}
      <div className="mb-6">
        <label className="text-sm font-medium mb-2 block">Sale Amount (₹) *</label>
        <Input
          type="number"
          inputMode="numeric"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          placeholder="Enter price"
          className="text-3xl font-bold h-16 rounded-xl text-center"
        />
      </div>

      {/* Category Selection - Row 1 */}
      <div className="mb-4">
        <label className="text-sm font-medium mb-2 block">Category *</label>
        <div className="flex flex-wrap gap-2">
          {(['Men', 'Women', 'Kids'] as const).map((cat) => (
            <motion.button
              key={cat}
              whileTap={{ scale: 0.95 }}
              onClick={() => { setSelectedCategory(cat); setSelectedSubCategory(''); }}
              className={`category-chip ${selectedCategory === cat ? 'active' : ''}`}
            >
              {cat}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Sub-Category Selection - Row 2 */}
      <div className="mb-6">
        <label className="text-sm font-medium mb-2 block">Sub-Category *</label>
        <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto">
          {categories[selectedCategory].map((sub) => (
            <motion.button
              key={sub}
              whileTap={{ scale: 0.95 }}
              onClick={() => setSelectedSubCategory(sub)}
              className={`category-chip text-sm ${selectedSubCategory === sub ? 'active' : ''}`}
            >
              {sub}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Submit Button - Large for mobile */}
      <Button
        onClick={handleSubmit}
        disabled={isSubmitting || !price || !selectedSubCategory}
        className="w-full h-14 rounded-xl gradient-gold text-foreground font-semibold text-lg btn-pressed"
      >
        {isSubmitting ? (
          <div className="w-6 h-6 border-2 border-foreground/30 border-t-foreground rounded-full animate-spin" />
        ) : (
          <>
            <Check className="w-6 h-6 mr-2" />
            Record Sale
          </>
        )}
      </Button>
    </motion.div>
  );
};

export default RecordSaleForm;
