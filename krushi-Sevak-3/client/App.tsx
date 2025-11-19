import "./global.css";

import { Toaster } from "@/components/ui/toaster";
import { createRoot } from "react-dom/client";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Outlet, Navigate } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Crops from "./pages/Crops";
import Schemes from "./pages/Schemes";
import Weather from "./pages/Weather";
import Experts from "./pages/Experts";
import Distributors from "./pages/Distributors";
import Admin from "./pages/Admin";
import Finance from "./pages/Finance";
import Login from "./pages/Login";
import Header from "@/site/Header";
import Footer from "@/site/Footer";
import { LanguageProvider } from "@/site/i18n";
import { AuthProvider, useAuth } from "@/lib/auth";

const queryClient = new QueryClient();

function Layout() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="flex-1">
        <Outlet />
      </div>
      <Footer />
    </div>
  );
}

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isLoggedIn } = useAuth();
  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }
  return children;
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <LanguageProvider>
        <AuthProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route element={<Layout />}>
                <Route index element={<Index />} />
                <Route path="crops" element={<ProtectedRoute><Crops /></ProtectedRoute>} />
                <Route path="schemes" element={<Schemes />} />
                <Route path="weather" element={<Weather />} />
                <Route path="experts" element={<Experts />} />
                <Route path="distributors" element={<Distributors />} />
                <Route path="admin" element={<Admin />} />
                <Route path="finance" element={<ProtectedRoute><Finance /></ProtectedRoute>} />
                <Route path="*" element={<NotFound />} />
              </Route>
            </Routes>
          </BrowserRouter>
        </AuthProvider>
      </LanguageProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

createRoot(document.getElementById("root")!).render(<App />);
