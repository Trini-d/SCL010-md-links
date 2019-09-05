const path = require('path');
const fs = require('fs');
const marked = require('marked');
const fetch = require("node-fetch");


let userPath = process.argv[2];

// let options = {
//     validate = false,
//     stats = false
// }


// print process.argv
process.argv.forEach((val, index) => {
    console.log(`${index}: ${val}`);
    if(val == "--validate" || val == "--v"){
        options.validate = true;
    }
    if(val == "--stats" || val == "--s"){
        options.stats = true;
    }
});


  
const isMd = (route) => {
    const extension = path.extname(route);
    if(extension === '.md'){
        console.log("esto es una archivo md:", route);
        return true;
    }else{
        console.log("esto no es una archivo md:", route);
        return false;
    }    
}

const extractURLS = (userPath) =>{
    if(isMd(userPath) === true){
        console.log("es true");
        console.log(extractUrlsFile(userPath));
    }else{
        fs.readdir(userPath, function(err, files) {
            if(!err){
                console.log(files);
                files.forEach(function(file) {
                    if(isMd(file) === true){
                        console.log("es true");
                        console.log(extractUrlsFile(file));
                    } else {
                        console.log("es false");
                    }             
                });
            } else {
                console.log(err);
            }
        });
    }
}




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

//función para leer archivos 
const extractUrlsFile = (route) => {
        return new Promise((resolve, reject) => {
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
    return new Promise ((resolve, reject) => {
        
        let linksResponse = links.map(link =>{
            return fetch(link.href).then(res =>{
                if(res.status<200||res.status>400){
                    link.statusCode = res.status;
                    link.statusText = "fail"; 
                }else{
                    link.statusCode = res.status;
                    link.statusText = "ok";               
                }
            })
            .catch((err)=>{
                    link.statusText = "fail";
                    link.statusCode = 0;
            }) 
        })
        Promise.all(linksResponse).then(res=>{
            resolve(links)
        })
    })
}

const stats = (links) => {
    console.log(links)

    return new Promise ((resolve, reject) => {
        let ans = {}
        ans["total"] = links.length;
        let totalHref = links.map(link => link.href);
        let uniqueHref = [... new Set(totalHref)].length;
        ans.uniqueHref = uniqueHref;
        let brokenHref = links.filter(link =>{
            if(link.statusText === "fail"){
                return link.statusText;
            }
        });
        ans.brokenHref = brokenHref.length;
        console.log(ans)
        resolve(ans)
    })
}


extractUrlsFile(userPath).then(urls=>{
    //console.log(urls)
    validateUrls(urls).then(response => {
        //console.log(response)
        stats(response).then(stats =>{
            console.log(stats)
        })
    })
})



// const mdLinks = (userPath, options) =>{
//     return new promise ((resolve, reject) =>{
//         if()
//     })
// }


// function checkStatus(res) {
//     if (res.ok) { // res.status >= 200 && res.status < 300
//         console.log("HTTP Status:", res.status);
//         console.log("Status text:", res.statusText);
//         console.log("Status url", res.url);
       
//     } else {
//         console.log(res.statusText);
//     }
// }








