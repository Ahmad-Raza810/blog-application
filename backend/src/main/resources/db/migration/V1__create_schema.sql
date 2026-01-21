-- Categories
CREATE TABLE category
(
    id   BINARY(16) NOT NULL,
    name VARCHAR(255) NOT NULL,
    PRIMARY KEY (id),
    UNIQUE KEY uk_category_name (name)
);


-- User
CREATE TABLE user
(
    id         BINARY(16) NOT NULL,
    email      VARCHAR(150) NOT NULL UNIQUE,
    password   VARCHAR(255) NOT NULL,
    name       VARCHAR(100) NOT NULL,
    created_at DATETIME     NOT NULL,
    user_role  VARCHAR(50)  NOT NULL,
    PRIMARY KEY (id)
);


CREATE TABLE tag
(
    id   BINARY(16) NOT NULL,
    name VARCHAR(100) NOT NULL UNIQUE,
    PRIMARY KEY (id)
);


CREATE TABLE refresh_token
(
    id         BINARY(16) NOT NULL,
    token      VARCHAR(255) NOT NULL UNIQUE,
    exp_date   TIMESTAMP    NOT NULL,
    user_id    BINARY(16) NOT NULL UNIQUE,
    created_at DATETIME     NOT NULL,
    PRIMARY KEY (id),
    CONSTRAINT fk_refresh_user
        FOREIGN KEY (user_id) REFERENCES user (id)
            ON DELETE CASCADE
);



CREATE TABLE post
(
    id           BINARY(16) NOT NULL,
    title        VARCHAR(255) NOT NULL,
    content      TEXT         NOT NULL,
    reading_time INT          NOT NULL,
    author_id    BINARY(16) NOT NULL,
    post_status  VARCHAR(50),
    is_featured  BOOLEAN DEFAULT FALSE,
    is_trending  BOOLEAN DEFAULT FALSE,
    category_id  BINARY(16) NOT NULL,
    created_at   DATETIME     NOT NULL,
    updated_at   DATETIME     NOT NULL,
    PRIMARY KEY (id),

    CONSTRAINT fk_post_author
        FOREIGN KEY (author_id) REFERENCES user (id)
            ON DELETE CASCADE,

    CONSTRAINT fk_post_category
        FOREIGN KEY (category_id) REFERENCES category (id)
);


CREATE TABLE post_tag
(
    post_id BINARY(16) NOT NULL,
    tag_id  BINARY(16) NOT NULL,
    PRIMARY KEY (post_id, tag_id),

    CONSTRAINT fk_post_tag_post
        FOREIGN KEY (post_id) REFERENCES post (id)
            ON DELETE CASCADE,

    CONSTRAINT fk_post_tag_tag
        FOREIGN KEY (tag_id) REFERENCES tag (id)
            ON DELETE CASCADE
);


CREATE TABLE comments
(
    id         BINARY(16) NOT NULL,
    content    VARCHAR(1000) NOT NULL,
    post_id    BINARY(16) NOT NULL,
    user_id    BINARY(16) NOT NULL,
    created_at DATETIME      NOT NULL,
    PRIMARY KEY (id),

    CONSTRAINT fk_comment_post
        FOREIGN KEY (post_id) REFERENCES post (id)
            ON DELETE CASCADE,

    CONSTRAINT fk_comment_user
        FOREIGN KEY (user_id) REFERENCES user (id)
            ON DELETE CASCADE
);



