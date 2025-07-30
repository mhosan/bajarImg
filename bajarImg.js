const axios = require('axios');
const fs = require('fs');

// Token de acceso de Mapbox
const accessToken = 'pk.eyJ1IjoibWhvc2FuIiwiYSI6ImNsYjdjd3hvcDA0NDkzcXBreXkwbWI0MzYifQ.CQRqNMLyy56TFpKGdZC9zA';

// La coordenada de la imagen satelital a descargar
const longitude = -57.9005;
const latitude = -34.9213;

// La URL de la API de Mapbox 
const url = `https://api.mapbox.com/styles/v1/mapbox/satellite-v9/static/${longitude},${latitude},15,0,0/800x800?access_token=${accessToken}`;

// La función que descarga la imagen y la guarda en un archivo
async function downloadImage(url, fileName) {
  try {
    const response = await axios({
      url,
      responseType: 'stream'
    });
    response.data.pipe(fs.createWriteStream(fileName));
  } catch (error) {
    console.log(error);
  }
}

// downloadImage para descargar la imagen y guardarla en un archivo
downloadImage(url, 'imagen-satelital.png').then(() => {
  const metadata = `Fecha: ${new Date().toISOString()}\nLongitud: ${longitude}\nLatitud: ${latitude}`;
  fs.writeFileSync('imagen-satelital.txt', metadata);
});
