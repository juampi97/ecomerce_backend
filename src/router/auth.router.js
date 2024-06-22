import { Router } from "express";
import passport from "passport";
import { manager } from "../dao/usuariosManager.js";
import { isValidPassword, generateToken, authToken, passportCall } from "../utils.js";

const router = Router();

// Express-Session
router.post('/register', passport.authenticate('register', {failureRedirect:'/api/auth/failregister'}),async (req,res) => {
    res.status(200).json({status:'success', payload:'User registered'})
})

router.post('/failregister', async (req,res) => {
    console.log('fail register');
    res.status(400).json({status:'error', payload:'fail register'})
})

router.post('/login', passport.authenticate('login', {failureRedirect:'/api/auth/faillogin'}),async (req,res) => {
    if(!req.user) return res.status(400).json({status:'error', payload:'Invalid credentials'})
    req.session.user = {
        nombre: req.session.nombre,
        apellido: req.session.apellido,
        email: req.session.email,
        user: req.session.user
    }
    res.status(200).json({status:'success', payload:req.user})
})

router.post('/faillogin', async (req,res) => {
    console.log('fail login');
    res.status(400).json({status:'error', payload:'fail login'})
})

// Passport-JWT
router.post('/jwt/login',  (req,res) => {
const { email, password } = req.body;
  if (email && password) {
    try {
      const result = manager.getUserByEmail(email, password).then ((data) => {
      if(!data) return res.status(406).json({status: "error", payload: "Usuario o contraseña incorrecto"}) 
        const validPassword = isValidPassword(data, password)
        if(!validPassword) return res.status(406).json({status: "error", payload: "Usuario o contraseña incorrecto"}) 
        else {
          // Sacar de aca la password
          let token = generateToken(data)  
          return res.status(200).cookie(process.env.NAME_COOKIE,token, {maxAge:3600000, httpOnly: true}).json({status: "success", payload: 'Login ok'})
        } 
    })
    } catch (error) {
      return res.status(400).json({status: "success", payload: error}) 
    }
  }
  else return res.status(400).json({status: "error", payload: "Complete todos los campos"})
})

//Middleware Propio
router.get('/current', authToken,(req,res) => {
    res.status(200).json({status:"success", payload: req.user})
})

//Middleware de Passport - JWT
router.get('/private', passport.authenticate('jwt', { session: false }), (req, res) => {
    res.status(200).json({ status: 'success', payload: req.user })
})
//Middleware de Propio Passport - JWT
router.get('/private/propio', passportCall('jwt'), (req, res) => {
    res.status(200).json({ status: 'success', payload: req.user })
})

router.get('/logout', (req, res) => {
    req.session.destroy(err => {
        if(err) {
            console.log(err);
            res.status(500).json({status:'error', payload:'fail logout'})
        } else res.status(200).clearCookie(process.env.NAME_COOKIE).json({status:'success', payload:'logout ok'})
    })
})

export default router;
