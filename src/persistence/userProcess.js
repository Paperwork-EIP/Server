const db = require('./db');
const sql = require('sql-template-strings');

module.exports = {
    async create(user_id, process_id) {
        try {
            var currentDate = new Date();
            const { rows } = await db.query(sql`
            INSERT INTO user_process (is_done, start_process_date, user_id, process_id)
                VALUES (false, ${currentDate}, ${user_id}, ${process_id})
                RETURNING id, user_id, process_id;
            `);
            const [user_process] = rows;
            return user_process;          
        } catch (error) {
            throw error;
        }
    },
    async delete(user_id, process_id) {
        try {
            const { rows } = await db.query(sql`
            DELETE FROM user_process where user_id=${user_id} and process_id=${process_id};`);
            return rows[0];         
        } catch (error) {
            throw error;
        }
    },
    async get(user_id, process_id) {
        const { rows } = await db.query(sql`
        SELECT * FROM user_process WHERE user_id=${user_id} AND process_id=${process_id} LIMIT 1;
        `);
        return rows[0];
    },
    async getAll(user_id) {
        const { rows } = await db.query(sql`
        SELECT * FROM user_process WHERE user_id=${user_id};
        `);
        return rows;
    },
};