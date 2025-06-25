CREATE EXTENSION "pgcrypto";
CREATE EXTENSION "uuid-ossp";

CREATE DATABASE timewaitfornoonedb;

-- USE andre;
\c timewaitfornoonedb;


-- ! find a way to salt with a var
-- DECLARE "SALT" CONSTANT CHAR NOT NULL DEFAULT 'monGrainDeCummin';

-- ! find a way to store liked wallpaper in user profile

CREATE TABLE "users" (
    "id" uuid DEFAULT gen_random_uuid(),
    "firstname" VARCHAR(100) NOT NULL,
    "lastname" VARCHAR(100) NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "passhash" CHAR(64) NOT NULL,
    PRIMARY KEY ("id")
);

CREATE TABLE "tokens" (
    "token" uuid DEFAULT gen_random_uuid(),
    "expires" TIMESTAMP DEFAULT (Now() + INTERVAL '30 days'),
    "userid" uuid NOT NULL REFERENCES "users"("id"),
    PRIMARY KEY ("token")
);
CREATE TABLE "tasks" (
    "id" uuid DEFAULT gen_random_uuid(),
    "content" TEXT NOT NULL,
    "created" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    "deadline"TIMESTAMP DEFAULT (Now() + INTERVAL '1 days') NULL,
    "isdone" CHAR(1) DEFAULT 0,
    "assignee" uuid NULL,
    "userid" uuid NOT NULL REFERENCES "users"("id"),
    PRIMARY KEY ("id")
);

CREATE TABLE "projects" (
    "id" uuid DEFAULT gen_random_uuid(),
    "name" VARCHAR(255) NOT NULL,
    "taskid" uuid NOT NULL REFERENCES "tasks"("id"),
    PRIMARY KEY ("id")
);

CREATE TABLE "shared_tasks" (
  "id" uuid DEFAULT gen_random_uuid(),
  "task_id" uuid NOT NULL REFERENCES "tasks"("id") ON DELETE CASCADE,
  "assigned_by" uuid NOT NULL REFERENCES "users"("id") ON DELETE CASCADE,
  "assigned_to" uuid NOT NULL REFERENCES "users"("id") ON DELETE CASCADE,
  "assigned_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  "status" VARCHAR(20) DEFAULT 'pending', -- possible: pending, accepted, refused
  PRIMARY KEY ("id"),
  CONSTRAINT unique_assignment UNIQUE ("task_id", "assigned_to")
);

CREATE UNIQUE INDEX uidx_users_email ON "users"("email");

INSERT INTO "users" ("email", "passhash", "firstname", "lastname") VALUES
('f', 'f', 'François', 'Fier'),
('g', 'g', 'Fanny', 'Huet'),
('u@example.com', ENCODE(SHA256('u'), 'hex'), 'Ugo', 'Urbain'),
('uh@example.com', ENCODE(SHA256('uh'), 'hex'), 'Ursule', 'Henri'),
('a@example.com', ENCODE(SHA256('a'), 'hex'), 'Alex', 'Aubin'),
('ah@example.com', ENCODE(SHA256('ah'), 'hex'), 'Anaïs', 'Houde');


INSERT INTO "tasks" ("userid", "content") VALUES
( (SELECT "id" FROM "users" WHERE "email" = 'f@example.com'), 'hike mount thamaire. first task'),
( (SELECT "id" FROM "users" WHERE "email" = 'u@example.com'), 'buy some melons. second task'),
( (SELECT "id" FROM "users" WHERE "email" = 'ah@example.com'), 'be a nice boi. third task');