const db = require('./db');
const sql = require('sql-template-strings');

module.exports = {
    async create(title, type, description, question, source, delay, process_id = '', is_unique = false) {
        try {
            const { rows } = await db.query(sql`
            INSERT INTO step (title, type, description, question, source, is_unique, delay, process_id)
                VALUES (${title}, ${type}, ${description}, ${question}, ${source}, ${is_unique}, ${delay}, ${process_id})
                RETURNING id, title;
            `);
            const [step] = rows;
            return step;          
        } catch (error) {
            throw error;
        }
    },
    async deleteAll(process_id) {
        try {
            const { rows } = await db.query(sql`
            DELETE FROM step where process_id=${process_id};`);
            return rows[0];         
        } catch (error) {
            throw error;
        }
    },
    async getByProcess(process_id) {
        const { rows } = await db.query(sql`
        SELECT * FROM step WHERE process_id=${process_id};
        `);
        return rows;
    },
    async getById(step_id) {
        const { rows } = await db.query(sql`
        SELECT * FROM step WHERE id=${step_id} LIMIT 1;
        `);
        return rows[0];
    },
}