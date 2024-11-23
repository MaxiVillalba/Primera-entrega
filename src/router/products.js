import { Router } from "express";
import { ProductManager } from "../managers/productManager.js";
import Joi from 'joi';

const productManager = new ProductManager();
const router = Router();

const productSchema = Joi.object({
  title: Joi.string().required(),
  description: Joi.string().required(),
  price: Joi.number().required(),
  thumbnail: Joi.array().items(Joi.string()).required(),
  code: Joi.string().required(),
  stock: Joi.number().required(),
  category: Joi.string().required(),
});

router.get("/", async (req, res) => {
  try {
    const products = await productManager.getProducts();
    if (!products.length) {
      return res.status(404).json({ message: "No hay productos disponibles" });
    }
    res.status(200).json(products);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al obtener los productos" });
  }
});

router.post("/", async (req, res) => {
  try {
    const { error, value } = productSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const newProduct = await productManager.addProduct(value);
    res.status(201).json(newProduct);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

export default router;
