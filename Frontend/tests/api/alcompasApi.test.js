import alcompasApi from '../../src/api/alcompasApi';


describe('Pruebas en el alcompasApi', () => {
    
    test('debe de tener la configuración por defecto', () => {

        expect( alcompasApi.defaults.baseURL ).toBe( process.env.VITE_API_URL );
    
    });

    test('debe de tener el x-token en el header de todas las peticiones ', async() => {

        const token = 'ABC-123-XYZ';
        localStorage.setItem('token', token );
        const res = await alcompasApi.get("/auth")
        .then((res) => res)
        .catch((res) => res);

        expect(res.config.headers['x-token']).toBe( token );
        
    });

});