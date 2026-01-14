import express from "express";
import http from "http";
import path from "path";
import { fileURLToPath } from "url";
import { Server } from "socket.io";
import { engine } from "express-handlebars";


// Routers
import productsRouter from "./src/routes/productsRouter.js";
import cartsRouter from "./src/routes/cartsRouter.js";
import viewsRouter from "./src/routes/viewsRouter.js";

// Managers
import ProductManager from "./src/managers/ProductManager.js";
// mongodb 

import dotenv from "dotenv";
import { connectDB } from "./src/config/db.js";
// --------------------------------------------------
// Configuración base
// --------------------------------------------------

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// rutas absolutas 
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();
connectDB();
// --------------------------------------------------
// Middlewares
// --------------------------------------------------

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Archivos públicos
app.use(express.static(path.join(__dirname, "src", "public")));

// --------------------------------------------------
// Handlebars
// --------------------------------------------------

app.engine("handlebars", engine());
app.set("view engine", "handlebars");
app.set("views", path.join(__dirname, "src", "views"));

// --------------------------------------------------
// Routers
// --------------------------------------------------

app.use("/", viewsRouter);
app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);

// --------------------------------------------------
// Socket.IO
// --------------------------------------------------

const productManager = new ProductManager(
  path.join(__dirname, "src", "data", "products.json")
);

io.on("connection", async (socket) => {
  console.log(" Cliente conectado");

  // Enviar productos actuales
  const products = await productManager.getProducts();
  socket.emit("products", products);

  // Crear producto desde websocket
  socket.on("new-product", async (data) => {
    await productManager.addProduct({
      title: data.title,
      description: data.description || "Sin descripción",
      code: Date.now().toString(),
      price: Number(data.price),
      status: true,
      stock: 1,
      category: "general",
      thumbnails: []
    });

    const updatedProducts = await productManager.getProducts();
    io.emit("products", updatedProducts);
  });

  // Eliminar producto desde websocket
  socket.on("delete-product", async (pid) => {
    await productManager.deleteProduct(pid);

    const updatedProducts = await productManager.getProducts();
    io.emit("products", updatedProducts);
  });
});

// --------------------------------------------------
// Servidor
// --------------------------------------------------

const PORT = process.env.PORT || 8080;
server.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});

