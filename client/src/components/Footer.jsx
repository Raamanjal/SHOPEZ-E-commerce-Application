import { Facebook, Instagram, Mail, MapPin, Phone, Twitter, Youtube } from "lucide-react";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-brand">
        <h3>ShopEZ</h3>
        <p>Your one-stop destination for effortless online shopping, discovery, and fast checkout.</p>
        <div className="footer-socials">
          <a href="#social" aria-label="Twitter">
            <Twitter size={16} />
          </a>
          <a href="#social" aria-label="Instagram">
            <Instagram size={16} />
          </a>
          <a href="#social" aria-label="Youtube">
            <Youtube size={16} />
          </a>
          <a href="#social" aria-label="Facebook">
            <Facebook size={16} />
          </a>
        </div>
      </div>
      <div className="footer-links">
        <h4>Shop</h4>
        <Link to="/products">All Products</Link>
        <Link to="/products?featured=true">Featured</Link>
        <Link to="/auth">Login</Link>
      </div>
      <div className="footer-links">
        <h4>Account</h4>
        <Link to="/profile">Profile</Link>
        <Link to="/cart">Cart</Link>
        <Link to="/admin">Sell on ShopEZ</Link>
      </div>
      <div className="footer-links">
        <h4>Support</h4>
        <span><Mail size={14} /> support@shopez.dev</span>
        <span><Phone size={14} /> +91 98765 43210</span>
        <span><MapPin size={14} /> India</span>
      </div>
    </footer>
  );
}
