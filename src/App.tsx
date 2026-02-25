import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import EmailWriter from "./pages/EmailWriter";
import StressCoping from "./pages/StressCoping";
import Games from "./pages/Games";
import TimeManager from "./pages/TimeManager";
import StretchingGuide from "./pages/StretchingGuide";
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
          <Route path="/email-writer" element={<EmailWriter />} />
          <Route path="/stress-coping" element={<StressCoping />} />
          <Route path="/games" element={<Games />} />
          <Route path="/planner" element={<TimeManager />} />
          <Route path="/stretching" element={<StretchingGuide />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
