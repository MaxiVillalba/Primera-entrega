import fs from "fs";
import { v4 as uuid } from "uuid";

export class CartManager {
  constructor() {
    this.carts = [];
    this.path = "./src/managers/data/carts.json";
    this.initializeFileIfNotExists(this.path);
  }

  async initializeFileIfNotExists(filePath) {
    try {
      if (!fs.existsSync(filePath)) {
        await fs.promises.writeFile(filePath, JSON.stringify([]));
      }
    } catch (error) {
      console.error(`Error al inicializar el archivo ${filePath}:`, error);
    }
  }

  async getCarts() {
    const file = await fs.promises.readFile(this.path, "utf-8");
    this.carts = JSON.parse(file) || [];
    return this.carts;
  }

  async createCart() {
    await this.getCarts();
    const newCart = {
      id: uuid(),
      products: [],
    };
    this.carts.push(newCart);
    await fs.promises.writeFile(this.path, JSON.stringify(this.carts));
    return newCart;
  }

  async getCartById(cid) {
    await this.getCarts();
    const cart = this.carts.find((cart) => cart.id === cid);
    if (!cart) throw new Error(`Carrito con id ${cid} no encontrado`);
    return cart;
  }

  async addProductToCart(cid, pid) {
    const cart = await this.getCartById(cid);

    const product = cart.products.find((productCart) => productCart.product === pid);
    if (!product) {
      cart.products.push({ product: pid, quantity: 1 });
    } else {
      product.quantity++;
    }

    await fs.promises.writeFile(this.path, JSON.stringify(this.carts));
    return cart;
  }
}
