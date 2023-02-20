const request = require("supertest");
const { app } = require('../index');

describe("Tests sobre la api de directivos", () => {
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


        beforeAll(async () => {
            // Registramos usuario
            await request(app).post('/api/auth/register').send(newUser);
            let loginReponse = await request(app).post('/api/auth').send({"correo": "testbanda@test.com", "contraseña": "asdf1234"});
            token = loginReponse.body.token;
            uid = loginReponse.body.uid;

            // Creamos una banda
            const response = await request(app).post('/api/bandas').send(newBanda).set('x-token', token);
            bandaId = response.body.nueva_banda._id;

            // Obtenemos el directivo a partir de su user id
            const directivoResponse = await request(app).get('/api/directivos/byUserId/' + uid).set('x-token', token);
            directivoId = directivoResponse.body.directivo[0]._id;
        });

        test("Obtener directivo por su id", async () => {
            const response = await request(app).get('/api/directivos/' + directivoId).set('x-token', token);
            expect(response.statusCode).toBe(201);
        });

        test("Obtener directivo por su user id", async () => {
            const response = await request(app).get('/api/directivos/byUserId/' + uid).set('x-token', token);
            expect(response.statusCode).toBe(201);
        });

        test("Obtener directivos de una banda", async () => {
            const response = await request(app).get('/api/directivos/banda/id/' + bandaId).set('x-token', token);
            expect(response.statusCode).toBe(201);
        });

        test("Finalizar directivo", async () => {
            const response = await request(app).put('/api/directivos/finalizar/' + uid + '/' + bandaId).set('x-token', token);
            expect(response.statusCode).toBe(201);
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
        let tokenInvalido = "";
        let uidInvalido = "";

        beforeAll(async () => {
            // Registramos usuario
            await request(app).post('/api/auth/register').send(newUser);
            let loginReponse = await request(app).post('/api/auth').send({"correo": "testbanda@test.com", "contraseña": "asdf1234"});
            token = loginReponse.body.token;
            uid = loginReponse.body.uid;

            // Creamos una banda
            const response = await request(app).post('/api/bandas').send(newBanda).set('x-token', token);
            bandaId = response.body.nueva_banda._id;

            // Obtenemos el directivo a partir de su user id
            const directivoResponse = await request(app).get('/api/directivos/byUserId/' + uid).set('x-token', token);
            directivoId = directivoResponse.body.directivo[0]._id;

            // Nos logeamos con otro usuario
            let loginReponse2 = await request(app).post('/api/auth').send({"correo": "alvaro.uber8@gmail.com", "contraseña": "asdf1234"});
            tokenInvalido = loginReponse2.body.token;
            uidInvalido = loginReponse2.body.uid;
        });

        test("Finalizar directivo sin ser directivo de la banda", async () => {
            const response = await request(app).put('/api/directivos/finalizar/' + uid + '/' + bandaId).set('x-token', tokenInvalido);
            expect(response.statusCode).toBe(401);
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