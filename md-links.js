const path = require('path');
const fs = require('fs');
const marked = require('marked');
const fetch = require("node-fetch");

let userPath = process.argv[2];


const isMd = (route) => {
    const extension = path.extname(route);
    if (extension === '.md') {
       
        return true;
    } else {
       
        return false;
    }
}

const extractUrls = (userPath) => {
    userPath = absolutePath(userPath);
    console.log(userPath);
    if (isMd(userPath) === true) {
       
        // console.log("File found 2 > " + userPath);
        return extractUrlsFile(userPath);
    } else if (fs.statSync(userPath).isDirectory()) {
        return new Promise((resolve, reject) => {
            fs.readdir(userPath, function (err, files) {
                if (!err) {
                    // console.log(files);
                    const ret = files.map(function (file) {
                        if (isMd(file) === true) {
                            return extractUrlsFile(file)
                        } else {
                            return []
                        }
                    });

                    resolve(Promise.all(ret).then(arrRes => {
                        return arrRes.reduce((prev, act) => {
                            return prev.concat(act);
                        }, [])
                    }))
                } else {
                    resolve([])
                }
            });
        })
    }
}




//funcion que normaliza y convierte en absoluta una ruta.
const absolutePath = (route) => {
    if (!path.isAbsolute(route)) {
        // console.log("RUTA AL COMIENZO:", route);
        route = path.normalize(route);
        route = path.resolve(route);
        // console.log("RUTA AL FINAL:", route);
    }
    return route;
};

//función para leer archivos 
const extractUrlsFile = (route) => {
    return new Promise((resolve, reject) => {
        // console.log("Reading > " + route)
        fs.readFile(route, 'utf-8', (err, data) => {
            if (err) {
                reject(err);
            }
            let arrayLinks = [];
            const renderer = new marked.Renderer();
            renderer.link = function (href, title, text) {
                arrayLinks.push({
                    href: href,
                    text: text,
                    file: userPath
                })
            }

            marked(data, {
                renderer: renderer
            })
            resolve(arrayLinks)
        });
    })
};


const validateUrls = (links) => {
    return new Promise((resolve, reject) => {

        let linksResponse = links.map(link => {
            return fetch(link.href).then(res => {
                if (res.status < 200 || res.status > 400) {
                    link.statusCode = res.status;
                    link.statusText = "fail";
                } else {
                    link.statusCode = res.status;
                    link.statusText = "ok";
                }
            })
                .catch((err) => {
                    link.statusText = "fail";
                    link.statusCode = 0;
                })
        })
        Promise.all(linksResponse).then(res => {
            resolve(links)
        })
    })
}

const stats = (links, isValidate) => {
    // console.log(links)

    return new Promise((resolve, reject) => {
        let linkStats = {}
        linkStats.total = links.length;
        let total = links.map(link => link.href); //genera un nuevo arreglo con los resultados de la llamada por cada elemento. 
        let unique = [... new Set(total)].length; //set genera un arreglo con elementos unicos. deja afuera los repetidos. 
        linkStats.unique = unique;
        if (isValidate) {
            let broken = links.filter(link => {
                if (link.statusText === "fail") {
                    return link.statusText;
                }
            });
            linkStats.broken = broken.length;
        }

        // console.log(linkStats)
        resolve(linkStats)
    })
}

const mdLinks = (userPath, options) => {
    // console.log(options);
    return new Promise ((resolve,reject) => {
       
        extractUrls(userPath)
        .then(links =>{
            if (options.validate && options.stats) {
                // console.log("las dos");
                resolve(stats(links, options.validate));
    
            } else if(options.validate) {
                resolve (validateUrls(links))
                // console.log("funcion validate");
    
            }
            else if(options.stats) {
                // console.log("funcion stats");
                resolve(stats(links, false));
            } else {
                // console.log("ninguna de las dos");
                resolve(extractUrls(userPath));
            }
        })  
    })
  
    // }).then(links=>{
    //     console.log(links)
    //     return stats(links)
    // })
}



//mdLinks(userPath, { validate: true }).then(console.error)

module.exports = {
    mdLinks,
    stats,
    extractUrls,
    extractUrlsFile,
    validateUrls,
   
  }





