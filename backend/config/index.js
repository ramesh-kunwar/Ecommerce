import dotenv from "dotenv";
dotenv.config();

const config = {
  JWT_SECRET: process.env.JWT_SECRET,
  JWT_Expiry: process.env.JWT_Expiry || "30d",
};

export default config;
