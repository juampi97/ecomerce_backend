import { pool } from "../models/db.js";

export default async function getUsers(req, res) {
  try {
    const result = await pool.query("SELECT * from usuarios");
    res.status(200).json({ status: "success", payload: result[0] });
  } catch (error) {
    res.status(400).json({ status: "error", payload: error });
  }
}
