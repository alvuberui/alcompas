const request = require("supertest");
const { app } = require('../index');

describe('Pruebas sobre la API de instrumeto', () => {

    const newInstrumento = {
        "modelo": "Test",
        "instrumento": "Trompeta",
        "marca": "Test",
        "numeroSerie": "Test",
        "usuario": "Test",
    }

    const newInstrumentoBanda = {
        "modelo": "Test",
        "instrumento": "Trompeta",
        "marca": "Test",
        "numeroSerie": "Test",
    }

    const newUser = {
        "nombre": "Test",
        "primer_apellido": "Test",
        "segundo_apellido": "Test",
        "fecha_nacimiento": "1999-01-01",
        "correo": "test@test.com",
        "descripcion": "Test",
        "localidad": "Test",
        "provincia": "Test",
        "codigo_postal": 41400,
        "direccion": "Test",
        "nif": "50746953Y",
        "telefono": 666666666,
        "usuario": "Test",
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
        "correo": "testbanda2@gmail.com",
        "cif": "G01536622",
    }

    describe('Casos positivos de instrumento para banda', () => {

        let token = "";
        let uid = "";

        let instrumentoId = "";

        beforeAll(async () => {
            await request(app).post('/api/auth/register').send(newUser);
            const loginReponse = await request(app).post('/api/auth').send({"correo": "test@test.com", "contraseña": "asdf1234"});
            token = loginReponse.body.token;
            uid = loginReponse.body.uid;
            
        });

        test("Crear instrumento banda", async () => {
            const response = await request(app).post('/api/bandas').send(newBanda).set('x-token', token);
           expect(response.statusCode).toBe(201);
            bandaId = response.body.nueva_banda._id;
            newInstrumentoBanda.banda = bandaId;
            
            const response2 = await request(app).post('/api/instrumentos/banda').send(newInstrumentoBanda).set('x-token', token);
            expect(response2.statusCode).toBe(200);
            expect(response2.body.instrumentoDB).toHaveProperty('modelo');
        
            const eliminar = await request(app).delete('/api/bandas/' + bandaId).set('x-token', token);
            expect(eliminar.statusCode).toBe(201);

            const response5 = await request(app).delete('/api/auth/' + uid).set('x-token', token);
            expect(response5.statusCode).toBe(200);
            
        });

        test("Obtener todos los instrumentos de una banda", async () => {
            const response1 = await request(app).post('/api/bandas').send(newBanda).set('x-token', token);
           
            bandaId = response1.body.nueva_banda._id;
            newInstrumentoBanda.banda = bandaId;
            
            const response2 = await request(app).post('/api/instrumentos/banda').send(newInstrumentoBanda).set('x-token', token);
            const isntrumentoBandaId = response2.body.instrumentoDB._id;
            const response = await request(app).get('/api/instrumentos/banda/' + bandaId).set('x-token', token);
            const lista = response.body.instrumentos;
            expect(response.statusCode).toBe(200);
            expect(lista.length).toBeGreaterThan(0);
            const eliminar = await request(app).delete('/api/bandas/' + bandaId).set('x-token', token);
            expect(eliminar.statusCode).toBe(201);

            const response5 = await request(app).delete('/api/auth/' + uid).set('x-token', token);
            expect(response5.statusCode).toBe(200);
            
        });

        test("Editar instrumento banda", async () => {
            const response1 = await request(app).post('/api/bandas').send(newBanda).set('x-token', token);
           
            bandaId = response1.body.nueva_banda._id;
            newInstrumentoBanda.banda = bandaId;
            
            const response2 = await request(app).post('/api/instrumentos/banda').send(newInstrumentoBanda).set('x-token', token);
            const isntrumentoBandaId = response2.body.instrumentoDB._id;
            newInstrumentoBanda.banda = bandaId;
            newInstrumentoBanda.instrumento = "Clarinete";
            const response = await request(app).put('/api/instrumentos/banda/' + isntrumentoBandaId).send(newInstrumentoBanda).set('x-token', token);
            
            expect(response.statusCode).toBe(200);
            expect(response.body.instrumentoActualizado.instrumento).toBe("Clarinete");
            const eliminar = await request(app).delete('/api/bandas/' + bandaId).set('x-token', token);
            expect(eliminar.statusCode).toBe(201);

            const response5 = await request(app).delete('/api/auth/' + uid).set('x-token', token);
            expect(response5.statusCode).toBe(200);
            
        });

        test("Eliminar instrumento banda", async () => {
            const response1 = await request(app).post('/api/bandas').send(newBanda).set('x-token', token);
           
            bandaId = response1.body.nueva_banda._id;
            newInstrumentoBanda.banda = bandaId;
            
            const response2 = await request(app).post('/api/instrumentos/banda').send(newInstrumentoBanda).set('x-token', token);
            const isntrumentoBandaId = response2.body.instrumentoDB._id;
            newInstrumentoBanda.banda = bandaId;
            newInstrumentoBanda.instrumento = "Clarinete";
            const response = await request(app).delete('/api/instrumentos/banda/' + isntrumentoBandaId).set('x-token', token);
            
            expect(response.statusCode).toBe(200);
            const eliminar = await request(app).delete('/api/bandas/' + bandaId).set('x-token', token);
            expect(eliminar.statusCode).toBe(201);

            const response5 = await request(app).delete('/api/auth/' + uid).set('x-token', token);
            expect(response5.statusCode).toBe(200);
            
        });

        test("Listar todos los instrumentos prestados", async () => {
            const response1 = await request(app).post('/api/bandas').send(newBanda).set('x-token', token);
           
            const bandaId = response1.body.nueva_banda._id;
            newInstrumentoBanda.banda = bandaId;
            await request(app).post('/api/instrumentos/banda').send(newInstrumentoBanda).set('x-token', token);

            const response = await request(app).get('/api/instrumentos/banda/prestados/' + bandaId).set('x-token', token);
            expect(response.statusCode).toBe(200);
            expect(response.body.instrumentos.length).toBe(0);

            const eliminar = await request(app).delete('/api/bandas/' + bandaId).set('x-token', token);
            expect(eliminar.statusCode).toBe(201);

            const response5 = await request(app).delete('/api/auth/' + uid).set('x-token', token);
            expect(response5.statusCode).toBe(200);
            
        });

        test("Listar todos los instrumentos sin prestar", async () => {
            const response1 = await request(app).post('/api/bandas').send(newBanda).set('x-token', token);
           
            const bandaId = response1.body.nueva_banda._id;
            newInstrumentoBanda.banda = bandaId;
            await request(app).post('/api/instrumentos/banda').send(newInstrumentoBanda).set('x-token', token);

            const response = await request(app).get('/api/instrumentos/banda/sinprestar/' + bandaId).set('x-token', token);
            expect(response.statusCode).toBe(200);
            expect(response.body.instrumentos.length).toBe(1);

            const eliminar = await request(app).delete('/api/bandas/' + bandaId).set('x-token', token);
            expect(eliminar.statusCode).toBe(201);

            const response5 = await request(app).delete('/api/auth/' + uid).set('x-token', token);
            expect(response5.statusCode).toBe(200);
            
        });

      
    });


    describe('Casos positivos de instrumento', () => {

        


        beforeAll(async () => {
            await request(app).post('/api/auth/register').send(newUser);
            const loginReponse = await request(app).post('/api/auth').send({"correo": "test@test.com", "contraseña": "asdf1234"});
            token = loginReponse.body.token;
            uid = loginReponse.body.uid;
            
        });
            

        test("Crear instrumento", async () => {
            newInstrumento.usuario = uid;
            const response = await request(app).post('/api/instrumentos/usuario').send(newInstrumento).set('x-token', token);
            
            expect(response.statusCode).toBe(200);
            expect(response.body.instrumentoGuardado).toHaveProperty('modelo');
            instrumentoId = response.body.instrumentoGuardado._id;
        });

        

        test("Editar instrumento", async () => {
            newInstrumento.usuario = uid;
            newInstrumento.instrumento = "Tuba";
            const response = await request(app).put('/api/instrumentos/usuario/' + instrumentoId).send(newInstrumento).set('x-token', token);
            
            expect(response.statusCode).toBe(200);
            expect(response.body.instrumentoActualizado.instrumento).toBe("Tuba");
        });


        test("Obtener instrumento por su id", async () => {
            const response = await request(app).get('/api/instrumentos/instrumentosById/' + instrumentoId).set('x-token', token);
            
            expect(response.statusCode).toBe(200);
        });

        test("Obtener instrumentos de un usuario", async () => {
            const response = await request(app).get('/api/instrumentos/instrumentosByUserId/' + uid).set('x-token', token);
            const lista = response.body.instrumentos;
            expect(response.statusCode).toBe(200);
            expect(lista.length).toBeGreaterThan(0);
        });


        test("Eliminar instrumento", async () => {
            const response = await request(app).delete('/api/instrumentos/' + instrumentoId).set('x-token', token);
            
            expect(response.statusCode).toBe(200);
        });

        beforeAll(async () => {
            const response = await request(app).delete('/api/auth/' + uid).set('x-token', token);
            expect(response.statusCode).toBe(200);
        });
    });

    describe('Casos negativos de instrumento', () => {

        let token = "";
        let uid = "";

        let instrumentoId = "";

        let uidInvalido = "";
        let tokenInvalido = "";

        beforeAll(async () => {
            const response = await request(app).post('/api/auth/register').send(newUser);
            const loginReponse = await request(app).post('/api/auth').send({"correo": "test@test.com", "contraseña": "asdf1234"});
            token = loginReponse.body.token;
            uid = loginReponse.body.uid;

            newInstrumento.usuario = uid;
            const responseInstrumento = await request(app).post('/api/instrumentos/usuario').send(newInstrumento).set('x-token', token);
        
            instrumentoId = responseInstrumento.body.instrumentoGuardado._id;

            const loginReponseInvalido = await request(app).post('/api/auth').send({"correo": "alvaro.uber8@gmail.com", "contraseña": "asdf1234"});
            tokenInvalido = loginReponseInvalido.body.token;
            uidInvalido = loginReponseInvalido.body.uid;
        });

        test("Crear instrumento a otro usuario", async () => {
            newInstrumento.usuario = uid;
            const response = await request(app).post('/api/instrumentos/usuario').send(newInstrumento).set('x-token', tokenInvalido);
            
            expect(response.statusCode).toBe(400);
        });

        test("Editar un instrumento no existente", async () => {
            newInstrumento.usuario = uid;
            const response = await request(app).put('/api/instrumentos/usuario/' + "63cbf392239d012faf2c1ff3").send(newInstrumento).set('x-token', tokenInvalido);
            
            expect(response.statusCode).toBe(404);
        });

        test("Editar un instrumento de otro usuario", async () => {
            newInstrumento.usuario = uid;
            const response = await request(app).put('/api/instrumentos/usuario/' + instrumentoId).send(newInstrumento).set('x-token', tokenInvalido);
            
            expect(response.statusCode).toBe(400);
        });

        test("Eliminar un instrumento de otro usuario", async () => {
            newInstrumento.usuario = uid;
            const response = await request(app).delete('/api/instrumentos/' + instrumentoId).send(newInstrumento).set('x-token', tokenInvalido);
            
            expect(response.statusCode).toBe(400);
        });

        test("Eliminar un instrumento no existente", async () => {
            newInstrumento.usuario = uid;
            const response = await request(app).delete('/api/instrumentos/' + "63cbf392239d012faf2c1ff3").send(newInstrumento).set('x-token', tokenInvalido);
            
            expect(response.statusCode).toBe(404);
        });

        test("Crear instrumento con datos inválidos", async () => {
            newInstrumento.usuario = uid;
            newInstrumento.instrumento = "asdasd";
            const response = await request(app).post('/api/instrumentos/usuario').send(newInstrumento).set('x-token', token);
            expect(response.statusCode).toBe(400);

            const response2 = await request(app).post('/api/instrumentos/banda').send(newInstrumento).set('x-token', token);
            expect(response2.statusCode).toBe(400);
        });

        test("Editar instrumento con datos inválidos", async () => {
            newInstrumento.usuario = uid;
            newInstrumento.instrumento = "asdasd";
            const response = await request(app).put('/api/instrumentos/usuario/' + instrumentoId).send(newInstrumento).set('x-token', token);
            expect(response.statusCode).toBe(400);

            const response2 = await request(app).put('/api/instrumentos/banda/' + instrumentoId).send(newInstrumento).set('x-token', token);
            expect(response2.statusCode).toBe(400);
            
        });



        afterAll(async () => {
            const response = await request(app).delete('/api/instrumentos/' + instrumentoId).set('x-token', token);
            await request(app).delete('/api/auth/' + uid).set('x-token', token);
        });
    
    });
});