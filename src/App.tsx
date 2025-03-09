
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import NotFound from "./pages/NotFound";
import DashboardLayout from "./components/layout/DashboardLayout";
import Auth from "./pages/Auth";
import { AuthProvider } from "./context/AuthContext";
import AuthRoute from "./components/auth/AuthRoute";

// Create a new client
const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <BrowserRouter>
        <AuthProvider>
          <Toaster />
          <Sonner />
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/auth" element={<Auth />} />
            
            {/* Protected routes */}
            <Route element={<AuthRoute><DashboardLayout /></AuthRoute>}>
              <Route path="/dashboard" element={<Dashboard />} />
              
              {/* Placeholder routes for the sidebar links */}
              <Route path="/food-order" element={<Dashboard />} />
              <Route path="/favorite-menu" element={<Dashboard />} />
              <Route path="/messages" element={<Dashboard />} />
              <Route path="/order-history" element={<Dashboard />} />
              <Route path="/notifications" element={<Dashboard />} />
              <Route path="/bills" element={<Dashboard />} />
              <Route path="/restaurant" element={<Dashboard />} />
              <Route path="/restaurant/menu" element={<Dashboard />} />
              <Route path="/restaurant/orders" element={<Dashboard />} />
              <Route path="/restaurant/reviews" element={<Dashboard />} />
              <Route path="/drivers" element={<Dashboard />} />
              <Route path="/settings" element={<Dashboard />} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
