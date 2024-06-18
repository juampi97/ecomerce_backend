import express from "express";
import cors from "cors";
import {} from "dotenv/config";
import bodyParser from "body-parser";

import ping_router from './router/ping.router.js'
import usuariosRouter from './router/usuarios.router.js'
import loginRouter from './router/login.router.js'
import registerRouter from './router/register.router.js'

const port = process.env.PORT || 3000;

const app = express();
app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true })); 

app.get("/", (req, res) => {
  res.send("Hello World!");
});
app.use('/ping', ping_router)
app.use("/api/usuarios", usuariosRouter);
app.use("/api/login", loginRouter);
app.use("/api/register", registerRouter);


app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
