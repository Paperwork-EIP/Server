const db = require('../db');
const sql = require('sql-template-strings');

module.exports = {
    async create(delay, process_id = '', is_unique = false) {
        try {
            const { rows } = await db.query(sql`
            INSERT INTO step (is_unique, delay, process_id)
                VALUES (${is_unique}, ${delay}, ${process_id})
                RETURNING id;
            `);
            const [step] = rows;
            return step;          
        } catch (error) {
            console.error(error);
            throw error;
        }
    },
    async update(step_id, delay, is_unique) {
        try {
            const { rows } = await db.query(sql`
            UPDATE step SET delay=${delay}, is_unique=${is_unique}
            WHERE id=${step_id}
            RETURNING id;
            `);
            const [step] = rows;
            return step;
        } catch (error) {
            console.error(error);
            throw error;
        }
    },
    async deleteAll(process_id) {
        try {
            const { rows } = await db.query(sql`
            DELETE FROM step where process_id=${process_id};`);
            return rows[0];         
        } catch (error) {
            console.error(error);
            throw error;
        }
    },
    async getByProcess(process_id) {
        const { rows } = await db.query(sql`
        SELECT * FROM step WHERE process_id=${process_id} ORDER BY id;
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