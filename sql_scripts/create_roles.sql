CREATE TABLE roles(
  name VARCHAR(16) UNIQUE NOT NULL,
  description TEXT,
  secretCode int(11)
  PRIMARY KEY (name)
);