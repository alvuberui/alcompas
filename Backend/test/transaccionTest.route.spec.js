const request = require("supertest");
const { app } = require('../index');

describe("Pruebas de la api de vestimentas", () => {

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

    const newUser2 = {
        "nombre": "TestBanda",
        "primer_apellido": "TestBanda",
        "segundo_apellido": "TestBanda",
        "fecha_nacimiento": "1999-01-01",
        "correo": "testbanda2@test.com",
        "descripcion": "TestBanda",
        "localidad": "TestBanda",
        "provincia": "TestBanda",
        "codigo_postal": 41400,
        "direccion": "TestBanda",
        "nif": "37233792N",
        "telefono": 111222334,
        "usuario": "TestBanda2",
        "contraseña": "asdf1234"
    }

    const newUser3 = {
        "nombre": "TestBanda",
        "primer_apellido": "TestBanda",
        "segundo_apellido": "TestBanda",
        "fecha_nacimiento": "1999-01-01",
        "correo": "testbanda3@test.com",
        "descripcion": "TestBanda",
        "localidad": "TestBanda",
        "provincia": "TestBanda",
        "codigo_postal": 41400,
        "direccion": "TestBanda",
        "nif": "63628579E",
        "telefono": 111221334,
        "usuario": "TestBanda3",
        "contraseña": "asdf1234"
    }

    const transaccion = {
        "cantidad": 100,
        "motivo": "TestTransaccion",
        "descripcion": "TestTransaccion",
        "fecha": "2021-01-01",
        "tipo": "Beneficio",
        "banda": "",
    }

    const newPeticion = {
        "fecha": "1999-01-01",
        "mensaje": "Mensaje de prueba",
        "rol": "Directivo",
        "cargo": "Tesorero",
        "banda": "",


    }

    describe("Casos positivos de la api de vestimentas", () => {
        let token = "";
        let uid = "";
        let token2 = "";
        let uid2 = "";

        let bandaId = "";
        let transaccionId = "";
        let directivoId = "";
        let peticionId = "";

        beforeAll(async () => {
            await request(app).post('/api/auth/register').send(newUser);
            const loginReponse = await request(app).post('/api/auth').send({"correo": "testbanda@test.com", "contraseña": "asdf1234"});
            token = loginReponse.body.token;
            uid = loginReponse.body.uid;
            await request(app).post('/api/auth/register').send(newUser2);
            const loginReponse2 = await request(app).post('/api/auth').send({"correo": "testbanda2@test.com", "contraseña": "asdf1234"});
            token2 = loginReponse2.body.token;
            uid2 = loginReponse2.body.uid;
            const response = await request(app).post('/api/bandas').send(newBanda).set('x-token', token);
            bandaId = response.body.nueva_banda._id;

             // obtener mi directivo
             const response2 = await request(app).get('/api/directivos/byUserId/' + uid).set('x-token', token);
             directivoId = response2.body.directivo[0]._id;

            // creamos peticion de archivero
            newPeticion.banda = bandaId;
            newPeticion.directivo = directivoId;
            newPeticion.usuario = uid2;
            const response3 = await request(app).post('/api/peticiones').send(newPeticion).set('x-token', token);
            peticionId = response3.body.peticion._id;
            await request(app).put('/api/peticiones/aceptar/' + peticionId + '/' + uid2).set('x-token', token2);
        });

        test("Crear una transaccion", async () => {
            transaccion.banda = bandaId;
            const response = await request(app).post('/api/transacciones').send(transaccion).set('x-token', token2);
            transaccionId = response.body.transaccionDB._id;
            expect(response.statusCode).toBe(200);
        });

        test("Editar una transaccion", async () => {
            transaccion.cantidad = 200;
            const response = await request(app).put('/api/transacciones/' + transaccionId).send(transaccion).set('x-token', token2);
            expect(response.statusCode).toBe(200);
        });

        test("Obtener transacciones de una banda", async () => {
            const response = await request(app).get('/api/transacciones/banda/' + bandaId).set('x-token', token2);
            expect(response.statusCode).toBe(200);
        });

        test("Obtener transacciones ultimo año", async () => {
            const response = await request(app).get('/api/transacciones/ano/banda/' + bandaId).set('x-token', token2);
            expect(response.statusCode).toBe(200);
        });

        test("Eliminar una transaccion", async () => {
            const response = await request(app).delete('/api/transacciones/' + transaccionId).set('x-token', token2);
            expect(response.statusCode).toBe(200);
        });

        afterAll(async () => {
            await request(app).delete('/api/bandas/' + bandaId).set('x-token', token);
            await request(app).delete('/api/auth/' + uid).set('x-token', token);
            await request(app).delete('/api/auth/' + uid2).set('x-token', token2);
        });
    });

    describe("Casos negativos de la api de vestimentas", () => {
        let token = "";
        let uid = "";
        let token2 = "";
        let uid2 = "";
        let token3 = "";
        let uid3 = "";

        let bandaId = "";
        let transaccionId = "";
        let directivoId = "";
        let peticionId = "";

        beforeAll(async () => {
            await request(app).post('/api/auth/register').send(newUser);
            const loginReponse = await request(app).post('/api/auth').send({"correo": "testbanda@test.com", "contraseña": "asdf1234"});
            token = loginReponse.body.token;
            uid = loginReponse.body.uid;
            await request(app).post('/api/auth/register').send(newUser2);
            const loginReponse2 = await request(app).post('/api/auth').send({"correo": "testbanda2@test.com", "contraseña": "asdf1234"});
            token2 = loginReponse2.body.token;
            uid2 = loginReponse2.body.uid;
            await request(app).post('/api/auth/register').send(newUser3);
            const loginReponse3 = await request(app).post('/api/auth').send({"correo": "testbanda3@test.com", "contraseña": "asdf1234"});
            token3 = loginReponse3.body.token;
            uid3 = loginReponse3.body.uid;

            const response = await request(app).post('/api/bandas').send(newBanda).set('x-token', token);
            bandaId = response.body.nueva_banda._id;

             // obtener mi directivo
             const response2 = await request(app).get('/api/directivos/byUserId/' + uid).set('x-token', token);
             directivoId = response2.body.directivo[0]._id;

            // creamos peticion de archivero
            newPeticion.banda = bandaId;
            newPeticion.directivo = directivoId;
            newPeticion.usuario = uid2;
            const response3 = await request(app).post('/api/peticiones').send(newPeticion).set('x-token', token);
            peticionId = response3.body.peticion._id;
            await request(app).put('/api/peticiones/aceptar/' + peticionId + '/' + uid2).set('x-token', token2);
        });

        test("Crear una transaccion sin ser tesorero", async () => {
            transaccion.banda = bandaId;
            const response = await request(app).post('/api/transacciones').send(transaccion).set('x-token', token);
            expect(response.statusCode).toBe(401);
        });

        test("Editar una transaccion sin ser tesorero", async () => {
            // Crear transaccion 
            transaccion.banda = bandaId;
            const response2 = await request(app).post('/api/transacciones').send(transaccion).set('x-token', token2);
            transaccionId = response2.body.transaccionDB._id;
            // Editar transaccion
            transaccion.cantidad = 200;
            const response = await request(app).put('/api/transacciones/' + transaccionId).send(transaccion).set('x-token', token);
            expect(response.statusCode).toBe(401);
        });

        test("Obtener transacciones de la banda sin ser directivo", async () => {
            const response = await request(app).get('/api/transacciones/banda/' + bandaId).set('x-token', token3);
            expect(response.statusCode).toBe(401);
        });

        test("Obtener transacciones ultimo año sin ser directivo", async () => {
            const response = await request(app).get('/api/transacciones/ano/banda/' + bandaId).set('x-token', token3);
            expect(response.statusCode).toBe(401);
        });

        test("Eliminar una transaccion sin ser tesorero", async () => {
            const response = await request(app).delete('/api/transacciones/' + transaccionId).set('x-token', token);
            expect(response.statusCode).toBe(401);
        });

        test("Crear transaccion con tipo invalido" , async () => {
            const transaccion5 = {
                "cantidad": 100,
                "motivo": "TestTransaccion",
                "descripcion": "TestTransaccion",
                "fecha": "2021-01-01",
                "tipo": "Beneficio",
                "banda": "",
            }
            transaccion5.tipo = "Test";
            const response = await request(app).post('/api/transacciones').send(transaccion5).set('x-token', token2);
            expect(response.statusCode).toBe(400);
        });

        afterAll(async () => {
            await request(app).delete('/api/bandas/' + bandaId).set('x-token', token);
            await request(app).delete('/api/auth/' + uid).set('x-token', token);
            await request(app).delete('/api/auth/' + uid2).set('x-token', token2);
            await request(app).delete('/api/auth/' + uid3).set('x-token', token3);
        });
    });
});