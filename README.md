# trini-md-links

 
Librería que permite extraer los links de archivos markdown(.md), validar status de links y obtener algunas estadisticas.

## Instalación ⚙️🔧

```
npm i trini-md-links
```
## Uso 📌

```
const md-links = require ( 'trini-md-links' ) ;   
```

### CLI (Command Line Interface - Interfaz de Línea de Comando)

La librería puede ejecutarse a través de la terminal de la siguiente manera:

`md-links <path-to-file> [options]`

Por ejemplo:

```sh
$ md-links ./some/example.md
./some/example.md http://algo.com/2/3/ Link a algo
./some/example.md https://otra-cosa.net/algun-doc.html algún doc
./some/example.md http://google.com/ Google
```
El comportamiento de la librería por defecto es identificar el archivo markdown (a partir de la ruta que recibe como argumento), analizar este archivo e imprimir los links que vaya encontrando, junto con la ruta del archivo donde aparece y el texto que hay dentro del link.

<a href="https://ibb.co/YhwsgHb"><img src="https://i.ibb.co/tDFrRV3/ruta.png" alt="ruta" border="0"></a>

#### Options

##### `--validate`

Si pasas la opción `--validate`, el módulo hace una petición HTTP para
averiguar si el link funciona o no. Si el link resulta en una redirección a una
URL que responde ok, entonces consideraremos el link como ok.

Por ejemplo:

```sh
$ md-links ./some/example.md --validate
./some/example.md http://algo.com/2/3/ ok 200 Link a algo
./some/example.md https://otra-cosa.net/algun-doc.html fail 404 algún doc
./some/example.md http://google.com/ ok 301 Google
```

<a href="https://ibb.co/jy98Y4d"><img src="https://i.ibb.co/PcsryCR/validate.png" alt="validate" border="0"></a>

##### `--stats`

Si pasas la opción `--stats` el output (salida) será un texto con estadísticas
básicas sobre los links.

```sh
$ md-links ./some/example.md --stats
Total: 3
Unique: 3
```

<a href="https://imgbb.com/"><img src="https://i.ibb.co/YBdFbhH/stats.png" alt="stats" border="0"></a>

También puedes combinar --stats(--s) y --validate(--v) para obtener estadísticas que necesiten de los resultados de la validación.

```sh
$ md-links ./some/example.md --stats --validate
Total: 3
Unique: 3
Broken: 1
```
<a href="https://imgbb.com/"><img src="https://i.ibb.co/C6jDcFw/stats-validate.png" alt="stats-validate" border="0"></a>

## Dependencias Utilizadas 📋
- "eslint": "^6.3.0",
- "marked": "^0.7.0",
- "node-fetch": "^2.6.0",
- "eslint-plugin-jest": "^22.17.0",
- "esm": "^3.2.25",
- "jest": "^24.9.0"

## Autora ✒️

- **Trinidad Dominguez**