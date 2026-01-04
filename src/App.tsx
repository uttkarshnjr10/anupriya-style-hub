import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Shop from "./pages/Shop";
import Staff from "./pages/Staff";
import StaffBilling from "./pages/StaffBilling";
import StaffInventory from "./pages/StaffInventory";
import Owner from "./pages/Owner";
import OwnerSalesHistory from "./pages/OwnerSalesHistory";
import OwnerInventoryHistory from "./pages/OwnerInventoryHistory";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/login" element={<Login />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/staff" element={<Staff />} />
          <Route path="/staff/billing" element={<StaffBilling />} />
          <Route path="/staff/inventory" element={<StaffInventory />} />
          <Route path="/owner" element={<Owner />} />
          <Route path="/owner/sales-history" element={<OwnerSalesHistory />} />
          <Route path="/owner/inventory-history" element={<OwnerInventoryHistory />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
