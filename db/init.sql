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



CREATE UNIQUE INDEX uidx_users_email ON "users"("email");

INSERT INTO "users" ("email", "passhash") VALUES
('f', 'f'),
('fh', ENCODE (SHA256('fh'), 'hex')),
('u', 'u'),
('uh', ENCODE (SHA256('uh'), 'hex')),
('a', 'a'),
('ah', ENCODE (SHA256('ah'), 'hex'));

INSERT INTO "tasks" ("userid", "content") VALUES
( (SELECT "id" FROM "users" WHERE "email" = 'f'), 'hike mount thamaire. first task'),
( (SELECT "id" FROM "users" WHERE "email" = 'u'), 'buy some melons. second task'),
( (SELECT "id" FROM "users" WHERE "email" = 'ah'), 'be a nice boi. third task');