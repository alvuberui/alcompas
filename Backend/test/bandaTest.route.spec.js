const request = require("supertest");
const { app } = require('../index');

describe("Pruebas de la api de bandas", () => {

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

    describe("Casos positivos de la api de bandas", () => {

        let token = "";
        let uid = "";

        let bandaId = "";

        beforeAll(async () => {
            await request(app).post('/api/auth/register').send(newUser);
            const loginReponse = await request(app).post('/api/auth').send({"correo": "testbanda@test.com", "contraseña": "asdf1234"});
            token = loginReponse.body.token;
            uid = loginReponse.body.uid;
        });

        it("Crear banda", async() => {
            const response = await request(app).post('/api/bandas').send(newBanda).set('x-token', token);

            expect(response.statusCode).toBe(201);
            expect(response.body.nueva_banda).toHaveProperty('nombre');
            expect(response.body.nuevo_directivo).toHaveProperty('usuario');
            bandaId = response.body.nueva_banda._id;
        });

        it("Editar banda", async() => {
            newBanda.nombre = "TestBanda2";
            const response = await request(app).put('/api/bandas/' + bandaId).send(newBanda).set('x-token', token);

            expect(response.statusCode).toBe(201);
        });

        it("Obtener banda", async() => {
            const response = await request(app).get('/api/bandas/' + bandaId).set('x-token', token);

            expect(response.statusCode).toBe(201);
        });

        it("Obtener todas las bandas", async() => {
            const response = await request(app).get('/api/bandas').set('x-token', token);

            expect(response.statusCode).toBe(201);
        });

        it("Obtener todas las bandas de un usuario", async() => {
            const response = await request(app).get('/api/bandas/misBandas/' + uid).set('x-token', token);

            expect(response.statusCode).toBe(201);
        });

        it("Obtener banda por nombre", async() => {
            const response = await request(app).get('/api/bandas/buscar/' + newBanda.nombre).set('x-token', token);

            expect(response.statusCode).toBe(201);
        });

        it("Eliminar banda" , async() => {
            const response = await request(app).delete('/api/bandas/' + bandaId).set('x-token', token);

            expect(response.statusCode).toBe(201);
        });

        afterAll(async () => {
            await request(app).delete('/api/auth/' + uid).set('x-token', token);
        });
    });

    describe("Casos negativos de la api de bandas", () => {

        let token = "";
        let uid = "";

        let tokenInvalido = "";
        let uidInvalido = "";

        let bandaId = "";

        beforeAll(async () => {
            await request(app).post('/api/auth/register').send(newUser);
            let loginReponse = await request(app).post('/api/auth').send({"correo": "testbanda@test.com", "contraseña": "asdf1234"});
            token = loginReponse.body.token;
            uid = loginReponse.body.uid;

            loginReponse = await request(app).post('/api/auth').send({"correo": "alvaro.uber8@gmail.com", "contraseña": "asdf1234"});
            tokenInvalido = loginReponse.body.token;
            uidInvalido = loginReponse.body.uid;

            const response = await request(app).post('/api/bandas').send(newBanda).set('x-token', token);
            bandaId = response.body.nueva_banda._id;
        });

        it("Crear banda con campo repetido" , async() => {
            const response = await request(app).post('/api/bandas').send(newBanda).set('x-token', token);

            expect(response.statusCode).toBe(400);
        });

        it("Crear banda con tipo invalido" , async() => {
            newBanda.tipo = "hola";
            const response = await request(app).post('/api/bandas').send(newBanda).set('x-token', token);
            expect(response.statusCode).toBe(400);
        });

        it("Crear banda con fecha invalida" , async() => {
            newBanda.año_fundacion = 3000;
            const response = await request(app).post('/api/bandas').send(newBanda).set('x-token', token);
            console.log(response)
            expect(response.statusCode).toBe(400);
        });

        it("Crear banda sin token" , async() => {
            const response = await request(app).post('/api/bandas').send(newBanda);

            expect(response.statusCode).toBe(401);
        });

        it("Editar banda sin ser directivo" , async() => {
            newBanda.nombre = "TestBanda2";
            const response = await request(app).put('/api/bandas/' + bandaId).send(newBanda).set('x-token', tokenInvalido);

            expect(response.statusCode).toBe(400);
        });

        it("Obtener las bandas de otro usuario" , async() => {
            const response = await request(app).get('/api/bandas/misBandas/' + uidInvalido).set('x-token', token);

            expect(response.statusCode).toBe(400);
        });

        it("Eliminar banda sin ser el presidente" , async() => {
            const response = await request(app).delete('/api/bandas/' + bandaId).set('x-token', tokenInvalido);

            expect(response.statusCode).toBe(400);
        });

        afterAll(async () => {
            await request(app).delete('/api/bandas/' + bandaId).set('x-token', token);
            await request(app).delete('/api/auth/' + uid).set('x-token', token);
        });
    });


});