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

export { PageShell }

interface PageShellProps {
  children: React.ReactNode;
  isClient?: boolean;
  url?: string;
}

function PageShell({ children, isClient, url }: PageShellProps) {
  const content = (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/about" element={<About />} />
      <Route path="/blog" element={<Blog />} />
      <Route path="/case-studies" element={<CaseStudies />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/services" element={<Services />} />
    </Routes>
  );

  if (isClient) {
    return <BrowserRouter>{content}</BrowserRouter>;
  }
  
  return <StaticRouter location={url || '/'}>{content}</StaticRouter>;
}