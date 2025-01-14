import { Button } from "@/components/ui/button";

const Contact = () => {
  return (
    <div className="min-h-screen pt-24">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold text-primary mb-8">Contact Us</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div>
            <h2 className="text-2xl font-semibold mb-6">Get in Touch</h2>
            <p className="text-muted-foreground mb-8">
              Have a project in mind? Let's discuss how we can help bring your ideas to life.
              Fill out the form, and we'll get back to you within 24 hours.
            </p>
            
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">Office Location</h3>
                <p className="text-muted-foreground">
                  123 Tech Street<br />
                  San Francisco, CA 94105<br />
                  United States
                </p>
              </div>
              
              <div>
                <h3 className="font-semibold mb-2">Contact Information</h3>
                <p className="text-muted-foreground">
                  Email: contact@attractgroup.com<br />
                  Phone: +1 (555) 123-4567
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-card p-6 rounded-lg shadow-sm">
            <form className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2">Name</label>
                <input
                  type="text"
                  className="w-full p-2 border rounded-md"
                  placeholder="Your name"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Email</label>
                <input
                  type="email"
                  className="w-full p-2 border rounded-md"
                  placeholder="your@email.com"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Message</label>
                <textarea
                  className="w-full p-2 border rounded-md h-32"
                  placeholder="Tell us about your project"
                ></textarea>
              </div>
              
              <Button type="submit" className="w-full">Send Message</Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;