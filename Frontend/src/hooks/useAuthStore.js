import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { alcompasAPI } from '../api';
import { ClearErrorMessage, onChecking, onErrorUpdate, onLogin, onLogout, onUpdate } from '../store/auth/authSlice';

export const useAuthStore = () => {

    const { status, user, errorMessage } = useSelector( state => state.auth );
    const dispatch = useDispatch();
    let navigate = useNavigate();

    const startLogin = async({ correo, contraseña }) => {
        dispatch( onChecking() );
        
        try{
            const { data } = await alcompasAPI.post('/auth', {correo, contraseña});
            navigate('/');
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
            navigate('/');
            localStorage.setItem('token', data.token );
            localStorage.setItem('token-init-date', new Date().getTime());
            
            dispatch( onLogin({ nombre: data.nombre, uid: data.uid }) );
            return data;
            
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
            return data.uid
        }catch (error) {
            let fallo = ' '
            const objetos = error.response.data.msg; 
            const objetos2 = error.response.data.errors;
            if(objetos2 != undefined) {
                for(const objeto in objetos2) {
                    fallo = objetos2[objeto].msg;
                    break;
                }
            } else {
                fallo = objetos;
            }
            dispatch( onErrorUpdate(fallo));

            setTimeout(()=> {
                dispatch( ClearErrorMessage() );
            }, 10);
            return fallo;
            
        }
    }
    const startUpdatePassword = async({ contraseñaNueva}) => {
        
        try{
            
            const { data } = await alcompasAPI.put('/auth/update/contrasena/' + user.uid, {contraseñaNueva});
       
            return data.usuarioModificado;
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

    const checkAuthToken = async() => {
        const token = localStorage.getItem( 'token' );
        if( !token ) return dispatch( onLogout() );

        try {
            const { data } = await alcompasAPI.get('auth/renew');
            localStorage.setItem( 'token', data.token );
            localStorage.setItem('token-init-date', new Date().getTime() );
      
            dispatch( onLogin( { nombre: data.nombre, uid: data.uid }));
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
            
            dispatch(onLogout());
            const { data } = await alcompasAPI.delete('/auth/' + user.uid);
            localStorage.clear();
            
       
            
        }catch (error) {
            console.log("Error eliminando usuario")
            let fallo = 'Error eliminando usuario'
            
            dispatch( onErrorUpdate( fallo ));
            console.log(errorMessage)
            setTimeout(()=> {
                dispatch( ClearErrorMessage() );
            }, 10);
        }

    }

    const deleteAdminById = async(id) => {
        try{
            const { data } = await alcompasAPI.delete('/auth/admin/' + id);
          
            return data.usuario;
        }catch (error) {
            console.log("Error eliminando usuario")
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
        }
    }

    /*
    *  Obtiene todos los usuarios
    */
    const getAllUsers = async() => {
        try {
            const { data } = await alcompasAPI.get('auth');
            const usuarios = data.usuarios;
            return usuarios;
        } catch(error) {
            console.log('Error cargando usuarios');
        }
    }

    /*
    *  Obtiene el usuario a partir de su username
    */
    const getUserByUsername = async(username) => {
        try {
            const { data } = await alcompasAPI.get('auth/getByUsername/' + username);
            const usuario = data.usuario;
            return usuario;
        } catch(error) {
            console.log('Error cargando usuario');
        }
    }

    const obtenerTodasLocalidades = async() => {
        try {
            const { data } = await alcompasAPI.get('auth/todas/localidades');
            const localidades = data.localidades;
            return localidades;
        } catch(error) {
            console.log('Error cargando localidades');
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
        startDelete,
        getAllUsers,
        getUserByUsername,
        deleteAdminById,
        obtenerTodasLocalidades
    }
}