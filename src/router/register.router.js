import { Router } from "express";
import  register  from "../controllers/register.controllers.js"

const router = Router()

router.post('/', register)

export default router