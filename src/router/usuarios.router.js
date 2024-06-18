import { Router } from "express";
import  getUsers  from "../controllers/usuarios.controllers.js"

const router = Router()

router.get('/', getUsers)

export default router