import React from 'react'
import { BrowserRouter } from 'react-router-dom'
import { StaticRouter } from 'react-router-dom/server'
import { Routes, Route } from 'react-router-dom'
import { Page as About } from '../pages/About.page'
import { Page as Blog } from '../pages/Blog.page'
import { Page as CaseStudies } from '../pages/CaseStudies.page'
import { Page as Contact } from '../pages/Contact.page'
import { Page as Services } from '../pages/Services.page'
import { Page as Home } from '../pages/index.page'
import Header from '../components/layout/Header'
import Footer from '../components/layout/Footer'

export { PageShell }

interface PageShellProps {
  children: React.ReactNode;
  isClient?: boolean;
  url?: string;
}

function PageShell({ children, isClient, url }: PageShellProps) {
  const Router = isClient ? BrowserRouter : StaticRouter;
  const routerProps = isClient ? {} : { location: url || '/' };

  return (
    // @ts-ignore - StaticRouter has different props than BrowserRouter
    <Router {...routerProps}>
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/case-studies" element={<CaseStudies />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/services" element={<Services />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}