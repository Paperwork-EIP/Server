const db = require('./db');
const sql = require('sql-template-strings');
const bcrypt = require('bcryptjs');

module.exports = {
  async create(username, email, password = '') {
    try {
      const hashedPassword = await bcrypt.hash(password, 10);
      const { rows } = await db.query(sql`
      INSERT INTO user_table (username, email, password)
        VALUES (${username}, ${email}, ${hashedPassword})
        RETURNING id, email;
      `);
      const [user] = rows;
      return user;
    } catch (error) {
      if (error.constraint === 'users_email_key') {
        return null;
      }
      console.error(error);
      throw error;
    }
  },
  async find(email) {
    const { rows } = await db.query(sql`
    SELECT * FROM user_table WHERE email=${email} LIMIT 1;
    `);
    return rows[0];
  },
  async findUsername(username) {
    const { rows } = await db.query(sql`
    SELECT * FROM user_table WHERE username=${username} LIMIT 1;
    `);
    return rows[0];
  },
  async connect(email, password, callback) {
    const { rows } = await db.query(sql`
      SELECT * FROM user_table
      WHERE email = ${email}
      LIMIT 1
    `)
    if (rows.length == 0) {
      callback({ code: 'no email', user: { id: -1, email: '' } })
    } else {
      bcrypt.compare(password, rows[0].password, (err, result) => {
        if (result === true) {
          callback({ code: 'valid', user: { id: rows[0].id, email: rows[0].email } })
        } else {
          callback({ code: 'invalid', user: { id: -1, email: '' } })
        }
      })
    }
  },
  async delete(email) {
    try {
      const { rows } = await db.query(sql`
      DELETE FROM user_table where email=${email};`);
      return rows[0];
    } catch (error) {
      console.error(error);
      throw error;
    }
  },
  async modifyDatas(email, data, value) {
    try {
      if (value === undefined) {
        return;
      }
      if (data === "email") {
        const { rows } = await db.query(sql`
        UPDATE user_table SET email=${value} where email=${email};`);
        return rows[0];
      }
      if (data === "language") {
        const { rows } = await db.query(sql`
        UPDATE user_table SET language=${value} where email=${email};`);
        return rows[0];
      }
      if (data === "username") {
        const { rows } = await db.query(sql`
        UPDATE user_table SET username=${value} where email=${email};`);
        return rows[0];
      }
      if (data === "firstname") {
        const { rows } = await db.query(sql`
        UPDATE user_table SET firstname=${value} where email=${email};`);
        return rows[0];
      }
      if (data === "name") {
        const { rows } = await db.query(sql`
        UPDATE user_table SET name=${value} where email=${email};`);
        return rows[0];
      }
      if (data === "age") {
        const { rows } = await db.query(sql`
        UPDATE user_table SET age=${value} where email=${email};`);
        return rows[0];
      }
      if (data === "adress") {
        const { rows } = await db.query(sql`
        UPDATE user_table SET adress=${value} where email=${email};`);
        return rows[0];
      }
      if (data === "number_phone") {
        const { rows } = await db.query(sql`
        UPDATE user_table SET number_phone=${value} where email=${email};`);
        return rows[0];
      }
      if (data === "profile_picture") {
        const { rows } = await db.query(sql`
        UPDATE user_table SET profile_picture=${value} where email=${email};`);
        return rows[0];
      }
      if (data === "password") {
        const hashedPassword = await bcrypt.hash(value, 10);
        const { rows } = await db.query(sql`
        UPDATE user_table SET password=${hashedPassword} where email=${email};`);
        return rows[0];
      }
    } catch (error) {
     throw error;
    }
  }
};