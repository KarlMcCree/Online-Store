import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";

const Refund = () => (
  <div className="min-h-screen flex flex-col bg-background">
    <SEO title="Refund Policy" description="The Digital Desk refund policy for digital downloads." />
    <Header />
    <main className="container max-w-3xl py-12 font-body">
      <h1 className="font-display text-3xl font-bold mb-4">Refund Policy</h1>
      <p className="text-sm text-muted-foreground">Last updated: {new Date().toLocaleDateString()}</p>

      <h2 className="font-display text-xl font-semibold mt-8 mb-2">Digital Products</h2>
      <p>Because our products are digital and instantly accessible after payment, all sales are final. Refunds are issued only in the following situations:</p>
      <ul className="list-disc pl-6 space-y-1 mt-2">
        <li>The file you purchased is corrupted or unreadable and we are unable to replace it.</li>
        <li>You were charged but the order was never delivered (no download link, no email).</li>
        <li>You were charged more than once for the same order due to a technical error.</li>
      </ul>

      <h2 className="font-display text-xl font-semibold mt-8 mb-2">Requesting a Refund</h2>
      <p>Email us within 7 days of purchase via the Contact page with your order reference and a description of the issue. We aim to respond within 2 business days.</p>

      <h2 className="font-display text-xl font-semibold mt-8 mb-2">Services & Consultations</h2>
      <p>For booked services (consultations, document review, migration packages), partial refunds may be considered if work has not yet started. Once the service has begun, fees are non-refundable.</p>

      <h2 className="font-display text-xl font-semibold mt-8 mb-2">Chargebacks</h2>
      <p>Please contact us before initiating a chargeback so we can resolve the issue directly. Fraudulent chargebacks may result in account suspension.</p>

      <h2 className="font-display text-xl font-semibold mt-8 mb-2">Contact</h2>
      <p>Questions about refunds? Reach us via the Contact page.</p>
    </main>
    <Footer />
  </div>
);

export default Refund;
