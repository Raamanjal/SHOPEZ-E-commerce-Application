import bcrypt from "bcryptjs";
import dotenv from "dotenv";

import connectDB from "../config/db.js";
import { Admin, Product, User } from "../models/Schema.js";
import { sampleBanner, sampleProducts } from "../data/sampleData.js";

dotenv.config();

const DEMO_USERS = [
  {
    username: "demo-user",
    email: "user@shopez.dev",
    password: "123456",
    usertype: "user",
  },
  {
    username: "demo-admin",
    email: "admin@shopez.dev",
    password: "123456",
    usertype: "admin",
  },
];

const seed = async () => {
  try {
    await connectDB();

    await Promise.all([
      Product.deleteMany({}),
      Admin.deleteMany({}),
      User.deleteMany({ email: { $in: DEMO_USERS.map((user) => user.email) } }),
    ]);

    await Product.insertMany(sampleProducts);
    await Admin.create(sampleBanner);

    const usersWithHashedPasswords = await Promise.all(
      DEMO_USERS.map(async (user) => ({
        ...user,
        password: await bcrypt.hash(user.password, 10),
      }))
    );

    await User.insertMany(usersWithHashedPasswords);

    console.log("Seed completed successfully.");
    console.log("Demo user: user@shopez.dev / 123456");
    console.log("Demo admin: admin@shopez.dev / 123456");
    process.exit(0);
  } catch (error) {
    console.error("Seed failed:", error.message);
    process.exit(1);
  }
};

seed();
