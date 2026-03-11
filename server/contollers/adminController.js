import { Admin, Order, Product, User } from "../models/Schema.js";

const getOrCreateConfig = async () => {
  let config = await Admin.findOne();

  if (!config) {
    config = await Admin.create({ banner: [], categories: [] });
  }

  return config;
};

export const getDashboardStats = async (req, res, next) => {
  try {
    const [users, products, orders, config] = await Promise.all([
      User.countDocuments(),
      Product.countDocuments(),
      Order.countDocuments(),
      getOrCreateConfig(),
    ]);

    return res.status(200).json({
      users,
      products,
      orders,
      categories: config.categories,
      banner: config.banner,
    });
  } catch (error) {
    next(error);
  }
};

export const getAdminConfig = async (req, res, next) => {
  try {
    const config = await getOrCreateConfig();
    return res.status(200).json(config);
  } catch (error) {
    next(error);
  }
};

export const updateAdminConfig = async (req, res, next) => {
  try {
    const config = await getOrCreateConfig();
    const { banner, categories } = req.body;

    if (banner) {
      config.banner = banner;
    }

    if (categories) {
      config.categories = categories;
    }

    await config.save();
    return res.status(200).json(config);
  } catch (error) {
    next(error);
  }
};
