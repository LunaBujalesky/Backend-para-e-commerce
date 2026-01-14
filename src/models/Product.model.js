import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const productSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  code: { type: String, required: true },
  price: { type: Number, required: true },
  status: { type: Boolean, default: true },
  stock: Number,
  category: String,
  thumbnails: [String]
});

productSchema.plugin(mongoosePaginate);

export const ProductModel = mongoose.model("Product", productSchema);