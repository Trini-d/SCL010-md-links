const path = require('path');
const mdLinks = require('./md-links.js');

// export const start = (args) => {
let userPath = process.argv[2];

let options = {
    stats: false,
    validate: false
}



// print process.argv
process.argv.forEach((val, index) => {
    console.log(`${index}: ${val}`);
    if(val === "--validate" || val == "--v"){
        options.validate = true;
    }
    if(val == "--stats" || val == "--s"){
        options.stats = true;
    }
});


// if(option)

mdLinks.mdLinks(userPath, options)
    .then(res => {
        console.log(res);
    })
//}
    // .then(res =>{
    //     if(options.stats&&options.validate){
    //         mdLinks(res)
    //             //   .then(res=>{
    //             //        console.log(("Links totales: ").green,(`${res.total}`).magenta,("\nLinks unicos: ").yellow, (`${res.unique}`).magenta, ("\nLinks rotos: ").red, (`${res.broken}`).magenta)
    //             //   })
    //    }
    // })
// mdLinks.mdLinks(userPath, options)//aqui llamamos nuestra funcion-promesa mdLinks que está en otro archivo
//     .then(res=>{
//          if(options.stats&&options.validate){
//               statsLinks(res)
//               .then
























    //                 .then(res=>{
    //                      console.log(("Links totales: ").green,(`${res.total}`).magenta,("\nLinks unicos: ").yellow, (`${res.unique}`).magenta, ("\nLinks rotos: ").red, (`${res.broken}`).magenta)
    //                 })
    //      }else if(options.stats){
    //           mdLinks.statsLinks(res)
    //                 .then(res=>{
    //                      console.log(("Links totales: ").green,(`${res.total}`).magenta,("\nLinks unicos: ").yellow, (`${res.unique}`).magenta)
    //                 })
    //      }else if(options.validate){
    //           res.forEach(el=>{
    //                console.log((`${el.file}`).green, (`${el.href}`).yellow,(`${el.statusCode}`).magenta,(`${el.statusText}`).cyan,(`${el.text}`).italic)
    //           })
    //      }else{
    //           res.forEach(el=>{
    //                console.log((`${el.file}`).green, (`${el.href}`).yellow,(`${el.text}`).italic)
    //           })
    //      }
    // })
    // .catch(err =>{
    //      console.log("Hay un error por aquí: ",err)
    // })
     
