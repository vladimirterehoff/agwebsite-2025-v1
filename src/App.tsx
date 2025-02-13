
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

// Shared loading component for routes
const LoadingFallback = () => (
  <div className="container py-24 flex items-center justify-center">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
  </div>
);

const App = () => {
  return (
    <TooltipProvider>
      <Suspense fallback={<LoadingFallback />}>
        <div className="flex flex-col min-h-screen">
          <Header />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={
                <Suspense fallback={<LoadingFallback />}>
                  <Index />
                </Suspense>
              } />
              <Route path="/blog" element={
                <Suspense fallback={<LoadingFallback />}>
                  <Blog />
                </Suspense>
              } />
              <Route path="/about" element={
                <Suspense fallback={<LoadingFallback />}>
                  <About />
                </Suspense>
              } />
              <Route path="/contact" element={
                <Suspense fallback={<LoadingFallback />}>
                  <Contact />
                </Suspense>
              } />
              <Route path="/services" element={
                <Suspense fallback={<LoadingFallback />}>
                  <Services />
                </Suspense>
              } />
              <Route path="/case-studies" element={
                <Suspense fallback={<LoadingFallback />}>
                  <CaseStudies />
                </Suspense>
              } />
            </Routes>
          </main>
          <Footer />
        </div>
        <Toaster />
        <Sonner />
      </Suspense>
    </TooltipProvider>
  );
};

export default App;
