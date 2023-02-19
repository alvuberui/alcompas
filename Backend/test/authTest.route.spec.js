const request = require("supertest");
const { app } = require('../index');

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

const secondUser = {
    "nombre": "Test",
    "primer_apellido": "Test",
    "segundo_apellido": "Test",
    "fecha_nacimiento": "1999-01-01",
    "correo": "test2@test.com",
    "descripcion": "Test",
    "localidad": "Test",
    "provincia": "Test",
    "codigo_postal": 41400,
    "direccion": "Test",
    "nif": "87070613L",
    "telefono": 666666661,
    "usuario": "Test2",
    "contraseña": "asdf1234"
}

const userUpdate = {
    "nombre": "TestUpdate",
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
    "telefono": 666666669,
    "usuario": "Test",
    "contraseña": "asdf1234"
}

describe('Pruebas sobre la API de auth', () => {

    let token = "";
    let uid = "";

    describe('Casos positivos de auth', () => {
        /*
        * Prueba de registro de usuario
        */
        test('Registrar usuario', async() => {
            const response = await request( app ).post('/api/auth/register').send(newUser);
            
            expect(response.status).toBe(201);
            expect(response.body).toHaveProperty('token');
            expect(response.body.nombre).toBe("Test");
        });

        /*
        * Login de usuario
        */
        test('Login de usuario test', async() => {
            const response = await request( app ).post('/api/auth')
                .send({
                    "correo": "test@test.com",
                    "contraseña": "asdf1234"
                });
            
            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('token');
            expect(response.body.nombre).toBe("Test");
            token = response.body.token;
            uid = response.body.uid;
        });

        /*
        * Prueba para actualizar datos de usuario
        */
        test('Actualizar usuario', async() => {
            const response = await request( app ).put('/api/auth/update/' + uid).send(userUpdate)
                .set('x-token', token);
       
            expect(response.status).toBe(201);
            expect(response.body.nombre).toBe("TestUpdate");
        });

        /*
        * Prueba para actualizar contraseña de usuario
        */
        test('Actualizar contraseña de usuario', async() => {
            const response = await request( app ).put('/api/auth/update/contrasena/' + uid).send({"contraseñaNueva": "asdf12345"})
                .set('x-token', token);
           
            expect(response.status).toBe(201);
        });

        /*
        * Prueba para actualizar token de usuario
        */
        test('Renovar token de usuario', async() => {
            const response = await request( app ).get('/api/auth/renew')
                .set('x-token', token);
           
            expect(response.status).toBe(200);
            expect(response.body.token).not.toBe(token);
            token = response.body.token;
        });

        /*
        * Obtener usuario a través de su id
        */
        test('Obtener usuario por id', async() => {
            const response = await request( app ).get('/api/auth/' + uid)
                .set('x-token', token);
           
            expect(response.status).toBe(200);
            expect(response.body.usuario.nombre).toBe("TestUpdate");
        });

        /*
        * Obtener todos los usuarios
        */
        test('Obtener todos los usuarios', async() => {
            const response = await request( app ).get('/api/auth/')
                .set('x-token', token);
            const usuarios = response.body.usuarios;
            const tamaño = usuarios.length;
            expect(response.status).toBe(200);
            expect(tamaño).not.toBe(0);
        });

         /*
        * Obtener usuario por nombre de usuario
        */
         test('Eliminar usuario como admin', async() => {
            const registerResponse = await request( app ).post('/api/auth/register').send(secondUser);
            const loginReponse = await request( app ).post('/api/auth').send({"correo":"alvaro.uber8@gmail.com", "contraseña":"asdf1234"});

            const userIdDelete = registerResponse.body.uid;
            const token = loginReponse.body.token;

            const response = await request( app ).delete('/api/auth/admin/' + userIdDelete).set('x-token', token);
      
            expect(response.status).toBe(200);
        });

        /*
        * Eliminar usuario el mismo usuario
        */
        test('Eliminar usuario propio', async() => {
            const response = await request( app ).delete('/api/auth/' + uid).set('x-token', token);
           
            expect(response.status).toBe(200);
        });
    });

    describe('Casos negativos de auth', () => {

        let token = "";
        let uid = "";

        let tokenIncorrecto = "";
        let uidIncorrecto = "";

        beforeAll(async() => {
            const response = await request( app ).post('/api/auth/register').send(newUser);
            token = response.body.token;
            uid = response.body.uid;

            const responseIncorrecto = await request( app ).post('/api/auth/register').send(secondUser);
            tokenIncorrecto = responseIncorrecto.body.token;
            uidIncorrecto = responseIncorrecto.body.uid;
        });

        
        test('Registro con correo duplicado' , async() => {
            await request( app ).post('/api/auth/register').send(newUser);
            const response = await request( app ).post('/api/auth/register').send(newUser);

            expect(response.status).toBe(400);
        });

        test('Registro con nif duplicado' , async() => {
            await request( app ).post('/api/auth/register').send(newUser);
            let repetido = newUser;
            repetido.correo = "repetido@test.com";
            const response = await request( app ).post('/api/auth/register').send(repetido);

            expect(response.status).toBe(400);
        });

        test('Registro con telefono  duplicado' , async() => {
            await request( app ).post('/api/auth/register').send(newUser);
            let repetido = newUser;
            repetido.correo = "repetido@test.com";
            repetido.nif = "70806873Q";
            const response = await request( app ).post('/api/auth/register').send(repetido);

            expect(response.status).toBe(400);
        });

        test('Registro con usuario  duplicado' , async() => {
            await request( app ).post('/api/auth/register').send(newUser);
            let repetido = newUser;
            repetido.correo = "repetido@test.com";
            repetido.nif = "70806873Q";
            repetido.telefono = "666666555";
            const response = await request( app ).post('/api/auth/register').send(repetido);
            
            expect(response.status).toBe(400);
        });

        test('Login con correo incorrecto' , async() => {
            const response = await request( app ).post('/api/auth').send({"correo":"a@gmail.com", "contraseña":"asdf1234"});
            
            expect(response.status).toBe(400);
        });

        test('Login con contraseña incorrecto' , async() => {
            const response = await request( app ).post('/api/auth').send({"correo":"test@test.com", "contraseña":"asdf1234123"});
            
            expect(response.status).toBe(400);
        });

        test('Actualizar datos de otro usuario' , async() => {
            const response = await request( app ).put('/api/auth/update/' + uid).send( newUser).set('x-token', tokenIncorrecto);
          
            expect(response.status).toBe(401);
        });

        test('Actualizar contraseña de otro usuario' , async() => {
            const response = await request( app ).put('/api/auth/update/contrasena/' + uid).send( {"contraseñaNueva": "kfpweofkpwe"} ).set('x-token', tokenIncorrecto);
     
            expect(response.status).toBe(401);
        });

        test('Eliminar a otro usuario que no sea el suyo' , async() => {
            const response = await request( app ).delete('/api/auth/' + uid ).set('x-token', tokenIncorrecto);
     
            expect(response.status).toBe(401);
        });

        test('Eliminar a un usuario sin ser administrador' , async() => {
            const response = await request( app ).delete('/api/auth/admin/' + uid ).set('x-token', tokenIncorrecto);
     
            expect(response.status).toBe(401);
        });

        afterAll(async() => {
            await request( app ).delete('/api/auth/' + uid).set('x-token', token);
            await request( app ).delete('/api/auth/' + uidIncorrecto).set('x-token', tokenIncorrecto);
        });
    });
})