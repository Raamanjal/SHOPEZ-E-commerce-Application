import { useState } from "react";

import { useGeneralContext } from "../../context/GeneralContext.js";

export default function Admin() {
  const { bannerData, dashboard, updateBanner } = useGeneralContext();
  const [form, setForm] = useState({
    banner: bannerData.banner?.join(", ") || "",
    categories: bannerData.categories?.join(", ") || "",
  });

  const handleSubmit = async (event) => {
    event.preventDefault();
    await updateBanner({
      banner: form.banner
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean),
      categories: form.categories
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean),
    });
  };

  return (
    <div className="page admin-page">
      <section className="admin-stats">
        <div className="stat-card">
          <span>Total users</span>
          <strong>{dashboard?.users ?? 0}</strong>
        </div>
        <div className="stat-card">
          <span>All Products</span>
          <strong>{dashboard?.products ?? 0}</strong>
        </div>
        <div className="stat-card">
          <span>All Orders</span>
          <strong>{dashboard?.orders ?? 0}</strong>
        </div>
      </section>

      <section className="panel admin-form-panel admin-banner-panel">
        <h2>Update Banner</h2>
        <form className="stack-form" onSubmit={handleSubmit}>
          <textarea
            rows="4"
            placeholder="Banner image URLs, comma separated"
            value={form.banner}
            onChange={(event) => setForm({ ...form, banner: event.target.value })}
          />
          <textarea
            rows="3"
            placeholder="Categories, comma separated"
            value={form.categories}
            onChange={(event) => setForm({ ...form, categories: event.target.value })}
          />
          <button className="primary-button" type="submit">
            Update
          </button>
        </form>
      </section>
    </div>
  );
}
