import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { Camera, Upload, X, Star, Sparkles, Globe } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { categories } from "@/data/mockData";
import { toast } from "sonner";

interface OnlineInventoryFormProps {
  onItemAdded?: () => void;
}

const OnlineInventoryForm = ({ onItemAdded }: OnlineInventoryFormProps) => {
  const [selectedCategory, setSelectedCategory] = useState<'Men' | 'Women' | 'Kids'>('Men');
  const [selectedSubCategory, setSelectedSubCategory] = useState('');
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [showOnWebsite, setShowOnWebsite] = useState(true);
  const [isNewArrival, setIsNewArrival] = useState(false);
  const [isBestSeller, setIsBestSeller] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const clearImage = () => {
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async () => {
    if (!name || !price || !selectedSubCategory || !imagePreview) {
      toast.error("Please fill in all required fields and add an image");
      return;
    }

    setIsSubmitting(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    toast.success(`"${name}" added to online inventory`);
    
    // Reset form
    setName('');
    setPrice('');
    setDescription('');
    setSelectedSubCategory('');
    setImagePreview(null);
    setShowOnWebsite(true);
    setIsNewArrival(false);
    setIsBestSeller(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    setIsSubmitting(false);
    onItemAdded?.();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-card rounded-2xl p-6 shadow-soft border border-border"
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
          <Globe className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h3 className="font-display text-xl font-semibold">Add to Online Catalog</h3>
          <p className="text-sm text-muted-foreground">This item will appear on the website</p>
        </div>
      </div>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={handleImageChange}
        className="hidden"
      />

      {/* Image Upload Area */}
      <div className="mb-6">
        {imagePreview ? (
          <div className="relative rounded-xl overflow-hidden">
            <img 
              src={imagePreview} 
              alt="Product preview" 
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
            onClick={triggerFileInput}
            className="w-full h-40 rounded-xl border-2 border-dashed border-gold/30 bg-gold/5 flex flex-col items-center justify-center gap-3 transition-colors hover:border-gold/50 hover:bg-gold/10 btn-pressed"
          >
            <div className="w-16 h-16 rounded-full bg-gold/10 flex items-center justify-center">
              <Camera className="w-8 h-8 text-gold" />
            </div>
            <p className="font-medium text-foreground">Upload Product Photo *</p>
            <p className="text-sm text-muted-foreground">High quality image for the website</p>
          </motion.button>
        )}
      </div>

      {/* Product Name */}
      <div className="mb-4">
        <label className="text-sm font-medium mb-2 block">Product Name *</label>
        <Input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g., Royal Silk Sherwani"
          className="rounded-xl"
        />
      </div>

      {/* Price Input */}
      <div className="mb-4">
        <label className="text-sm font-medium mb-2 block">Price (₹) *</label>
        <Input
          type="number"
          inputMode="numeric"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          placeholder="Enter price"
          className="text-xl font-bold h-12 rounded-xl"
        />
      </div>

      {/* Description */}
      <div className="mb-4">
        <label className="text-sm font-medium mb-2 block">Description</label>
        <Textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Add a description for customers..."
          className="rounded-xl resize-none"
          rows={2}
        />
      </div>

      {/* Category Selection */}
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

      {/* Sub-Category Selection */}
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

      {/* Toggles */}
      <div className="space-y-4 py-4 border-t border-b mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Globe className="w-4 h-4 text-muted-foreground" />
            <div>
              <p className="font-medium text-sm">Show on Website</p>
              <p className="text-xs text-muted-foreground">Visible to customers</p>
            </div>
          </div>
          <Switch checked={showOnWebsite} onCheckedChange={setShowOnWebsite} />
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-muted-foreground" />
            <div>
              <p className="font-medium text-sm">Mark as New Arrival</p>
              <p className="text-xs text-muted-foreground">Shows "New" badge</p>
            </div>
          </div>
          <Switch 
            checked={isNewArrival} 
            onCheckedChange={(checked) => {
              setIsNewArrival(checked);
              if (checked) setIsBestSeller(false);
            }} 
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Star className="w-4 h-4 text-muted-foreground" />
            <div>
              <p className="font-medium text-sm">Mark as Best Seller</p>
              <p className="text-xs text-muted-foreground">Shows "Best Seller" badge</p>
            </div>
          </div>
          <Switch 
            checked={isBestSeller} 
            onCheckedChange={(checked) => {
              setIsBestSeller(checked);
              if (checked) setIsNewArrival(false);
            }} 
          />
        </div>
      </div>

      {/* Submit Button */}
      <Button
        onClick={handleSubmit}
        disabled={isSubmitting || !name || !price || !selectedSubCategory || !imagePreview}
        className="w-full h-12 rounded-xl gradient-gold text-foreground font-semibold btn-pressed"
      >
        {isSubmitting ? (
          <div className="w-5 h-5 border-2 border-foreground/30 border-t-foreground rounded-full animate-spin" />
        ) : (
          <>
            <Upload className="w-5 h-5 mr-2" />
            Add to Online Catalog
          </>
        )}
      </Button>
    </motion.div>
  );
};

export default OnlineInventoryForm;
