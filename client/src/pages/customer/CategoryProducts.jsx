import { useDeferredValue, useMemo, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";

import Products from "../../components/Products.jsx";
import { useGeneralContext } from "../../context/GeneralContext.js";

export default function CategoryProducts() {
  const { category } = useParams();
  const [searchParams] = useSearchParams();
  const { globalSearch, products } = useGeneralContext();
  const [gender, setGender] = useState("all");
  const [sortBy, setSortBy] = useState("latest");
  const deferredSearch = useDeferredValue(globalSearch);
  const selectedCategory = category ? decodeURIComponent(category) : "all";

  const featuredOnly = searchParams.get("featured") === "true";

  const filteredProducts = useMemo(() => {
    const nextProducts = products
      .filter((product) =>
        selectedCategory === "all" ? true : product.category.toLowerCase() === selectedCategory.toLowerCase()
      )
      .filter((product) => (featuredOnly ? Boolean(product.featured) : true))
      .filter((product) =>
        gender === "all" ? true : product.gender?.toLowerCase() === gender.toLowerCase()
      )
      .filter((product) => {
        if (!deferredSearch) {
          return true;
        }

        const haystack = `${product.title} ${product.description} ${product.category}`.toLowerCase();
        return haystack.includes(deferredSearch.toLowerCase());
      });

    if (sortBy === "price-low") {
      return [...nextProducts].sort((a, b) => a.price - b.price);
    }

    if (sortBy === "price-high") {
      return [...nextProducts].sort((a, b) => b.price - a.price);
    }

    return [...nextProducts].sort(
      (a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime()
    );
  }, [deferredSearch, featuredOnly, gender, products, selectedCategory, sortBy]);

  return (
    <div className="page products-layout">
      <aside className="sidebar panel">
        <h3>Filters</h3>
        <label>
          Sort by
          <select value={sortBy} onChange={(event) => setSortBy(event.target.value)}>
            <option value="latest">Latest</option>
            <option value="price-low">Price low to high</option>
            <option value="price-high">Price high to low</option>
          </select>
        </label>
        <label>
          Gender
          <select value={gender} onChange={(event) => setGender(event.target.value)}>
            <option value="all">All</option>
            <option value="men">Men</option>
            <option value="women">Women</option>
            <option value="unisex">Unisex</option>
          </select>
        </label>
      </aside>
      <Products
        products={filteredProducts}
        title={
          featuredOnly
            ? "Featured Products"
            : selectedCategory === "all"
              ? "All Products"
              : selectedCategory
        }
      />
    </div>
  );
}
