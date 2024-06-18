import express from "express";
import cors from "cors";
import {} from "dotenv/config";
import bodyParser from "body-parser";

import ping_router from './router/ping.router.js'
import usuarios_router from './router/usuarios.router.js'
import login_router from './router/login.router.js'
import register_router from './router/register.router.js'

const port = process.env.PORT || 3000;

const app = express();
app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true })); 

app.get("/", (req, res) => {
  res.send("Hello World!");
});
app.get('/ping', ping_router)
app.get("/api/usuarios", usuarios_router);
app.post("/api/login", login_router);
app.post("/api/register", register_router);


app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
