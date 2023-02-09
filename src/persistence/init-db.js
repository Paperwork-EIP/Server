const db = require('./db')
const sql = require('sql-template-strings')

module.exports = {
    async initAll() {
        try {
            await db.query(sql`CREATE TABLE IF NOT EXISTS user_table (
                id SERIAL UNIQUE NOT NULL,
                username text UNIQUE NOT NULL,
                email text UNIQUE NOT NULL,
                password text NOT NULL,
                language text NULL,
                name text NULL,
                firstname text NULL,
                adress text NULL,
                profile_picture text NULL,
                age int NULL,
                number_phone int NULL,
                google_token text NULL,
                facebook_token text NULL);`)
            await db.query(sql`CREATE TABLE IF NOT EXISTS role (
                id SERIAL UNIQUE NOT NULL,
                access_forum int NOT NULL,
                access_posts_and_comments int NOT NULL,
                access_feature_idea_submit int NOT NULL,
                is_moderator int NOT NULL,
                is_admin int NOT NULL,
                user_id int NOT NULL);`)
            await db.query(sql`CREATE TABLE IF NOT EXISTS user_process (
                id SERIAL UNIQUE NOT NULL,
                is_done bool NOT NULL,
                start_process_date date NOT NULL,
                end_process_date date NULL,
                expire_date date NULL,
                user_id int NOT NULL,
                process_id int NOT NULL,
                process_title text NOT NULL);`)
            await db.query(sql`CREATE TABLE IF NOT EXISTS step (
                id SERIAL UNIQUE NOT NULL,
                title text NOT NULL,
                type text NOT NULL,
                description text NOT NULL,
                question text NOT NULL,
                source text NULL,
                is_unique bool NOT NULL,
                delay text NULL,
                process_id int NOT NULL);`)
            await db.query(sql`CREATE TABLE IF NOT EXISTS user_step (
                id SERIAL UNIQUE NOT NULL,
                step_id int NOT NULL,
                step_title text NOT NULL,
                step_type text NOT NULL,
                step_description text NOT NULL,
                step_source text NULL,
                is_done bool NOT NULL,
                start_date date NOT NULL,
                end_date date NULL,
                delay date NULL,
                appoinment timestamp NULL,
                user_process_id int NULL);`)
            await db.query(sql`CREATE TABLE IF NOT EXISTS report (
                id SERIAL UNIQUE NOT NULL,
                description text NOT NULL,
                post_id int NOT NULL,
                com_id int NOT NULL,
                reported_user_id int NOT NULL);`)
            await   db.query(sql`CREATE TABLE IF NOT EXISTS process_proposal (
                id SERIAL UNIQUE NOT NULL,
                title text NOT NULL,
                description text NOT NULL,
                content text NOT NULL,
                date date NOT NULL,
                user_id int NOT NULL,
                is_in_process bool NOT NULL);`)
            await db.query(sql`CREATE TABLE IF NOT EXISTS process (
                id SERIAL UNIQUE NOT NULL,
                title text UNIQUE NOT NULL,
                description text NOT NULL,
                source text NULL,
                delay text NULL);`)
            await db.query(sql`CREATE TABLE IF NOT EXISTS posts (
                id SERIAL UNIQUE NOT NULL,
                title text NOT NULL,
                description text NOT NULL,
                date date NOT NULL,
                upvote int NOT NULL,
                downvote int NOT NULL,
                is_open int NOT NULL,
                is_display int NOT NULL,
                user_id int NOT NULL,
                process_id int NOT NULL);`)
            await db.query(sql`CREATE TABLE IF NOT EXISTS coms (
                id SERIAL UNIQUE NOT NULL,
                content text NOT NULL,
                date date NOT NULL,
                upvote int NOT NULL,
                downvote int NOT NULL,
                is_display int NOT NULL,
                post_id int NOT NULL,
                user_id int NOT NULL);`)
            await db.query(sql`CREATE TABLE IF NOT EXISTS user_settings (
                id SERIAL UNIQUE NOT NULL,
                user_id int UNIQUE NOT NULL,
                night_mode boolean
              );`)
        } catch(error) {
            console.log(error);
        }
    }
}
