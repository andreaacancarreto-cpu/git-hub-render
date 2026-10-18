require('dotenv').config();
const app = require('../app');
const { sequelize } = require('../server/models');

// en render el puerto lo pone la plataforma (process.env.PORT)
// en local usa el del .env o el 8010
const PORT = process.env.PORT || 8010;

// primero se prueba la conexion a la bd y si funciona se levanta el servidor
async function iniciar() {
  try {
    await sequelize.authenticate();
    console.log('Conexión a PostgreSQL establecida correctamente.');

    app.listen(PORT, () => {
      console.log(`Servidor corriendo en http://localhost:${PORT}`);
    });
  } catch (error) {
    // si falla revisar los datos del .env (o las variables en render)
    console.error('No se pudo conectar a la base de datos:', error.message);
    process.exit(1);
  }
}

iniciar();
