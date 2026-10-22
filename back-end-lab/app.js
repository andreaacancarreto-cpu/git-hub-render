const express = require("express");

const app = express();

// para poder leer el body en formato json y de formularios
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS: deja que el front-end (u otra pagina) haga peticiones a la api
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
        "Access-Control-Allow-Headers",
        "Authorization, X-Auth-Token, Origin, X-Requested-With, Content-Type, Accept"
    );
    res.header(
        "Access-Control-Allow-Methods",
        "GET, POST, PUT, DELETE, OPTIONS"
    );
    next();
});

// ruta de inicio, sirve para ver rapido si el servidor esta arriba
app.get("/", (req, res) => {
    res.status(200).send({ message: "API de estudiantes corriendo correctamente" });
});

// rutas de la api
const authRoutes = require('./server/routes/auth.routes');
app.use('/api/auth', authRoutes);

const ejemploRoutes = require('./server/routes/ejemplo.routes');
app.use('/api/ejemplo', ejemploRoutes);

const estudianteRoutes = require('./server/routes/estudiante.routes');
app.use('/api/estudiante', estudianteRoutes);

// aqui van las demas rutas cuando se generen con generar-crud.js

module.exports = app;
