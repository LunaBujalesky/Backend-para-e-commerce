import { Router } from "express";
import { CartModel } from "../models/Cart.model.js";

const router = Router();

// POST /api/carts: crea el carrito
router.post("/", async (req, res) => {
  const cart = await CartModel.create({ products: [] });
  res.status(201).json(cart);
});

// GET /api/carts/:cid: para ver carrito con productos
router.get("/:cid", async (req, res) => {
    try {
      const cart = await CartModel
        .findById(req.params.cid)
        .populate("products.product")
        .lean();
  
      if (!cart) {
        return res.status(404).json({ error: "Carrito no encontrado" });
      }
  
      res.json(cart);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

// POST /api/carts/:cid/product/:pid; para agregar producto
router.post("/:cid/product/:pid", async (req, res) => {
  const { cid, pid } = req.params;

  const cart = await CartModel.findById(cid);
  if (!cart) return res.status(404).json({ error: "Carrito no encontrado" });

  const productIndex = cart.products.findIndex(
    p => p.product.toString() === pid
  );

  if (productIndex !== -1) {
    cart.products[productIndex].quantity++;
  } else {
    cart.products.push({ product: pid, quantity: 1 });
  }

  await cart.save();
  res.json(cart);
});

export default router;