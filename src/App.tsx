
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Gallery from "./pages/Gallery";
import Reviews from "./pages/Reviews";
import Contact from "./pages/Contact";
import NotFound from "./pages/NotFound";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import CallToAction from "./components/CallToAction";
import Services from "./pages/Services";
import About from "./pages/About";
import Account from "./pages/Account";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import { CartProvider } from "./contexts/CartContext";
import CommandButton from "./components/CommandButton";
import Tracking from "./pages/Tracking";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <CartProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <div className="flex flex-col min-h-screen">
            <Navbar />
            <main className="flex-grow">
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/galerie" element={<Gallery />} />
                <Route path="/avis" element={<Reviews />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/services" element={<Services />} />
                <Route path="/a-propos" element={<About />} />
                <Route path="/mon-compte" element={<Account />} />
                <Route path="/panier" element={<Cart />} />
                <Route path="/paiement" element={<Checkout />} />
                <Route path="/suivi" element={<Tracking />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
              <CommandButton />
            </main>
            <Footer />
            <CallToAction phoneNumber="+228 71014747" />
          </div>
        </BrowserRouter>
      </TooltipProvider>
    </CartProvider>
  </QueryClientProvider>
);

export default App;
