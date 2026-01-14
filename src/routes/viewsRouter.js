import { Router } from "express";
import { ProductModel } from "../models/Product.model.js";

const router = Router();

// HOME
router.get("/", async (req, res) => {
  const products = await ProductModel.find().lean();
  res.render("home", { products });
});

// REAL TIME
router.get("/realtimeproducts", async (req, res) => {
  const products = await ProductModel.find().lean();
  res.render("realTimeProducts", { products });
});

export default router;