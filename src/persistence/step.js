const db = require('./db');
const sql = require('sql-template-strings');
const bcrypt = require('bcrypt');

module.exports = {
    async create(title, type, description, question, source, expire_date, is_unique, delay, process_id = '') {
        try {
            const { rows } = await db.query(sql`
            INSERT INTO step (title, type, description, question, source, expire_date, is_unique, delay, process_id)
                VALUES (${title}, ${type}, ${description}, ${question}, ${source}, ${expire_date}, ${is_unique}, ${delay}, ${process_id})
                RETURNING id, title;
            `);
            const [step] = rows;
            return step;          
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
}