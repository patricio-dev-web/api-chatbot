CREATE TABLE `user` (
  `id` integer UNIQUE PRIMARY KEY NOT NULL AUTO_INCREMENT,
  `username` varchar(255),
  `pasword` varchar(255),
  `email` varchar(255),
  `role` varchar(255)
);

CREATE TABLE `challenge` (
  `id` integer UNIQUE PRIMARY KEY NOT NULL AUTO_INCREMENT,
  `category_id` int,
  `title` text,
  `description` text,
  `active` bool COMMENT 'indica si el desafió está activo o no'
);

CREATE TABLE `category` (
  `id` integer UNIQUE PRIMARY KEY NOT NULL AUTO_INCREMENT,
  `name` varchar(255),
  `description` text
);

CREATE TABLE `query` (
  `id` integer UNIQUE PRIMARY KEY NOT NULL AUTO_INCREMENT,
  `user_id` integer,
  `challenge_id` integer,
  `content` text
);

CREATE TABLE `query_result` (
  `id` integer UNIQUE PRIMARY KEY NOT NULL AUTO_INCREMENT,
  `query_id` integer,
  `content` text
);

CREATE TABLE `query_type` (
  `id` integer UNIQUE PRIMARY KEY NOT NULL AUTO_INCREMENT,
  `query_id` integer,
  `name` varchar(255),
  `description` text
);

 ALTER TABLE user CHANGE COLUMN pasword password VARCHAR(255);
 
ALTER TABLE `challenge` ADD FOREIGN KEY (`category_id`) REFERENCES `category` (`id`);

ALTER TABLE `query` ADD FOREIGN KEY (`user_id`) REFERENCES `user` (`id`);

ALTER TABLE `query` ADD FOREIGN KEY (`challenge_id`) REFERENCES `challenge` (`id`);

ALTER TABLE `query_result` ADD FOREIGN KEY (`query_id`) REFERENCES `query` (`id`);

ALTER TABLE `query_type` ADD FOREIGN KEY (`query_id`) REFERENCES `query` (`id`);


ALTER TABLE query ADD COLUMN date DATETIME DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE query_result ADD COLUMN date DATETIME DEFAULT CURRENT_TIMESTAMP;

ALTER TABLE query MODIFY COLUMN user_id INTEGER NOT NULL;
ALTER TABLE query_result MODIFY COLUMN query_id INTEGER NOT NULL;


-- Consulta para agrupar las query
SELECT 
    q.id AS query_id,
    q.content AS prompt,
    u.id AS user_id,
    u.username AS user_name,
    qr.id AS query_result_id,
    qr.content AS response
FROM 
    query q
JOIN 
    user u ON q.user_id = u.id
JOIN 
    query_result qr ON qr.query_id = q.id;
