import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Owner from "./pages/Owner";
import Staff from "./pages/Staff";
import Shop from "./pages/Shop";
import NotFound from "./pages/NotFound";
import OwnerSalesHistory from "./pages/OwnerSalesHistory";
import OwnerInventoryHistory from "./pages/OwnerInventoryHistory";
import StaffBilling from "./pages/StaffBilling";
import StaffInventory from "./pages/StaffInventory";
import ProtectedRoute from "./components/layout/ProtectedRoute"; 

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Index />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/login" element={<Login />} />

          {/* Owner Routes - We will rely on API 401 checks for now */}
          <Route path="/owner" element={<Owner />} />
          <Route path="/owner/sales" element={<OwnerSalesHistory />} />
          <Route path="/owner/inventory" element={<OwnerInventoryHistory />} />

          {/* Staff Routes */}
          <Route path="/staff" element={<Staff />} />
          <Route path="/staff/billing" element={<StaffBilling />} />
          <Route path="/staff/inventory" element={<StaffInventory />} />

          {/* Fallback */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;