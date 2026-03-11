import { Admin } from "../models/Schema.js";

const getOrCreateConfig = async () => {
  let config = await Admin.findOne();

  if (!config) {
    config = await Admin.create({ banner: [], categories: [] });
  }

  return config;
};

export const getBannerData = async (req, res, next) => {
  try {
    const config = await getOrCreateConfig();
    return res.status(200).json(config);
  } catch (error) {
    next(error);
  }
};

export const updateBannerData = async (req, res, next) => {
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
