const path = require('path');
const fs = require('fs');
const marked = require('marked');
const fetch = require("node-fetch");


let userPath = process.argv[2];

let options = {
    stats: false,
    validate: false
}


// print process.argv
process.argv.forEach((val, index) => {
    console.log(`${index}: ${val}`);
    if (val === "--validate" || val == "--v") {
        options.validate = true;
    }
    if (val == "--stats" || val == "--s") {
        options.stats = true;
    }
});



const isMd = (route) => {
    const extension = path.extname(route);
    if (extension === '.md') {
        console.log("esto es una archivo md:", route);
        return true;
    } else {
        console.log("esto no es una archivo md:", route);
        return false;
    }
}

const extractUrls = (userPath) => {
    userPath = absolutePath(userPath);
    console.log(userPath);
    if (isMd(userPath) === true) {
        console.log("File found 2 > " + userPath);
        return extractUrlsFile(userPath);
    } else if (fs.statSync(userPath).isDirectory()) {
        return new Promise((resolve, reject) => {
            fs.readdir(userPath, function (err, files) {
                if (!err) {
                    console.log(files);
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
        console.log("RUTA AL COMIENZO:", route);
        route = path.normalize(route);
        route = path.resolve(route);
        console.log("RUTA AL FINAL:", route);
    }
    return route;
};

//función para leer archivos 
const extractUrlsFile = (route) => {
    return new Promise((resolve, reject) => {
        console.log("Reading > " + route)
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
    console.log(links)

    return new Promise((resolve, reject) => {
        let linkStats = {}
        linkStats.total = links.length;
        let total = links.map(link => link.href);
        let unique = [... new Set(total)].length;
        linkStats.unique = unique;
        if (isValidate) {
            let broken = links.filter(link => {
                if (link.statusText === "fail") {
                    return link.statusText;
                }
            });
            linkStats.broken = broken.length;
        }

        console.log(linkStats)
        resolve(linkStats)
    })
}

const mdLinks = (userPath, options) => {
    return extractUrls(userPath)
    .then(links =>{
       return validateUrls(links)
    })
}


mdLinks(userPath, { validate: true }).then(console.error)







