const db = require('./db');
const sql = require('sql-template-strings');
const Process = require('./process');

module.exports = {
    async create(user_id, process_id, process_title) {
        try {
            const currentDate = new Date();
            const { rows } = await db.query(sql`
            INSERT INTO user_process (is_done, start_process_date, user_id, process_id, process_title)
                VALUES (false, ${currentDate}, ${user_id}, ${process_id}, ${process_title})
                RETURNING id, user_id, process_id;
            `);
            const [user_process] = rows;
            return user_process;
        } catch (error) {
            console.error(error);
            throw error;
        }
    },
    async update(user_process_id, process_id) {
        try {
            const process = await Process.getById(process_id);
            if (process) {
                const currentDate = new Date();
                let expire_date = null;
                const invalidDate = process.delay.split("-");
                const year = parseInt(invalidDate[0]);
                const month = parseInt(invalidDate[1]);
                const day = parseInt(invalidDate[2]);
                if (process.delay != null) {
                    expire_date = currentDate;
                    expire_date.setFullYear(expire_date.getFullYear() + year);
                    expire_date.setMonth(expire_date.getMonth() + month);
                    expire_date.setDate(expire_date.getDate() + day);
                }
                const is_done = true;
                const { rows } = await db.query(sql`
            UPDATE user_process SET is_done=${is_done}, expire_date=${expire_date}, end_process_date=${currentDate}
                WHERE id=${user_process_id} RETURNING id, user_id, process_id;
            `);
                const [user_process] = rows;
                return user_process;
            }
            return null;
        } catch (error) {
            console.error(error);
            throw error;
        }
    },
    async delete(user_id, process_id) {
        try {
            const { rows } = await db.query(sql`
            DELETE FROM user_process where user_id=${user_id} and process_id=${process_id};`);
            return rows[0];
        } catch (error) {
            console.error(error);
            throw error;
        }
    },
    async get(user_id, process_id) {
        const { rows } = await db.query(sql`
        SELECT * FROM user_process WHERE user_id=${user_id} AND process_id=${process_id} LIMIT 1;
        `);
        return rows[0];
    },
    async getById(user_process_id) {
        const { rows } = await db.query(sql`
        SELECT * FROM user_process WHERE id=${user_process_id} LIMIT 1;
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
