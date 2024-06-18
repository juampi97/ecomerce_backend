import { Router } from "express";
import  ping  from "../controllers/ping.controller.js"

const ping_router = Router()

ping_router.get('/ping', ping)

export default ping_router