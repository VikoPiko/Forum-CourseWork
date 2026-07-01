-- USERS
ALTER TABLE users ADD COLUMN updated_at TIMESTAMPTZ;

UPDATE users
SET updated_at = created_at
WHERE updated_at IS NULL;

ALTER TABLE users ALTER COLUMN updated_at SET NOT NULL;
ALTER TABLE users ALTER COLUMN role SET DEFAULT 'USER';

CREATE UNIQUE INDEX ux_users_username_lower
    ON users (LOWER(username));


-- POSTS
ALTER TABLE posts ADD COLUMN created_by_user_id BIGINT;
ALTER TABLE posts ADD COLUMN updated_at TIMESTAMPTZ;
ALTER TABLE posts ADD COLUMN view_count BIGINT NOT NULL DEFAULT 0;

UPDATE posts
SET created_by_user_id = (
    SELECT id
    FROM users
    WHERE username = 'admin'
    ORDER BY id
    LIMIT 1
),
    updated_at = created_at
WHERE created_by_user_id IS NULL;

ALTER TABLE posts ALTER COLUMN created_by_user_id SET NOT NULL;
ALTER TABLE posts ALTER COLUMN updated_at SET NOT NULL;

ALTER TABLE posts
    ADD CONSTRAINT fk_posts_created_by_user
        FOREIGN KEY (created_by_user_id)
            REFERENCES users (id);

CREATE INDEX idx_posts_created_by_user_id
    ON posts (created_by_user_id);

CREATE UNIQUE INDEX ux_posts_title_lower
    ON posts (LOWER(title));


-- REPLIES
ALTER TABLE replies ADD COLUMN created_by_user_id BIGINT;
ALTER TABLE replies ADD COLUMN updated_at TIMESTAMPTZ;

UPDATE replies
SET created_by_user_id = (
    SELECT id
    FROM users
    WHERE username = 'admin'
    ORDER BY id
    LIMIT 1
),
    updated_at = created_at
WHERE created_by_user_id IS NULL;

ALTER TABLE replies ALTER COLUMN created_by_user_id SET NOT NULL;
ALTER TABLE replies ALTER COLUMN updated_at SET NOT NULL;

ALTER TABLE replies
    ADD CONSTRAINT fk_replies_created_by_user
        FOREIGN KEY (created_by_user_id)
            REFERENCES users (id);

CREATE INDEX idx_replies_created_by_user_id
    ON replies (created_by_user_id);


-- POST CONTENT LIMIT
ALTER TABLE posts
    ALTER COLUMN content TYPE VARCHAR(1000)
        USING content::VARCHAR(1000);