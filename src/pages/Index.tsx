import AnnouncementBar from "@/components/AnnouncementBar";
import Header from "@/components/Header";
import HeroSlider from "@/components/HeroSlider";
import CategoriesSection from "@/components/CategoriesSection";
import FeaturedProducts from "@/components/FeaturedProducts";
import CollectionBanners from "@/components/CollectionBanners";
import HighTicketServices from "@/components/HighTicketServices";
import LookbookSection from "@/components/LookbookSection";
import CollectionSlider from "@/components/CollectionSlider";
import MarqueeSection from "@/components/MarqueeSection";
import TestimonialsSection from "@/components/TestimonialsSection";
import InstagramGallery from "@/components/InstagramGallery";
import FeaturesBar from "@/components/FeaturesBar";
import Footer from "@/components/Footer";
import PurchaseNotification from "@/components/PurchaseNotification";
import SEO from "@/components/SEO";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <SEO
        title="The Digital Desk – Study Abroad Resources & Digital Products"
        description="Study abroad services, migration assistance, visa processing, and digital guides to help you achieve your global ambitions."
        url="/"
      />
      <AnnouncementBar />

      <Header />
      <HeroSlider />
      <CategoriesSection />
      <FeaturedProducts />
      <CollectionBanners />
      <HighTicketServices />
      <LookbookSection />
      <CollectionSlider />
      <MarqueeSection />
      <TestimonialsSection />
      <InstagramGallery />
      <FeaturesBar />
      <Footer />
      <PurchaseNotification />
    </div>
  );
};

export default Index;
