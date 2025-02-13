
import { Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { lazy, Suspense } from "react";
import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";

const Index = lazy(() => import("./pages/Index"));
const Blog = lazy(() => import("./pages/Blog"));
const About = lazy(() => import("./pages/About"));
const Contact = lazy(() => import("./pages/Contact"));
const Services = lazy(() => import("./pages/Services"));
const CaseStudies = lazy(() => import("./pages/CaseStudies"));

// Shared loading component
const LoadingFallback = () => (
  <div className="container py-24">Loading...</div>
);

const App = () => {
  return (
    <TooltipProvider>
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow">
          <Suspense fallback={<LoadingFallback />}>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/blog" element={<Blog />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/services" element={<Services />} />
              <Route path="/case-studies" element={<CaseStudies />} />
            </Routes>
          </Suspense>
        </main>
        <Footer />
      </div>
      <Toaster />
      <Sonner />
    </TooltipProvider>
  );
};

export default App;
