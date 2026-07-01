import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AnnouncementBar from "@/components/AnnouncementBar";
import SEO from "@/components/SEO";
import { Calendar, Clock, ArrowRight, User } from "lucide-react";
import { Link } from "react-router-dom";

const blogPosts = [
  {
    id: 1,
    title: "Top 10 Countries for Study Abroad in 2025",
    excerpt: "Discover the best destinations for international students this year, from scholarships to quality of life and post-study work opportunities.",
    category: "Study Abroad",
    author: "Adebayo Johnson",
    date: "Mar 15, 2025",
    readTime: "8 min read",
    featured: true,
  },
  {
    id: 2,
    title: "How to Write a Winning Statement of Purpose",
    excerpt: "Your SOP can make or break your application. Learn the proven framework that has helped over 1,000 students get accepted.",
    category: "Guides",
    author: "Sarah Mitchell",
    date: "Mar 10, 2025",
    readTime: "6 min read",
    featured: false,
  },
  {
    id: 3,
    title: "Canada Express Entry: Complete Guide for 2025",
    excerpt: "Everything you need to know about the Express Entry system, CRS scores, and how to maximize your chances of getting an ITA.",
    category: "Migration",
    author: "David Okonkwo",
    date: "Mar 5, 2025",
    readTime: "12 min read",
    featured: false,
  },
  {
    id: 4,
    title: "5 Common Visa Mistakes and How to Avoid Them",
    excerpt: "Don't let simple errors cost you your visa. Here are the most frequent mistakes we see and practical tips to avoid them.",
    category: "Visa Tips",
    author: "Amina Hassan",
    date: "Feb 28, 2025",
    readTime: "5 min read",
    featured: false,
  },
  {
    id: 5,
    title: "Citizenship by Investment: Is It Worth It?",
    excerpt: "An honest breakdown of CBI programs, their costs, benefits, and which countries offer the best value in 2025.",
    category: "Second Passport",
    author: "Adebayo Johnson",
    date: "Feb 20, 2025",
    readTime: "10 min read",
    featured: false,
  },
  {
    id: 6,
    title: "Dubai Travel Guide: What to Know Before You Go",
    excerpt: "From visa requirements to cultural etiquette, here's everything you need for an unforgettable trip to Dubai.",
    category: "Travel",
    author: "Sarah Mitchell",
    date: "Feb 15, 2025",
    readTime: "7 min read",
    featured: false,
  },
];

const categories = ["All", "Study Abroad", "Migration", "Guides", "Visa Tips", "Travel", "Second Passport"];

const Blog = () => {
  const featuredPost = blogPosts.find((p) => p.featured);
  const regularPosts = blogPosts.filter((p) => !p.featured);

  return (
    <div className="min-h-screen bg-background">
      <SEO
        title="Blog – Study Abroad Tips & Updates"
        description="Expert insights on study abroad, visa applications, migration pathways, and scholarship opportunities."
        url="/blog"
      />
      <AnnouncementBar />
      <Header />


      {/* Hero */}
      <section className="bg-primary py-16 md:py-24">
        <div className="container text-center">
          <h1 className="font-display text-4xl md:text-5xl font-bold text-primary-foreground mb-4">
            Blog & Resources
          </h1>
          <p className="text-primary-foreground/70 font-body text-lg max-w-2xl mx-auto">
            Expert insights, guides, and tips to help you navigate your global journey with confidence.
          </p>
        </div>
      </section>

      {/* Categories */}
      <section className="border-b border-border">
        <div className="container py-4">
          <div className="flex flex-wrap gap-3">
            {categories.map((cat) => (
              <button
                key={cat}
                className={`px-4 py-2 rounded-full text-sm font-medium font-body transition-all ${
                  cat === "All"
                    ? "bg-secondary text-secondary-foreground"
                    : "bg-muted text-muted-foreground hover:bg-muted/80"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12 md:py-16">
        <div className="container">
          {/* Featured Post */}
          {featuredPost && (
            <div className="mb-16">
              <div className="grid md:grid-cols-2 gap-8 bg-card rounded-lg border border-border overflow-hidden hover:shadow-lg transition-shadow">
                <div className="bg-muted aspect-video md:aspect-auto flex items-center justify-center">
                  <div className="text-center p-8">
                    <span className="inline-block bg-secondary text-secondary-foreground text-xs font-bold px-3 py-1 rounded-sm mb-4">
                      FEATURED
                    </span>
                    <div className="w-16 h-16 mx-auto rounded-full bg-secondary/20 flex items-center justify-center">
                      <span className="text-3xl">✍️</span>
                    </div>
                  </div>
                </div>
                <div className="p-8 md:p-10 flex flex-col justify-center">
                  <span className="text-xs font-bold text-secondary uppercase tracking-wider font-body mb-3">
                    {featuredPost.category}
                  </span>
                  <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground mb-4 hover:text-secondary transition-colors cursor-pointer">
                    {featuredPost.title}
                  </h2>
                  <p className="text-muted-foreground font-body mb-6 leading-relaxed">
                    {featuredPost.excerpt}
                  </p>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground font-body mb-6">
                    <span className="flex items-center gap-1.5">
                      <User className="h-3.5 w-3.5" /> {featuredPost.author}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Calendar className="h-3.5 w-3.5" /> {featuredPost.date}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Clock className="h-3.5 w-3.5" /> {featuredPost.readTime}
                    </span>
                  </div>
                  <button className="inline-flex items-center gap-2 text-sm font-semibold text-secondary hover:text-secondary/80 transition-colors font-body">
                    Read Article <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Blog Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {regularPosts.map((post) => (
              <article
                key={post.id}
                className="bg-card rounded-lg border border-border overflow-hidden hover:shadow-lg hover:border-secondary/30 transition-all duration-300 group cursor-pointer"
              >
                <div className="bg-muted aspect-video flex items-center justify-center">
                  <div className="text-center p-6">
                    <div className="w-12 h-12 mx-auto rounded-full bg-secondary/20 flex items-center justify-center">
                      <span className="text-xl">📝</span>
                    </div>
                  </div>
                </div>
                <div className="p-6">
                  <span className="text-xs font-bold text-secondary uppercase tracking-wider font-body">
                    {post.category}
                  </span>
                  <h3 className="font-display text-lg font-semibold text-foreground mt-2 mb-3 group-hover:text-secondary transition-colors line-clamp-2">
                    {post.title}
                  </h3>
                  <p className="text-sm text-muted-foreground font-body mb-4 line-clamp-2 leading-relaxed">
                    {post.excerpt}
                  </p>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground font-body">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" /> {post.date}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" /> {post.readTime}
                    </span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Blog;
