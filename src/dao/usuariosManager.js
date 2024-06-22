import { pool } from "../config/db.js";
import { createHash, isValidPassword } from "../utils.js";
class UserManager {
  #path;
  #dbName;
  constructor() {
    this.#dbName = "usuarios";
  }

  getUsers = async () => {
    const result = await pool.query(`SELECT * from ${this.#dbName}`);
    return result[0];
  };

  getUserByEmail = async (email) => {
    const result = await pool.query(`SELECT * from ${this.#dbName} WHERE email = ?`, [email])
    return result[0][0]
  }

  getUserById = async (id) => {
    const result = await pool.query(`SELECT * from ${this.#dbName} WHERE _id = ?`, [id])
    return result[0][0]
  }

  userExists = async (email, user) => {
    const result = await pool.query(
      `SELECT * from ${this.#dbName} WHERE email = ? OR user = ?`,
      [email, user]
    );
    if (result[0].length > 0) return true;
    else return false;
  };

  createUser = async (nombre, apellido, email, user, password) => {
    try {
      const result = pool.query(
        `INSERT INTO ${this.#dbName} (nombre, apellido, email, user, password) VALUES (?,?,?,?,?)`,
        [nombre, apellido, email, user, createHash(password)]
      );
      if (result[0].affectedRows > 0) return true;
      else return false;
    } catch (error) {
      return false;
    }
  };

}

const manager = new UserManager();

export { manager, UserManager };
