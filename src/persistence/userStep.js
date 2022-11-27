const db = require('./db');
const sql = require('sql-template-strings');
const Step = require('./step');

module.exports = {
    async create(user_process_id, step_id, is_done) {
        try {
            var currentDate = new Date();
            var delay = null;
            step = await Step.getById(step_id);
            const invalidDate = step.delay.split("-");
            const year = parseInt(invalidDate[0]);
            const month = parseInt(invalidDate[1]);
            const day = parseInt(invalidDate[2]);
            if (step.delay != null) {
                delay = currentDate;
                delay.setFullYear(delay.getFullYear() + year);
                delay.setMonth(delay.getMonth() + month);
                delay.setDate(delay.getDate() + day);
            }
            const { rows } = await db.query(sql`
            INSERT INTO user_step (user_process_id, step_id, is_done, start_date, delay)
                VALUES (${user_process_id}, ${step_id}, ${is_done}, ${currentDate}, ${delay})
                RETURNING id, step_id;
            `);
            const [user_step] = rows;
            return user_step;          
        } catch (error) {
            throw error;
        }
    },
    async deleteAll(user_process_id) {
        try {
            const { rows } = await db.query(sql`
            DELETE FROM user_step where user_process_id=${user_process_id};`);
            return rows[0];   
        } catch (error) {
            throw error;
        }
    },
    async getAll(user_process_id) {
        const { rows } = await db.query(sql`
        SELECT * FROM user_step WHERE user_process_id=${user_process_id};
        `);
        return rows;
    },
    async getNotDone(user_process_id) {
        const { rows } = await db.query(sql`
        SELECT * FROM user_step WHERE user_process_id=${user_process_id} AND is_done=false;
        `);
        return rows;
    }
};