import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AnnouncementBar from "@/components/AnnouncementBar";
import SEO from "@/components/SEO";
import { Target, Eye, Users, Globe, Award, TrendingUp } from "lucide-react";

const stats = [
  { value: "5,000+", label: "Clients Served" },
  { value: "20+", label: "Countries Covered" },
  { value: "98%", label: "Success Rate" },
  { value: "10+", label: "Years Experience" },
];

const values = [
  {
    icon: Target,
    title: "Mission-Driven",
    description: "We exist to simplify global mobility — making study abroad, migration, and travel accessible to everyone.",
  },
  {
    icon: Eye,
    title: "Transparency",
    description: "No hidden fees, no surprises. We believe in clear communication at every step of your journey.",
  },
  {
    icon: Users,
    title: "Client-First",
    description: "Every service and product is designed around your needs, with personalized support throughout.",
  },
  {
    icon: Globe,
    title: "Global Reach",
    description: "Our network spans 20+ countries, giving you access to opportunities worldwide.",
  },
  {
    icon: Award,
    title: "Excellence",
    description: "We maintain the highest standards in every consultation, guide, and service we deliver.",
  },
  {
    icon: TrendingUp,
    title: "Innovation",
    description: "We continuously evolve our tools and resources to stay ahead of changing immigration policies.",
  },
];

const team = [
  { name: "Adebayo Johnson", role: "Founder & CEO", initials: "AJ" },
  { name: "Sarah Mitchell", role: "Head of Migration Services", initials: "SM" },
  { name: "David Okonkwo", role: "Study Abroad Director", initials: "DO" },
  { name: "Amina Hassan", role: "Client Relations Manager", initials: "AH" },
];

const About = () => {
  return (
    <div className="min-h-screen bg-background">
      <SEO
        title="About Us – The Digital Desk"
        description="Learn about The Digital Desk — our mission to simplify study abroad, migration, and global mobility for everyone."
        url="/about"
      />
      <AnnouncementBar />
      <Header />


      {/* Hero */}
      <section className="bg-primary py-16 md:py-24">
        <div className="container text-center">
          <h1 className="font-display text-4xl md:text-5xl font-bold text-primary-foreground mb-4">
            About Us
          </h1>
          <p className="text-primary-foreground/70 font-body text-lg max-w-2xl mx-auto">
            Online Dynamics & BSB — your trusted partner for study abroad, migration, and global travel services.
          </p>
        </div>
      </section>

      {/* Story */}
      <section className="py-16 md:py-24">
        <div className="container max-w-4xl">
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-6">
              Our Story
            </h2>
            <div className="space-y-4 text-muted-foreground font-body leading-relaxed">
              <p>
                Online Dynamics & BSB was born from a simple idea: everyone deserves access to global opportunities. 
                Founded over a decade ago, we started as a small consultancy helping students navigate the complex 
                world of international education.
              </p>
              <p>
                Today, we've grown into a full-service platform offering everything from DIY visa guides 
                to premium migration packages. Our team has helped over 5,000 clients across 20+ countries 
                achieve their dreams of studying, working, and living abroad.
              </p>
              <p>
                Whether you're a first-time traveler looking for a simple checklist or a professional 
                seeking citizenship by investment, we have the expertise and resources to guide you 
                every step of the way.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-primary py-16">
        <div className="container">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="font-display text-3xl md:text-4xl font-bold text-secondary mb-2">
                  {stat.value}
                </p>
                <p className="text-primary-foreground/70 font-body text-sm">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-16 md:py-24 bg-surface-warm">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-3">
              Our Values
            </h2>
            <p className="text-muted-foreground font-body">
              The principles that guide everything we do.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {values.map((value) => (
              <div key={value.title} className="bg-card rounded-lg border border-border p-8 hover:shadow-lg hover:border-secondary/30 transition-all duration-300">
                <value.icon className="h-8 w-8 text-secondary mb-4" />
                <h3 className="font-display text-lg font-semibold text-foreground mb-2">
                  {value.title}
                </h3>
                <p className="text-sm text-muted-foreground font-body leading-relaxed">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-16 md:py-24">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-3">
              Meet The Team
            </h2>
            <p className="text-muted-foreground font-body">
              The people behind your success stories.
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {team.map((member) => (
              <div key={member.name} className="text-center group">
                <div className="w-28 h-28 md:w-32 md:h-32 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center group-hover:bg-secondary/10 transition-colors border-2 border-transparent group-hover:border-secondary">
                  <span className="font-display text-2xl font-bold text-muted-foreground group-hover:text-secondary transition-colors">
                    {member.initials}
                  </span>
                </div>
                <h3 className="font-display font-semibold text-foreground text-sm mb-1">
                  {member.name}
                </h3>
                <p className="text-xs text-muted-foreground font-body">{member.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default About;
