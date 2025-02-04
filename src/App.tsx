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

const App = () => {
  return (
    <TooltipProvider>
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow">
          <Routes>
            <Route
              path="/"
              element={
                <Suspense fallback={<div className="container py-24">Loading...</div>}>
                  <Index />
                </Suspense>
              }
            />
            <Route
              path="/blog"
              element={
                <Suspense fallback={<div className="container py-24">Loading...</div>}>
                  <Blog />
                </Suspense>
              }
            />
            <Route
              path="/about"
              element={
                <Suspense fallback={<div className="container py-24">Loading...</div>}>
                  <About />
                </Suspense>
              }
            />
            <Route
              path="/contact"
              element={
                <Suspense fallback={<div className="container py-24">Loading...</div>}>
                  <Contact />
                </Suspense>
              }
            />
            <Route
              path="/services"
              element={
                <Suspense fallback={<div className="container py-24">Loading...</div>}>
                  <Services />
                </Suspense>
              }
            />
            <Route
              path="/case-studies"
              element={
                <Suspense fallback={<div className="container py-24">Loading...</div>}>
                  <CaseStudies />
                </Suspense>
              }
            />
          </Routes>
        </main>
        <Footer />
      </div>
      <Toaster />
      <Sonner />
    </TooltipProvider>
  );
};

export default App;