const db = require('./db')
const sql = require('sql-template-strings')

module.exports = {
    initAll() {
        db.query(sql`CREATE TABLE IF NOT EXISTS user_table (
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
        db.query(sql`CREATE TABLE IF NOT EXISTS role (
            id SERIAL UNIQUE NOT NULL,
            access_forum int NOT NULL,
            access_posts_and_comments int NOT NULL,
            access_feature_idea_submit int NOT NULL,
            is_moderator int NOT NULL,
            is_admin int NOT NULL,
            user_id int NOT NULL);`)
        db.query(sql`CREATE TABLE IF NOT EXISTS user_process (
            id SERIAL UNIQUE NOT NULL,
            is_done bool NOT NULL,
            start_process_date date NOT NULL,
            end_process_date date NULL,
            expire_date date NULL,
            user_id int NOT NULL,
            process_id int UNIQUE NOT NULL);`)
        db.query(sql`CREATE TABLE IF NOT EXISTS step (
            id SERIAL UNIQUE NOT NULL,
            title text NOT NULL,
            type text NOT NULL,
            description text NOT NULL,
            question text NOT NULL,
            source text NULL,
            is_unique bool NOT NULL,
            delay int NULL,
            process_id int NOT NULL);`)
        db.query(sql`CREATE TABLE IF NOT EXISTS user_step (
            id SERIAL UNIQUE NOT NULL,
            step_id int NOT NULL,
            is_done bool NOT NULL,
            start_date date NOT NULL,
            expire_date date NULL,
            appoinment date NULL,
            user_process_id int NULL);`)
        db.query(sql`CREATE TABLE IF NOT EXISTS report (
            id SERIAL UNIQUE NOT NULL,
            description text NOT NULL,
            post_id int NOT NULL,
            com_id int NOT NULL,
            reported_user_id int NOT NULL);`)
        db.query(sql`CREATE TABLE IF NOT EXISTS proposed_feature (
            id SERIAL UNIQUE NOT NULL,
            title text NOT NULL,
            description text NOT NULL,
            date date NOT NULL,
            user_id int NOT NULL,
            is_in_process int NOT NULL);`)
        db.query(sql`CREATE TABLE IF NOT EXISTS process (
            id SERIAL UNIQUE NOT NULL,
            title text UNIQUE NOT NULL,
            description text NOT NULL,
            source text NULL,
            delay date NULL);`)
        db.query(sql`CREATE TABLE IF NOT EXISTS posts (
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
        db.query(sql`CREATE TABLE IF NOT EXISTS coms (
            id SERIAL UNIQUE NOT NULL,
            content text NOT NULL,
            date date NOT NULL,
            upvote int NOT NULL,
            downvote int NOT NULL,
            is_display int NOT NULL,
            post_id int NOT NULL,
            user_id int NOT NULL);`)
    }
}
