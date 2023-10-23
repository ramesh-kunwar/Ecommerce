import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Collection name is required"],
      trim: true,
      maxLength: [
        120,
        "Collection name should not be more than 120 characters",
      ],
    },
  },
  { timestamps: true }
);

export default mongoose.model("Product", productSchema);
