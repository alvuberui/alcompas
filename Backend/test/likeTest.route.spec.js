const request = require("supertest");
const { app } = require('../index');

describe("Pruebas de la api de likes", () => {

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

    const concierto = {
        "titulo": "Concierto de prueba",
        "descripcion": "Descripción de prueba",
        "fechaInicio": new Date("2025/01/30 15:30:10.999"),
        "fechaFin": new Date("2025/01/30 16:30:10.999"),
        "localidad": "Localidad de prueba",
        "provincia": "Provincia de prueba",
        "lugar": "Lugar de prueba",
        "tipoActuacion": "Concierto",
        "fechaSalida": new Date("2025/01/30 13:30:10.999"),
        "lugarSalida": "Lugar de salida de prueba",
        "beneficios": 100,
        "costes": 100,
        "comentarioEconomico": "Comentario económico de prueba",
    }

    const ensayo = {
        "titulo": "Ensayo de prueba",
        "descripcion": "Descripción de prueba",
        "fechaInicio": new Date("2025/01/30 15:30:10.999"),
        "fechaFin": new Date("2025/01/30 16:30:10.999"),
        "lugar": "Lugar de prueba",
        "tematica": "Tematica de prueba",
    }

    const procesion = {
        "titulo": "Procesión de prueba",
        "descripcion": "Descripción de prueba",
        "fechaInicio": new Date("2025/01/30 15:30:10.999"),
        "fechaFin": new Date("2025/01/30 16:30:10.999"),
        "localidad": "Localidad de prueba",
        "provincia": "Provincia de prueba",
        "lugar": "Lugar de prueba",
        "costes": 100,
        "beneficios": 100,
        "comentarioEconomico": "Comentario económico de prueba",
        "dia": "Viernes Dolores",
        "tipo": "Gloria",
        "fechaSalida": new Date("2025/01/30 13:30:10.999"),
        "lugarSalida": "Lugar de salida de prueba",
        "hermandad": "Hermandades de prueba",
        "nombreTitular": "Nombre de titular de prueba",
        "bocadillo": true,
    }

    const noticia = { 
        "titulo": "Noticia de prueba",
        "descripcion": "Descripción de prueba",
        "privacidad": "Pública",
    }

    describe("Casos positivos de la api de likes", () => {

        let token = "";
        let uid = "";
        let token2 = "";
        let uid2 = "";
        let bandaId = "";
        let procesionId = "";
        let actuacionId = "";
        let ensayoId = "";
        let asistenciaId = "";
        let noticiaId = "";

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
            procesion.banda = bandaId;
            concierto.banda = bandaId;
            ensayo.banda = bandaId;
            const responseProcesion = await request(app).post('/api/eventos/procesion').send(procesion).set('x-token', token);
            procesionId = responseProcesion.body.procesionDB._id;
            procesion.transaccion = responseProcesion.body.procesionDB.transaccion;
            const responseConcierto = await request(app).post('/api/eventos/actuacion').send(concierto).set('x-token', token);
            actuacionId = responseConcierto.body.actuacionDB._id;
            concierto.transaccion = responseConcierto.body.actuacionDB.transaccion;
            const responseEnsayo = await request(app).post('/api/eventos/ensayo').send(ensayo).set('x-token', token);
            ensayoId = responseEnsayo.body.ensayoDB._id;
            noticia.banda = bandaId;
            const responseNoticia = await request(app).post('/api/noticias').send(noticia).set('x-token', token);
            noticiaId = responseNoticia.body.anuncioDB._id;
        });

        test("Publicar like a banda", async () => {
            const response = await request(app).post('/api/likes').send({"tipo": "Banda", "referencia": bandaId, "usuario": uid}).set('x-token', token);
            expect(response.statusCode).toBe(200);
            expect(response.body.ok).toBe(true);
            expect(response.body.likeDB).not.toBe(null);
            expect(response.body.likeDB.tipo).toBe("Banda");
            expect(response.body.likeDB.referencia).toBe(bandaId);
            expect(response.body.likeDB.usuario).toBe(uid);
        });

        test("Publicar like a ensayo", async () => {
            const response = await request(app).post('/api/likes').send({"tipo": "Ensayo", "referencia": ensayoId, "usuario": uid}).set('x-token', token);
            expect(response.statusCode).toBe(200);
            expect(response.body.ok).toBe(true);
            expect(response.body.likeDB).not.toBe(null);
            expect(response.body.likeDB.tipo).toBe("Ensayo");
            expect(response.body.likeDB.referencia).toBe(ensayoId);
            expect(response.body.likeDB.usuario).toBe(uid);
        });

        test("Publicar like a noticia", async () => {
            const response = await request(app).post('/api/likes').send({"tipo": "Noticia", "referencia": noticiaId, "usuario": uid}).set('x-token', token);
            expect(response.statusCode).toBe(200);
            expect(response.body.ok).toBe(true);
            expect(response.body.likeDB).not.toBe(null);
            expect(response.body.likeDB.tipo).toBe("Noticia");
            expect(response.body.likeDB.referencia).toBe(noticiaId);
            expect(response.body.likeDB.usuario).toBe(uid);
        });

        test("Publicar dislike a una banda", async () => {
            const response = await request(app).delete('/api/likes/tipo/Banda/referencia/' + bandaId).set('x-token', token);
            expect(response.statusCode).toBe(200);
            expect(response.body.ok).toBe(true);
        });

        test("Publicar dislike a un ensayo", async () => {
            const response = await request(app).delete('/api/likes/tipo/Ensayo/referencia/' + ensayoId).set('x-token', token);
            expect(response.statusCode).toBe(200);
            expect(response.body.ok).toBe(true);
        });

        test("Publicar dislike a una noticia", async () => {
            const response = await request(app).delete('/api/likes/tipo/Noticia/referencia/' + noticiaId).set('x-token', token);
            expect(response.statusCode).toBe(200);
            expect(response.body.ok).toBe(true);
        });

        test("Obtener like de una entidad donde no le he dado like", async () => {
            const response = await request(app).get('/api/likes/tipo/Procesion/referencia/' + procesionId).set('x-token', token);
            expect(response.statusCode).toBe(200);
            expect(response.body.ok).toBe(true);
            expect(response.body.like).toBe(false);
        });

        test("Obtener like de una entidad donde  le he dado like", async () => {
            await request(app).post('/api/likes').send({"tipo": "Procesion", "referencia": procesionId, "usuario": uid}).set('x-token', token);
            const response = await request(app).get('/api/likes/tipo/Procesion/referencia/' + procesionId).set('x-token', token);
            expect(response.statusCode).toBe(200);
            expect(response.body.ok).toBe(true);
            expect(response.body.like).toBe(true);
        });

        test("Obtener numero de likes de una entidad", async () => {
            const response = await request(app).get('/api/likes/numero/tipo/Procesion/referencia/' + procesionId).set('x-token', token);
            expect(response.statusCode).toBe(200);
            expect(response.body.ok).toBe(true);
            expect(response.body.likes).toBe(1);

            // igual pero de una noticia que no tiene likes
            const response2 = await request(app).get('/api/likes/numero/tipo/Noticia/referencia/' + noticiaId).set('x-token', token);
            expect(response2.statusCode).toBe(200);
            expect(response2.body.ok).toBe(true);
            expect(response2.body.likes).toBe(0);
        });




        afterAll(async () => {
            await request(app).delete('/api/bandas/' + bandaId).set('x-token', token);
            await request(app).delete('/api/auth/' + uid).set('x-token', token);
            await request(app).delete('/api/auth/' + uid2).set('x-token', token2);
        });
        
    });

    describe("Casos negativos de la api de likes", () => {

        let token = "";
        let uid = "";
        let token2 = "";
        let uid2 = "";
        let bandaId = "";
        let procesionId = "";
        let actuacionId = "";
        let ensayoId = "";
        let asistenciaId = "";
        let noticiaId1 = "";
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
            procesion.banda = bandaId;
            concierto.banda = bandaId;
            ensayo.banda = bandaId;
            const responseProcesion = await request(app).post('/api/eventos/procesion').send(procesion).set('x-token', token);
            procesionId = responseProcesion.body.procesionDB._id;
            procesion.transaccion = responseProcesion.body.procesionDB.transaccion;
            const responseConcierto = await request(app).post('/api/eventos/actuacion').send(concierto).set('x-token', token);
            actuacionId = responseConcierto.body.actuacionDB._id;
            concierto.transaccion = responseConcierto.body.actuacionDB.transaccion;
            const responseEnsayo = await request(app).post('/api/eventos/ensayo').send(ensayo).set('x-token', token);
            ensayoId = responseEnsayo.body.ensayoDB._id;
            noticia.banda = bandaId;
            noticia.privacidad = "Privada"; 
            const responseNoticia = await request(app).post('/api/noticias').send(noticia).set('x-token', token);
            noticiaId1 = responseNoticia.body.anuncioDB._id;
            noticia.privacidad = "Restringida";
            const responseNoticia2 = await request(app).post('/api/noticias').send(noticia).set('x-token', token);
            noticiaId2 = responseNoticia2.body.anuncioDB._id;
        });

        test("Dar like a una procesion dos veces", async () => {
            await                  request(app).post('/api/likes').send({"tipo": "Procesion", "referencia": procesionId, "usuario": uid}).set('x-token', token);
            const response = await request(app).post('/api/likes').send({"tipo": "Procesion", "referencia": procesionId, "usuario": uid}).set('x-token', token);
            expect(response.statusCode).toBe(400);
            expect(response.body.ok).toBe(false);
        });

        test("Dar like a una noticia que no tiene permiso", async () => {
            const response = await request(app).post('/api/likes').send({"tipo": "Noticia", "referencia": noticiaId1, "usuario": uid2}).set('x-token', token2);
            expect(response.statusCode).toBe(400);
            expect(response.body.ok).toBe(false);

            // igual pero con una noticia restringida
            const response2 = await request(app).post('/api/likes').send({"tipo": "Noticia", "referencia": noticiaId2, "usuario": uid2}).set('x-token', token2);
            expect(response2.statusCode).toBe(400);
            expect(response2.body.ok).toBe(false);

            // igual pero a un ensayo
            const response3 = await request(app).post('/api/likes').send({"tipo": "Ensayo", "referencia": ensayoId, "usuario": uid2}).set('x-token', token2);
            expect(response3.statusCode).toBe(400);
            expect(response3.body.ok).toBe(false);
        });

        test("Dar dislike a una procesion que no tiene like", async () => {
            const response = await request(app).delete('/api/likes/tipo/Procesion/referencia/' + procesionId).set('x-token', token2);
            expect(response.statusCode).toBe(400);
            expect(response.body.ok).toBe(false);
        });

        test("Dar dislike a una noticia sin permiso", async () => {
            const response = await request(app).delete('/api/likes/tipo/Noticia/referencia/' + noticiaId1).set('x-token', token2);
            expect(response.statusCode).toBe(400);
            expect(response.body.ok).toBe(false);

            // igual pero con una noticia restringida
            const response2 = await request(app).delete('/api/likes/tipo/Noticia/referencia/' + noticiaId2).set('x-token', token2);
            expect(response2.statusCode).toBe(400);
            expect(response2.body.ok).toBe(false);

            // igual pero a un ensayo
            const response3 = await request(app).delete('/api/likes/tipo/Ensayo/referencia/' + ensayoId).set('x-token', token2);
            expect(response3.statusCode).toBe(400);
            expect(response3.body.ok).toBe(false);
        });

        test("Obtener numero de likes de entidades que no tengo permiso", async () => {
            // Noticia privada
            const response = await request(app).get('/api/likes/numero/tipo/Noticia/referencia/' + noticiaId1).set('x-token', token2);
            expect(response.statusCode).toBe(400);
            expect(response.body.ok).toBe(false);

            // Noticia restringida
            const response2 = await request(app).get('/api/likes/numero/tipo/Noticia/referencia/' + noticiaId2).set('x-token', token2);
            expect(response2.statusCode).toBe(400);
            expect(response2.body.ok).toBe(false);

            // Ensayo
            const response3 = await request(app).get('/api/likes/numero/tipo/Ensayo/referencia/' + ensayoId).set('x-token', token2);
            expect(response3.statusCode).toBe(400);
            expect(response3.body.ok).toBe(false);
        });

        test("Crear like con refenrencia invalida", async () => {
            const response = await request(app).post('/api/likes').send({"tipo": "Pdasdrocesion", "referencia": "123456789012345678901234", "usuario": uid}).set('x-token', token);
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