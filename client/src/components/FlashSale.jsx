import { createElement } from "react";
import { ArrowRight, ShieldCheck, Truck, Undo2, Zap } from "lucide-react";
import { Link } from "react-router-dom";
import bannerOne from "../images/home-banner1.png";
import bannerTwo from "../images/home-banner-2.png";
import { useGeneralContext } from "../context/GeneralContext.js";

const fallbackBanners = [bannerOne, bannerTwo];

export default function FlashSale() {
  const { bannerData } = useGeneralContext();
  const slides = bannerData.banner?.length ? bannerData.banner : fallbackBanners;
  const heroBanner = slides[0];
  const perks = [
    { icon: Truck, title: "Free Shipping", text: "On orders over Rs 999" },
    { icon: ShieldCheck, title: "Secure Payment", text: "Protected transactions" },
    { icon: Undo2, title: "Easy Returns", text: "7-day return policy" },
    { icon: Zap, title: "Fast Delivery", text: "Local dispatch available" },
  ];

  return (
    <>
      <section className="hero-card">
        <div className="hero-copy">
          <span className="eyebrow">New season, new deals</span>
          <h1>
            Shop Smarter,
            <br />
            <span>Live Better</span>
          </h1>
          <p>
            Discover thousands of products curated for your lifestyle. Better prices, faster
            delivery, and a cleaner shopping flow for both customers and admins.
          </p>
          <div className="hero-actions">
            <Link className="primary-button" to="/products">
              Explore Now <ArrowRight size={16} />
            </Link>
            <Link className="secondary-button" to="/products?featured=true">
              Featured Picks
            </Link>
          </div>
          <div className="hero-gallery">
            <img src={heroBanner} alt="ShopEZ banner" />
          </div>
        </div>
      </section>
      <section className="perks-row">
        {perks.map(({ icon, title, text }) => (
          <article className="perk-card" key={title}>
            <span className="perk-icon">
              {createElement(icon, { size: 18 })}
            </span>
            <div>
              <strong>{title}</strong>
              <p>{text}</p>
            </div>
          </article>
        ))}
      </section>
    </>
  );
}
