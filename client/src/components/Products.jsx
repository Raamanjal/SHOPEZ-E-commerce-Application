import { Link } from "react-router-dom";
import { ShoppingCart, Star } from "lucide-react";

export default function Products({ products, title = "All Products", adminMode = false, onDelete }) {
  return (
    <section className="panel">
      <div className="section-heading">
        <h2>{title}</h2>
        <span>{products.length} items</span>
      </div>
      <div className="product-grid">
        {products.map((product) => {
          const finalPrice = product.price - (product.discount || 0);

          return (
            <article className="product-card" key={product._id}>
              <div className="product-card__media">
                <img src={product.mainImg} alt={product.title} />
              </div>
              <div className="product-card__body">
                <p className="product-category">{product.category}</p>
                <h3>{product.title}</h3>
                <p className="product-description">{product.description}</p>
                <div className="price-row">
                  <strong>Rs {finalPrice}</strong>
                  {product.discount > 0 && <span>Rs {product.price}</span>}
                </div>
                <div className="tag-row">
                  <span>{product.gender}</span>
                  <span>{product.sizes?.join(", ") || "No sizes"}</span>
                </div>
                <div className="card-actions">
                  {!adminMode && (
                    <>
                      <Link className="primary-button" to={`/product/${product._id}`}>
                        View
                      </Link>
                      <Link className="secondary-button icon-only-mobile" to={`/product/${product._id}`}>
                        <ShoppingCart size={16} /> Add
                      </Link>
                    </>
                  )}
                  {adminMode && (
                    <>
                      <Link className="ghost-button" to={`/admin/products/${product._id}/edit`}>
                        Update
                      </Link>
                      <button className="danger-button" onClick={() => onDelete(product._id)}>
                        Delete
                      </button>
                    </>
                  )}
                </div>
                {product.featured && (
                  <div className="featured-chip">
                    <Star size={12} /> featured
                  </div>
                )}
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
