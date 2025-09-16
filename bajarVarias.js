const axios = require('axios');
const fs = require('fs');
const fsPromises = require('fs').promises;
const path = require('path');

const accessToken = 'pk.eyJ1IjoibWhvc2FuIiwiYSI6ImNsYjdjd3hvcDA0NDkzcXBreXkwbWI0MzYifQ.CQRqNMLyy56TFpKGdZC9zA';

const downloadDir = './downloads';

/**
 * Ensures the download directory exists, creating it if necessary.
 */
async function ensureDownloadDir() {
    try {
        await fsPromises.mkdir(downloadDir, { recursive: true });
    } catch (err) {
        if (err.code !== 'EEXIST') throw err;
    }
}

/**
 * Generates the Mapbox static image URL.
 * @param {number} longitude - Longitude coordinate
 * @param {number} latitude - Latitude coordinate
 * @param {number} zoom - Zoom level
 * @param {number} dimensions - Image dimensions in pixels
 * @param {string} accessToken - Mapbox access token
 * @returns {string} The generated URL
 */
function generateImageUrl(longitude, latitude, zoom, dimensions, accessToken) {
    return `https://api.mapbox.com/styles/v1/mapbox/satellite-streets-v11/static/${longitude},${latitude},${zoom}/${dimensions}x${dimensions}@2x?access_token=${accessToken}&layers=building-label&format=jpeg`;
}

/**
 * Calculates new coordinates based on distance offset.
 * @param {number} baseLatitude - Base latitude
 * @param {number} baseLongitude - Base longitude
 * @param {number} i - Iteration index
 * @param {number} distance - Distance in meters
 * @returns {Object} Object with newLatitude and newLongitude
 */
function calculateNewCoords(baseLatitude, baseLongitude, i, distance) {
    // Approximate calculation; for precision, consider using a geospatial library
    const newLatitude = baseLatitude + (i / 100000) * (distance / 111111);
    const newLongitude = baseLongitude + (i / 100000) * (distance / (111111 * Math.cos(baseLatitude * Math.PI / 180)));
    return { newLatitude, newLongitude };
}

/**
 * Downloads an image from the given URL and saves it with metadata.
 * @param {string} url - Image URL
 * @param {string} fileName - File name for the image
 * @param {number} latitude - Latitude for metadata
 * @param {number} longitude - Longitude for metadata
 * @param {number} i - Image index
 */
async function downloadImage(url, fileName, latitude, longitude, i) {
    try {
        const response = await axios({
            url,
            responseType: 'stream'
        });
        const filePath = path.join(downloadDir, fileName);
        const writer = fs.createWriteStream(filePath);
        response.data.pipe(writer);

        await new Promise((resolve, reject) => {
            writer.on('finish', resolve);
            writer.on('error', reject);
        });

        const metadata = `Fecha: ${new Date().toISOString()}\nLongitud: ${longitude}\nLatitud: ${latitude}`;
        await fsPromises.writeFile(path.join(downloadDir, `imagen-satelital-${i}.txt`), metadata);
        console.log(`Imagen ${i} descargada exitosamente.`);
    } catch (error) {
        console.error(`Error descargando imagen ${i}: ${error.message}`);
    }
}

/**
 * Main function to download multiple satellite images.
 */
async function main() {
    await ensureDownloadDir();

    const baseLatitude = -34.9213; // Latitude of La Plata, Argentina
    const baseLongitude = -57.9535; // Longitude of La Plata, Argentina
    const distance = 25000; // Distance between images in meters
    const zoom = 17; // Zoom level
    const dimensions = 800; // Image dimensions in pixels
    const numImages = 5; // Number of images to download

    const downloadPromises = [];

    for (let i = 0; i < numImages; i++) {
        let latitude = baseLatitude;
        let longitude = baseLongitude;
        if (i > 0) {
            const coords = calculateNewCoords(baseLatitude, baseLongitude, i, distance);
            latitude = coords.newLatitude;
            longitude = coords.newLongitude;
        }

        const imageUrl = generateImageUrl(longitude, latitude, zoom, dimensions, accessToken);
        const fileName = `imagen-satelital-${i}.jpeg`;
        downloadPromises.push(downloadImage(imageUrl, fileName, latitude, longitude, i));
    }

    await Promise.all(downloadPromises);
    console.log('Todas las descargas completadas.');
}

// Run the main function
main().catch(console.error);
