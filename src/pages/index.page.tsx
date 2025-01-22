import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

export { Page };

const Page = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="pt-32 pb-16 px-4" aria-label="hero">
        <div className="container mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-primary mb-6 animate-fade-up">
            Building Tomorrow's Digital Solutions.
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto animate-fade-up">
            We help businesses transform their ideas into powerful software solutions
            that drive growth and innovation.
          </p>
          <div className="flex justify-center gap-4 animate-fade-up">
            <Button size="lg" asChild>
              <Link to="/contact">Get Started</Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link to="/case-studies">View Our Work</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Services Preview */}
      <section className="py-16 bg-accent" aria-label="services">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-primary mb-12 text-center">
            Our Services
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {services.map((service) => (
              <article
                key={service.title}
                className="bg-background p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow"
              >
                <h3 className="text-xl font-semibold mb-3">{service.title}</h3>
                <p className="text-muted-foreground mb-4">{service.description}</p>
                <Link
                  to={service.href}
                  className="inline-flex items-center text-primary hover:text-primary/80 transition-colors"
                  aria-label={`Learn more about ${service.title}`}
                >
                  Learn More <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

const services = [
  {
    title: "Web Development",
    description: "Custom web applications built with cutting-edge technologies.",
    href: "/services/web-development",
  },
  {
    title: "Mobile Development",
    description: "Native and cross-platform mobile applications.",
    href: "/services/mobile-development",
  },
  {
    title: "Cloud Solutions",
    description: "Scalable cloud infrastructure and DevOps services.",
    href: "/services/cloud-solutions",
  },
];

