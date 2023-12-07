const db = require('../db');
const sql = require('sql-template-strings');

module.exports = {
    async create(title, description, content, user_id) {
        try {
            const current_date = new Date();
            const { rows } = await db.query(sql`
            INSERT INTO process_proposal (title, description, content, date, user_id, is_in_process)
                VALUES (${title}, ${description}, ${content}, ${current_date}, ${user_id}, false)
                RETURNING id, title;
            `);
            const [process_proposal] = rows;
            return process_proposal;
        } catch (error) {
            console.error(error);
            throw error;
        }
    },
    async getAll() {
        try {
            const { rows } = await db.query(sql`
            SELECT * FROM process_proposal ORDER BY id
            `);
            return rows;
        } catch (error) {
            console.error(error);
            throw error;
        }
    },
    async get(id) {
        try {
            const { rows } = await db.query(sql`
            SELECT * FROM process_proposal WHERE id=${id} LIMIT 1;
            `);
            return rows[0];
        } catch (error) {
            console.error(error);
            throw error;
        }
    },
    async delete(id) {
        try {
            const { rows } = await db.query(sql`
            DELETE FROM process_proposal where id=${id};`);
            return rows[0];
        } catch (error) {
            console.error(error);
            throw error;
        }
    },
}