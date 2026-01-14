import { Router } from "express";
import { ProductModel } from "../models/Product.model.js";

const router = Router();

/*GET /api/products  Soporta limit, page, sort, query */
router.get("/", async (req, res) => {
  try {
    const {
      limit = 10,
      page = 1,
      sort,
      query
    } = req.query;

    const filter = query
      ? { category: query }
      : {};

    const sortOption =
      sort === "asc" ? { price: 1 } :
      sort === "desc" ? { price: -1 } :
      {};

    const options = {
      limit: Number(limit),
      page: Number(page),
      sort: sortOption,
      lean: true
    };

    const result = await ProductModel.paginate(filter, options);

    res.json({
      status: "success",
      payload: result.docs,
      totalPages: result.totalPages,
      page: result.page,
      hasPrevPage: result.hasPrevPage,
      hasNextPage: result.hasNextPage,
      prevPage: result.prevPage,
      nextPage: result.nextPage,
      prevLink: result.hasPrevPage
        ? `/api/products?page=${result.prevPage}`
        : null,
      nextLink: result.hasNextPage
        ? `/api/products?page=${result.nextPage}`
        : null
    });

  } catch (error) {
    res.status(500).json({
      status: "error",
      error: error.message
    });
  }
});

/* POST /api/products */
router.post("/", async (req, res) => {
  try {
    if (!Array.isArray(req.body)) {
      return res.status(400).json({
        status: "error",
        error: "Se espera un array de productos"
      });
    }

    const products = await ProductModel.insertMany(req.body);

    res.status(201).json({
      status: "success",
      payload: products
    });
  } catch (error) {
    res.status(400).json({
      status: "error",
      error: error.message
    });
  }
});

export default router;
