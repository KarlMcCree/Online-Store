import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";

const Terms = () => (
  <div className="min-h-screen flex flex-col bg-background">
    <SEO title="Terms of Service" description="The Digital Desk terms of service for digital products and services." />
    <Header />
    <main className="container max-w-3xl py-12 prose prose-slate font-body">
      <h1 className="font-display text-3xl font-bold mb-4">Terms of Service</h1>
      <p className="text-sm text-muted-foreground">Last updated: {new Date().toLocaleDateString()}</p>

      <h2 className="font-display text-xl font-semibold mt-8 mb-2">1. Acceptance of Terms</h2>
      <p>By accessing or using The Digital Desk ("we", "us", "our"), you agree to be bound by these Terms of Service. If you do not agree, do not use our website or purchase our products.</p>

      <h2 className="font-display text-xl font-semibold mt-8 mb-2">2. Payment Terms</h2>
      <p>All prices are displayed in the applicable currency at checkout. Payments are processed securely through third-party providers (Paystack). You authorize us to charge the payment method you provide for the total amount of your order.</p>

      <h2 className="font-display text-xl font-semibold mt-8 mb-2">3. Digital Products & License</h2>
      <p>When you purchase a digital product, we grant you a limited, non-exclusive, non-transferable license for personal, non-commercial use. You may not redistribute, resell, sublicense, or publicly share the content.</p>

      <h2 className="font-display text-xl font-semibold mt-8 mb-2">4. Intellectual Property</h2>
      <p>All content on this site — including guides, templates, text, graphics, logos, and software — is the property of The Digital Desk or its licensors and is protected by copyright and other intellectual property laws.</p>

      <h2 className="font-display text-xl font-semibold mt-8 mb-2">5. Download Limits</h2>
      <p>Digital downloads are subject to a per-product download limit. Once exceeded, you may request a refill from your Dashboard.</p>

      <h2 className="font-display text-xl font-semibold mt-8 mb-2">6. Disclaimer</h2>
      <p>Our products and services are provided "as is" and "as available". We make no warranties, express or implied, regarding accuracy, reliability, or fitness for a particular purpose. We are not responsible for any visa, migration, or admission outcomes.</p>

      <h2 className="font-display text-xl font-semibold mt-8 mb-2">7. Limitation of Liability</h2>
      <p>To the maximum extent permitted by law, The Digital Desk shall not be liable for any indirect, incidental, special, or consequential damages arising from your use of our products or services.</p>

      <h2 className="font-display text-xl font-semibold mt-8 mb-2">8. Governing Law</h2>
      <p>These Terms are governed by the laws of the Federal Republic of Nigeria, without regard to conflict-of-law principles. Any disputes shall be resolved in the courts of Nigeria.</p>

      <h2 className="font-display text-xl font-semibold mt-8 mb-2">9. Changes</h2>
      <p>We may update these Terms from time to time. Continued use of the service after changes constitutes acceptance of the new Terms.</p>

      <h2 className="font-display text-xl font-semibold mt-8 mb-2">10. Contact</h2>
      <p>Questions about these Terms? Email us via the Contact page.</p>
    </main>
    <Footer />
  </div>
);

export default Terms;
