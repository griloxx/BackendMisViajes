

function obtenerExtensionDesdeBuffer(buffer) {
    // Comprueba si el buffer comienza con una firma típica de formato de imagen para determinar la extensión.
    if (buffer[0] === 0xFF && buffer[1] === 0xD8) {
        return '.jpg'; // Si es una imagen JPEG
    } else if (buffer[0] === 0x89 && buffer[1] === 0x50 && buffer[2] === 0x4E && buffer[3] === 0x47) {
        return '.png'; // Si es una imagen PNG
    } else if (buffer[0] === 0x47 && buffer[1] === 0x49 && buffer[2] === 0x46) {
        return '.gif'; // Si es una imagen GIF
    } else {
        return ''; // Extensión no identificada
    }
}


module.exports = {obtenerExtensionDesdeBuffer};