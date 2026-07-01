import { Mail } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-primary text-primary-foreground">
      {/* Newsletter */}
      <div className="border-b border-primary-foreground/10 py-12">
        <div className="container flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="font-display text-xl font-bold mb-1">Stay in the Loop</h3>
            <p className="text-primary-foreground/70 text-sm font-body">
              Get the latest guides, tips, and exclusive offers.
            </p>
          </div>
          <div className="flex w-full md:w-auto">
            <input
              type="email"
              placeholder="Your email address"
              className="bg-primary-foreground/10 text-primary-foreground placeholder:text-primary-foreground/40 px-4 py-3 text-sm font-body rounded-l-lg border border-primary-foreground/20 focus:outline-none focus:border-secondary w-full md:w-72"
            />
            <button className="bg-secondary text-secondary-foreground px-6 py-3 text-sm font-semibold rounded-r-lg hover:bg-secondary/90 transition-colors font-body flex items-center gap-2">
              <Mail className="h-4 w-4" />
              Subscribe
            </button>
          </div>
        </div>
      </div>

      {/* Links */}
      <div className="py-12">
        <div className="container grid grid-cols-2 md:grid-cols-4 gap-8">
          <div>
            <h4 className="font-display font-semibold text-sm mb-4">Services</h4>
            <ul className="space-y-2.5">
              {["Study Abroad", "Migration", "Visa Processing", "Second Passport", "Travel Packages"].map((link) => (
                <li key={link}>
                  <a href="#" className="text-primary-foreground/60 text-sm hover:text-secondary transition-colors font-body">
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="font-display font-semibold text-sm mb-4">Digital Products</h4>
            <ul className="space-y-2.5">
              {["Visa Guides", "SOP Templates", "Country Checklists", "Travel Insurance Guide", "Free Resources"].map((link) => (
                <li key={link}>
                  <a href="#" className="text-primary-foreground/60 text-sm hover:text-secondary transition-colors font-body">
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="font-display font-semibold text-sm mb-4">Company</h4>
            <ul className="space-y-2.5">
              {["About Us", "Blog", "Careers", "Contact", "Partners"].map((link) => (
                <li key={link}>
                  <a href="#" className="text-primary-foreground/60 text-sm hover:text-secondary transition-colors font-body">
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="font-display font-semibold text-sm mb-4">Support</h4>
            <ul className="space-y-2.5">
              {[
                { label: "Help Center", href: "/contact" },
                { label: "FAQs", href: "/contact" },
                { label: "Terms of Service", href: "/terms" },
                { label: "Privacy Policy", href: "/privacy" },
                { label: "Refund Policy", href: "/refund" },
              ].map((link) => (
                <li key={link.label}>
                  <a href={link.href} className="text-primary-foreground/60 text-sm hover:text-secondary transition-colors font-body">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom */}
      <div className="border-t border-primary-foreground/10 py-6">
        <div className="container flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex flex-col items-center md:items-start">
            <span className="font-display text-lg font-bold">Online Dynamics & BSB</span>
            <span className="text-primary-foreground/50 text-xs font-body">
              © {new Date().getFullYear()} All rights reserved.
            </span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-xs text-primary-foreground/50 font-body">
              Payments powered by secure gateway
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
