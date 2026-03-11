import Products from "../../components/Products.jsx";
import { useGeneralContext } from "../../context/GeneralContext.js";

export default function AllProducts() {
  const { deleteProduct, products } = useGeneralContext();

  return <Products adminMode onDelete={deleteProduct} products={products} title="All Products" />;
}
