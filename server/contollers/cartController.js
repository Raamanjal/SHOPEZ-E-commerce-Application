import { Cart, Product } from "../models/Schema.js";

const cartTotals = (items) => {
  const subtotal = items.reduce((total, item) => total + item.price * item.quantity, 0);
  const discountedTotal = items.reduce(
    (total, item) => total + (item.price - item.discount) * item.quantity,
    0
  );

  return { subtotal, discountedTotal };
};

export const getCartItems = async (req, res, next) => {
  try {
    const items = await Cart.find({ userId: req.user._id }).sort({ createdAt: -1 });
    return res.status(200).json({ items, totals: cartTotals(items) });
  } catch (error) {
    next(error);
  }
};

export const addToCart = async (req, res, next) => {
  try {
    const { productId, quantity = 1, size } = req.body;

    if (!productId || !size) {
      return res.status(400).json({ message: "Product and size are required" });
    }

    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    const existingCartItem = await Cart.findOne({
      userId: req.user._id,
      productId,
      size,
    });

    if (existingCartItem) {
      existingCartItem.quantity += Number(quantity);
      await existingCartItem.save();
      return res.status(200).json(existingCartItem);
    }

    const cartItem = await Cart.create({
      userId: req.user._id,
      productId: product._id,
      title: product.title,
      description: product.description,
      mainImg: product.mainImg,
      size,
      quantity,
      price: product.price,
      discount: product.discount,
    });

    return res.status(201).json(cartItem);
  } catch (error) {
    next(error);
  }
};

export const updateCartItem = async (req, res, next) => {
  try {
    const { quantity, size } = req.body;

    const cartItem = await Cart.findOne({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!cartItem) {
      return res.status(404).json({ message: "Cart item not found" });
    }

    if (quantity) {
      cartItem.quantity = quantity;
    }

    if (size) {
      cartItem.size = size;
    }

    await cartItem.save();
    return res.status(200).json(cartItem);
  } catch (error) {
    next(error);
  }
};

export const removeCartItem = async (req, res, next) => {
  try {
    const cartItem = await Cart.findOne({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!cartItem) {
      return res.status(404).json({ message: "Cart item not found" });
    }

    await cartItem.deleteOne();
    return res.status(200).json({ message: "Cart item removed successfully" });
  } catch (error) {
    next(error);
  }
};

export const clearCart = async (req, res, next) => {
  try {
    await Cart.deleteMany({ userId: req.user._id });
    return res.status(200).json({ message: "Cart cleared successfully" });
  } catch (error) {
    next(error);
  }
};
