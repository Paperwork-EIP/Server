const db = require('./db');
const sql = require('sql-template-strings');

module.exports = {
    async create(title, description, source = '', delay = null) {
        try {
            const { rows } = await db.query(sql`
            INSERT INTO process (title, description, source, delay)
                VALUES (${title}, ${description}, ${source}, ${delay})
                RETURNING id, title;
            `);
            const [process] = rows;
            return process;          
        } catch (error) {
            throw error;
        }
    },
    async delete(title) {
        try {
            const { rows } = await db.query(sql`
            DELETE FROM process where title=${title};`);
            return rows[0];         
        } catch (error) {
            throw error;
        }
    },
    async get(title) {
        const { rows } = await db.query(sql`
        SELECT * FROM process WHERE title=${title} LIMIT 1;
        `);
        return rows[0];
    },
    async getAll() {
        const { rows } = await db.query(sql`
        SELECT title, source FROM process;
        `);
        return rows;
    },
}