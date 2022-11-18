const db = require('./db');
const sql = require('sql-template-strings');
const UserProcess = require('./userProcess');

module.exports = {
    async create(step_id, is_done, user_process_id = '') {
        try {
            var currentTime = new Date();
            const step = await db.query(sql`SELECT * FROM step where id=${step_id} LIMIT 1;`);
            const process_id = step.rows[0].process_id;
            const delay = await db.query(sql`SELECT delay FROM process where id=${process_id} LIMIT 1;`);
            const expire_date = null;
            if (delay.rows[0].delay) {
                expire_date = currentTime + delay.rows[0].delay;
            }
            if (step.rows[0].is_unique == true) {
                is_done = false;
            }
            const { rows } = await db.query(sql`
            INSERT INTO user_step (step_id, is_done, start_date, expire_date, user_process_id)
                VALUES (${step_id}, ${is_done}, ${currentTime}, ${expire_date}, ${user_process_id})
                RETURNING id, user_process_id;
            `);
            const [userStep] = rows;
            return userStep;          
        } catch (error) {
            throw error;
        }
    },
    async delete(user_process_id) {
        try {
            const { rows } = await db.query(sql`
            DELETE * FROM user_step where user_process_id=${user_process_id};`);
            return rows;         
        } catch (error) {
            throw error;
        }
    }
}