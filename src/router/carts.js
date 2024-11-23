import { Router } from "express";
import { CartManager } from "../managers/cartManager.js";
import { ProductManager } from "../managers/productManager.js";

const cartManager = new CartManager();
const productManager = new ProductManager();
const router = Router();

router.post("/", async (req, res) => {
  try {
    const cart = await cartManager.createCart();
    res.status(201).json(cart);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

router.get("/:cid", async (req, res) => {
  const { cid } = req.params;
  try {
    const cart = await cartManager.getCartById(cid);
    res.status(200).json(cart);
  } catch (error) {
    console.error(error);
    res.status(404).json({ error: error.message });
  }
});

router.post("/:cid/product/:pid", async (req, res) => {
  const { cid, pid } = req.params;
  try {
    const product = await productManager.getProductById(pid);
    if (!product) {
      return res.status(404).json({ error: `Producto con id ${pid} no encontrado` });
    }

    const cart = await cartManager.addProductToCart(cid, pid);
    res.status(200).json(cart);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

export default router;
