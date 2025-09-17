
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import Onboarding from "./pages/Onboarding";
import Claims from "./pages/Claims";
import Policies from "./pages/Policies";
import PetIdentity from "./pages/PetIdentity";
import AIAssistant from "./pages/AIAssistant";
import APITest from "./pages/APITest";
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
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/onboarding" element={<Onboarding />} />
          <Route path="/claims" element={<Claims />} />
          <Route path="/policies" element={<Policies />} />
          <Route path="/pet-identity" element={<PetIdentity />} />
          <Route path="/ai-chat" element={<AIAssistant />} />
          <Route path="/api-test" element={<APITest />} />
          {/* VetPortal removed - functionality consolidated into AI Assistant */}
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
