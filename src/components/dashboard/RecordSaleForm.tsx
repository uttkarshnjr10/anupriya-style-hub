import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Camera, Check, X, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { categories } from "@/data/mockData";
import { toast } from "sonner";
import { api } from "@/lib/api";

// Added Prop Interface
interface RecordSaleFormProps {
  onSaleSuccess?: () => void;
}

const RecordSaleForm = ({ onSaleSuccess }: RecordSaleFormProps) => {
  const [selectedCategory, setSelectedCategory] = useState<'Men' | 'Women' | 'Kids'>('Men');
  const [selectedSubCategory, setSelectedSubCategory] = useState('');
  const [price, setPrice] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    return () => stopCamera();
  }, []);

  const startCamera = async () => {
    try {
      setIsCameraOpen(true);
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: "environment" } 
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.error("Camera Error:", err);
      toast.error("Camera access failed. Please upload a file.");
      fileInputRef.current?.click();
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setIsCameraOpen(false);
  };

  const capturePhoto = () => {
    if (videoRef.current) {
      const video = videoRef.current;
      const canvas = document.createElement("canvas");
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        canvas.toBlob((blob) => {
          if (blob) {
            const file = new File([blob], "captured-sale.jpg", { type: "image/jpeg" });
            setImageFile(file);
            setImagePreview(URL.createObjectURL(blob));
            stopCamera();
          }
        }, "image/jpeg", 0.8);
      }
    }
  };

  const clearImage = () => {
    setImagePreview(null);
    setImageFile(null);
  };

  const handleSubmit = async () => {
    if (!price || !selectedSubCategory) {
      toast.error("Please fill in price and category");
      return;
    }
    if (!imageFile) {
      toast.error("Please capture an image");
      return;
    }

    setIsSubmitting(true);
    
    try {
      // 1. Get Signature
      const signRes = await api.get("/images/sign-upload");
      if (!signRes.data.success) throw new Error("Failed to get signature");
      
      const { signature, timestamp, apiKey, folder, cloudName, transformation } = signRes.data.data;

      // 2. Upload
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

      if (!uploadRes.ok) throw new Error("Image upload failed");
      const uploadData = await uploadRes.json();

      // 3. Create Product
      const productPayload = {
        name: selectedSubCategory, 
        price: parseInt(price),
        category: selectedCategory,
        subCategory: selectedSubCategory,
        images: [{ url: uploadData.secure_url, public_id: uploadData.public_id }]
      };

      const productRes = await api.post("/products", productPayload);
      const newProduct = productRes.data.data;

      // 4. Record Sale
      await api.post("/transactions/sale", {
        productId: newProduct._id,
        salePrice: parseInt(price)
      });
      
      toast.success(`Sold ${selectedSubCategory} for ₹${price}`);
      setPrice('');
      setSelectedSubCategory('');
      clearImage();
      
      // REFRESH PARENT LIST
      if (onSaleSuccess) onSaleSuccess();

    } catch (error) {
      console.error(error);
      toast.error("Failed to record sale.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const fileInputRef = useRef<HTMLInputElement>(null);
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(file);
    }
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

      <input 
        type="file" 
        ref={fileInputRef} 
        className="hidden" 
        accept="image/*" 
        onChange={handleFileChange} 
      />

      {/* Camera Area */}
      <div className="mb-6">
        {imagePreview ? (
          <div className="relative rounded-xl overflow-hidden aspect-video bg-black">
            <img src={imagePreview} alt="Captured" className="w-full h-full object-contain" />
            <button
              onClick={clearImage}
              className="absolute top-2 right-2 p-2 bg-destructive text-white rounded-full shadow-lg"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ) : isCameraOpen ? (
          <div className="relative rounded-xl overflow-hidden aspect-video bg-black">
            <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover" />
            <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-4">
               <Button variant="destructive" size="icon" className="rounded-full w-12 h-12" onClick={stopCamera}>
                 <X className="w-6 h-6" />
               </Button>
               <Button variant="default" size="icon" className="rounded-full w-16 h-16 border-4 border-white bg-transparent" onClick={capturePhoto}>
                 <div className="w-12 h-12 bg-white rounded-full" />
               </Button>
            </div>
          </div>
        ) : (
          <motion.button
            whileTap={{ scale: 0.98 }}
            onClick={startCamera}
            className="w-full h-48 rounded-xl border-2 border-dashed border-primary/30 bg-primary/5 flex flex-col items-center justify-center gap-3 hover:bg-primary/10"
          >
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
              <Camera className="w-8 h-8 text-primary" />
            </div>
            <p className="font-medium">Tap to Start Camera</p>
          </motion.button>
        )}
      </div>

      {/* Inputs */}
      <div className="space-y-6">
        <div>
          <label className="text-sm font-medium mb-2 block">Sale Amount (₹) *</label>
          <Input
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="text-3xl font-bold h-16 rounded-xl text-center"
            placeholder="0"
          />
        </div>

        <div>
          <label className="text-sm font-medium mb-2 block">Category *</label>
          <div className="flex flex-wrap gap-2">
            {(['Men', 'Women', 'Kids'] as const).map((cat) => (
              <button
                key={cat}
                onClick={() => { setSelectedCategory(cat); setSelectedSubCategory(''); }}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  selectedCategory === cat 
                    ? 'bg-primary text-primary-foreground shadow-md' 
                    : 'bg-muted hover:bg-muted/80'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="text-sm font-medium mb-2 block">Sub-Category *</label>
          <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto">
            {categories[selectedCategory].map((sub) => (
              <button
                key={sub}
                onClick={() => setSelectedSubCategory(sub)}
                className={`px-3 py-1.5 rounded-full text-sm transition-all border ${
                  selectedSubCategory === sub
                    ? 'border-primary bg-primary/10 text-primary'
                    : 'border-border hover:border-primary/50'
                }`}
              >
                {sub}
              </button>
            ))}
          </div>
        </div>

        <Button
          onClick={handleSubmit}
          disabled={isSubmitting || !price || !selectedSubCategory}
          className="w-full h-14 rounded-xl gradient-gold text-foreground font-semibold text-lg"
        >
          {isSubmitting ? (
            <div className="flex items-center gap-2">
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>Processing...</span>
            </div>
          ) : (
            <>
              <Check className="w-6 h-6 mr-2" />
              Record Sale
            </>
          )}
        </Button>
      </div>
    </motion.div>
  );
};

export default RecordSaleForm;