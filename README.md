# 📦 Backend E-commerce – Node.js & MongoDB

Backend desarrollado en **Node.js** utilizando **Express** y **MongoDB** como sistema de persistencia.  
El proyecto implementa una API REST para la gestión de **productos** y **carritos**, junto con **vistas renderizadas con Handlebars** para la visualización de productos y carritos.

---

## 🚀 Tecnologías utilizadas

- Node.js
- Express
- MongoDB + Mongoose
- Handlebars
- Socket.io (productos en tiempo real)

---

## 🗂 Arquitectura del proyecto

```text
🌐 Cliente (Navegador)
        │
        │ HTTP / WebSocket
        ▼
🚦 Express (server.js)
        │
        ├── /api/products  → Products Router
        │                     └── Product Model (MongoDB)
        │
        ├── /api/carts     → Carts Router
        │                     └── Cart Model (MongoDB)
        │
        └── /products      → Views Router
                              └── Handlebars (HTML)
🧠 Responsabilidades

Express: recibe y gestiona las peticiones HTTP

Routers: organizan y separan las rutas por dominio

Models (Mongoose): definen esquemas y gestionan la persistencia en MongoDB

Handlebars: renderiza vistas HTML dinámicas

Socket.io: actualiza productos en tiempo real

📌 Funcionalidades principales
🛍 Productos

Listado de productos con:

Paginación

Filtros por categoría o disponibilidad

Ordenamiento por precio (asc/desc)

Visualización de producto individual

Actualización de productos en tiempo real

🛒 Carritos

Creación de carritos

Agregar productos al carrito

Actualizar cantidades

Eliminar productos del carrito

Vaciar carrito

Visualización de carrito con productos completos (populate)

🌐 Vistas disponibles

/products → Listado de productos con paginación

/products/:pid → Detalle de producto

/carts/:cid → Visualización de carrito específico

⚙️ Instalación y ejecución
git clone <url-del-repositorio>
cd backend-ecommerce
npm install
npm run dev


Crear un archivo .env con las siguientes variables:

PORT=8082
MONGO_URL=your_mongo_connection_string

📝 Notas

MongoDB es utilizado como sistema de persistencia principal.
La lógica de negocio se mantiene separada de la capa de presentación.

