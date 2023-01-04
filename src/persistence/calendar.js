const db = require('./db');
const sql = require('sql-template-strings');
const moment = require('moment');

module.exports = {
    async set(date, user_process_id, step_id) {
        try {
            let convertedDate = null;
            if (date != null) {
                convertedDate = moment(date, "YYYY-MM-DD HH:mm:ss").toDate();
            }
            const { rows } = await db.query(sql`
            UPDATE user_step SET appoinment=${convertedDate} WHERE user_process_id=${user_process_id} AND step_id=${step_id} RETURNING id, appoinment
            `);
            return rows[0];
        } catch (error) {
            console.log(error);
            throw error;
        }
    }
}