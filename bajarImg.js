const request = require('request');
const fs = require('fs');

// Tu token de acceso de Mapbox
const accessToken = 'pk.eyJ1IjoibWhvc2FuIiwiYSI6ImNsYjdjd3hvcDA0NDkzcXBreXkwbWI0MzYifQ.CQRqNMLyy56TFpKGdZC9zA';

// La coordenada de la imagen satelital que quieres descargar
const longitude = -57.9535;
const latitude = -34.9213;

// La URL de la API de Mapbox que usaremos para descargar la imagen
//const url = `https://api.mapbox.com/v4/mapbox.satellite/${longitude},${latitude},17/800x800.png?access_token=${accessToken}`;
const url = `https://api.mapbox.com/v4/mapbox.satellite/${longitude},${latitude},15/800x800.png?access_token=${accessToken}`;

// La función que descarga la imagen y la guarda en un archivo
function downloadImage(url, fileName) {
  request.get(url)
    .on('error', (err) => {
      console.log(err);
    })
    .pipe(fs.createWriteStream(fileName));
}

// Usamos la función downloadImage para descargar la imagen y guardarla en un archivo
downloadImage(url, 'imagen-satelital.png');
