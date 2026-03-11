import { Cart, Order } from "../models/Schema.js";

const buildDeliveryDate = () => {
  const deliveryDate = new Date();
  deliveryDate.setDate(deliveryDate.getDate() + 7);
  return deliveryDate;
};

export const createOrder = async (req, res, next) => {
  try {
    const { name, email, mobile, address, pincode, paymentMethod, items } = req.body;

    if (!name || !email || !mobile || !address || !pincode || !paymentMethod) {
      return res.status(400).json({ message: "Shipping and payment details are required" });
    }

    const cartItems =
      items && items.length
        ? items
        : await Cart.find({
            userId: req.user._id,
          });

    if (!cartItems.length) {
      return res.status(400).json({ message: "No items available for order" });
    }

    const normalizedItems = cartItems.map((item) => ({
      productId: item.productId,
      title: item.title,
      description: item.description,
      mainImg: item.mainImg,
      size: item.size,
      quantity: item.quantity,
      price: item.price,
      discount: item.discount || 0,
    }));

    const totalAmount = normalizedItems.reduce(
      (total, item) => total + (item.price - item.discount) * item.quantity,
      0
    );

    const order = await Order.create({
      userId: req.user._id,
      items: normalizedItems,
      name,
      email,
      mobile,
      address,
      pincode,
      paymentMethod,
      totalAmount,
      deliveryDate: buildDeliveryDate(),
    });

    await Cart.deleteMany({ userId: req.user._id });

    return res.status(201).json(order);
  } catch (error) {
    next(error);
  }
};

export const getMyOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ userId: req.user._id }).sort({ createdAt: -1 });
    return res.status(200).json(orders);
  } catch (error) {
    next(error);
  }
};

export const getOrderById = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    const isOwner = String(order.userId) === String(req.user._id);
    const isAdmin = req.user.usertype === "admin";

    if (!isOwner && !isAdmin) {
      return res.status(403).json({ message: "Not authorized to view this order" });
    }

    return res.status(200).json(order);
  } catch (error) {
    next(error);
  }
};

export const getAllOrders = async (req, res, next) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    return res.status(200).json(orders);
  } catch (error) {
    next(error);
  }
};

export const updateOrderStatus = async (req, res, next) => {
  try {
    const { orderStatus } = req.body;

    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    order.orderStatus = orderStatus || order.orderStatus;
    await order.save();

    return res.status(200).json(order);
  } catch (error) {
    next(error);
  }
};

export const deleteOrder = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    await order.deleteOne();
    return res.status(200).json({ message: "Order deleted successfully" });
  } catch (error) {
    next(error);
  }
};
