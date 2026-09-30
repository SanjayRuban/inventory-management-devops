const request = require("supertest");
const app = require("../app");

describe("Inventory API", () => {

  test("GET /health should return UP", async () => {

    const response = await request(app)
      .get("/health");

    expect(response.statusCode).toBe(200);

    expect(response.body.status).toBe("UP");
  });


  test("GET /api/products should return products", async () => {

    const response = await request(app)
      .get("/api/products");

    expect(response.statusCode).toBe(200);

    expect(Array.isArray(response.body)).toBe(true);
  });


  test("POST /api/products should create a product", async () => {

    const response = await request(app)
      .post("/api/products")
      .send({
        name: "Test Keyboard",
        category: "Electronics",
        price: 1200,
        quantity: 10,
        reorder_level: 2
      });

    expect(response.statusCode).toBe(201);

    expect(response.body.name).toBe("Test Keyboard");
  });

});