import { useState } from "react";
import { motion } from "framer-motion";
import { Camera, Upload, Check } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { categories } from "@/data/mockData";

const QuickSellForm = () => {
  const [selectedCategory, setSelectedCategory] = useState<'Men' | 'Women' | 'Kids'>('Men');
  const [selectedSubCategory, setSelectedSubCategory] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [listOnline, setListOnline] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsSubmitting(false);
    // Reset form
    setPrice('');
    setDescription('');
    setSelectedSubCategory('');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-card rounded-2xl p-6 shadow-soft border border-border"
    >
      <h3 className="font-display text-xl font-semibold mb-6">Quick Sell</h3>

      {/* Upload Area */}
      <div
        className={`upload-zone mb-6 ${isDragOver ? 'dragover' : ''}`}
        onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
        onDragLeave={() => setIsDragOver(false)}
        onDrop={() => setIsDragOver(false)}
      >
        <div className="text-center">
          <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
            <Camera className="w-8 h-8 text-primary" />
          </div>
          <p className="font-medium text-foreground mb-1">Upload or Take Photo</p>
          <p className="text-sm text-muted-foreground">Drag & drop or click to browse</p>
        </div>
      </div>

      {/* Price Input */}
      <div className="mb-6">
        <label className="text-sm font-medium mb-2 block">Price (₹)</label>
        <Input
          type="number"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          placeholder="Enter price"
          className="text-2xl font-bold h-14 rounded-xl"
        />
      </div>

      {/* Description */}
      <div className="mb-6">
        <label className="text-sm font-medium mb-2 block">Description</label>
        <Textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Add a short description..."
          className="rounded-xl resize-none"
          rows={2}
        />
      </div>

      {/* Category Selection - Row 1 */}
      <div className="mb-4">
        <label className="text-sm font-medium mb-2 block">Category</label>
        <div className="flex flex-wrap gap-2">
          {(['Men', 'Women', 'Kids'] as const).map((cat) => (
            <motion.button
              key={cat}
              whileHover={{ scale: 1.05 }}
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
        <label className="text-sm font-medium mb-2 block">Sub-Category</label>
        <div className="flex flex-wrap gap-2">
          {categories[selectedCategory].map((sub) => (
            <motion.button
              key={sub}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setSelectedSubCategory(sub)}
              className={`category-chip ${selectedSubCategory === sub ? 'active' : ''}`}
            >
              {sub}
            </motion.button>
          ))}
        </div>
      </div>

      {/* List Online Toggle */}
      <div className="flex items-center justify-between py-4 border-t border-b mb-6">
        <div>
          <p className="font-medium">List Online?</p>
          <p className="text-sm text-muted-foreground">Make this item visible in the shop</p>
        </div>
        <Switch checked={listOnline} onCheckedChange={setListOnline} />
      </div>

      {/* Submit Button */}
      <Button
        onClick={handleSubmit}
        disabled={isSubmitting || !price || !selectedSubCategory}
        className="w-full h-12 rounded-xl gradient-gold text-foreground font-semibold btn-pressed"
      >
        {isSubmitting ? (
          <div className="w-5 h-5 border-2 border-foreground/30 border-t-foreground rounded-full animate-spin" />
        ) : (
          <>
            <Upload className="w-5 h-5 mr-2" />
            Add to Inventory
          </>
        )}
      </Button>
    </motion.div>
  );
};

export default QuickSellForm;
