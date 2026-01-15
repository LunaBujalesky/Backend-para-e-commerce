import { Router } from "express";
import { ProductModel } from "../models/Product.model.js";
import { CartModel } from "../models/Cart.model.js";

const router = Router();

// HOME
router.get("/", async (req, res) => {
  const products = await ProductModel.find().lean();
  res.render("home", { products });
});

// PRODUCTS con paginación 
router.get("/products", async (req, res) => {
  const {
    limit = 10,
    page = 1,
    sort,
    query
  } = req.query;

  let filter = {};

  if (query) {
    if (query === "true" || query === "false") {
      filter.status = query === "true";
    } else {
      filter.category = query;
    }
  }

  const sortOption =
    sort === "asc" ? { price: 1 } :
    sort === "desc" ? { price: -1 } :
    {};

  const result = await ProductModel.paginate(filter, {
    limit,
    page,
    sort: sortOption,
    lean: true
  });

  res.render("products", {
    products: result.docs,
    totalPages: result.totalPages,
    page: result.page,
    hasPrevPage: result.hasPrevPage,
    hasNextPage: result.hasNextPage,
    prevLink: result.hasPrevPage
      ? `/products?page=${result.prevPage}`
      : null,
    nextLink: result.hasNextPage
      ? `/products?page=${result.nextPage}`
      : null,
    cartId: "6968300f6a748c82abe42066"
  });
});

// PRODUCTO INDIVIDUAL
router.get("/products/:pid", async (req, res) => {
  const product = await ProductModel
    .findById(req.params.pid)
    .lean();

  res.render("productDetail", { product });
});

// VISTA DE CARRITO
router.get("/carts/:cid", async (req, res) => {
  const cart = await CartModel
    .findById(req.params.cid)
    .populate("products.product")
    .lean();

  res.render("cart", cart);
});


router.get("/products/:pid", async (req, res) => {
  const product = await ProductModel
    .findById(req.params.pid)
    .lean();

  res.render("productDetail", {
    product,
    cartId: "6968300f6a748c82abe42066"
  });
});
export default router;