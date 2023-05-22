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

    const newPeticion = {
        "fecha": "1999-01-01",
        "mensaje": "Mensaje de prueba"
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

        test("Crear banda", async() => {
            const response = await request(app).post('/api/bandas').send(newBanda).set('x-token', token);

            expect(response.statusCode).toBe(201);
            expect(response.body.nueva_banda).toHaveProperty('nombre');
            expect(response.body.nuevo_directivo).toHaveProperty('usuario');
            bandaId = response.body.nueva_banda._id;
        });

        test("Añadir usuario como musico y archivero a la banda", async () => {
            const directivoResponse = await request(app).get('/api/directivos/byUserId/' + uid).set('x-token', token);
            directivoId = directivoResponse.body.directivo[0]._id;

            newPeticion.directivo = directivoId;
            newPeticion.banda = bandaId;
            newPeticion.usuario = uid;
            newPeticion.rol = "Músico";
            newPeticion.instrumento = "Tuba";
            newPeticion.voz = "Primero";

            const response = await request(app).post('/api/peticiones').send(newPeticion).set('x-token', token);
            const peticionId = response.body.peticion._id;
            expect(response.statusCode).toBe(200);

            const response2 = await request(app).put('/api/peticiones/aceptar/' + peticionId + '/' + uid).set('x-token', token);
            expect(response2.statusCode).toBe(201);

            // Creamos otro de archivero
            const newPeticion2 = {
                "fecha": "1999-01-01",
                "mensaje": "Mensaje de prueba" }
            newPeticion2.rol = "Archivero";
            newPeticion2.usuario = uid;
            newPeticion2.directivo = directivoId;
            newPeticion2.banda = bandaId;

            const response3 = await request(app).post('/api/peticiones').send(newPeticion2).set('x-token', token);
            console.log(response3.body)
            const peticionId2 = response3.body.peticion._id;
            expect(response3.statusCode).toBe(200);

            const response4 = await request(app).put('/api/peticiones/aceptar/' + peticionId2 + '/' + uid).set('x-token', token);
            expect(response4.statusCode).toBe(201);
        });

        test("Comprobar que si un usuario pertenece a la banda", async() => {
            const response = await request(app).get('/api/bandas/pertenece/usuario/' + uid + '/banda/' + bandaId).set('x-token', token);

            expect(response.statusCode).toBe(201);
            expect(response.body.resultado).toBe(true);
        });

        test("Obtener todos los componentes de una banda", async() => {
            const response = await request(app).get('/api/bandas/componentes/' + bandaId).set('x-token', token);

            expect(response.statusCode).toBe(201);
            expect(response.body.componentes.length).toBe(1);
        });


        test("Editar banda", async() => {
            newBanda.nombre = "TestBanda2";
            const response = await request(app).put('/api/bandas/' + bandaId).send(newBanda).set('x-token', token);

            expect(response.statusCode).toBe(201);
        });

        test("Obtener banda", async() => {
            const response = await request(app).get('/api/bandas/' + bandaId).set('x-token', token);

            expect(response.statusCode).toBe(201);
        });

        test("Obtener todas las bandas", async() => {
            const response = await request(app).get('/api/bandas').set('x-token', token);

            expect(response.statusCode).toBe(201);
        });

        test("Obtener todas las bandas de un usuario", async() => {
            const response = await request(app).get('/api/bandas/misBandas/' + uid).set('x-token', token);

            expect(response.statusCode).toBe(201);
        });

        test("Obtener banda por nombre", async() => {
            const response = await request(app).get('/api/bandas/buscar/' + newBanda.nombre).set('x-token', token);

            expect(response.statusCode).toBe(201);
        });

        test("Eliminar banda" , async() => {
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

        test("Crear banda con campo repetido" , async() => {
            const response = await request(app).post('/api/bandas').send(newBanda).set('x-token', token);

            expect(response.statusCode).toBe(400);
        });

        test("Crear banda con tipo invalido" , async() => {
            newBanda.tipo = "hola";
            const response = await request(app).post('/api/bandas').send(newBanda).set('x-token', token);
            expect(response.statusCode).toBe(400);
        });

        test("Crear banda con cif invalido" , async() => {
            newBanda.cif = "hola";
            newBanda.tipo = "Agrupación Musical";
            const response = await request(app).post('/api/bandas').send(newBanda).set('x-token', token);
            expect(response.statusCode).toBe(400);
        });

        test("Crear banda con fecha invalida" , async() => {
            newBanda.año_fundacion = 3000;
            const response = await request(app).post('/api/bandas').send(newBanda).set('x-token', token);
     
            expect(response.statusCode).toBe(400);
        });

        test("Crear banda sin token" , async() => {
            const response = await request(app).post('/api/bandas').send(newBanda);

            expect(response.statusCode).toBe(401);
        });

        test("Editar banda sin ser directivo" , async() => {
            newBanda.nombre = "TestBanda2";
            const response = await request(app).put('/api/bandas/' + bandaId).send(newBanda).set('x-token', tokenInvalido);

            expect(response.statusCode).toBe(400);
        });

        test("Editar banda con cif invalido" , async() => {
            newBanda.cif = "hola";
            const response = await request(app).put('/api/bandas/' + bandaId).send(newBanda).set('x-token', token);
            expect(response.statusCode).toBe(400);
        });

        test("Obtener las bandas de otro usuario" , async() => {
            const response = await request(app).get('/api/bandas/misBandas/' + uidInvalido).set('x-token', token);

            expect(response.statusCode).toBe(400);
        });
        
        test("Editar banda con tipo incorrecto" , async() => {
            const newBanda5 = {
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
            newBanda5.tipo = "hola";
            const response = await request(app).put('/api/bandas/' + bandaId).send(newBanda5).set('x-token', token);
            expect(response.statusCode).toBe(400);
        });

        test("Eliminar banda sin ser el presidente" , async() => {
            const response = await request(app).delete('/api/bandas/' + bandaId).set('x-token', tokenInvalido);

            expect(response.statusCode).toBe(400);
        });

        afterAll(async () => {
            await request(app).delete('/api/bandas/' + bandaId).set('x-token', token);
            await request(app).delete('/api/auth/' + uid).set('x-token', token);
        });
    });


});