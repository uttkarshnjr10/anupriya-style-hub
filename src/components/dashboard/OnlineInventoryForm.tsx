// import { useState, useRef } from "react";
// import { motion } from "framer-motion";
// import { Camera, Upload, X, Star, Sparkles, Globe } from "lucide-react";
// import { Input } from "@/components/ui/input";
// import { Textarea } from "@/components/ui/textarea";
// import { Button } from "@/components/ui/button";
// import { Switch } from "@/components/ui/switch";
// import { categories } from "@/data/mockData";
// import { toast } from "sonner";

// interface OnlineInventoryFormProps {
//   onItemAdded?: () => void;
// }

// const OnlineInventoryForm = ({ onItemAdded }: OnlineInventoryFormProps) => {
//   const [selectedCategory, setSelectedCategory] = useState<'Men' | 'Women' | 'Kids'>('Men');
//   const [selectedSubCategory, setSelectedSubCategory] = useState('');
//   const [name, setName] = useState('');
//   const [price, setPrice] = useState('');
//   const [description, setDescription] = useState('');
//   const [showOnWebsite, setShowOnWebsite] = useState(true);
//   const [isNewArrival, setIsNewArrival] = useState(false);
//   const [isBestSeller, setIsBestSeller] = useState(false);
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [imagePreview, setImagePreview] = useState<string | null>(null);
//   const fileInputRef = useRef<HTMLInputElement>(null);

//   const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     if (file) {
//       const reader = new FileReader();
//       reader.onloadend = () => {
//         setImagePreview(reader.result as string);
//       };
//       reader.readAsDataURL(file);
//     }
//   };

//   const triggerFileInput = () => {
//     fileInputRef.current?.click();
//   };

//   const clearImage = () => {
//     setImagePreview(null);
//     if (fileInputRef.current) {
//       fileInputRef.current.value = '';
//     }
//   };

//   const handleSubmit = async () => {
//     if (!name || !price || !selectedSubCategory || !imagePreview) {
//       toast.error("Please fill in all required fields and add an image");
//       return;
//     }

//     setIsSubmitting(true);
//     await new Promise(resolve => setTimeout(resolve, 1000));
    
//     toast.success(`"${name}" added to online inventory`);
    
//     // Reset form
//     setName('');
//     setPrice('');
//     setDescription('');
//     setSelectedSubCategory('');
//     setImagePreview(null);
//     setShowOnWebsite(true);
//     setIsNewArrival(false);
//     setIsBestSeller(false);
//     if (fileInputRef.current) {
//       fileInputRef.current.value = '';
//     }
//     setIsSubmitting(false);
//     onItemAdded?.();
//   };

//   return (
//     <motion.div
//       initial={{ opacity: 0, y: 20 }}
//       animate={{ opacity: 1, y: 0 }}
//       className="bg-card rounded-2xl p-6 shadow-soft border border-border"
//     >
//       <div className="flex items-center gap-3 mb-6">
//         <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
//           <Globe className="w-5 h-5 text-primary" />
//         </div>
//         <div>
//           <h3 className="font-display text-xl font-semibold">Add to Online Catalog</h3>
//           <p className="text-sm text-muted-foreground">This item will appear on the website</p>
//         </div>
//       </div>

//       {/* Hidden file input */}
//       <input
//         ref={fileInputRef}
//         type="file"
//         accept="image/*"
//         capture="environment"
//         onChange={handleImageChange}
//         className="hidden"
//       />

//       {/* Image Upload Area */}
//       <div className="mb-6">
//         {imagePreview ? (
//           <div className="relative rounded-xl overflow-hidden">
//             <img 
//               src={imagePreview} 
//               alt="Product preview" 
//               className="w-full h-48 object-cover"
//             />
//             <button
//               onClick={clearImage}
//               className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full shadow-lg btn-pressed"
//             >
//               <X className="w-4 h-4" />
//             </button>
//           </div>
//         ) : (
//           <motion.button
//             whileTap={{ scale: 0.98 }}
//             onClick={triggerFileInput}
//             className="w-full h-40 rounded-xl border-2 border-dashed border-gold/30 bg-gold/5 flex flex-col items-center justify-center gap-3 transition-colors hover:border-gold/50 hover:bg-gold/10 btn-pressed"
//           >
//             <div className="w-16 h-16 rounded-full bg-gold/10 flex items-center justify-center">
//               <Camera className="w-8 h-8 text-gold" />
//             </div>
//             <p className="font-medium text-foreground">Upload Product Photo *</p>
//             <p className="text-sm text-muted-foreground">High quality image for the website</p>
//           </motion.button>
//         )}
//       </div>

//       {/* Product Name */}
//       <div className="mb-4">
//         <label className="text-sm font-medium mb-2 block">Product Name *</label>
//         <Input
//           value={name}
//           onChange={(e) => setName(e.target.value)}
//           placeholder="e.g., Royal Silk Sherwani"
//           className="rounded-xl"
//         />
//       </div>

//       {/* Price Input */}
//       <div className="mb-4">
//         <label className="text-sm font-medium mb-2 block">Price (₹) *</label>
//         <Input
//           type="number"
//           inputMode="numeric"
//           value={price}
//           onChange={(e) => setPrice(e.target.value)}
//           placeholder="Enter price"
//           className="text-xl font-bold h-12 rounded-xl"
//         />
//       </div>

//       {/* Description */}
//       <div className="mb-4">
//         <label className="text-sm font-medium mb-2 block">Description</label>
//         <Textarea
//           value={description}
//           onChange={(e) => setDescription(e.target.value)}
//           placeholder="Add a description for customers..."
//           className="rounded-xl resize-none"
//           rows={2}
//         />
//       </div>

//       {/* Category Selection */}
//       <div className="mb-4">
//         <label className="text-sm font-medium mb-2 block">Category *</label>
//         <div className="flex flex-wrap gap-2">
//           {(['Men', 'Women', 'Kids'] as const).map((cat) => (
//             <motion.button
//               key={cat}
//               whileTap={{ scale: 0.95 }}
//               onClick={() => { setSelectedCategory(cat); setSelectedSubCategory(''); }}
//               className={`category-chip ${selectedCategory === cat ? 'active' : ''}`}
//             >
//               {cat}
//             </motion.button>
//           ))}
//         </div>
//       </div>

//       {/* Sub-Category Selection */}
//       <div className="mb-6">
//         <label className="text-sm font-medium mb-2 block">Sub-Category *</label>
//         <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto">
//           {categories[selectedCategory].map((sub) => (
//             <motion.button
//               key={sub}
//               whileTap={{ scale: 0.95 }}
//               onClick={() => setSelectedSubCategory(sub)}
//               className={`category-chip text-sm ${selectedSubCategory === sub ? 'active' : ''}`}
//             >
//               {sub}
//             </motion.button>
//           ))}
//         </div>
//       </div>

//       {/* Toggles */}
//       <div className="space-y-4 py-4 border-t border-b mb-6">
//         <div className="flex items-center justify-between">
//           <div className="flex items-center gap-2">
//             <Globe className="w-4 h-4 text-muted-foreground" />
//             <div>
//               <p className="font-medium text-sm">Show on Website</p>
//               <p className="text-xs text-muted-foreground">Visible to customers</p>
//             </div>
//           </div>
//           <Switch checked={showOnWebsite} onCheckedChange={setShowOnWebsite} />
//         </div>

//         <div className="flex items-center justify-between">
//           <div className="flex items-center gap-2">
//             <Sparkles className="w-4 h-4 text-muted-foreground" />
//             <div>
//               <p className="font-medium text-sm">Mark as New Arrival</p>
//               <p className="text-xs text-muted-foreground">Shows "New" badge</p>
//             </div>
//           </div>
//           <Switch 
//             checked={isNewArrival} 
//             onCheckedChange={(checked) => {
//               setIsNewArrival(checked);
//               if (checked) setIsBestSeller(false);
//             }} 
//           />
//         </div>

//         <div className="flex items-center justify-between">
//           <div className="flex items-center gap-2">
//             <Star className="w-4 h-4 text-muted-foreground" />
//             <div>
//               <p className="font-medium text-sm">Mark as Best Seller</p>
//               <p className="text-xs text-muted-foreground">Shows "Best Seller" badge</p>
//             </div>
//           </div>
//           <Switch 
//             checked={isBestSeller} 
//             onCheckedChange={(checked) => {
//               setIsBestSeller(checked);
//               if (checked) setIsNewArrival(false);
//             }} 
//           />
//         </div>
//       </div>

//       {/* Submit Button */}
//       <Button
//         onClick={handleSubmit}
//         disabled={isSubmitting || !name || !price || !selectedSubCategory || !imagePreview}
//         className="w-full h-12 rounded-xl gradient-gold text-foreground font-semibold btn-pressed"
//       >
//         {isSubmitting ? (
//           <div className="w-5 h-5 border-2 border-foreground/30 border-t-foreground rounded-full animate-spin" />
//         ) : (
//           <>
//             <Upload className="w-5 h-5 mr-2" />
//             Add to Online Catalog
//           </>
//         )}
//       </Button>
//     </motion.div>
//   );
// };

// export default OnlineInventoryForm;
import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { Camera, Upload, X, Star, Sparkles, Globe, Loader2, Image as ImageIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { categories } from "@/data/mockData";
import { toast } from "sonner";
import { api } from "@/lib/api";

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
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate File Type manually to be safe
      const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];
      if (!validTypes.includes(file.type)) {
        toast.error("Format not supported. Please use JPG, PNG, or WEBP.");
        return;
      }

      setImageFile(file);
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

    try {
      // 1. Get Signature
      const signRes = await api.get("/images/sign-upload");
      if (!signRes.data.success) throw new Error("Signature failed");
      
      const { signature, timestamp, apiKey, folder, cloudName, transformation } = signRes.data.data;

      // 2. Upload to Cloudinary
      const formData = new FormData();
      formData.append("file", imageFile);
      formData.append("api_key", apiKey);
      formData.append("timestamp", timestamp);
      formData.append("signature", signature);
      
      if (folder) formData.append("folder", folder);
      if (transformation) formData.append("transformation", transformation);
      
      // Strict format requirement from backend
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
        accept="image/*"
        capture="environment"
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
            className="w-full h-40 rounded-xl border-2 border-dashed border-gold/30 bg-gold/5 flex flex-col items-center justify-center gap-3 transition-colors hover:border-gold/50 hover:bg-gold/10 btn-pressed"
          >
            <div className="w-16 h-16 rounded-full bg-gold/10 flex items-center justify-center">
              <Camera className="w-8 h-8 text-gold" />
            </div>
            <div className="text-center">
              <p className="font-medium text-foreground">Upload Photo *</p>
              <p className="text-xs text-muted-foreground mt-1">JPG, PNG or WEBP only</p>
            </div>
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
        disabled={isSubmitting || !name || !price || !selectedSubCategory || !imagePreview}
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