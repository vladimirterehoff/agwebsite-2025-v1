import { Link } from "react-router-dom";

const Page = () => {
  return (
    <div className="min-h-screen pt-24">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold text-primary mb-8">Blog</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogPosts.map((post) => (
            <article
              key={post.id}
              className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow"
            >
              <img
                src={post.image}
                alt={post.title}
                className="w-full h-48 object-cover rounded-t-lg"
              />
              <div className="p-6">
                <p className="text-sm text-muted mb-2">{post.date}</p>
                <h2 className="text-xl font-semibold mb-3">
                  <Link to={`/blog/${post.id}`} className="hover:text-secondary transition-colors">
                    {post.title}
                  </Link>
                </h2>
                <p className="text-muted mb-4">{post.excerpt}</p>
                <Link
                  to={`/blog/${post.id}`}
                  className="text-secondary hover:text-primary transition-colors"
                >
                  Read More
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
};

const blogPosts = [
  {
    id: 1,
    title: "The Future of Web Development",
    date: "March 15, 2024",
    excerpt: "Exploring upcoming trends and technologies in web development.",
    image: "/placeholder.svg",
  },
  {
    id: 2,
    title: "Mobile App Development Best Practices",
    date: "March 10, 2024",
    excerpt: "Key considerations for building successful mobile applications.",
    image: "/placeholder.svg",
  },
  {
    id: 3,
    title: "Cloud Computing Solutions",
    date: "March 5, 2024",
    excerpt: "Understanding modern cloud infrastructure and services.",
    image: "/placeholder.svg",
  },
];

export { Page };