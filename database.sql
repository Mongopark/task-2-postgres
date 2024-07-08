CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS Users(
  userId uuid PRIMARY KEY DEFAULT uuid_generate_v4() UNIQUE,
  firstName TEXT NOT NULL,
  lastName TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  password TEXT NOT NULL,
  phone TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS Organisations(
  orgId uuid PRIMARY KEY DEFAULT uuid_generate_v4() UNIQUE,
  name TEXT NOT NULL,
  description TEXT,
  createdBy uuid REFERENCES Users(userId) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS User_Organisations(
  userId uuid REFERENCES Users(userId) ON DELETE CASCADE,
  orgId uuid REFERENCES Organisations(orgId) ON DELETE CASCADE,
  PRIMARY KEY (userId, orgId)
);

INSERT INTO Users (firstName, lastName, email, password, phone) 
VALUES ('Brad', 'Stephan', 'brad@email.com', 'brad', '07053007777');
