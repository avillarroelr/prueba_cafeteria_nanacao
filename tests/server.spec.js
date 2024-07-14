const request = require("supertest");
const app = require("../index.js");
const { faker } = require('@faker-js/faker');

// Probando la ruta GET
describe("OPERACIONES RUTA GET DE CAFES", () => {
    // Verificando respuesta con un status 200
    it("Should respond with a 200 status", async () => {
        const response = await request(app).get("/cafes").send();
        expect(response.status).toBe(200);
    });
    // Verificando que el tipo de dato sea un Array
    it("Should respond with an array", async () => {
        const response = await request(app).get("/cafes").send();
        expect(Array.isArray(response.body)).toBe(true);
    });
    // Verificando que el Array tenga al menos un objeto
    it("Should respond with at least one object", async () => {
        const response = await request(app).get("/cafes").send();
        expect(response.body.length).toBeGreaterThan(0);
    });
    // Verificando que el primer elemento del arreglo sea un objeto
    it("Should first element of array be an object", async () => {
        const response = await request(app).get("/cafes").send();
        expect(typeof response.body[0]).toBe("object");
    });
    // *PRUEBA ADICIONAL* Verificando respuesta 404 cuando el ID no existe
    it("Should return 404 if cafe ID does not exist", async () => {
        const response = await request(app).get("/cafes/9999").send();
        expect(response.status).toBe(404);
        expect(response.body.message).toBe("No se encontró ningún cafe con ese id");
    });
});

// Probando la Ruta DELETE
describe("OPERACIONES RUTA DELETE DE CAFES", () => {
    // Verificando error 404 al intentar eliminar cafe con id que no existe 
    it("Should return a 404 status when trying to delete a non-existent cafe", async () => {
        // Usando id ficticio que no existe en cafes.json
        const nonExistentId = 9999; 
        const response = await request(app)
            .delete(`/cafes/${nonExistentId}`)
            .set("Authorization", "Bearer some-valid-token");

        expect(response.status).toBe(404);
        expect(response.body.message).toBe("No se encontró ningún cafe con ese id");
    });
    // *PRUEBA ADICIONAL* Verificando error 400 si no se proporciona el encabezado de autorización
    it("Should return a 400 status if no Authorization header is present", async () => {
        const cafeId = 1; // tomando id que ya existe en cafes.json
        const response = await request(app)
            .delete(`/cafes/${cafeId}`);
        expect(response.status).toBe(400);
        expect(response.body.message).toBe("No recibió ningún token en las cabeceras");
    });
    // *PRUEBA ADICIONAL* Verifica que se elimina un café existente correctamente
    it("Should delete an existing cafe and respond with a 200 status", async () => {
        const newCafe = {
            id: faker.number.int({ min: 5, max: 1000 }), // id inventado para agregar y luego eliminar
            nombre: faker.commerce.productName()
        };
        // Primero, agregamos un nuevo café para tener algo que eliminar
        await request(app)
            .post("/cafes")
            .send(newCafe)
            .set("Content-Type", "application/json");

        const response = await request(app)
            .delete(`/cafes/${newCafe.id}`)
            .set("Authorization", "Bearer some-valid-token");

        expect(response.status).toBe(200);
        const getResponse = await request(app).get("/cafes").send();
        expect(getResponse.body).not.toContainEqual(expect.objectContaining({ id: newCafe.id }));
    });
});

// Probando la ruta POST
describe("OPERACIONES RUTA POST DE CAFES", () => {
    // Verificando que se agregó nuevo café con resultado estado 201
    it("Should add a new cafe and respond with a 201 status", async () => {
        const newCafe = {
            id: faker.number.int({ min: 6, max: 1000 }), // tomando id que no existe en cafes.json
            nombre: faker.commerce.productName()
        };
        const response = await request(app)
            .post("/cafes")
            .send(newCafe)
            .set("Content-Type", "application/json");
        expect(response.status).toBe(201);
        expect(response.body).toContainEqual(newCafe);
    });
    // Verifica error 400 al insertar café con un id que ya existe
    it("Should return a 400 status if the cafe ID already exists", async () => {
        const existingCafe = {
            id: 1, // Usando id 1 de cafes.json
            nombre: faker.commerce.productName()
        };
        const response = await request(app)
            .post("/cafes")
            .send(existingCafe)
            .set("Content-Type", "application/json");
        expect(response.status).toBe(400);
        expect(response.body.message).toBe("Ya existe un cafe con ese id");
    });
    // *PRUEBA ADICIONAL* Verificando el error al intentar agregar un café sin id
    it("Should return a 400 status if the cafe does not have an ID", async () => {
        const newCafe = {
            nombre: faker.commerce.productName()
        };
        const response = await request(app)
            .post("/cafes")
            .send(newCafe)
            .set("Content-Type", "application/json");
        expect(response.status).toBe(400);
        expect(response.body.message).toBe("El cafe debe tener un ID");
    });
});

// Probando la Ruta PUT
describe("OPERACIONES RUTA PUT DE CAFES", () => {
    // Verificando que se obtiene error 400 si ids no coinciden
    it("Should return a 400 status if the cafe ID in parameters does not match the ID in the payload", async () => {
        const idParam = faker.number.int({ min: 6, max: 1000 });
        const cafePayload = {
            id: faker.number.int({ min: 6, max: 1000 }),
            nombre: faker.commerce.productName()
        };
        
        const response = await request(app)
            .put(`/cafes/${idParam}`)
            .send(cafePayload)
            .set("Content-Type", "application/json");
        
        expect(response.status).toBe(400);
        expect(response.body.message).toBe("El id del parámetro no coincide con el id del café recibido");
    });
    // Verificando que se actualiza un café que ya existe
    it("Should update an existing cafe and respond with a 200 status", async () => {
        const existingId = 1; // Usando id 1 de cafes.json
        const updatedCafe = {
            id: existingId,
            nombre: faker.commerce.productName()
        };

        const response = await request(app)
            .put(`/cafes/${existingId}`)
            .send(updatedCafe)
            .set("Content-Type", "application/json");

        expect(response.status).toBe(200);
        expect(response.body).toContainEqual(updatedCafe);
    });
    // Verificando que se obtiene error 404 si el cafe no existe
    it("Should return a 404 status if the cafe does not exist", async () => {
        const nonExistentId = 9999;
        const cafePayload = {
            id: nonExistentId,
            nombre: faker.commerce.productName()
        };
        const response = await request(app)
            .put(`/cafes/${nonExistentId}`)
            .send(cafePayload)
            .set("Content-Type", "application/json");
        expect(response.status).toBe(404);
        expect(response.body.message).toBe("No se encontró ningún café con ese id");
    });
    // *PRUEBA ADICIONAL* Verificando el error al intentar actualizar un café sin id
    it("Should return a 400 status if the cafe does not have an ID in the payload", async () => {
        const idParam = faker.number.int({ min: 6, max: 1000 });
        const cafePayload = {
            nombre: faker.commerce.productName()
        };
        const response = await request(app)
            .put(`/cafes/${idParam}`)
            .send(cafePayload)
            .set("Content-Type", "application/json");
        expect(response.status).toBe(400);
        expect(response.body.message).toBe("El id del parámetro no coincide con el id del café recibido");
    });
});





