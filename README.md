# Backend para e-commerce
Entorno de backend con nodejs, y mongo db para realizar un e-commerce

## Arquitectura del proyecto
🌐 Cliente (Navegador)
|
| HTTP / WebSocket
v
🚦 Express (server.js)
|
|-- /api/products --> Products Router
| |
| v
| Product Model (MongoDB)
|
|-- /api/carts ----> Carts Router
| |
| v
| Cart Model (MongoDB)
|
|-- /products ----> Views Router
|
v
Handlebars (HTML)

**Responsabilidades:**
- Express: recibe pedidos
- Routers: organizan rutas
- Models (Mongo): guardan datos
- Handlebars: muestra información
