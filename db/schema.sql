DROP TABLE IF EXISTS books;

CREATE TABLE books (
  title TEXT,
  author TEXT,
  id VARCHAR(255) PRIMARY KEY,
  description TEXT,
  image_link TEXT
);
