const app = require('./app'); // Importamos la configuración de Express
const PORT = 3000;

app.listen(PORT, () => {
    console.log(`🚀 Motor corriendo en: http://localhost:${PORT}`);
});