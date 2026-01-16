const express = require("express");
const poRoutes = require("./routes/poRoutes");
const usersRoutes = require("./routes/usersRoutes");
const MetodosRoutes = require("./routes/metodosRoutes");
const vicepresidenteRoutes = require("./routes/vicepresidenteRoutes");
const administradorRoutes = require("./routes/administradorRoutes");
const gerenteRoutes = require("./routes/gerenteRoutes");
const check = require("./routes/check");
const morgan = require("morgan");
const cors = require("cors");
const cookieParser = require('cookie-parser');

const app = express();


app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.use(morgan('dev'));
app.use(cookieParser()); 


app.use(cors({
  origin: process.env.PORT_ACEPT, // Angular tener "http://localhost" en prod o process.env.PORT_ACEPT en dev
  credentials: true,               
  Metodos: "GET,POST,PUT,DELETE",
  allowedHeaders: ["Content-Type", "Authorization"]
}));




app.use("/api", poRoutes);
app.use("/api", usersRoutes);
app.use("/api", MetodosRoutes);
app.use("/api", vicepresidenteRoutes);
app.use("/api", administradorRoutes);
app.use("/api", gerenteRoutes);

app.use(check);

module.exports = app;
