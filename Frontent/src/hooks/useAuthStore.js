import { useDispatch, useSelector } from 'react-redux';
import { alcompasAPI} from '../api';
import { onChecking, onLogin, onLogout, ClearErrorMessage, onErrorUpdate, onUpdate } from '../store/auth/authSlice';
import Swal from 'sweetalert2';

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
            dispatch( ClearErrorMessage() );
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

    const startUpdate = async({ nombre, primer_apellido, segundo_apellido, correo, descripcion, localidad, provincia, codigo_postal, direccion, nif, telefono, usuario,fecha_nacimiento}) => {
        
        try{
            
            const { data } = await alcompasAPI.put('/auth/update/' + user.uid, {nombre, primer_apellido, segundo_apellido, correo, descripcion, localidad, provincia, codigo_postal, direccion, nif, telefono, usuario,fecha_nacimiento});
            localStorage.setItem('token', data.token );
            localStorage.setItem('token-init-date', new Date().getTime());
            dispatch( onUpdate({ nombre: data.nombre, uid: data.uid }) );

        }catch (error) {
            console.log(error)
            let fallo = ''
            const objetos = Object(error.response.data.errors); 
            for(const objeto in objetos) {
                let arreglo = objetos[objeto];
                fallo = arreglo['msg'];
                break;
            }
            
            dispatch( onErrorUpdate(error.response.data?.msg || fallo));

            setTimeout(()=> {
                dispatch( ClearErrorMessage() );
            }, 10);
            
        }
    }
    const startUpdatePassword = async({ contraseñaNueva}) => {
        
        try{
            
            const { data } = await alcompasAPI.put('/auth/update/contrasena/' + user.uid, {contraseñaNueva});
            localStorage.setItem('token', data.token );
            localStorage.setItem('token-init-date', new Date().getTime());
            dispatch( onUpdate({ nombre: data.nombre, uid: data.uid }) );

        }catch (error) {
            console.log(error)
            let fallo = ''
            const objetos = Object(error.response.data.errors); 
            for(const objeto in objetos) {
                let arreglo = objetos[objeto];
                fallo = arreglo['msg'];
                break;
            }
            
            dispatch( onErrorUpdate(error.response.data?.msg || fallo));

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

    const startDelete = async() => {
        try{
            
            const { data } = await alcompasAPI.delete('/auth/' + user.uid);
   
            localStorage.clear();
            dispatch(onLogout());
            
        }catch (error) {
            
            let fallo = ''
            const objetos = Object(error.response.data.errors); 
            for(const objeto in objetos) {
                let arreglo = objetos[objeto];
                fallo = arreglo['msg'];
                break;
            }
            
            dispatch( onErrorUpdate(error.response.data?.msg || fallo));

            setTimeout(()=> {
                dispatch( ClearErrorMessage() );
            }, 10);
        }

    }

    const getUserByiD = async(id) => {
        try {
            
            if(id != undefined) {
                const { data } = await alcompasAPI.get('auth/' + id);
                const usuario = data.usuario;
                
                
              
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
        startUpdate,
        startUpdatePassword,
        startDelete
    }
}