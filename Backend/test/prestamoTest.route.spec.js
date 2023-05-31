const request = require("supertest");
const { app } = require('../index');

describe("Pruebas de la api de prestamo", () => {

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

    const vestimenta = {
        "tipo": "Camisa",
        "banda": "",
    }

    const newInstrumentoBanda = {
        "modelo": "Test",
        "instrumento": "Trompeta",
        "marca": "Test",
        "numeroSerie": "Test",
    }

    const prestamo = {
        "comentario": "Test",
        "tipo": "Vestimenta",
        "referencia": "",
        "usuario": "",
    }

    describe("Casos positivos de la api de vestimentas", () => {
        let token = "";
        let uid = "";
        let token2 = "";
        let uid2 = "";

        let bandaId = "";
        let vestiementaId = "";
        let instrumentoId = "";
        let prestamoId = "";

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
            vestimenta.banda = bandaId;
            const response3 = await request(app).post('/api/vestimentas').send(vestimenta).set('x-token', token);
            vestiementaId = response3.body.nuevaVestimenta._id;
            newInstrumentoBanda.banda = bandaId;
            const response2 = await request(app).post('/api/instrumentos/banda').send(newInstrumentoBanda).set('x-token', token);
            instrumentoId = response2.body.instrumentoDB._id;
        });

        test("Crear prestamo", async () => {
            prestamo.referencia = vestiementaId;
            prestamo.usuario = uid;
            const response = await request(app).post('/api/prestamos').send(prestamo).set('x-token', token);
            expect(response.statusCode).toBe(200);
            prestamoId = response.body.prestamo._id;
        });

        test("Obtener prestamo activo a partir de su referencia", async () => {
            const response = await request(app).get('/api/prestamos/activo/Vestimenta/' + vestiementaId).set('x-token', token);
            expect(response.statusCode).toBe(200);
        });

        test("Cancelar prestamo activo", async () => {
            const response = await request(app).put('/api/prestamos/cancelar/' + prestamoId).set('x-token', token);
            expect(response.statusCode).toBe(200);
        });

        test("crear prestamo instrumento", async () => {
            prestamo.referencia = instrumentoId;
            prestamo.usuario = uid;
            prestamo.tipo = "Instrumento";
            const response = await request(app).post('/api/prestamos').send(prestamo).set('x-token', token);
            expect(response.statusCode).toBe(200);
            prestamoId = response.body.prestamo._id;
        });

        test("Obtener prestamo activo a partir de su referencia", async () => {
            const response = await request(app).get('/api/prestamos/activo/Instrumento/' + instrumentoId).set('x-token', token);
            expect(response.statusCode).toBe(200);
        });

        test("Cancelar prestamo activo", async () => {
            const response = await request(app).put('/api/prestamos/cancelar/' + prestamoId).set('x-token', token);
            expect(response.statusCode).toBe(200);
        });

        test("Obtener todos los prestamos de un usuario", async () => {
            const response = await request(app).get('/api/prestamos/usuario/' + uid).set('x-token', token);
            expect(response.statusCode).toBe(200);
        });

        test("Obtener todos los prestamos de una banda", async () => {
            const response = await request(app).get('/api/prestamos/banda/' + bandaId).set('x-token', token);
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

        let bandaId = "";
        let vestiementaId = "";
        let instrumentoId = "";
        let prestamoId = "";

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
            vestimenta.banda = bandaId;
            const response3 = await request(app).post('/api/vestimentas').send(vestimenta).set('x-token', token);
            vestiementaId = response3.body.nuevaVestimenta._id;
            newInstrumentoBanda.banda = bandaId;
            const response2 = await request(app).post('/api/instrumentos/banda').send(newInstrumentoBanda).set('x-token', token);
            instrumentoId = response2.body.instrumentoDB._id;
        });

        test("Crear prestamo sin ser directivo de la banda", async () => {
            prestamo.referencia = vestiementaId;
            prestamo.usuario = uid2;
            prestamo.tipo = "Vestimenta";
            prestamo.usuario = uid2;
            const response = await request(app).post('/api/prestamos').send(prestamo).set('x-token', token2);
            expect(response.statusCode).toBe(400);
        });

        test("Crear un prestamo de una vestimenta que ya esta prestada", async () => {
            prestamo.referencia = vestiementaId;
            prestamo.usuario = uid;
            prestamo.tipo = "Vestimenta";
            const response = await request(app).post('/api/prestamos').send(prestamo).set('x-token', token);
            expect(response.statusCode).toBe(200);
            prestamoId = response.body.prestamo._id;

            const response2 = await request(app).post('/api/prestamos').send(prestamo).set('x-token', token);
            expect(response2.statusCode).toBe(400);
        });

        test("Obtener prestamo activo sin ser directivo", async () => {
            const response = await request(app).get('/api/prestamos/activo/Vestimenta/' + vestiementaId).set('x-token', token2);
            expect(response.statusCode).toBe(400);
        });

        test("Cancelar prestamo activo sin ser directivo", async () => {
            const response = await request(app).put('/api/prestamos/cancelar/' + prestamoId).set('x-token', token2);
            expect(response.statusCode).toBe(400);
        });

        test("Cancelar prestamo sin existir", async () => {
            const response = await request(app).put('/api/prestamos/cancelar/' + "5f9b0b3b3b3b3b3b3b3b3b3b").set('x-token', token);
            expect(response.statusCode).toBe(400);
        });

        test("Obtener todos los prestamos de un usuario sin ser el mismo", async () => {
            const response = await request(app).get('/api/prestamos/usuario/' + uid).set('x-token', token2);
            expect(response.statusCode).toBe(400);
        });

        test("Obtener todos los prestamos de una banda sin ser directivo", async () => {
            const response = await request(app).get('/api/prestamos/banda/' + bandaId).set('x-token', token2);
            expect(response.statusCode).toBe(400);
        });





        afterAll(async () => {
            await request(app).delete('/api/bandas/' + bandaId).set('x-token', token);
            await request(app).delete('/api/auth/' + uid).set('x-token', token);
            await request(app).delete('/api/auth/' + uid2).set('x-token', token2);
        });
    });
});