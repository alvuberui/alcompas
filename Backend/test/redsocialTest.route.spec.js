const request = require("supertest");
const { app } = require('../index');

describe("Tests sobre la api de redes sociales", () => {

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

    const newRedSocial = {
        "nombre": "TestRedSocial",
        "url": "TestRedSocial",
    }


    describe("Casos positivos", () => {

        let token = "";
        let uid = "";

        let bandaId = "";
        let redSocialId = "";

        beforeAll(async () => {
            await request(app).post('/api/auth/register').send(newUser);
            const loginReponse = await request(app).post('/api/auth').send({"correo": "testbanda@test.com", "contraseña": "asdf1234"});
            token = loginReponse.body.token;
            uid = loginReponse.body.uid;
            const response = await request(app).post('/api/bandas').send(newBanda).set('x-token', token);
            bandaId = response.body.nueva_banda._id;
        });

        it("Crear red social", async() => {
            newRedSocial.banda = bandaId;
            const response = await request(app).post('/api/redes').send(newRedSocial).set('x-token', token);
       
            redSocialId = response.body.nuevaRedSocial._id;
            expect(response.statusCode).toBe(200);
        });

        it("Obtener todas las redes sociales de una banda", async() => {
            const response = await request(app).get('/api/redes/banda/id/' + bandaId).set('x-token', token);
            expect(response.statusCode).toBe(200);
        });

        it("Eliminar red social creada", async() => {
            const response = await request(app).delete('/api/redes/' + redSocialId).set('x-token', token);
            expect(response.statusCode).toBe(200);
        });

        afterAll(async () => {
            await request(app).delete('/api/bandas/' + bandaId).set('x-token', token);
            await request(app).delete('/api/auth/' + uid).set('x-token', token);
        });

    });

    describe("Casos negativos", () => {

        let token = "";
        let uid = "";

        let tokenInvalido = "";
        let uidInvalido = "";

        let bandaId = "";
        let redSocialId = "";

        beforeAll(async () => {
            await request(app).post('/api/auth/register').send(newUser);
            let loginReponse = await request(app).post('/api/auth').send({"correo": "testbanda@test.com", "contraseña": "asdf1234"});
            token = loginReponse.body.token;
            uid = loginReponse.body.uid;

            const response = await request(app).post('/api/bandas').send(newBanda).set('x-token', token);
            bandaId = response.body.nueva_banda._id;

            loginReponse = await request(app).post('/api/auth').send({"correo": "alvaro.uber8@gmail.com", "contraseña": "asdf1234"});
            tokenInvalido = loginReponse.body.token;
            uidInvalido = loginReponse.body.uid;

            newRedSocial.banda = bandaId;
            const responseRed = await request(app).post('/api/redes').send(newRedSocial).set('x-token', token);
            redSocialId = responseRed.body.nuevaRedSocial._id;
        });

        it("Crear red social sin ser directivo de la banda", async() => {
            newRedSocial.banda = bandaId;
            const response = await request(app).post('/api/redes').send(newRedSocial).set('x-token', tokenInvalido);
            expect(response.statusCode).toBe(401);
        });

        it("Eliminar red social sin ser directivo" , async() => {
            const response = await request(app).delete('/api/redes/' + redSocialId).set('x-token', tokenInvalido);
            expect(response.statusCode).toBe(401);
        });

        it("Eliminar red social no existente" , async() => {
            const response = await request(app).delete('/api/redes/' + "63cbf392239d012faf2c1ff3").set('x-token', token);
            expect(response.statusCode).toBe(404);
        });

        afterAll(async () => {
            await request(app).delete('/api/redes/' + redSocialId).set('x-token', token);
            await request(app).delete('/api/bandas/' + bandaId).set('x-token', token);
            await request(app).delete('/api/auth/' + uid).set('x-token', token);
        });

    });

});