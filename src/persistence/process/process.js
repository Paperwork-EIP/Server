const db = require('../db');
const sql = require('sql-template-strings');

module.exports = {
    async create(title, description, source = '', delay = null) {
        try {
            const { rows } = await db.query(sql`
            INSERT INTO process (title, delay)
                VALUES (${title}, ${delay})
                RETURNING id, title;
            `);
            const [process] = rows;
            return process;          
        } catch (error) {
            console.error(error);
            throw error;
        }
    },
    async update(id, delay = null) {
        try {
            const { rows } = await db.query(sql`
            UPDATE process SET delay=${delay} WHERE id=${id}
            RETURNING id, title;
            `);
            const [process] = rows;
            return process;
        } catch (error) {
            console.error(error);
            throw error;
        }
    },
    async delete(id) {
        try {
            const { rows } = await db.query(sql`
            DELETE FROM process where id=${id};`);
            return rows[0];         
        } catch (error) {
            console.error(error);
            throw error;
        }
    },
    async get(title) {
        const { rows } = await db.query(sql`
        SELECT * FROM process WHERE title=${title} LIMIT 1;
        `);
        return rows[0];
    },
    async getById(id) {
        const { rows } = await db.query(sql`
        SELECT * FROM process WHERE id=${id} LIMIT 1;
        `);
        return rows[0];
    },
    async getAll() {
        const { rows } = await db.query(sql`
        SELECT title FROM process ORDER BY id;
        `);
        return rows;
    },
}