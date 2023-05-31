const request = require("supertest");
const { app } = require('../index');

describe('Pruebas sobre la API de uploads', () => {


    const newUser = {
        "nombre": "TestEstudio",
        "primer_apellido": "TestEstudio",
        "segundo_apellido": "TestEstudio",
        "fecha_nacimiento": "1999-01-01",
        "correo": "testestudio@test.com",
        "descripcion": "TestEstudio",
        "localidad": "TestEstudio",
        "provincia": "TestEstudio",
        "codigo_postal": 41400,
        "direccion": "TestEstudio",
        "nif": "76497455F",
        "telefono": 111222333,
        "usuario": "TestEstudio",
        "contraseña": "asdf1234"
    }

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

    describe('Pruebas sobre la API de uploads', () => {
        
        let token = "";
        let uid = "";
        let bandaId = "";

        beforeAll(async () => {
            await request(app).post('/api/auth/register').send(newUser);
            const loginReponse = await request(app).post('/api/auth').send({"correo": "testestudio@test.com", "contraseña": "asdf1234"});
            token = loginReponse.body.token;
            uid = loginReponse.body.uid;
            const response = await request(app).post('/api/bandas').send(newBanda).set('x-token', token);
            bandaId = response.body.nueva_banda._id;
        });

        test("Obtener foto de perfil de un usuario", async () => {
            const response = await request(app).get('/api/fotos/get/foto/usuario/' + uid).set('x-token', token);
            expect(response.statusCode).toBe(200);
        });

        test("Obtener foto de perfil de una banda", async () => {
            const response = await request(app).get('/api/fotos/get/foto/banda/' + bandaId).set('x-token', token);
            expect(response.statusCode).toBe(200);
        });

        test("Obtener foto de perfil de un usuario sin exisitr", async () => {
            const response = await request(app).get('/api/fotos/get/foto/usuario/' + "fsdfsdfsd").set('x-token', token);
            expect(response.statusCode).toBe(400);
        });

        test("Obtener foto de perfil de una banda sin existir", async () => {
            const response = await request(app).get('/api/fotos/get/foto/banda/' + "ffsdfsdfsd").set('x-token', token);
            expect(response.statusCode).toBe(400);
        });

        afterAll(async () => {
            await request(app).delete('/api/bandas/' + bandaId).set('x-token', token);
            await request(app).delete('/api/auth/' + uid).set('x-token', token);
        });
    });
});