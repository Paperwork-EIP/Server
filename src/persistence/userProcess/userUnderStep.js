const db = require('../db');
const sql = require('sql-template-strings');

module.exports = {
    async add(user_process_id, step_id, is_done) {
        try {
            const { rows } = await db.query(sql`
            INSERT INTO user_under_step (user_process_id, step_id, is_done)
                VALUES (${user_process_id}, ${step_id}, ${is_done})
                RETURNING id, step_id;
            `);
            const [user_under_step] = rows;
            return user_under_step;
        } catch (error) {
            console.error(error);
            throw error;
        }
    },
    async update(user_process_id, step_id, id, is_done) {
        try {
            const { rows } = await db.query(sql`
            UPDATE user_under_step SET is_done=${is_done} WHERE user_process_id=${user_process_id} AND step_id=${step_id} AND id=${id} RETURNING id, is_done;
            `);
            const [user_under_step] = rows;
            return user_under_step;
        } catch (error) {
            console.error(error);
            throw error;
        }
    },
    async deleteAll(user_process_id) {
        try {
            const { rows } = await db.query(sql`
            DELETE FROM user_under_step where user_process_id=${user_process_id};`);
            return rows[0];
        } catch (error) {
            console.error(error);
            throw error;
        }
    },
    async getAllByStepId(user_process_id, step_id) {
        const { rows } = await db.query(sql`
        SELECT * FROM user_under_step WHERE user_process_id=${user_process_id} AND step_id=${step_id} ORDER BY id;
        `);
        return rows;
    },
    async getAllNotDoneByStepId(user_process_id, step_id) {
        const { rows } = await db.query(sql`
        SELECT * FROM user_under_step WHERE user_process_id=${user_process_id} AND step_id=${step_id} AND is_done=false ORDER BY id;
        `);
        return rows;
    }
};