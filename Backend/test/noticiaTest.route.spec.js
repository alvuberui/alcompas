const request = require("supertest");
const { app } = require('../index');

describe("Pruebas de la api de noticias", () => {

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

    const newNoticia = {
        "privacidad": "Pública",
        "titulo": "TestNoticia",
        "descripcion": "TestNoticia",
    }

    const newNoticia2 = {
        "privacidad": "Privada",
        "titulo": "TestNoticia",
        "descripcion": "TestNoticia",
    }

    describe("Casos positivos de la api de eventos", () => {
        let token = "";
        let uid = "";
        let token2 = "";
        let uid2 = "";

        let bandaId = "";
        let noticiaId = "";
        let noticiaId2 = "";

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

        test("Crear noticia", async() => {
            newNoticia.banda = bandaId;
            const response = await request(app).post('/api/noticias').send(newNoticia).set('x-token', token);
            expect(response.statusCode).toBe(200);
            expect(response.body.anuncioDB).toHaveProperty('titulo');
            noticiaId = response.body.anuncioDB._id;

            newNoticia2.banda = bandaId;
            const response2 = await request(app).post('/api/noticias').send(newNoticia2).set('x-token', token);
            expect(response2.statusCode).toBe(200);
            expect(response2.body.anuncioDB).toHaveProperty('titulo');
            noticiaId2 = response2.body.anuncioDB._id;
        });

        test("Obtener noticias by banda", async() => {
            const response = await request(app).get('/api/noticias/banda/' + bandaId).set('x-token', token);
            expect(response.statusCode).toBe(200);
            expect(response.body.anuncios).toHaveLength(2);

            const response2 = await request(app).get('/api/noticias/banda/' + bandaId).set('x-token', token2);
            expect(response2.statusCode).toBe(200);
            expect(response2.body.anuncios).toHaveLength(1);
        });

        test("Obtener noticias destacadas", async() => {
            //publicar primero un like sobre la noticia 1
            const response = await request(app).post('/api/likes').send({"tipo": "Noticia", "referencia": noticiaId, "usuario": uid}).set('x-token', token);
            expect(response.statusCode).toBe(200);

            const response2 = await request(app).get('/api/noticias/destacadas').set('x-token', token);
            expect(response2.statusCode).toBe(200);
            // LOS PARAMATROS CAMBIAS SEGUN ESTE POBLADA LA BASE DE DATOS
            // AJUSTARLO ANTES DE EJECUTAR EL TEST
            /*
            expect(response2.body.anuncios).toHaveLength(2);
            expect(response2.body.anuncios[0]._id).toBe(noticiaId); */
        });

        test("Eliminar noticia", async() => {
            const response = await request(app).delete('/api/noticias/id/' + noticiaId).set('x-token', token);
            expect(response.statusCode).toBe(200);
        });



        afterAll(async () => {
            await request(app).delete('/api/bandas/' + bandaId).set('x-token', token);
            await request(app).delete('/api/auth/' + uid).set('x-token', token);
            await request(app).delete('/api/auth/' + uid2).set('x-token', token2);
        });
    });

    describe("Casos negativos de la api de eventos", () => {
        let token = "";
        let uid = "";
        let token2 = "";
        let uid2 = "";

        let bandaId = "";
        let noticiaId = "";
        let noticiaId2 = "";

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

        test("Crear noticia sin ser directivo", async() => {
            newNoticia.banda = bandaId;
            const response = await request(app).post('/api/noticias').send(newNoticia).set('x-token', token2);
            expect(response.statusCode).toBe(401);
        });

        test("Eliminar noticia que no existe", async() => {
            const response = await request(app).delete('/api/noticias/id/idinventidao' ).set('x-token', token);
            expect(response.statusCode).toBe(404);
        });

        test("Eliminar noticia sin  ser directivo", async() => {
            const r = await request(app).post('/api/noticias').send(newNoticia).set('x-token', token);
            noticiaId = r.body.anuncioDB._id;
            const response = await request(app).delete('/api/noticias/id/' + noticiaId).set('x-token', token2);
            expect(response.statusCode).toBe(401);
        });

        test("Crear noticia con privacidad invalida", async() => {
            newNoticia.privacidad = "invalida";
            const response = await request(app).post('/api/noticias').send(newNoticia).set('x-token', token);
            expect(response.statusCode).toBe(400);
        });

        afterAll(async () => {
            await request(app).delete('/api/bandas/' + bandaId).set('x-token', token);
            await request(app).delete('/api/auth/' + uid).set('x-token', token);
            await request(app).delete('/api/auth/' + uid2).set('x-token', token2);
        });

    });
});