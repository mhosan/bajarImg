const io = require('socket.io')();

// Establecemos una conexión con el servidor de chat
io.connect('https://chat.openai.com/chat');

// Cuando se establezca la conexión, enviamos un mensaje al servidor
io.on('connect', () => {
  io.emit('chat message', 'Hola, soy una aplicación de Node.js!');
});

// Finalmente, escuchamos los mensajes que nos envía el servidor
io.on('chat message', (message) => {
  console.log(message); // Imprimimos el mensaje en la consola
});