import axios from 'axios';
import { useState } from 'react';
import { getEnvVariables } from '../helpers';

export const useUploadsStore = () => {
    const [ errores, setErrores ] = useState([]); 
    const { VITE_API_URL } = getEnvVariables();

    const editarFotoUsuario = async(foto, userId) => {
        let formData = new FormData();
        formData.append('archivo', foto);
        return axios({
            method: "post",
            url: VITE_API_URL + "/fotos/subir/foto/usuario/id/" + userId,
            data: formData,
            headers: { "Content-Type": "multipart/form-data", 'x-token': localStorage.getItem('token') },
        })
        .then(function (data) {
         
            const usuario = data.data;
            const base64 = btoa(
                new Uint8Array(usuario).reduce(
                    (data, byte) => data + String.fromCharCode(byte),
                    ''
                ));

            return base64;
        })
        .catch(function (error) {
            console.log(error)
            //handle error
            const res = ['Por favor, seleccione una imagen válida.']
            setErrores(res);
        });
    }

    const getFotoPerfilUsuario = async(userId) => {
        return axios.get(VITE_API_URL + "/fotos/get/foto/usuario/" + userId, {
            responseType: "arraybuffer",
            headers: { 'x-token': localStorage.getItem('token') }
            })
            .then((res) => {
                
                const base64 = btoa(
                new Uint8Array(res.data).reduce(
                    (data, byte) => data + String.fromCharCode(byte),
                    ''
                ));
                return base64;
            })
    }

    const getFotoPerfilBanda = async(bandaId) => {
        return axios.get(VITE_API_URL + "/fotos/get/foto/banda/" + bandaId, {
            responseType: "arraybuffer",
            headers: { 'x-token': localStorage.getItem('token') }
            })
            .then((res) => {
                const base64 = btoa(
                new Uint8Array(res.data).reduce(
                    (data, byte) => data + String.fromCharCode(byte),
                    ''
                ));
                return base64;
            })
    }


    const editarFotoBanda = async(foto, bandaId) => {
        let formData = new FormData();
        formData.append('archivo', foto);
        return axios({
            method: "post",
            url: VITE_API_URL + "/fotos/subir/foto/banda/id/" + bandaId,
            data: formData,
            headers: { "Content-Type": "multipart/form-data", 'x-token': localStorage.getItem('token') },
        })
        .then(function (data) {
            const banda = data.bandaDb;
            return banda;
        })
        .catch(function (error) {
        
            //handle error
            const res = ['Por favor, seleccione una imagen válida.']
            setErrores(res);
        });
    }
    return {
        // Constantes
        errores,
        setErrores,

        // Métodos
        editarFotoUsuario,
        getFotoPerfilUsuario,
        editarFotoBanda,
        getFotoPerfilBanda
    }

    
}
