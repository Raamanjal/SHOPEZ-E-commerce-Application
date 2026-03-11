import { useEffect, useState } from "react";
import { ShoppingCart } from "lucide-react";
import { useParams } from "react-router-dom";

import { useGeneralContext } from "../../context/GeneralContext.js";

export default function IndividualProduct() {
  const { id } = useParams();
  const { addToCart, getProductById, status, user } = useGeneralContext();
  const [product, setProduct] = useState(null);
  const [selectedSize, setSelectedSize] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadProduct = async () => {
      try {
        const data = await getProductById(id);
        setProduct(data);
        setSelectedSize(data.sizes?.[0] || "standard");
      } catch (loadError) {
        setError(loadError.message);
      }
    };

    loadProduct();
  }, [getProductById, id]);

  if (error) {
    return <p className="message error">{error}</p>;
  }

  if (!product) {
    return <p className="message">Loading product...</p>;
  }

  const finalPrice = product.price - (product.discount || 0);

  return (
    <section className="page product-detail panel">
      <img className="product-detail__image" src={product.mainImg} alt={product.title} />
      <div className="product-detail__content">
        <p className="eyebrow">{product.category}</p>
        <h1>{product.title}</h1>
        <p>{product.description}</p>
        <div className="price-row">
          <strong>Rs {finalPrice}</strong>
          {product.discount > 0 && <span>Rs {product.price}</span>}
        </div>
        <div className="buy-box">
          <div className="buy-box__controls">
            <label>
              <span>Size</span>
              <select value={selectedSize} onChange={(event) => setSelectedSize(event.target.value)}>
                {(product.sizes?.length ? product.sizes : ["standard"]).map((size) => (
                  <option key={size} value={size}>
                    {size}
                  </option>
                ))}
              </select>
            </label>
            <label>
              <span>Quantity</span>
              <input
                min="1"
                type="number"
                value={quantity}
                onChange={(event) => setQuantity(Number(event.target.value))}
              />
            </label>
          </div>
          <button
            className="primary-button buy-box__button"
            onClick={() => addToCart({ productId: product._id, size: selectedSize, quantity })}
            disabled={!user}
          >
            <ShoppingCart size={18} />
            {user ? "Add to cart" : "Login to buy"}
          </button>
        </div>
        {status.error && <p className="message error">{status.error}</p>}
        {status.success && <p className="message success">{status.success}</p>}
      </div>
    </section>
  );
}
