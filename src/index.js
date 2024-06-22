import express from "express";
import cors from "cors";
import {} from "dotenv/config";
import bodyParser from "body-parser";
import MongoStore from 'connect-mongo'
import cookieParser from "cookie-parser"
import session from "express-session";

import authRouter from './router/auth.router.js'

import passport from "passport";
import initializePassport from "./config/passport.config.js";

const port = process.env.PORT || 3000;

const app = express();
app.use(cors());
app.use(express.json());
app.use(cookieParser())
app.use(bodyParser.urlencoded({ extended: true })); 

app.use(session({
  store: MongoStore.create({
    mongoUrl: `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASS}@clustersession.r444kwo.mongodb.net/`,
    mongoOptions: {useNewUrlParser: true, useUnifiedTopology: true},
    ttl: 15,
  }),
  secret: process.env.MONGO_SECRET,
  resave: false,
  saveUninitialized: false
}))

initializePassport()
app.use(passport.initialize())
app.use(passport.session())

app.use("/api/auth", authRouter);

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});