const request = require('request');
const fs = require('fs');

const accessToken = 'pk.eyJ1IjoibWhvc2FuIiwiYSI6ImNsYjdjd3hvcDA0NDkzcXBreXkwbWI0MzYifQ.CQRqNMLyy56TFpKGdZC9zA';

const downloadImage = (url, fileName) => {
    // Generamos el nombre del directorio de descarga
    const downloadDir = './downloads';
    // Comprobamos si el directorio de descarga existe
    if (!fs.existsSync(downloadDir)) {
        // Si el directorio no existe, lo creamos
        fs.mkdir(downloadDir, (err) => {
            if (err) {
                // Si se produce un error al crear el directorio, mostramos un mensaje de error
                console.error(`Error al crear el directorio ${downloadDir}: ${err}`);
                return;
            }
        });
    }
    // Descargamos la imagen y la guardamos en el directorio de descarga
    request.get(url)
        .on('error', (err) => {
            console.log(err);
        })
        .pipe(fs.createWriteStream(`${downloadDir}/${fileName}`));
};

// Descargamos diez imágenes satelitales a partir de una URL
for (let i = 0; i < 5; i++) {
    const latitude = -34.9213; // Latitud de La Plata, Argentina
    const longitude = -57.9535; // Longitud de La Plata, Argentina
    const distance = 25000; // Distancia entre imágenes en metros
    const zoom = 19; // Nivel de zoom de la imagen
    const dimensions = 800; // Dimensiones de la imagen en píxeles
    if (i === 0) {
        const imageUrl = `https://api.mapbox.com/styles/v1/mapbox/satellite-streets-v11/static/${longitude},${latitude},${zoom}/${dimensions}x${dimensions}@2x?access_token=${accessToken}`;
        downloadImage(imageUrl, `imagen-satelital-${i}.png`);
    } else {
        // Calculamos la nueva latitud
        const newLatitude = latitude + (i / 100000) * (distance / 111.111);
        // Calculamos la nueva longitud
        const newLongitude = longitude + (i / 100000) * (distance / (111.111 * Math.cos(latitude)));
        const imageUrl = `https://api.mapbox.com/styles/v1/mapbox/satellite-streets-v11/static/${newLongitude},${newLatitude},${zoom}/${dimensions}x${dimensions}@2x?access_token=${accessToken}`;
        downloadImage(imageUrl, `imagen-satelital-${i}.png`);
    }
    
}
