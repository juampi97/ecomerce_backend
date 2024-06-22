import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import passport from "passport";

export const createHash = (password) =>
  bcrypt.hashSync(password, bcrypt.genSaltSync(10));

export const isValidPassword = (user, password) =>
  bcrypt.compareSync(password, user.password);

export const generateToken = (user) => {
  const token = jwt.sign(user, process.env.SECRET_COOKIE, {
    expiresIn: "168h",
  });
  return token;
};

export const authToken = (req, res, next) => {
  let token = req.headers.authorization;
  if (!token) token = req.cookies[process.env.NAME_COOKIE];
  if (!token) return res.status(401).json({ error: "Not authenticated!" });
  jwt.verify(token, process.env.SECRET_COOKIE, (err, credential) => {
    if (err) return res.status(403).json({ error: "Not authorized!" });
    req.user = credential.user;
    next();
  });
};

// Cualquier usuario puede acceder
export const passportCall = (strategy) => {
    return async (req,res,next) =>{
        passport.authenticate(strategy, function (err,user,info){
            if(err) return next(err)
                if(!user) {
                    return res.status(401).json({status:"error", payload:info.messages ? info.messages : info.toString()})
                }
                req.user = user
                return res.status(200).json({ status: 'success', payload: req.user })
            })(req,res,next)
        }
    }
    
// Cualquier usuario con permisos puede acceder
export const passportCallProtected = (strategy, role) => {
    return async (req,res,next) =>{
        passport.authenticate(strategy, function (err,user,info){
            if(err) return next(err)
            if(!user) {
                return res.status(401).json({status:"error", payload:info.messages ? info.messages : info.toString()})
            }
            if(user.role !== role) return res.status(403).json({status:"error", payload:"No tiene los permisos"})
            req.user = user
            return res.status(200).json({ status: 'success', payload: req.user })
        })(req,res,next)
    }
}