# Inventory Management System

Simple Inventory Management System using Node.js, Express and MySQL.

## 1. Create the MySQL database

Run this in MySQL:

```sql
CREATE DATABASE inventory_db;

USE inventory_db;

CREATE TABLE products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    category VARCHAR(100) NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    quantity INT NOT NULL,
    reorder_level INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## 2. Configure backend

Open `backend/.env.example`, change the MySQL password, and save it as `.env`.

Example:

```env
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=inventory_db
DB_PORT=3306
```

## 3. Install and run backend

```bash
cd backend
npm install
npm start
```

API:
http://localhost:5000

Health:
http://localhost:5000/health

## 4. Test with Postman

### Create
POST http://localhost:5000/api/products

Body → raw → JSON:

```json
{
  "name": "Laptop",
  "category": "Electronics",
  "price": 50000,
  "quantity": 20,
  "reorder_level": 5
}
```

### Read all
GET http://localhost:5000/api/products

### Read one
GET http://localhost:5000/api/products/1

### Update
PUT http://localhost:5000/api/products/1

```json
{
  "name": "Gaming Laptop",
  "category": "Electronics",
  "price": 65000,
  "quantity": 15,
  "reorder_level": 5
}
```

### Delete
DELETE http://localhost:5000/api/products/1

## 5. Open frontend

Open `frontend/index.html` in a browser after starting the backend.

The frontend uses the API at:

http://localhost:5000/api/products
