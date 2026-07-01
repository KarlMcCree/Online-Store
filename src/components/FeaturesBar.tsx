import { RotateCcw, Truck, Headphones, BadgePercent } from "lucide-react";

const features = [
  {
    icon: RotateCcw,
    title: "Money-Back Guarantee",
    description: "Risk-free purchases on digital products.",
  },
  {
    icon: Truck,
    title: "Instant Delivery",
    description: "Digital products delivered to your inbox.",
  },
  {
    icon: Headphones,
    title: "24/7 Support",
    description: "Always here to help with your journey.",
  },
  {
    icon: BadgePercent,
    title: "Member Discounts",
    description: "Exclusive pricing for returning clients.",
  },
];

const FeaturesBar = () => {
  return (
    <section className="py-12 border-t border-border">
      <div className="container">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {features.map((feature) => (
            <div key={feature.title} className="flex flex-col items-center text-center gap-3">
              <feature.icon className="h-8 w-8 text-secondary" />
              <div>
                <p className="font-body font-semibold text-foreground text-sm">{feature.title}</p>
                <p className="text-xs text-muted-foreground font-body mt-0.5">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesBar;
