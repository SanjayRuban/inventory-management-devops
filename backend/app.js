const express = require("express");
const cors = require("cors");
require("dotenv").config();

const pool = require("./db");

const app = express();

app.use(cors());
app.use(express.json());

// Health check
app.get("/health", (req, res) => {
  res.json({
    status: "UP",
    service: "inventory-management-api"
  });
});

// GET all products
app.get("/api/products", async (req, res) => {
  try {
    const [rows] = await pool.query(
      "SELECT * FROM products ORDER BY id DESC"
    );

    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Failed to fetch products"
    });
  }
});

// GET product by ID
app.get("/api/products/:id", async (req, res) => {
  try {
    const [rows] = await pool.query(
      "SELECT * FROM products WHERE id = ?",
      [req.params.id]
    );

    if (rows.length === 0) {
      return res.status(404).json({
        message: "Product not found"
      });
    }

    res.json(rows[0]);

  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Failed to fetch product"
    });
  }
});

// CREATE product
app.post("/api/products", async (req, res) => {
  try {
    const {
      name,
      category,
      price,
      quantity,
      reorder_level
    } = req.body;

    if (
      !name ||
      !category ||
      price === undefined ||
      quantity === undefined
    ) {
      return res.status(400).json({
        message: "name, category, price and quantity are required"
      });
    }

    const [result] = await pool.query(
      `INSERT INTO products
       (name, category, price, quantity, reorder_level)
       VALUES (?, ?, ?, ?, ?)`,
      [
        name,
        category,
        Number(price),
        Number(quantity),
        Number(reorder_level || 0)
      ]
    );

    const [rows] = await pool.query(
      "SELECT * FROM products WHERE id = ?",
      [result.insertId]
    );

    res.status(201).json(rows[0]);

  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Failed to create product"
    });
  }
});

// UPDATE product
app.put("/api/products/:id", async (req, res) => {
  try {
    const {
      name,
      category,
      price,
      quantity,
      reorder_level
    } = req.body;

    const [result] = await pool.query(
      `UPDATE products
       SET name = ?, category = ?, price = ?,
           quantity = ?, reorder_level = ?
       WHERE id = ?`,
      [
        name,
        category,
        Number(price),
        Number(quantity),
        Number(reorder_level || 0),
        req.params.id
      ]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        message: "Product not found"
      });
    }

    const [rows] = await pool.query(
      "SELECT * FROM products WHERE id = ?",
      [req.params.id]
    );

    res.json(rows[0]);

  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Failed to update product"
    });
  }
});

// DELETE product
app.delete("/api/products/:id", async (req, res) => {
  try {
    const [result] = await pool.query(
      "DELETE FROM products WHERE id = ?",
      [req.params.id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        message: "Product not found"
      });
    }

    res.json({
      message: "Product deleted successfully"
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Failed to delete product"
    });
  }
});

module.exports = app;