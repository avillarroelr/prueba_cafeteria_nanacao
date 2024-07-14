const request = require("supertest");
const app = require("../index.js"); // Asegúrate de que la ruta sea correcta

describe("Operaciones CRUD de cafes", () => {
  it("Should respond with a 200 status", async () => {
    const response = await request(app).get("/cafes").send();
    expect(response.status).toBe(200);
  });
});