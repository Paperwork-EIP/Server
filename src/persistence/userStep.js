const db = require('./db');
const sql = require('sql-template-strings');
const Step = require('./step');

module.exports = {
    async create(user_process_id, step_id, is_done) {
        try {
            const currentDate = new Date();
            let delay = null;
            const step = await Step.getById(step_id);
            if (step) {
                if (step.delay != null) {
                    const invalidDate = step.delay.split("-");
                    const year = parseInt(invalidDate[0]);
                    const month = parseInt(invalidDate[1]);
                    const day = parseInt(invalidDate[2]);
                    delay = currentDate;
                    delay.setFullYear(delay.getFullYear() + year);
                    delay.setMonth(delay.getMonth() + month);
                    delay.setDate(delay.getDate() + day);
                }
                const { rows } = await db.query(sql`
                INSERT INTO user_step (user_process_id, step_id, step_title, step_type, step_description, step_source, is_done, start_date, delay)
                    VALUES (${user_process_id}, ${step_id}, ${step.title}, ${step.type}, ${step.description}, ${step.source}, ${is_done}, ${currentDate}, ${delay})
                    RETURNING id, step_id;
                `);
                const [user_step] = rows;
                return user_step;
            }
            return null;
        } catch (error) {
            console.error(error);
            throw error;
        }
    },
    async update(user_process_id, step_id, is_done) {
        try {
            const { rows } = await db.query(sql`
            UPDATE user_step SET is_done=${is_done} WHERE user_process_id=${user_process_id} AND step_id=${step_id} RETURNING id, is_done;
            `);
            const [user_step] = rows;
            return user_step;
        } catch (error) {
            console.error(error);
            throw error;
        }
    },
    async deleteAll(user_process_id) {
        try {
            const { rows } = await db.query(sql`
            DELETE FROM user_step where user_process_id=${user_process_id};`);
            return rows[0];
        } catch (error) {
            console.error(error);
            throw error;
        }
    },
    async getById(user_step_id) {
        const { rows } = await db.query(sql`
        SELECT * FROM user_step WHERE id=${user_step_id} LIMIT 1;
        `);
        return rows[0];
    },
    async getByStepId(user_process_id, step_id) {
        const { rows } = await db.query(sql`
        SELECT * FROM user_step WHERE user_process_id=${user_process_id} AND step_id=${step_id} LIMIT 1;
        `);
        return rows[0];
    },
    async getAll(user_process_id) {
        const { rows } = await db.query(sql`
        SELECT * FROM user_step WHERE user_process_id=${user_process_id};
        `);
        return rows;
    },
    async getAllAppoinment(user_process_id) {
        const { rows } = await db.query(sql`
        SELECT * FROM user_step WHERE user_process_id=${user_process_id} AND appoinment IS NOT NULL;
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