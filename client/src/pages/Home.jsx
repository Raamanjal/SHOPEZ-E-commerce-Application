import { ArrowRight, Armchair, CircleEllipsis, Smartphone, Sparkles, TvMinimal, Volleyball } from "lucide-react";
import { Link } from "react-router-dom";

import FlashSale from "../components/FlashSale.jsx";
import Products from "../components/Products.jsx";
import { useGeneralContext } from "../context/GeneralContext.js";

export default function Home() {
  const { categories, products } = useGeneralContext();
  const featuredProducts = products.filter((product) => product.featured).slice(0, 5);
  const categoryIcons = {
    Electronics: TvMinimal,
    Accessories: Sparkles,
    Sports: Volleyball,
    Furniture: Armchair,
    Mobiles: Smartphone,
    default: CircleEllipsis,
  };

  return (
    <div className="page page-home">
      <FlashSale />
      <section className="panel category-section">
        <div className="section-heading">
          <div>
            <h2>Shop by Category</h2>
            <span>Find exactly what you are looking for</span>
          </div>
          <Link className="secondary-button" to="/products">
            View All <ArrowRight size={15} />
          </Link>
        </div>
        <div className="category-grid">
          {categories.map((category) => {
            const Icon = categoryIcons[category] || categoryIcons.default;

            return (
              <Link
                className="category-showcase"
                key={category}
                to={`/products/${encodeURIComponent(category)}`}
              >
                <span className="category-icon">
                  <Icon size={20} />
                </span>
                <strong>{category}</strong>
                <span>Explore</span>
              </Link>
            );
          })}
        </div>
      </section>
      <Products products={featuredProducts.length ? featuredProducts : products.slice(0, 5)} title="Featured Products" />
    </div>
  );
}
