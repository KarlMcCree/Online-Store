import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";

const Privacy = () => (
  <div className="min-h-screen flex flex-col bg-background">
    <SEO title="Privacy Policy" description="How The Digital Desk collects, uses, and protects your personal information." />
    <Header />
    <main className="container max-w-3xl py-12 font-body">
      <h1 className="font-display text-3xl font-bold mb-4">Privacy Policy</h1>
      <p className="text-sm text-muted-foreground">Last updated: {new Date().toLocaleDateString()}</p>

      <p className="mt-6">This page is maintained by The Digital Desk to explain how we handle personal data when you use our website and purchase our products.</p>

      <h2 className="font-display text-xl font-semibold mt-8 mb-2">1. Information We Collect</h2>
      <ul className="list-disc pl-6 space-y-1">
        <li><strong>Account data:</strong> name, email address, password (hashed).</li>
        <li><strong>Order data:</strong> products purchased, order totals, payment reference.</li>
        <li><strong>Payment data:</strong> processed by Paystack — we do not store card details.</li>
        <li><strong>Usage data:</strong> pages viewed, interactions, device and browser information.</li>
      </ul>

      <h2 className="font-display text-xl font-semibold mt-8 mb-2">2. How We Use Your Information</h2>
      <ul className="list-disc pl-6 space-y-1">
        <li>Fulfill orders and deliver digital downloads.</li>
        <li>Send transactional emails (receipts, download links, support replies).</li>
        <li>Send marketing emails only when you opt in — you can unsubscribe anytime.</li>
        <li>Improve our products, content, and customer experience.</li>
        <li>Detect and prevent fraud or abuse.</li>
      </ul>

      <h2 className="font-display text-xl font-semibold mt-8 mb-2">3. Sharing Your Information</h2>
      <p>We share data only with service providers needed to run the business: payment processor (Paystack), email delivery (Resend), and backend hosting. We do not sell your personal data.</p>

      <h2 className="font-display text-xl font-semibold mt-8 mb-2">4. Your Rights (GDPR / CCPA)</h2>
      <p>You have the right to access, correct, export, or delete your personal data. You may also object to processing or withdraw consent for marketing emails. To exercise these rights, contact us via the Contact page.</p>

      <h2 className="font-display text-xl font-semibold mt-8 mb-2">5. Cookies</h2>
      <p>We use essential cookies to keep you signed in and to remember your cart. Analytics cookies, if used, help us understand site usage.</p>

      <h2 className="font-display text-xl font-semibold mt-8 mb-2">6. Data Retention</h2>
      <p>We keep your account and order data for as long as your account is active or as required to comply with our legal obligations.</p>

      <h2 className="font-display text-xl font-semibold mt-8 mb-2">7. Security</h2>
      <p>We use industry-standard practices to protect your data, including encrypted connections and access controls. No method of transmission over the internet is 100% secure.</p>

      <h2 className="font-display text-xl font-semibold mt-8 mb-2">8. Children's Privacy</h2>
      <p>Our services are not directed to children under 13, and we do not knowingly collect data from them.</p>

      <h2 className="font-display text-xl font-semibold mt-8 mb-2">9. Contact</h2>
      <p>For privacy-related questions or requests, use the Contact page.</p>
    </main>
    <Footer />
  </div>
);

export default Privacy;
