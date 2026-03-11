import { useState } from "react";

const baseProduct = {
  title: "",
  description: "",
  mainImg: "",
  carousel: "",
  sizes: "S,M,L,XL",
  category: "",
  gender: "unisex",
  price: "",
  discount: "",
  stock: "",
  featured: false,
};

export default function ProductForm({ title, initialValues = baseProduct, onSubmit }) {
  const [form, setForm] = useState({
    ...baseProduct,
    ...initialValues,
    carousel: Array.isArray(initialValues.carousel)
      ? initialValues.carousel.join(", ")
      : initialValues.carousel || "",
    sizes: Array.isArray(initialValues.sizes)
      ? initialValues.sizes.join(", ")
      : initialValues.sizes || "S,M,L,XL",
  });

  const handleSubmit = async (event) => {
    event.preventDefault();
    await onSubmit({
      ...form,
      price: Number(form.price),
      discount: Number(form.discount || 0),
      stock: Number(form.stock || 0),
      carousel: form.carousel
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean),
      sizes: form.sizes
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean),
    });
  };

  return (
    <section className="page panel admin-form-panel full-span-panel">
      <h2>{title}</h2>
      <form className="stack-form" onSubmit={handleSubmit}>
        <div className="form-grid">
          <input
            placeholder="Product title"
            value={form.title}
            onChange={(event) => setForm({ ...form, title: event.target.value })}
          />
          <input
            placeholder="Category"
            value={form.category}
            onChange={(event) => setForm({ ...form, category: event.target.value })}
          />
        </div>
        <textarea
          rows="4"
          placeholder="Product description"
          value={form.description}
          onChange={(event) => setForm({ ...form, description: event.target.value })}
        />
        <input
          placeholder="Thumbnail image URL"
          value={form.mainImg}
          onChange={(event) => setForm({ ...form, mainImg: event.target.value })}
        />
        <input
          placeholder="Carousel image URLs"
          value={form.carousel}
          onChange={(event) => setForm({ ...form, carousel: event.target.value })}
        />
        <div className="form-grid">
          <input
            placeholder="Sizes"
            value={form.sizes}
            onChange={(event) => setForm({ ...form, sizes: event.target.value })}
          />
          <select
            value={form.gender}
            onChange={(event) => setForm({ ...form, gender: event.target.value })}
          >
            <option value="unisex">Unisex</option>
            <option value="men">Men</option>
            <option value="women">Women</option>
          </select>
        </div>
        <div className="form-grid">
          <input
            placeholder="Price"
            type="number"
            value={form.price}
            onChange={(event) => setForm({ ...form, price: event.target.value })}
          />
          <input
            placeholder="Discount"
            type="number"
            value={form.discount}
            onChange={(event) => setForm({ ...form, discount: event.target.value })}
          />
          <input
            placeholder="Stock"
            type="number"
            value={form.stock}
            onChange={(event) => setForm({ ...form, stock: event.target.value })}
          />
        </div>
        <label className="checkbox-row">
          <input
            checked={Boolean(form.featured)}
            type="checkbox"
            onChange={(event) => setForm({ ...form, featured: event.target.checked })}
          />
          Featured product
        </label>
        <button className="primary-button" type="submit">
          Save product
        </button>
      </form>
    </section>
  );
}
