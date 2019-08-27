let path = require('path');
let fs = require('fs');

let userPath = process.argv[2];
// print process.argv
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

const isMd = (route) => {
    const extension = path.extname(route);
    if(extension === '.md'){
        console.log("esto es una archivo md:", route);
        return true;
    }else{
        return false;
    }    
}

//abrir un archivo y extraer las URL 
const extractURLS = (route) => {
    var datos = fs.readFileSync(route).toString(); 
    var ans = datos.match(/\bhttps?:\/\/\S+\)/gi);
    //hay que quitarle ultimo valor a los strings de ans
    return ans;

    };   

if(isMd(userPath) === true){
    console.log("es true");
    console.log(extractURLS(userPath));
} else {
    console.log("es false");
}                                            




module.exports = {
    absolutePath,
    isMd,
    extractURLS
}
