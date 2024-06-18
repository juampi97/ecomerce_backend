import { Router } from "express";
import  register  from "../controllers/register.controllers.js"

const register_router = Router()

register_router.post('/api/register', register)

export default register_router