const request = require("supertest");
const { app } = require('../index');

describe("Tests sobre la api de archiveros", () => {
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
        let musicoId = "";
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

            // Enviamos petición de archivero
            newPeticion.directivo = directivoId;
            newPeticion.banda = bandaId;
            newPeticion.usuario = uid;
            newPeticion.rol = "Músico";
            newPeticion.instrumento = "Tuba";
            newPeticion.voz = "Primero"

            const responseA = await request(app).post('/api/peticiones').send(newPeticion).set('x-token', token);
            peticionId = responseA.body.peticion._id;

            // Aceptamos la petición
            await request(app).put('/api/peticiones/aceptar/' + peticionId + '/' + uid).set('x-token', token);
        });

        it("Obtener los músicos de una banda", async () => {
            const response = await request(app).get('/api/musicos/byAllByBandaId/' + bandaId).set('x-token', token);
            expect(response.statusCode).toBe(201);
        });

        it("Obtener músico por su user id", async () => {
            const response = await request(app).get('/api/musicos/user/id/' + uid).set('x-token', token);
            expect(response.statusCode).toBe(201);
            musicoId = response.body.musicos[0]._id;
        });

        it("Obtener músico por su id", async () => {
            const response = await request(app).get('/api/musicos/' + musicoId).set('x-token', token);
            expect(response.statusCode).toBe(201);
        });

        it("Finalizar musico", async () => {
            const response = await request(app).put('/api/musicos/finalizar/' + uid + '/' + bandaId).set('x-token', token);
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
        let musicoId = "";
        let bandaId = "";
        let peticionId = "";
        let uidInvalido = "";
        let tokenInvalido = "";

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

            // Enviamos petición de archivero
            newPeticion.directivo = directivoId;
            newPeticion.banda = bandaId;
            newPeticion.usuario = uid;
            newPeticion.rol = "Músico";
            newPeticion.instrumento = "Tuba";
            newPeticion.voz = "Primero"

            const responseA = await request(app).post('/api/peticiones').send(newPeticion).set('x-token', token);
            peticionId = responseA.body.peticion._id;

            // Aceptamos la petición
            await request(app).put('/api/peticiones/aceptar/' + peticionId + '/' + uid).set('x-token', token);

            // Logeamos con otro usuario
            const loginReponseB = await request(app).post('/api/auth').send({"correo": "alvaro.uber8@gmail.com", "contraseña": "asdf1234"});
            tokenInvalido = loginReponseB.body.token;
            uidInvalido = loginReponseB.body.uid;
        });

        it("Finalizar el rol de musico sin ser directivo de la banda ni el propio musico", async () => {
            const response = await request(app).put('/api/musicos/finalizar/' + uid + '/' + bandaId).set('x-token', tokenInvalido);
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