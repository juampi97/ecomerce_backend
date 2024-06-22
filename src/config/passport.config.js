import passport from "passport"
import local from "passport-local"
import jwt, { ExtractJwt } from "passport-jwt"
import { createHash, isValidPassword } from "../utils.js"
import{ manager } from "../dao/usuariosManager.js"

const JWTStrategy = jwt.Strategy
const JWTExtract = jwt.ExtractJwt

const LocalStrategy = local.Strategy

const cookieExtractor = req => {
    let token = null
    if(req && req.cookies){
        token = req.cookies[process.env.NAME_COOKIE]
    }
    return token
}

const initializePassport = () => {
    passport.use('register', new LocalStrategy(
        {passReqToCallback:true, usernameField:'email'}, async (req,username,password,done) => {
            const {nombre, apellido, email, user} = req.body
            try {
                let userExists = manager.userExists(username, user).then((userExists) => {
                    if(userExists) {
                        console.log('Ya existe el usuario');
                        return done(null,false)
                    }
                    let result = manager.createUser(nombre, apellido, email, user, password)
                    let usuario = {email:email, user:user}
                    console.log("usuario agregado");
                    return(null,usuario)
                })          
            } catch (error) {
                return done(error)
            }
        }
    ))
    passport.use('login', new LocalStrategy(
        {usernameField: 'email'}, async(username, password, done) => {
        try {
            const result = manager.getUserByEmail(username, password).then ((data) => {
                if(!data) {
                    console.log("User not exist");
                    return done(null, false, {payload: "invalid credentials"})
                }
                if(!isValidPassword(data, password)) return done(null, false)
                else {
                    const user = {nombre: data.nombre, apellido: data.apellido, email: data.email, user: data.user}
                    return done(null, user)
                }
            })
        } catch(error) {
            return done(error)
        }
    }))
    passport.use('jwt', new JWTStrategy({
        jwtFromRequest: ExtractJwt.fromExtractors([cookieExtractor]),
        secretOrKey: process.env.SECRET_COOKIE
    }, async (jwt_payload, done) => {
        try {
            return done(null, jwt_payload)
        } catch (error) {
            return done(error)
        }
    }))
}

// No es necesario para jwt
passport.serializeUser((user,done) => {
    done(null,user.email)
})

passport.deserializeUser(async (email,done) => {
    let user = manager.getUserByEmail(email)
    done(null,user)
})

export default initializePassport