import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";

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

const CaseStudies = () => {
  return (
    <div className="container mx-auto px-4 py-24">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-12">Case Studies</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {caseStudies.map((study) => (
            <Card key={study.id} className="flex flex-col">
              <CardHeader>
                <CardTitle className="text-xl">{study.title}</CardTitle>
                <CardDescription>{study.industry}</CardDescription>
              </CardHeader>
              <CardContent className="flex-grow flex flex-col">
                <div className="relative w-full h-48 mb-4">
                  <img
                    src={study.image}
                    alt={study.title}
                    className="absolute inset-0 w-full h-full object-cover rounded-md"
                  />
                </div>
                <p className="text-muted-foreground mb-4 flex-grow">{study.description}</p>
                <Link
                  to={`/case-studies/${study.id}`}
                  className="text-primary hover:text-primary/80 font-medium inline-block mt-auto"
                >
                  Read Case Study →
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CaseStudies;