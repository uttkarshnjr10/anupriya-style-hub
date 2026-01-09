import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Camera, Check, X, Loader2, ChevronDown } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { categories } from "@/data/mockData";
import { toast } from "sonner";
import { api } from "@/lib/api";
import imageCompression from 'browser-image-compression';

interface DuesDetails {
  name: string;
  phoneNumber: string;
  dueDate?: string;
}

interface PaymentMethod {
  type: "ONLINE" | "CASH" | "DUES";
  amount: number;
  duesDetails?: DuesDetails;
}

interface RecordSaleFormProps {
  onSaleSuccess?: () => void;
}

const RecordSaleForm = ({ onSaleSuccess }: RecordSaleFormProps) => {
  // Existing states
  const [selectedCategory, setSelectedCategory] = useState<'Men' | 'Women' | 'Kids'>('Men');
  const [selectedSubCategory, setSelectedSubCategory] = useState('');
  const [price, setPrice] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [isCompressing, setIsCompressing] = useState(false);
  
  // New payment states - FIXED
  const [showPaymentSection, setShowPaymentSection] = useState(false);
  const [selectedPaymentTypes, setSelectedPaymentTypes] = useState<("ONLINE" | "CASH" | "DUES")[]>(["CASH"]);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>(
    [{ type: "CASH", amount: 0 }]
  );

  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    return () => stopCamera();
  }, []);

  // Existing functions
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

  const processAndSetImage = async (file: File) => {
    setIsCompressing(true);
    try {
      const options = {
        maxSizeMB: 1,
        maxWidthOrHeight: 1920,
        useWebWorker: true,
        fileType: "image/jpeg"
      };
      
      const compressedFile = await imageCompression(file, options);
      setImageFile(compressedFile);
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
        setIsCompressing(false);
      };
      reader.readAsDataURL(compressedFile);
    } catch (error) {
      console.error("Compression error", error);
      toast.error("Error processing image");
      setIsCompressing(false);
    }
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
            processAndSetImage(file);
            stopCamera();
          }
        }, "image/jpeg", 0.8);
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processAndSetImage(file);
    }
  };

  const clearImage = () => {
    setImagePreview(null);
    setImageFile(null);
  };

  // FIXED: Payment handling functions
  const handlePaymentTypeChange = (type: "ONLINE" | "CASH" | "DUES") => {
    let updated = [...selectedPaymentTypes];
    if (updated.includes(type)) {
      updated = updated.filter((t) => t !== type);
    } else {
      updated.push(type);
    }
    setSelectedPaymentTypes(updated);

    // Create new payment methods array with proper structure
    const newMethods: PaymentMethod[] = updated.map((t) => ({
      type: t,
      amount: 0,
      duesDetails: t === "DUES" ? {
        name: "",
        phoneNumber: "",
        dueDate: ""
      } : undefined
    }));
    setPaymentMethods(newMethods);
  };

  const handlePaymentAmountChange = (type: "ONLINE" | "CASH" | "DUES", amount: number) => {
    setPaymentMethods((prev) =>
      prev.map((p) => (p.type === type ? { ...p, amount } : p))
    );
  };

  const handleDuesDetailsChange = (
    field: "name" | "phoneNumber" | "dueDate",
    value: string
  ) => {
    setPaymentMethods((prev) =>
      prev.map((p) =>
        p.type === "DUES" && p.duesDetails
          ? { ...p, duesDetails: { ...p.duesDetails, [field]: value } }
          : p
      )
    );
  };

  // FIXED: Validation function
  const validatePayment = (): boolean => {
    const totalAmount = parseFloat(price) || 0;
    const totalPaid = paymentMethods.reduce((sum, p) => sum + p.amount, 0);

    if (Math.abs(totalPaid - totalAmount) > 0.01) {
      toast.error(
        `Total paid (₹${totalPaid.toFixed(2)}) must equal total amount (₹${totalAmount.toFixed(2)})`
      );
      return false;
    }

    // Validate dues customer details
    const duesPayment = paymentMethods.find((p) => p.type === "DUES");
    if (duesPayment && duesPayment.amount > 0 && duesPayment.duesDetails) {
      if (!duesPayment.duesDetails.name?.trim()) {
        toast.error("Customer name is required for dues payment");
        return false;
      }
      if (!duesPayment.duesDetails.phoneNumber?.trim()) {
        toast.error("Customer phone is required for dues payment");
        return false;
      }
      // Validate phone number format (10 digits)
      if (!/^\d{10}$/.test(duesPayment.duesDetails.phoneNumber)) {
        toast.error("Phone number must be 10 digits");
        return false;
      }
    }

    return true;
  };

  // FIXED: Updated submit handler with correct payload structure
  const handleSubmit = async () => {
    if (!price || !selectedSubCategory) {
      toast.error("Please fill in price and category");
      return;
    }
    if (!imageFile) {
      toast.error("Please capture an image");
      return;
    }

    // Validate payment if section is shown
    if (showPaymentSection && !validatePayment()) {
      return;
    }

    setIsSubmitting(true);
    
    try {
      // 1. Get Cloudinary signature
      const signRes = await api.get("/images/sign-upload");
      if (!signRes.data.success) throw new Error("Failed to get signature");
      
      const { signature, timestamp, apiKey, folder, cloudName, transformation } = signRes.data.data;

      // 2. Upload image to Cloudinary
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

      // 3. Create product
      const productPayload = {
        name: selectedSubCategory, 
        price: parseInt(price),
        category: selectedCategory,
        subCategory: selectedSubCategory,
        images: [{ url: uploadData.secure_url, public_id: uploadData.public_id }]
      };

      const productRes = await api.post("/products", productPayload);
      const newProduct = productRes.data.data;

      // 4. FIXED: Record sale with CORRECT payment structure
      // Filter out payment methods with 0 amount
      const activePayments = paymentMethods.filter(p => p.amount > 0);
      
      const salePayload = {
        productId: newProduct._id,
        salePrice: parseInt(price),
        paymentMethods: showPaymentSection && activePayments.length > 0 
          ? activePayments 
          : [{ type: "CASH", amount: parseInt(price) }]
      };

      console.log("🚀 Sale Payload:", salePayload);
      
      // Call the correct endpoint
      const saleRes = await api.post("/transactions/sale", salePayload);
      
      if (!saleRes.data.success) {
        throw new Error(saleRes.data.message || "Failed to record sale");
      }

      toast.success(`✅ Sold ${selectedSubCategory} for ₹${price}`);
      
      // 5. Reset all states
      setPrice('');
      setSelectedSubCategory('');
      clearImage();
      setShowPaymentSection(false);
      setSelectedPaymentTypes(["CASH"]);
      setPaymentMethods([{ type: "CASH", amount: 0 }]);
      
      if (onSaleSuccess) onSaleSuccess();

    } catch (error: any) {
      console.error("❌ Error:", error);
      toast.error(error.response?.data?.message || error.message || "Failed to record sale");
    } finally {
      setIsSubmitting(false);
    }
  };

  const totalAmount = parseFloat(price) || 0;
  const totalPaid = paymentMethods.reduce((sum, p) => sum + p.amount, 0);
  const duesPayment = paymentMethods.find(p => p.type === "DUES");

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
               <Button 
                 variant="default" 
                 size="icon" 
                 className="rounded-full w-16 h-16 border-4 border-white bg-transparent" 
                 onClick={capturePhoto}
                 disabled={isCompressing}
               >
                 <div className="w-12 h-12 bg-white rounded-full" />
               </Button>
            </div>
          </div>
        ) : (
          <motion.button
            whileTap={{ scale: 0.98 }}
            onClick={startCamera}
            disabled={isCompressing}
            className="w-full h-48 rounded-xl border-2 border-dashed border-primary/30 bg-primary/5 flex flex-col items-center justify-center gap-3 hover:bg-primary/10"
          >
            {isCompressing ? (
               <div className="flex flex-col items-center gap-2 text-primary">
                  <Loader2 className="w-8 h-8 animate-spin" />
                  <span className="text-sm font-medium">Processing Image...</span>
               </div>
            ) : (
              <>
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                  <Camera className="w-8 h-8 text-primary" />
                </div>
                <p className="font-medium">Tap to Start Camera</p>
              </>
            )}
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

        {/* Payment Section Toggle */}
        {price && (
          <motion.button
            onClick={() => setShowPaymentSection(!showPaymentSection)}
            className="w-full p-4 rounded-xl border border-border hover:border-primary/50 bg-muted/30 flex items-center justify-between transition-all"
          >
            <div className="text-left">
              <p className="text-sm font-medium">Payment Details</p>
              <p className="text-xs text-muted-foreground">Optional: Add payment type details</p>
            </div>
            <ChevronDown className={`w-5 h-5 transition-transform ${showPaymentSection ? 'rotate-180' : ''}`} />
          </motion.button>
        )}

        {/* Payment Details Section - FIXED */}
        {showPaymentSection && price && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className="space-y-4 p-4 rounded-xl bg-muted/30 border border-border"
          >
            <h4 className="font-semibold text-sm">Payment Methods</h4>
            
            {/* Payment Type Selection */}
            <div className="flex gap-4 flex-wrap">
              {(["ONLINE", "CASH", "DUES"] as const).map((type) => (
                <div key={type} className="flex items-center gap-2">
                  <Checkbox
                    id={type}
                    checked={selectedPaymentTypes.includes(type)}
                    onCheckedChange={() => handlePaymentTypeChange(type)}
                  />
                  <label
                    htmlFor={type}
                    className="text-sm font-medium capitalize cursor-pointer"
                  >
                    {type}
                  </label>
                </div>
              ))}
            </div>

            {/* Payment Amount Inputs - FIXED */}
            <div className="space-y-4 mt-4">
              {paymentMethods.map((payment) => (
                <div key={payment.type} className="space-y-2">
                  <label className="text-xs font-semibold uppercase text-muted-foreground">
                    {payment.type} Payment
                  </label>
                  <Input
                    type="number"
                    min="0"
                    step="0.01"
                    value={payment.amount}
                    onChange={(e) =>
                      handlePaymentAmountChange(
                        payment.type,
                        parseFloat(e.target.value) || 0
                      )
                    }
                    placeholder="0.00"
                    className="text-lg font-semibold"
                  />

                  {/* Dues Customer Details - FIXED */}
                  {payment.type === "DUES" && payment.amount > 0 && payment.duesDetails && (
                    <div className="space-y-3 mt-3 p-3 rounded-lg bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-900">
                      <div>
                        <label className="text-xs font-semibold text-muted-foreground block mb-1">
                          Customer Name *
                        </label>
                        <Input
                          type="text"
                          placeholder="e.g., Rohit Kumar"
                          value={payment.duesDetails.name || ""}
                          onChange={(e) =>
                            handleDuesDetailsChange("name", e.target.value)
                          }
                          className="text-sm"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-muted-foreground block mb-1">
                          Customer Phone *
                        </label>
                        <Input
                          type="tel"
                          placeholder="10-digit number"
                          maxLength={10}
                          value={payment.duesDetails.phoneNumber || ""}
                          onChange={(e) =>
                            handleDuesDetailsChange("phoneNumber", e.target.value.replace(/\D/g, ''))
                          }
                          className="text-sm"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-muted-foreground block mb-1">
                          Due Date (Optional)
                        </label>
                        <Input
                          type="date"
                          value={payment.duesDetails.dueDate || ""}
                          onChange={(e) =>
                            handleDuesDetailsChange("dueDate", e.target.value)
                          }
                          className="text-sm"
                          min={new Date().toISOString().split('T')[0]}
                        />
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Amount Summary */}
            <div className="bg-background rounded-lg p-3 space-y-2 border border-border">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Total Amount:</span>
                <span className="font-semibold">₹{totalAmount.toFixed(2)}</span>
              </div>
              <div className={`flex justify-between text-sm font-semibold ${
                Math.abs(totalPaid - totalAmount) < 0.01 ? 'text-success' : 'text-destructive'
              }`}>
                <span>Total Paid:</span>
                <span>₹{totalPaid.toFixed(2)}</span>
              </div>
              {Math.abs(totalPaid - totalAmount) > 0.01 && (
                <div className="text-xs text-destructive mt-2">
                  ⚠️ Difference: ₹{Math.abs(totalPaid - totalAmount).toFixed(2)}
                </div>
              )}
            </div>
          </motion.div>
        )}

        <Button
          onClick={handleSubmit}
          disabled={isSubmitting || isCompressing || !price || !selectedSubCategory}
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