import { useNavigate } from "react-router-dom";

import { useGeneralContext } from "../../context/GeneralContext.js";
import ProductForm from "../../shared/ProductForm.jsx";

export default function NewProduct() {
  const navigate = useNavigate();
  const { createProduct } = useGeneralContext();

  return (
    <ProductForm
      title="New Product"
      onSubmit={async (values) => {
        await createProduct(values);
        navigate("/admin/products");
      }}
    />
  );
}
