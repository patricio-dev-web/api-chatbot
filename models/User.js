// models/User.js
const connection = require('../db/connection');

class User {
  static async findByUsername(username) {
    const [rows] = await connection.execute('SELECT * FROM user WHERE username = ?', [username]);
    return rows[0];
  }

  static async findByEmail(email) {
    const [rows] = await connection.execute('SELECT * FROM user WHERE email = ?', [email]);
    return rows[0];
  }

  static async create(username, passwordHash, email) {
    await connection.execute('INSERT INTO user (username, password, email) VALUES (?, ?, ?)', [username, passwordHash, email]);
  }
  static async getAllUsers() {
    const [rows] = await connection.execute('SELECT * FROM user');
    return rows;
  }
  
}

module.exports = User;
