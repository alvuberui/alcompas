const path = require('path');
const { v4: uuidv4 } = require('uuid');
const sharp = require('sharp');

const subirArchivo = ( files, extensionesValidas = ['png','jpg','jpeg'], carpeta = '', opt='' ) => {

    return new Promise( (resolve, reject) => {

        const { archivo } = files;
        const nombreCortado = archivo.name.split('.');
        const extension = nombreCortado[ nombreCortado.length - 1 ];
        
        // Validar la extension
        if ( !extensionesValidas.includes( extension ) ) {
            return reject(`La extensión ${ extension } no es permitida - ${ extensionesValidas }`);
        }
        
        const nombreTemp = uuidv4() + '.' + extension;
        const uploadPath = path.join( __dirname, '../public/uploads/', carpeta, nombreTemp );
        const uploadPathOpt = path.join( __dirname, '../public/uploads/', opt, nombreTemp );
        
        
        archivo.mv(uploadPath, (err) => {
            if (err) {
                reject(err);
            } 

            resolve( nombreTemp );
        }); 

        sharp(uploadPath)
            .resize(500,500)
            .toFile(uploadPathOpt, (err) => {
                if (err) {
                    reject(err);
                }
                resolve( nombreTemp );
        });

    });

}

const subirPartitura = ( files, extensionesValidas = ['pdf'], carpeta = '' ) => {

    return new Promise( (resolve, reject) => {

        const { archivo } = files;
        const nombreCortado = archivo.name.split('.');
        const extension = nombreCortado[ nombreCortado.length - 1 ];
        
        // Validar la extension
        if ( !extensionesValidas.includes( extension ) ) {
            return reject(`La extensión ${ extension } no es permitida - ${ extensionesValidas }`);
        }
        
        const nombreTemp = uuidv4() + '.' + extension;
        const uploadPath = path.join( __dirname, '../public/uploads/', carpeta, nombreTemp );

        archivo.mv(uploadPath, (err) => {
            if (err) {
                reject(err);
            } 

            resolve( nombreTemp );
        }); 
    });

}



module.exports = {
    subirArchivo,
    subirPartitura
}