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

        test("Crear petición", async () => {
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

        test("Obtener peticiones de un usuario", async () => {
            const response = await request(app).get('/api/peticiones/' + uid).set('x-token', token);

            expect(response.statusCode).toBe(200);
        });

        test("Obtener peticiones de una banda", async () => {
            const response = await request(app).get('/api/peticiones/peticionesByBandaId/' + bandaId).set('x-token', token);

            expect(response.statusCode).toBe(200);
        });

        test("Aceptar petición", async () => {
            const response = await request(app).put('/api/peticiones/aceptar/' + peticionId + '/' + uid).set('x-token', token);
            expect(response.statusCode).toBe(201);
        });

        test("Crear peticion archivero y Aceptar petición", async () => {
            const newPeticion2 = {
                "fecha": "1999-01-01",
                "mensaje": "Mensaje de prueba"
            }
            newPeticion2.directivo = directivoId;
            newPeticion2.banda = bandaId;
            newPeticion2.usuario = uid;
            newPeticion2.rol = "Archivero";

            const response1 = await request(app).post('/api/peticiones').send(newPeticion2).set('x-token', token);
            expect(response1.statusCode).toBe(200);
            const response = await request(app).put('/api/peticiones/rechazar/' + response1.body.peticion._id + '/' + uid).set('x-token', token);
            expect(response.statusCode).toBe(201);
        });

        test("Rechazar petición", async () => {
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

        test("Crear petición sin ser directivo", async () => {
            const response = await request(app).post('/api/peticiones').send(newPeticion).set('x-token', tokenInvalido);
            expect(response.statusCode).toBe(400);
        });

        test("Crear petición teniendo una en estado pendiente", async () => {
            const response = await request(app).post('/api/peticiones').send(newPeticion).set('x-token', token);
            expect(response.statusCode).toBe(400);
        });

        test("Crear una peticion teniendo ya ese rol el usuario", async () => {
            // Primero aceptamos la petición pendiente
            const response = await request(app).put('/api/peticiones/aceptar/' + peticionId + '/' + uid).set('x-token', token);
            expect(response.statusCode).toBe(201);
            // Creamos una nueva peticion
            const response2 = await request(app).post('/api/peticiones').send(newPeticion).set('x-token', token);
            expect(response2.statusCode).toBe(400);
        });

        test("Crear petición inválida", async () => {
            const pet = { "mensaje": "Mensaje de prueba", "fecha": "1999-01-01", "rol": "Archivero", "banda": bandaId, "directivo": directivoId, "usuario": uid, instrumento: "Tuba"};
            const response = await request(app).post('/api/peticiones').send(pet).set('x-token', token);
     
            expect(response.statusCode).toBe(400);
        });

        test("Crear petición inválida", async () => {
            const pet = { "mensaje": "Mensaje de prueba", "fecha": "1999-01-01", "rol": "Músico", "banda": bandaId, "directivo": directivoId, "usuario": uid};
            const response = await request(app).post('/api/peticiones').send(pet).set('x-token', token);
     
            expect(response.statusCode).toBe(400);
        });

        test("Crear petición inválida", async () => {
            const pet = { "mensaje": "Mensaje de prueba", "fecha": "1999-01-01", "rol": "Directivo", "cargo": "Presidente", "banda": bandaId, "directivo": directivoId, "usuario": uid};
            const response = await request(app).post('/api/peticiones').send(pet).set('x-token', token);
            expect(response.statusCode).toBe(400);

            const pet2 = { "mensaje": "Mensaje de prueba", "fecha": "1999-01-01", "rol": "dasda", "banda": bandaId, "directivo": directivoId, "usuario": uid};
            const response2 = await request(app).post('/api/peticiones').send(pet2).set('x-token', token);
            expect(response2.statusCode).toBe(400);

            const pet3 = { "mensaje": "Mensaje de prueba", "fecha": "1999-01-01", "rol": "Directivo", "cargo": "fsdfsd", "banda": bandaId, "directivo": directivoId, "usuario": uid};
            const response3 = await request(app).post('/api/peticiones').send(pet3).set('x-token', token);
            expect(response3.statusCode).toBe(400);

            const pet4 = { "instrumento": "sfsd", "mensaje": "Mensaje de prueba", "fecha": "1999-01-01", "rol": "Directivo", "cargo": "Presidente", "banda": bandaId, "directivo": directivoId, "usuario": uid};
            const response4 = await request(app).post('/api/peticiones').send(pet4).set('x-token', token);
            expect(response4.statusCode).toBe(400);

            const voz = { "voz": "wgweg", "mensaje": "Mensaje de prueba", "fecha": "1999-01-01", "rol": "Directivo", "cargo": "Presidente", "banda": bandaId, "directivo": directivoId, "usuario": uid};
            const response5 = await request(app).post('/api/peticiones').send(voz).set('x-token', token);
            expect(response5.statusCode).toBe(400);
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