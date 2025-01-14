import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";

const CaseStudies = () => {
  return (
    <div className="min-h-screen pt-24">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold text-primary mb-8">Case Studies</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {caseStudies.map((study) => (
            <Card key={study.title} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <CardTitle>{study.title}</CardTitle>
                <CardDescription>{study.industry}</CardDescription>
              </CardHeader>
              <CardContent>
                <img
                  src={study.image}
                  alt={study.title}
                  className="w-full h-48 object-cover rounded-md mb-4"
                />
                <p className="text-muted-foreground mb-4">{study.description}</p>
                <Link
                  to={`/case-studies/${study.id}`}
                  className="text-primary hover:text-primary/80 font-medium"
                >
                  Read Case Study
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

const caseStudies = [
  {
    id: 1,
    title: "E-commerce Platform Transformation",
    industry: "Retail",
    description: "How we helped a traditional retailer increase online sales by 300% through digital transformation.",
    image: "/placeholder.svg",
  },
  {
    id: 2,
    title: "Healthcare Management System",
    industry: "Healthcare",
    description: "Developing a comprehensive healthcare management system serving 100+ clinics.",
    image: "/placeholder.svg",
  },
  {
    id: 3,
    title: "FinTech Mobile App",
    industry: "Finance",
    description: "Creating a secure and user-friendly mobile banking application with 1M+ users.",
    image: "/placeholder.svg",
  },
];

export default CaseStudies;