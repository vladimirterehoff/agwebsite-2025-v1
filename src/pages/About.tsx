const About = () => {
  return (
    <div className="min-h-screen pt-24">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold text-primary mb-8">About Attract Group</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16">
          <div>
            <h2 className="text-2xl font-semibold mb-4">Our Story</h2>
            <p className="text-muted-foreground mb-4">
              Founded in 2010, Attract Group has been at the forefront of digital innovation,
              delivering cutting-edge software solutions to businesses worldwide. Our journey
              began with a simple mission: to help businesses thrive in the digital age.
            </p>
            <p className="text-muted-foreground">
              Today, we're proud to have served over 500 clients across 30 countries,
              delivering solutions that drive growth and innovation.
            </p>
          </div>
          <div className="bg-accent rounded-lg p-8">
            <h3 className="text-xl font-semibold mb-4">Company Facts</h3>
            <ul className="space-y-3">
              <li>13+ Years of Experience</li>
              <li>200+ Team Members</li>
              <li>500+ Successful Projects</li>
              <li>30+ Countries Served</li>
            </ul>
          </div>
        </div>

        <div className="mb-16">
          <h2 className="text-2xl font-semibold mb-6">Our Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {values.map((value) => (
              <div key={value.title} className="p-6 border rounded-lg">
                <h3 className="text-xl font-semibold mb-3">{value.title}</h3>
                <p className="text-muted-foreground">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const values = [
  {
    title: "Innovation",
    description: "We constantly push the boundaries of what's possible in software development.",
  },
  {
    title: "Excellence",
    description: "We maintain the highest standards in every project we undertake.",
  },
  {
    title: "Partnership",
    description: "We build lasting relationships with our clients based on trust and results.",
  },
];

export default About;