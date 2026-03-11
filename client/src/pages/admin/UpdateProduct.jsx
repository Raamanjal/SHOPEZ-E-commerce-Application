import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { useGeneralContext } from "../../context/GeneralContext.js";
import ProductForm from "../../shared/ProductForm.jsx";

export default function UpdateProduct() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getProductById, saveProduct } = useGeneralContext();
  const [initialValues, setInitialValues] = useState(null);

  useEffect(() => {
    const loadProduct = async () => {
      const data = await getProductById(id);
      setInitialValues(data);
    };

    loadProduct();
  }, [getProductById, id]);

  if (!initialValues) {
    return <p className="message">Loading product...</p>;
  }

  return (
    <ProductForm
      initialValues={initialValues}
      title="Update Product"
      onSubmit={async (values) => {
        await saveProduct(id, values);
        navigate("/admin/products");
      }}
    />
  );
}
