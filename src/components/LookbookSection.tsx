import lookbook1 from "@/assets/lookbook-1.jpg";
import lookbook2 from "@/assets/lookbook-2.jpg";

const lookbookItems = [
  {
    image: lookbook1,
    products: [
      { title: "Complete Visa Application Guide", price: "$9.99", originalPrice: "$19.99" },
      { title: "Country-Specific Checklist Bundle", price: "$4.99" },
    ],
  },
  {
    image: lookbook2,
    products: [
      { title: "1-on-1 Study Abroad Consultation", price: "$149", originalPrice: "$199" },
      { title: "SOP Writing Masterclass", price: "$14.99" },
    ],
  },
];

const LookbookSection = () => {
  return (
    <section className="py-16 md:py-24">
      <div className="container">
        <div className="grid md:grid-cols-2 gap-8">
          {lookbookItems.map((item, idx) => (
            <div key={idx} className="group">
              <div className="relative overflow-hidden rounded-lg mb-6">
                <img
                  src={item.image}
                  alt="Lookbook"
                  loading="lazy"
                  width={800}
                  height={1000}
                  className="w-full h-[500px] object-cover group-hover:scale-105 transition-transform duration-700"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                {item.products.map((product) => (
                  <a key={product.title} href="#" className="group/product flex items-center gap-3 p-3 rounded-lg hover:bg-muted transition-colors">
                    <div className="w-16 h-16 rounded-lg bg-secondary/10 flex items-center justify-center flex-shrink-0">
                      <span className="text-xl">📄</span>
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-foreground font-body truncate group-hover/product:text-secondary transition-colors">
                        {product.title}
                      </p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-sm font-semibold text-foreground font-body">{product.price}</span>
                        {product.originalPrice && (
                          <span className="text-xs text-muted-foreground line-through">{product.originalPrice}</span>
                        )}
                      </div>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default LookbookSection;
