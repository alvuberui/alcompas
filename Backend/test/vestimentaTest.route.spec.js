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

    const vestimenta = {
        "tipo": "Camisa",
        "banda": "",
    }

    describe("Casos positivos de la api de vestimentas", () => {
        let token = "";
        let uid = "";
        let token2 = "";
        let uid2 = "";

        let bandaId = "";
        let vestiementaId = "";

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
        });

        test("Crear vestimenta", async () => {
            vestimenta.banda = bandaId;
            const response = await request(app).post('/api/vestimentas').send(vestimenta).set('x-token', token);
            vestiementaId = response.body.nuevaVestimenta._id;
            expect(response.statusCode).toBe(200);
            expect(response.body.ok).toBe(true);
            expect(response.body.nuevaVestimenta).not.toBeNull();
        });

        test("Editar vestimenta", async () => {
            vestimenta.tipo = "Pantalones";
            vestimenta._id = vestiementaId;
            const response = await request(app).put('/api/vestimentas/' + vestiementaId).send(vestimenta).set('x-token', token);
            expect(response.statusCode).toBe(200);
            expect(response.body.ok).toBe(true);
            expect(response.body.nuevaVestimenta).not.toBeNull();
        });

        test("Obtener todas las vestimentas de una banda", async () => {
            const response = await request(app).get('/api/vestimentas/banda/' + bandaId).set('x-token', token);
            expect(response.statusCode).toBe(200);
            expect(response.body.ok).toBe(true);
            expect(response.body.vestimentas).not.toBeNull();
        });

        test("Obtener todos las vestimentas pretados de una banda", async () => {
            const response = await request(app).get('/api/vestimentas/banda/prestados/' + bandaId).set('x-token', token);
            expect(response.statusCode).toBe(200);
            expect(response.body.ok).toBe(true);
            expect(response.body.vestimentas.length).toBe(0)
        });

        test("Obtener todos las vestimentas sin prestar de una banda", async () => {
            const response = await request(app).get('/api/vestimentas/banda/sinprestar/' + bandaId).set('x-token', token);
            expect(response.statusCode).toBe(200);
            expect(response.body.ok).toBe(true);
            expect(response.body.vestimentas.length).toBe(1);
        });

        test("Eliminar vestimenta", async () => {
            const response = await request(app).delete('/api/vestimentas/' + vestiementaId).set('x-token', token);
            expect(response.statusCode).toBe(200);
            expect(response.body.ok).toBe(true);
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
        });

        test("Crear vestimenta sin ser directivo", async () => {
            vestimenta.banda = bandaId;
            const response = await request(app).post('/api/vestimentas').send(vestimenta).set('x-token', token2);
            expect(response.statusCode).toBe(400);
            expect(response.body.ok).toBe(false);
        });

        test("Ver vestimentas sin ser directivo", async () => {
            const response = await request(app).get('/api/vestimentas/banda/' + bandaId).set('x-token', token2);
            expect(response.statusCode).toBe(400);
            expect(response.body.ok).toBe(false);
        });

        test("Editar vestimente sin ser directivo", async () => {
            // creamos una vestimenta 
            vestimenta.banda = bandaId;
            const response2 = await request(app).post('/api/vestimentas').send(vestimenta).set('x-token', token);
            vestiementaId = response2.body.nuevaVestimenta._id;
            // editamos la vestimenta
            vestimenta.tipo = "Pantalones";
            vestimenta._id = vestiementaId;
            const response = await request(app).put('/api/vestimentas/' + vestiementaId).send(vestimenta).set('x-token', token2);
            expect(response.statusCode).toBe(400);
            expect(response.body.ok).toBe(false);
        });

        test("Eliminar vestimenta sin ser directivo", async () => {
            const response = await request(app).delete('/api/vestimentas/' + vestiementaId).set('x-token', token2);
            expect(response.statusCode).toBe(400);
            expect(response.body.ok).toBe(false);
        });

        test("Obtener sin prestar sin ser directivo", async () => {
            const response = await request(app).get('/api/vestimentas/banda/sinprestar/' + bandaId).set('x-token', token2);
            expect(response.statusCode).toBe(400);
            expect(response.body.ok).toBe(false);
        });

        test("Obtener prestados sin ser directivo", async () => {
            const response = await request(app).get('/api/vestimentas/banda/prestados/' + bandaId).set('x-token', token2);
            expect(response.statusCode).toBe(400);
            expect(response.body.ok).toBe(false);
        });

        afterAll(async () => {
            await request(app).delete('/api/bandas/' + bandaId).set('x-token', token);
            await request(app).delete('/api/auth/' + uid).set('x-token', token);
            await request(app).delete('/api/auth/' + uid2).set('x-token', token2);
        });
    });
});