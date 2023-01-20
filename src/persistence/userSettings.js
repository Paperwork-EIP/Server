const db = require('./db');
const sql = require('sql-template-strings');

module.exports = {
    async create(user_id) {
        try {
            const { rows } = await db.query(sql`
            INSERT INTO user_settings (user_id)
                VALUES (${user_id})
                RETURNING id, user_id;
            `);
            const [user_settings] = rows;
            return user_settings;          
        } catch (error) {
            console.error(error);
            throw error;
        }
    },
    async delete(user_id) {
        try {
            const { rows } = await db.query(sql`
            DELETE FROM user_settings where user_id=${user_id};`);
            return rows[0];         
        }
        catch (error) {
            console.error(error);
            throw error;
        }
    },
    async get(user_id) {
        const { rows } = await db.query(sql`
        SELECT * FROM user_settings WHERE user_id=${user_id} LIMIT 1;
        `);
        return rows[0];
    },
    async modifySettings(id, data, value) {
        try {
          if (value === undefined) {
            return;
          }
          if (data === "night_mode") {
            const { rows } = await db.query(sql`
            UPDATE user_settings SET night_mode=${value} where user_id=${id};`);
            return rows[0];
          }
        } catch (error) {
         throw error;
        }
    }
};