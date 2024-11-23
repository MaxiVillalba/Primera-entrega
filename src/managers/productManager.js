import fs from "fs";
import { v4 as uuid } from "uuid";

export class ProductManager {
  constructor() {
    this.products = [];
    this.path = "./src/managers/data/products.json";
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

  async getProducts(limit) { try {
    const file = await fs.promises.readFile(this.path, "utf-8");
    const fileParse = JSON.stringify(file);
    this.products = JSON.parse(file) || [];
    if (limit) return this.products.slice(0, limit);
    return this.products; 
  } catch (error) {
    console.log(error)
  } }

  async addProduct(product) {
    await this.getProducts();
    const { title, description, price, thumbnail, code, stock, category } = product;

    const newProduct = {
      id: uuid(),
      title,
      description,
      price,
      thumbnail,
      code,
      stock,
      status: true,
      category,
    };

    const productExist = this.products.find((prod) => prod.code === code);
    if (productExist) throw new Error(`Ya existe un producto con el código ${code}`);

    this.products.push(newProduct);
    await fs.promises.writeFile(this.path, JSON.stringify(this.products));
    return newProduct;
  }

  async getProductById(id) {
    await this.getProducts();
    const product = this.products.find((prod) => prod.id === id);
    if (!product) throw new Error(`Producto con id ${id} no encontrado`);
    return product;
  }

  async updateProduct(id, data) {
    await this.getProductById(id);
    const index = this.products.findIndex((prod) => prod.id === id);
    this.products[index] = { ...this.products[index], ...data };
    await fs.promises.writeFile(this.path, JSON.stringify(this.products));
    return this.products[index];
  }

  async deleteProduct(id) {
    await this.getProductById(id);
    this.products = this.products.filter((prod) => prod.id !== id);
    await fs.promises.writeFile(this.path, JSON.stringify(this.products));
    return `Producto con id ${id} eliminado`;
  }
}
