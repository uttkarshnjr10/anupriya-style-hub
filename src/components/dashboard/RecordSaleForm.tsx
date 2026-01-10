import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Camera, Check, X, Loader2, ChevronDown, ChevronUp } from "lucide-react"; // 1. Added Icons
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { categories } from "@/data/mockData";
import { toast } from "sonner";
import { api } from "@/lib/api";
import imageCompression from "browser-image-compression";

// Import the PaymentSection
import { PaymentSection, PaymentState } from "./components/PaymentSection";

interface RecordSaleFormProps {
  onSaleSuccess?: () => void;
}

const RecordSaleForm = ({ onSaleSuccess }: RecordSaleFormProps) => {
  // ── Core States ───────────────────────────────────────────────────────────
  const [selectedCategory, setSelectedCategory] = useState<"Men" | "Women" | "Kids">("Men");
  const [selectedSubCategory, setSelectedSubCategory] = useState("");
  const [price, setPrice] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // ── Image States ─────────────────────────────────────────────────────────
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [isCompressing, setIsCompressing] = useState(false);

  // ── Payment Logic (FIXED) ────────────────────────────────────────────────
  const [showPayment, setShowPayment] = useState(false); // 2. Added Toggle State
  const [paymentState, setPaymentState] = useState<PaymentState>({
    status: "PAID",
    mode: "ONLINE",
    partialAmount: "",
    customerName: "",
    customerPhone: "",
    dueDate: ""
  });

  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // ── Lifecycle ────────────────────────────────────────────────────────────
  useEffect(() => {
    return () => stopCamera();
  }, []);

  // ── Camera Controls ──────────────────────────────────────────────────────
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

  // ── Image Processing ─────────────────────────────────────────────────────
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
    if (!videoRef.current) return;

    const video = videoRef.current;
    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext("2d");

    if (ctx) {
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

      canvas.toBlob(
        (blob) => {
          if (blob) {
            const file = new File([blob], "captured-sale.jpg", { type: "image/jpeg" });
            processAndSetImage(file);
            stopCamera();
          }
        },
        "image/jpeg",
        0.8
      );
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processAndSetImage(file);
  };

  const clearImage = () => {
    setImagePreview(null);
    setImageFile(null);
  };

  // ── Payment Validation ───────────────────────────────────────────────────
  const validatePayment = () => {
    if (showPayment && paymentState.status === "DUE") { // Only validate if section is open
      if (!paymentState.customerName.trim()) {
        toast.error("Customer Name is required for Dues");
        return false;
      }
      if (paymentState.customerPhone.length !== 10) {
        toast.error("Valid 10-digit Phone Number is required");
        return false;
      }

      const partial = Number(paymentState.partialAmount);
      const total = parseFloat(price);
      if (partial > total) {
        toast.error("Partial amount cannot exceed total price");
        return false;
      }
    }
    return true;
  };

  // ── Form Submission ──────────────────────────────────────────────────────
  const handleSubmit = async () => {
    if (!price || !selectedSubCategory) {
      toast.error("Please fill in price and category");
      return;
    }
    if (!imageFile) {
      toast.error("Please capture an image");
      return;
    }

    // Only validate payment if the section is actually being used
    if (showPayment && !validatePayment()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // 1. Get Cloudinary signature
      const signRes = await api.get("/images/sign-upload");
      if (!signRes.data.success) throw new Error("Failed to get signature");

      const { signature, timestamp, apiKey, folder, cloudName, transformation } = signRes.data.data;

      // 2. Upload image
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

      // 4. Prepare sale payload
      const totalAmount = parseFloat(price);
      let finalPaidAmount = totalAmount; // Default to full payment if section hidden
      let finalPaymentMode: string | undefined = "CASH"; // Default fallback
      
      // If payment section is OPEN, use the granular data
      if (showPayment) {
          if (paymentState.status === "PAID") {
            finalPaidAmount = totalAmount;
            finalPaymentMode = paymentState.mode;
          } else {
            // DUE status
            finalPaidAmount = Number(paymentState.partialAmount) || 0;
            finalPaymentMode = finalPaidAmount > 0 ? paymentState.mode : undefined;
          }
      }

      const salePayload = {
        productId: newProduct._id,
        salePrice: totalAmount,
        amountPaid: finalPaidAmount,
        paymentMode: finalPaymentMode,
        customer: (showPayment && paymentState.status === "DUE")
          ? {
              name: paymentState.customerName,
              phoneNumber: paymentState.customerPhone
            }
          : undefined,
        dueDate: (showPayment && paymentState.dueDate) ? paymentState.dueDate : undefined
      };

      const saleRes = await api.post("/transactions/sale", salePayload);

      if (!saleRes.data.success) {
        throw new Error(saleRes.data.message || "Failed to record sale");
      }

      toast.success(`Sold ${selectedSubCategory} for ₹${price}`);

      // Reset form
      setPrice("");
      setSelectedSubCategory("");
      clearImage();
      setShowPayment(false); // Close the toggle
      setPaymentState({
        status: "PAID",
        mode: "ONLINE",
        partialAmount: "",
        customerName: "",
        customerPhone: "",
        dueDate: ""
      });

      onSaleSuccess?.();
    } catch (error: any) {
      console.error("Error recording sale:", error);
      toast.error(error.response?.data?.message || "Failed to record sale");
    } finally {
      setIsSubmitting(false);
    }
  };

  // ── Render ───────────────────────────────────────────────────────────────
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-card rounded-2xl p-6 shadow-soft border border-border"
    >
      {/* Header */}
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

      {/* Camera / Image Area */}
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
              <Button
                variant="destructive"
                size="icon"
                className="rounded-full w-12 h-12"
                onClick={stopCamera}
              >
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

      {/* Form Fields */}
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
            {(["Men", "Women", "Kids"] as const).map((cat) => (
              <button
                key={cat}
                onClick={() => {
                  setSelectedCategory(cat);
                  setSelectedSubCategory("");
                }}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  selectedCategory === cat
                    ? "bg-primary text-primary-foreground shadow-md"
                    : "bg-muted hover:bg-muted/80"
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
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-border hover:border-primary/50"
                }`}
              >
                {sub}
              </button>
            ))}
          </div>
        </div>

        {/* ── PAYMENT SECTION (TOGGLEABLE) ── */}
        {price && (
          <div className="border border-border rounded-xl overflow-hidden bg-card/50">
            <button
              onClick={() => setShowPayment(!showPayment)}
              className="w-full flex items-center justify-between p-4 bg-muted/20 hover:bg-muted/40 transition-colors"
            >
              <div className="flex flex-col items-start text-left">
                <span className="font-semibold text-sm">Payment Details</span>
                <span className="text-xs text-muted-foreground">
                  {showPayment ? "Click to collapse" : "Optional: Record dues or split payments"}
                </span>
              </div>
              {showPayment ? (
                <ChevronUp className="w-5 h-5 text-muted-foreground" />
              ) : (
                <ChevronDown className="w-5 h-5 text-muted-foreground" />
              )}
            </button>

            {showPayment && (
              <div className="p-4 border-t border-border bg-background">
                <PaymentSection
                  paymentState={paymentState}
                  onChange={setPaymentState} // FIXED: Changed from setPaymentState to onChange
                  totalAmount={parseFloat(price) || 0}
                />
              </div>
            )}
          </div>
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