import express from 'express';
import productsRouter from './router/products.js';
import cartsRouter from "./router/carts.js";

const app = express();
const PORT = 8080;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);

app.get('/', (req, res) => {
  res.send('Servidor funcionando sin base de datos');
});

app.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`);
});
