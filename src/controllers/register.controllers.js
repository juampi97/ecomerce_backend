import { pool } from "../models/db.js";
import bcrypt from "bcrypt";

export default async function register(req, res) {
  const { nombre, apellido, email, user, password } = req.body;

  if (nombre && apellido && email && user && password) {
    const resultCheckMail = await pool
      .query(`SELECT * from usuarios WHERE email = ? OR user = ?`, [email, user])
      .then((resultCheck) => {
        if (resultCheck[0] == 0) {

          const hash = bcrypt.hash(password, 13, (err, hash) => {
            const result = pool
              .query(
                `INSERT INTO usuarios (nombre, apellido, email, user, password) VALUES (?,?,?,?,?)`,
                [nombre, apellido, email, user, hash]
              )
              .then((result) => {
                if (result[0].affectedRows > 0) {
                  res
                    .status(201)
                    .json({ status: "success", payload: result[0] });
                } else {
                  res
                    .status(200)
                    .json({
                      status: "success",
                      payload: "Usuario no agregado",
                    });
                }
              });
          });
        } else {
          res
          .status(200)
          .json({
            status: "success",
            payload: "El mail o el usuario ya esta registrado",
          });
        }
      })
      .catch((res, err) => {
        res.status(400).json({ status: "error", payload: err });
      });
  }
}
