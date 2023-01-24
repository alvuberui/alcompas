const request = require("supertest");
const { app } = require('../index');

describe("Tests sobre la api de comentarios", () => {

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

    const newComentario = {
        "texto": "TestComentario",
        "titulo": "TestComentario",
        "fecha": "1999-01-01",
    }

    describe("Casos positivos", () => {

        let token = "";
        let uid = "";

        let bandaId = "";
        let comentarioId = "";

        beforeAll(async () => {
            await request(app).post('/api/auth/register').send(newUser);
            const loginReponse = await request(app).post('/api/auth').send({"correo": "testbanda@test.com", "contraseña": "asdf1234"});
            token = loginReponse.body.token;
            uid = loginReponse.body.uid;
            const response = await request(app).post('/api/bandas').send(newBanda).set('x-token', token);
            bandaId = response.body.nueva_banda._id;
        });

        it("Crear comentario", async() => {
            newComentario.banda = bandaId;
            newComentario.usuario = uid;
            const response = await request(app).post('/api/comentarios').send(newComentario).set('x-token', token);
            comentarioId = response.body.nuevoComentario._id;
            expect(response.status).toBe(200);
        });

        it("Obtener comentarios de una banda", async() => {
            const response = await request(app).get('/api/comentarios/' + bandaId).set('x-token', token);
            expect(response.status).toBe(200);
        });

        it("Eliminar comentario", async() => {
            const response = await request(app).delete('/api/comentarios/' + comentarioId).set('x-token', token);
      
            expect(response.status).toBe(200);
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
        let comentarioId = "";

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

            newComentario.banda = bandaId;
            newComentario.usuario = uid;
            const responseComentario = await request(app).post('/api/comentarios').send(newComentario).set('x-token', token);
            comentarioId = responseComentario.body.nuevoComentario._id;
        });

        it("Crear comentario sin token", async() => {
            const response = await request(app).post('/api/comentarios').send(newComentario);
            expect(response.status).toBe(401);
        });

        it("Eliminar un comentario de otro usuario", async() => {
            const response = await request(app).delete('/api/comentarios/' + comentarioId).set('x-token', tokenInvalido);
            expect(response.status).toBe(400);
        });

        afterAll(async () => {
            await request(app).delete('/api/comentarios/' + comentarioId).set('x-token', token);
            await request(app).delete('/api/bandas/' + bandaId).set('x-token', token);
            await request(app).delete('/api/auth/' + uid).set('x-token', token);
        });
    });
});