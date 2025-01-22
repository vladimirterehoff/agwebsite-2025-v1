import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const Page = () => {
  return (
    <div className="min-h-screen pt-24">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold text-primary mb-8">Our Services</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {services.map((service) => (
            <div key={service.title} className="border rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-4">{service.title}</h3>
              <p className="text-muted-foreground mb-4">{service.description}</p>
              <ul className="space-y-2 mb-6">
                {service.features.map((feature) => (
                  <li key={feature} className="flex items-center">
                    <ArrowRight className="h-4 w-4 mr-2 text-primary" />
                    {feature}
                  </li>
                ))}
              </ul>
              <Link
                to={service.href}
                className="text-primary hover:text-primary/80 font-medium inline-flex items-center"
              >
                Learn More <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const services = [
  {
    title: "Web Development",
    description: "Custom web applications built with cutting-edge technologies.",
    features: [
      "Full-stack Development",
      "Progressive Web Apps",
      "E-commerce Solutions",
      "API Development",
    ],
    href: "/services/web-development",
  },
  {
    title: "Mobile Development",
    description: "Native and cross-platform mobile applications.",
    features: [
      "iOS Development",
      "Android Development",
      "Cross-platform Apps",
      "App Maintenance",
    ],
    href: "/services/mobile-development",
  },
  {
    title: "Cloud Solutions",
    description: "Scalable cloud infrastructure and DevOps services.",
    features: [
      "Cloud Migration",
      "DevOps Services",
      "Cloud Architecture",
      "24/7 Support",
    ],
    href: "/services/cloud-solutions",
  },
];

export { Page };