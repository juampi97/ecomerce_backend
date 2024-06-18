import { pool } from "../models/db.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export default async function login(req, res) {
  const { email, password } = req.body;
  if (email && password) {
    const result = await pool
      .query(`SELECT * from usuarios WHERE email = ?`, [email])
      .then((result) => {
        if (result[0].length > 0) {
          const isValid = bcrypt.compare(
            password,
            result[0][0].password,
            (err, isValid) => {
              if (isValid) {
                const data = {
                  nombre: result[0][0].nombre,
                  apellido: result[0][0].apellido,
                  email: result[0][0].email,
                  user: result[0][0].user,
                };
                const token = jwt.sign(data, process.env.JWT_KEY, {
                  expiresIn: "24h",
                });
                res
                  .status(200)
                  .json({
                    status: "success",
                    payload: token,
                  });
              } else {
                res
                  .status(200)
                  .json({
                    status: "success",
                    payload: "Usuario o password incorrectos",
                  });
              }
            }
          );
        } else {
          res
            .status(200)
            .json({
              status: "success",
              payload: "Usuario o password incorrectos",
            });
        }
      })
      .catch((result, err) => {
        res.status(400).json({ status: "error", payload: err });
      });
  }
}
