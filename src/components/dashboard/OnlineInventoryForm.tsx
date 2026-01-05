import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { Camera, Upload, X, Star, Sparkles, Globe, Loader2 } from "lucide-react"; // Removed unused imports
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { categories } from "@/data/mockData";
import { toast } from "sonner";
import { api } from "@/lib/api";
// 1. IMPORT THE LIBRARY
import imageCompression from "browser-image-compression";

export interface OnlineInventoryFormProps {
  onSuccess?: () => void;
}

const OnlineInventoryForm = ({ onSuccess }: OnlineInventoryFormProps) => {
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
  const [imageFile, setImageFile] = useState<File | null>(null);
  
  // New State: To show compression loading
  const [isCompressing, setIsCompressing] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate File Type manually
      const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];
      if (!validTypes.includes(file.type)) {
        toast.error("Format not supported. Please use JPG, PNG, or WEBP.");
        return;
      }

      setIsCompressing(true); // Start loading spinner for image

      try {
        // 2. CONFIGURE COMPRESSION OPTIONS
        const options = {
          maxSizeMB: 1,           // Max file size: 1MB (Safe for Cloudinary)
          maxWidthOrHeight: 1920, // Max dimension: 1920px (Good for web)
          useWebWorker: true,     // Run in background (doesn't freeze UI)
          fileType: file.type as string // Maintain original type
        };

        // 3. COMPRESS THE FILE
        console.log(`Original size: ${file.size / 1024 / 1024} MB`);
        const compressedFile = await imageCompression(file, options);
        console.log(`Compressed size: ${compressedFile.size / 1024 / 1024} MB`);

        // 4. SET THE COMPRESSED FILE TO STATE
        setImageFile(compressedFile);

        // Generate Preview from the compressed file
        const reader = new FileReader();
        reader.onloadend = () => {
          setImagePreview(reader.result as string);
          setIsCompressing(false); // Stop loading
        };
        reader.readAsDataURL(compressedFile);

      } catch (error) {
        console.error("Compression error:", error);
        toast.error("Failed to process image. Please try another.");
        setIsCompressing(false);
      }
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const clearImage = () => {
    setImagePreview(null);
    setImageFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async () => {
    if (!name || !price || !selectedSubCategory) {
      toast.error("Please fill in all required fields");
      return;
    }
    if (!imageFile) {
      toast.error("Please add an image");
      return;
    }

    setIsSubmitting(true);
    console.log("uploading the product...");

    try {
      // 1. Get Signature
      const signRes = await api.get("/images/sign-upload");
      if (!signRes.data.success) throw new Error("Signature failed");
      
      const { signature, timestamp, apiKey, folder, cloudName, transformation } = signRes.data.data;

      // 2. Upload to Cloudinary (using the COMPRESSED imageFile)
      const formData = new FormData();
      formData.append("file", imageFile);
      formData.append("api_key", apiKey);
      formData.append("timestamp", timestamp);
      formData.append("signature", signature);
      
      if (folder) formData.append("folder", folder);
      if (transformation) formData.append("transformation", transformation);
      
      formData.append("allowed_formats", "jpg,png,webp");

      const uploadRes = await fetch(
        `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
        { method: "POST", body: formData }
      );

      if (!uploadRes.ok) {
        const err = await uploadRes.json();
        console.error("Cloudinary Error:", err);
        throw new Error(err.error?.message || "Image upload rejected");
      }
      
      const uploadResult = await uploadRes.json();

      // 3. Create Product
      const payload = {
        name: name,
        price: parseInt(price),
        category: selectedCategory,
        subCategory: selectedSubCategory,
        description: description,
        isOnline: showOnWebsite,
        isNewArrival: isNewArrival,
        isBestSeller: isBestSeller,
        images: [{ url: uploadResult.secure_url, public_id: uploadResult.public_id }]
      };

      await api.post("/products", payload);
      
      toast.success(`"${name}" added to inventory`);
      
      // Reset
      setName('');
      setPrice('');
      setDescription('');
      setSelectedSubCategory('');
      clearImage();
      setShowOnWebsite(true);
      setIsNewArrival(false);
      setIsBestSeller(false);
      
      if (onSuccess) onSuccess();

    } catch (error: any) {
      console.error(error);
      toast.error(error.message || "Failed to add product");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-card rounded-2xl p-6 shadow-soft border border-border sticky top-6"
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
          <Globe className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h3 className="font-display text-xl font-semibold">Add to Online Catalog</h3>
          <p className="text-sm text-muted-foreground">New item for the website</p>
        </div>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/png, image/jpeg, image/jpg, image/webp"
        onChange={handleImageChange}
        className="hidden"
      />

      {/* Image Upload Area */}
      <div className="mb-6">
        {imagePreview ? (
          <div className="relative rounded-xl overflow-hidden bg-muted/30">
            <img 
              src={imagePreview} 
              alt="Preview" 
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
            // Disable button if currently compressing
            disabled={isCompressing}
            className="w-full h-40 rounded-xl border-2 border-dashed border-gold/30 bg-gold/5 flex flex-col items-center justify-center gap-3 transition-colors hover:border-gold/50 hover:bg-gold/10 btn-pressed"
          >
            {isCompressing ? (
               // SHOW LOADER WHEN COMPRESSING
               <div className="flex flex-col items-center gap-2 text-gold">
                  <Loader2 className="w-8 h-8 animate-spin" />
                  <span className="text-sm font-medium">Optimizing Image...</span>
               </div>
            ) : (
              <>
                <div className="w-16 h-16 rounded-full bg-gold/10 flex items-center justify-center">
                  <Camera className="w-8 h-8 text-gold" />
                </div>
                <div className="text-center">
                  <p className="font-medium text-foreground">Upload Photo *</p>
                  <p className="text-xs text-muted-foreground mt-1">JPG, PNG or WEBP only</p>
                </div>
              </>
            )}
          </motion.button>
        )}
      </div>

      {/* Name & Price Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Product Name *</label>
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Silk Saree"
            className="rounded-xl"
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Price (₹) *</label>
          <Input
            type="number"
            inputMode="numeric"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder="0"
            className="rounded-xl"
          />
        </div>
      </div>

      {/* Category Chips */}
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

      {/* Sub-Category Chips */}
      <div className="mb-4">
        <label className="text-sm font-medium mb-2 block">Sub-Category *</label>
        <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto custom-scrollbar p-1">
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
      
      {/* Description */}
      <div className="mb-6">
        <label className="text-sm font-medium mb-2 block">Description</label>
        <Textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Details about fabric, fit, etc..."
          className="rounded-xl resize-none"
          rows={2}
        />
      </div>

      {/* Toggles */}
      <div className="space-y-3 py-3 border-t border-b mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Globe className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm font-medium">Show on Website</span>
          </div>
          <Switch checked={showOnWebsite} onCheckedChange={setShowOnWebsite} />
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm font-medium">New Arrival Badge</span>
          </div>
          <Switch 
            checked={isNewArrival} 
            onCheckedChange={(c) => { setIsNewArrival(c); if(c) setIsBestSeller(false); }} 
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Star className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm font-medium">Best Seller Badge</span>
          </div>
          <Switch 
            checked={isBestSeller} 
            onCheckedChange={(c) => { setIsBestSeller(c); if(c) setIsNewArrival(false); }} 
          />
        </div>
      </div>

      {/* Submit Button */}
      <Button
        onClick={handleSubmit}
        // Also disable submit if we are currently compressing
        disabled={isSubmitting || isCompressing || !name || !price || !selectedSubCategory || !imagePreview}
        className="w-full h-12 rounded-xl gradient-gold text-foreground font-semibold btn-pressed shadow-md"
      >
        {isSubmitting ? (
          <div className="flex items-center gap-2">
             <Loader2 className="w-5 h-5 animate-spin" />
             <span>Adding...</span>
          </div>
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