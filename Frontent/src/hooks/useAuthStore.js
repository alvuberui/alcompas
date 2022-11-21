import { useDispatch, useSelector } from 'react-redux';
import { alcompasAPI} from '../api';
import { onChecking, onLogin, onLogout, ClearErrorMessage } from '../store/auth/authSlice';

export const useAuthStore = () => {

    const { status, user, errorMessage } = useSelector( state => state.auth );
    const dispatch = useDispatch();

    const startLogin = async({ correo, contraseña }) => {
        dispatch( onChecking() );
        
        try{
            const { data } = await alcompasAPI.post('/auth', {correo, contraseña});
            localStorage.setItem('token', data.token );
            localStorage.setItem('token-init-date', new Date().getTime());
            dispatch( onLogin({ nombre: data.nombre, uid: data.uid }) );
        }catch (error) {
        
            dispatch( onLogout('Credenciales incorrectas'));

            setTimeout(()=> {
                dispatch( ClearErrorMessage() );
            }, 10);
        }
    }

    const startRegister = async({ nombre, primer_apellido, segundo_apellido, correo, descripcion, localidad, provincia, codigo_postal, direccion, nif, telefono, usuario, contraseña,fecha_nacimiento}) => {
        dispatch( onChecking() );
        
        try{
            
            const { data } = await alcompasAPI.post('/auth/register', {nombre, primer_apellido, segundo_apellido, correo, descripcion, localidad, provincia, codigo_postal, direccion, nif, telefono, usuario, contraseña,fecha_nacimiento});

            localStorage.setItem('token', data.token );
            localStorage.setItem('token-init-date', new Date().getTime());
            dispatch( onLogin({ nombre: data.nombre, uid: data.uid }) );
        }catch (error) {
            let fallo = ''
            const objetos = Object(error.response.data.errors); 
            for(const objeto in objetos) {
                let arreglo = objetos[objeto];
                fallo = arreglo['msg'];
                break;
            }
            
            dispatch( onLogout(error.response.data?.msg || fallo));

            setTimeout(()=> {
                dispatch( ClearErrorMessage() );
            }, 10);
        }
    }

    const checkAuthToken = async() => {
        const token = localStorage.getItem( 'token' );
        if( !token ) return dispatch( onLogout() );

        try {
            const { data } = await alcompasAPI.get('auth/renew');
            localStorage.setItem( 'token', data.token );
            localStorage.setItem('token-init-date', new Date().getTime() );
            dispatch( onLogin( { name: data.name, uid: data.uid }));
        } catch {
            localStorage.clear();
            dispatch( onLogout() );
        }
    }

    const startLogout = () => {
        localStorage.clear();
        dispatch(onLogout());

        
    }

    const getUserByiD = async(id) => {
        try {
            
            if(id != undefined) {
                const { data } = await alcompasAPI.get('auth/' + id);
                const usuario = data.usuario;
                const fechaNacimiento = usuario.fecha_nacimiento;
                const fecha = new Date(fechaNacimiento)
                const nuevaFecha = fecha.toLocaleDateString();
                
                usuario.fecha_nacimiento = nuevaFecha;
                return usuario;
            }
            
        } catch(error) {
            console.log('Error cargando usuario');
            console.log(error)
        }
    }

    return {
        // Propiedades
        status, 
        user, 
        errorMessage,


        // Métodos
        startLogin,
        startRegister,
        checkAuthToken,
        startLogout,
        getUserByiD,
    }
}