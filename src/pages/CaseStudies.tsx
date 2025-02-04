import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { Suspense } from "react";

const caseStudies = [
  {
    id: 1,
    title: "E-commerce Platform Transformation",
    industry: "Retail",
    description: "How we helped a traditional retailer increase online sales by 300% through digital transformation.",
    image: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d",
  },
  {
    id: 2,
    title: "Healthcare Management System",
    industry: "Healthcare",
    description: "Developing a comprehensive healthcare management system serving 100+ clinics.",
    image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158",
  },
  {
    id: 3,
    title: "FinTech Mobile App",
    industry: "Finance",
    description: "Creating a secure and user-friendly mobile banking application with 1M+ users.",
    image: "https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7",
  },
];

const CaseStudyCard = ({ study }: { study: typeof caseStudies[0] }) => (
  <Card className="flex flex-col h-full">
    <CardHeader>
      <CardTitle className="text-xl">{study.title}</CardTitle>
      <CardDescription>{study.industry}</CardDescription>
    </CardHeader>
    <CardContent className="flex-grow flex flex-col">
      <div className="relative w-full h-48 mb-4">
        <img
          src={study.image}
          alt={study.title}
          className="w-full h-full object-cover rounded-md"
          loading="lazy"
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
);

const CaseStudies = () => {
  return (
    <Suspense fallback={<div>Loading case studies...</div>}>
      <div className="container py-24">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-bold text-center mb-12">Case Studies</h1>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {caseStudies.map((study) => (
              <CaseStudyCard key={study.id} study={study} />
            ))}
          </div>
        </div>
      </div>
    </Suspense>
  );
};

export default CaseStudies;