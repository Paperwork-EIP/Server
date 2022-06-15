const db = require('./paperwork')

module.exports = {
    initAll() {
        db.query(sql`CREATE TABLE IF NOT EXISTS user_table (
          id SERIAL NOT NULL,
          username text NOT NULL,
          email text NOT NULL,
          password text NOT NULL,
          language text NOT NULL,
          name text NOT NULL,
          firstname text NOT NULL,
          adress text NOT NULL,
          profile_picture text NOT NULL,
          age int NOT NULL,
          number_phone int NOT NULL,
          google_token text NULL,
          facebook_token text NULL`)
        db.query(sql`CREATE TABLE IF NOT EXISTS role (
            id SERIAL NOT NULL,
            access_forum int NOT NULL,
            access_posts_and_comments int NOT NULL,
            access_feature_idea_submit int NOT NULL,
            is_moderator int NOT NULL,
            is_moderator int NOT NULL,
            is_admin int NOT NULL,
            user_id int NOT NULL`)
        db.query(sql`CREATE TABLE IF NOT EXISTS user_process (
            id SERIAL NOT NULL,
            is_done int NOT NULL,
            start_process_date date NOT NULL,
            end_process_date date NOT NULL,
            user_id int NOT NULL,
            process_id int NOT NULL`)
        db.query(sql`CREATE TABLE IF NOT EXISTS step (
            id SERIAL NOT NULL,
            title text NOT NULL,
            is_done int NOT NULL,
            type text NOT NULL,
            description text NOT NULL,
            source text NOT NULL,
            expire_date date NOT NULL,
            is_unique int NOT NULL,
            delay date NOT NULL,
            process_id int NOT NULL,
            user_process_id int NOT NULL`)
        db.query(sql`CREATE TABLE IF NOT EXISTS report (
            id SERIAL NOT NULL,
            description text NOT NULL,
            post_id int NOT NULL,
            com_id int NOT NULL,
            reported_user_id int NOT NULL`)
        db.query(sql`CREATE TABLE IF NOT EXISTS proposed_feature (
            id SERIAL NOT NULL,
            title text NOT NULL,
            description text NOT NULL,
            date date NOT NULL,
            user_id int NOT,
            is_in_process int NOT`)
        db.query(sql`CREATE TABLE IF NOT EXISTS process (
            id SERIAL NOT NULL,
            title text NOT NULL,
            description text NOT NULL,
            source text NOT NULL`)
        db.query(sql`CREATE TABLE IF NOT EXISTS posts (
            id SERIAL NOT NULL,
            title text NOT NULL,
            description text NOT NULL,
            date date NOT NULL,
            upvote int NOT NULL,
            downvote int NOT NULL,
            is_open int NOT NULL,
            is_display int NOT NULL,
            user_id int NOT NULL,
            process_id int NOT NULL`)
        db.query(sql`CREATE TABLE IF NOT EXISTS posts (
            id SERIAL NOT NULL,
            content text NOT NULL,
            date date NOT NULL,
            upvote int NOT NULL,
            downvote int NOT NULL,
            is_display int NOT NULL,
            post_id int NOT NULL,
            user_id int NOT NULL`)
    }
}