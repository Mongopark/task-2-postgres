CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE DATABASE stagetwo;

CREATE TABLE Users(
  userId uuid PRIMARY KEY DEFAULT uuid_generate_v4() UNIQUE,
  firstName TEXT NOT NULL,
  lastName TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  password TEXT NOT NULL,
  phone TEXT NOT NULL
);

SELECT * FROM users;

INSERT INTO users (firstName,email,user_password,phone) VALUES ('Brad','stephan','brad@email.com','brad','07053007777');


--psql -U postgres
--\c stagetwo
--\dt
--heroku pg:psql