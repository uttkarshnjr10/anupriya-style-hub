import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/context/AuthContext"; // <--- Import Provider

// Pages
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
import ProtectedRoute from "./layout/ProtectedRoute";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      {/* 1. Wrap App in AuthProvider */}
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Index />} />
            <Route path="/shop" element={<Shop />} />
            <Route path="/login" element={<Login />} />

            {/* Owner Protected Routes */}
            <Route element={<ProtectedRoute allowedRole="owner" />}>
               <Route path="/owner" element={<Owner />} />
               <Route path="/owner/sales" element={<OwnerSalesHistory />} />
               <Route path="/owner/inventory" element={<OwnerInventoryHistory />} />
            </Route>

            {/* Staff Protected Routes */}
            <Route element={<ProtectedRoute allowedRole="staff" />}>
               <Route path="/staff" element={<Staff />} />
               <Route path="/staff/billing" element={<StaffBilling />} />
               <Route path="/staff/inventory" element={<StaffInventory />} />
            </Route>

            {/* Fallback */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;