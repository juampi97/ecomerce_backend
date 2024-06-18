import { Router } from "express";
import  getUsers  from "../controllers/usuarios.controllers.js"

const usuarios_router = Router()

usuarios_router.get('/api/usuarios', getUsers)

export default usuarios_router