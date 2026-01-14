import express from "express";
import http from "http";
import path from "path";
import { fileURLToPath } from "url";
import { Server } from "socket.io";
import { engine } from "express-handlebars";
import { ProductModel } from "./src/models/Product.model.js";

// Routers
import productsRouter from "./src/routes/productsRouter.js";
import cartsRouter from "./src/routes/cartsRouter.js";
import viewsRouter from "./src/routes/viewsRouter.js";


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

io.on("connection", async (socket) => {
  console.log(" Cliente conectado");

  const products = await ProductModel.find().lean();
  socket.emit("products", products);

  socket.on("new-product", async (data) => {
    await ProductModel.create(data);

    const updatedProducts = await ProductModel.find().lean();
    io.emit("products", updatedProducts);
  });

  socket.on("delete-product", async (pid) => {
    await ProductModel.findByIdAndDelete(pid);

    const updatedProducts = await ProductModel.find().lean();
    io.emit("products", updatedProducts);
  });
});
// --------------------------------------------------
// Servidor
// --------------------------------------------------

const PORT = process.env.PORT || 8082;
server.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});

