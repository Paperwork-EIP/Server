const db = require('./db');
const sql = require('sql-template-strings');
const User = require('./users');
const Process = require('./process');
const UserStep = require('./userSteps');

module.exports = {
    async create(process_title, user_email = '') {
        try {
            var currentTime = new Date();
            const user = await User.find(user_email);
            const process = await Process.get(process_title);
            const { rows } = await db.query(sql`
            INSERT INTO user_process (is_done, start_process_date, user_id, process_id)
                VALUES (false, ${currentTime}, ${user.id}, ${process.id})
                RETURNING id;
            `);
            const [userProcess] = rows;
            return userProcess;          
        } catch (error) {
            throw error;
        }
    },
    async delete(title) {
        try {
            const { rows } = await db.query(sql`
            SELECT id FROM process WHERE title=${title} LIMIT 1;
            `);
            UserStep.delete(rows[0]);
            const { res } = await db.query(sql`
            DELETE FROM user_process where process_id=${rows[0]};`);
            return res[0];
        } catch (error) {
            throw error;
        }
    },
    async getUserSteps(title, user_email) {
        const process = await Process.get(title);
        const user = await User.find(user_email);
        const user_process = await db.query(sql`
        SELECT * FROM user_process WHERE process_id=${process.id} AND user_id=${user.id} LIMIT 1;
        `);
        const { rows } = await db.query(sql`
        SELECT * FROM user_step WHERE user_process_id=${user_process.rows[0].id};
        `);
        return rows;
    },
}