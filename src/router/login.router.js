import { Router } from "express";
import  login  from "../controllers/login.controllers.js"

const login_router = Router()

login_router.post('/api/login', login)

export default login_router