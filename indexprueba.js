let path = require('path');
let fs = requiere('fs');

let userPath = process.argv[2];

process.argv.forEach((val, index) => {
         console.log(`${index}: ${val}`);
    });

    //funcion que convierte en absoluta una ruta.
const absolutePath = (route) => {
    if (!path.isAbsolute(route)) {
        console.log("RUTA AL COMIENZO:", route);
        route = path.normalize(route);
        route = path.resolve(route);
        console.log("RUTA AL FINAL:", route);
    }
    return route;
};

userPath = absolutePath(userPath);

const checkFile = (route) => {
    if(stats.isFile(route) === true ){
        // return true;
        console.log('es un archivo');
    }if(stats.isFile(route) === false){
        console.log('es una directorio');
    }
    
}
checkFile();