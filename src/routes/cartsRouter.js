import { Router } from "express";
import { CartModel } from "../models/Cart.model.js";
import { ProductModel } from "../models/Product.model.js";

const router = Router();

// POST /api/carts
router.post("/", async (req, res) => {
  const cart = await CartModel.create({ products: [] });
  res.status(201).json(cart);
});

// GET /api/carts/:cid
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

// POST /api/carts/:cid/product/:pid
router.post("/:cid/product/:pid", async (req, res) => {
  try {
    const { cid, pid } = req.params;

    // validar producto
    const productExists = await ProductModel.findById(pid);
    if (!productExists) {
      return res.status(404).json({ error: "Producto no encontrado" });
    }

    // buscar carrito
    const cart = await CartModel.findById(cid);
    if (!cart) {
      return res.status(404).json({ error: "Carrito no encontrado" });
    }

    // agregar o incrementar
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

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
