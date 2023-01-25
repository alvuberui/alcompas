const request = require("supertest");
const { app } = require('../index');

describe("Tests sobre la api de peticiones", () => {

    const newBanda = {
        "nombre": "TestBanda",
        "tipo": "Agrupación Musical",
        "localidad": "TestBanda",
        "provincia": "TestBanda",
        "codigo_postal": 41400,
        "direccion": "TestBanda",
        "año_fundacion": 1999,
        "descripcion": "TestBanda",
        "telefono": 111222333,
        "correo": "testbanda@gmail.com",
        "cif": "G01536622",
    }

    const newUser = {
        "nombre": "TestBanda",
        "primer_apellido": "TestBanda",
        "segundo_apellido": "TestBanda",
        "fecha_nacimiento": "1999-01-01",
        "correo": "testbanda@test.com",
        "descripcion": "TestBanda",
        "localidad": "TestBanda",
        "provincia": "TestBanda",
        "codigo_postal": 41400,
        "direccion": "TestBanda",
        "nif": "96491178Z",
        "telefono": 111222333,
        "usuario": "TestBanda",
        "contraseña": "asdf1234"
    }

    const newPeticion = {
        "fecha": "1999-01-01",
        "mensaje": "Mensaje de prueba"
    }

    describe("Casos positivos", () => {

        let token = "";
        let uid = "";
        let directivoId = "";
        let bandaId = "";
        let peticionId = "";

        beforeAll(async () => {
            // Registramos usuario
            await request(app).post('/api/auth/register').send(newUser);
            const loginReponse = await request(app).post('/api/auth').send({"correo": "testbanda@test.com", "contraseña": "asdf1234"});
            token = loginReponse.body.token;
            uid = loginReponse.body.uid;

            // Creamos una banda
            const response = await request(app).post('/api/bandas').send(newBanda).set('x-token', token);
            bandaId = response.body.nueva_banda._id;

            // Obtenemos el directivo a partir de su user id
            const directivoResponse = await request(app).get('/api/directivos/byUserId/' + uid).set('x-token', token);
            directivoId = directivoResponse.body.directivo[0]._id;
        });

        it("Crear petición", async () => {
            newPeticion.directivo = directivoId;
            newPeticion.banda = bandaId;
            newPeticion.usuario = uid;
            newPeticion.rol = "Músico";
            newPeticion.instrumento = "Tuba";
            newPeticion.voz = "Primero";

            const response = await request(app).post('/api/peticiones').send(newPeticion).set('x-token', token);
            peticionId = response.body.peticion._id;
            expect(response.statusCode).toBe(200);
        });

        it("Obtener peticiones de un usuario", async () => {
            const response = await request(app).get('/api/peticiones/' + uid).set('x-token', token);

            expect(response.statusCode).toBe(200);
        });

        it("Obtener peticiones de una banda", async () => {
            const response = await request(app).get('/api/peticiones/peticionesByBandaId/' + bandaId).set('x-token', token);

            expect(response.statusCode).toBe(200);
        });

        it("Aceptar petición", async () => {
            const response = await request(app).put('/api/peticiones/aceptar/' + peticionId + '/' + uid).set('x-token', token);
            expect(response.statusCode).toBe(201);
        });

        it("Rechazar petición", async () => {
            const pet = { "mensaje": "Mensaje de prueba", "fecha": "1999-01-01", "rol": "Archivero", "banda": bandaId, "directivo": directivoId, "usuario": uid};
            const response = await request(app).post('/api/peticiones').send(pet).set('x-token', token);
            const response2 = await request(app).put('/api/peticiones/rechazar/' + response.body.peticion._id + '/' + uid).set('x-token', token);
            expect(response2.statusCode).toBe(201);
        });

        afterAll(async () => {
            // Eliminamos la banda
            await request(app).delete('/api/bandas/' + bandaId).set('x-token', token);
            // Eliminamos directivo
            await request(app).delete('/api/directivos/' + directivoId).set('x-token', token);
            // Eliminamos el usuario
            await request(app).delete('/api/auth/' + uid).set('x-token', token);
        });
    });

    describe("Casos negativos", () => {

        let token = "";
        let uid = "";
        let directivoId = "";
        let bandaId = "";
        let peticionId = "";
        let tokenInvalido = "";
        let uidInvalido = "";

        beforeAll(async () => {
            // Registramos usuario
            await request(app).post('/api/auth/register').send(newUser);
            const loginReponse = await request(app).post('/api/auth').send({"correo": "testbanda@test.com", "contraseña": "asdf1234"});
            token = loginReponse.body.token;
            uid = loginReponse.body.uid;

            // Creamos una banda
            const response = await request(app).post('/api/bandas').send(newBanda).set('x-token', token);
            bandaId = response.body.nueva_banda._id;

            // Obtenemos el directivo a partir de su user id
            const directivoResponse = await request(app).get('/api/directivos/byUserId/' + uid).set('x-token', token);
            directivoId = directivoResponse.body.directivo[0]._id;

            // Creamos una petición
            newPeticion.directivo = directivoId;
            newPeticion.banda = bandaId;
            newPeticion.usuario = uid;
            newPeticion.rol = "Músico";
            newPeticion.instrumento = "Tuba";
            newPeticion.voz = "Primero";

            const responseP = await request(app).post('/api/peticiones').send(newPeticion).set('x-token', token);
            peticionId = responseP.body.peticion._id;

            // Hacemos login con otro usuario
            const loginReponse2 = await request(app).post('/api/auth').send({"correo": "alvaro.uber8@gmail.com", "contraseña": "asdf1234"});
            tokenInvalido = loginReponse2.body.token;
            uidInvalido = loginReponse2.body.uid;
        });

        it("Crear petición sin ser directivo", async () => {
            const response = await request(app).post('/api/peticiones').send(newPeticion).set('x-token', tokenInvalido);
            expect(response.statusCode).toBe(400);
        });

        it("Crear petición teniendo una en estado pendiente", async () => {
            const response = await request(app).post('/api/peticiones').send(newPeticion).set('x-token', token);
            expect(response.statusCode).toBe(400);
        });

        it("Crear una peticion teniendo ya ese rol el usuario", async () => {
            // Primero aceptamos la petición pendiente
            const response = await request(app).put('/api/peticiones/aceptar/' + peticionId + '/' + uid).set('x-token', token);
            expect(response.statusCode).toBe(201);
            // Creamos una nueva peticion
            const response2 = await request(app).post('/api/peticiones').send(newPeticion).set('x-token', token);
            expect(response2.statusCode).toBe(400);
        });

        it("Crear petición inválida", async () => {
            const pet = { "mensaje": "Mensaje de prueba", "fecha": "1999-01-01", "rol": "Archivero", "banda": bandaId, "directivo": directivoId, "usuario": uid, instrumento: "Tuba"};
            const response = await request(app).post('/api/peticiones').send(pet).set('x-token', token);
            console.log(response.body);
            expect(response.statusCode).toBe(400);
        });

        afterAll(async () => {
            // Eliminamos la banda
            await request(app).delete('/api/bandas/' + bandaId).set('x-token', token);
            // Eliminamos directivo
            await request(app).delete('/api/directivos/' + directivoId).set('x-token', token);
            // Eliminamos el usuario
            await request(app).delete('/api/auth/' + uid).set('x-token', token);
        });
    });
});