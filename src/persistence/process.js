const db = require('./db');
const sql = require('sql-template-strings');
const bcrypt = require('bcrypt');

module.exports = {
    async create(title, description, source = '') {
        try {
            const { rows } = await db.query(sql`
            INSERT INTO process (title, description, source)
                VALUES (${title}, ${description}, ${source})
                RETURNING id, title;
            `);
            const [process] = rows;
            return process;          
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
}