ALTER TABLE replies
DROP
CONSTRAINT replies_post_id_fkey;

ALTER TABLE posts
    ADD created_by_user_id BIGINT;

ALTER TABLE posts
    ADD updated_at TIMESTAMP WITHOUT TIME ZONE;

ALTER TABLE posts
    ADD view_count BIGINT;

ALTER TABLE posts
    ALTER COLUMN created_by_user_id SET NOT NULL;

ALTER TABLE replies
    ADD created_by_user_id BIGINT;

ALTER TABLE replies
    ADD updated_at TIMESTAMP WITHOUT TIME ZONE;

ALTER TABLE replies
    ALTER COLUMN created_by_user_id SET NOT NULL;

ALTER TABLE posts
    ALTER COLUMN updated_at SET NOT NULL;

ALTER TABLE replies
    ALTER COLUMN updated_at SET NOT NULL;

ALTER TABLE posts
    ALTER COLUMN view_count SET NOT NULL;

ALTER TABLE posts
    ADD CONSTRAINT FK_POSTS_ON_CREATED_BY_USER FOREIGN KEY (created_by_user_id) REFERENCES users (id);

ALTER TABLE replies
    ADD CONSTRAINT FK_REPLIES_ON_CREATED_BY_USER FOREIGN KEY (created_by_user_id) REFERENCES users (id);

ALTER TABLE posts
ALTER
COLUMN content TYPE VARCHAR(1000) USING (content::VARCHAR(1000));