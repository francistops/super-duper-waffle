CREATE EXTENSION "pgcrypto";
CREATE EXTENSION "uuid-ossp";

CREATE DATABASE timewaitfornoonedb;

-- USE andre;
\c timewaitfornoonedb;


-- ! find a way to salt with a var
-- DECLARE "SALT" CONSTANT CHAR NOT NULL DEFAULT 'monGrainDeCummin';

-- ! find a way to store liked tasks in user profile

CREATE TABLE "users" (
    "id" uuid DEFAULT gen_random_uuid(),
    "email" VARCHAR(255) NOT NULL,
    "passhash" CHAR(64) NOT NULL,
    PRIMARY KEY ("id")
);

CREATE TABLE "tokens" (
    "id" uuid DEFAULT gen_random_uuid(),
    "token" uuid DEFAULT NULL,
    "expires" TIMESTAMP DEFAULT (Now() + INTERVAL '30 days'),
    "userid" uuid NOT NULL REFERENCES "users"("id"),
    PRIMARY KEY ("id")
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

-- CREATE TABLE "projects" (
--     "id" uuid DEFAULT gen_random_uuid(),
--     "name" VARCHAR(255) NOT NULL,
--     "taskid" uuid NOT NULL REFERENCES "tasks"("id"),
--     "status" VARCHAR(20) DEFAULT 'pending',
--     PRIMARY KEY ("id")
    -- errpr with db CONSTRAINT unique_assignment UNIQUE ("task_id")
-- );

CREATE UNIQUE INDEX uidx_users_email ON "users"("email");

INSERT INTO "users" ("email", "passhash") VALUES
('f', 'f'),
('u', 'u'),
('uh', ENCODE(SHA256('monGrainDeCumminuh'), 'hex')),
('a', 'a'),
('ah', ENCODE(SHA256('monGrainDeCumminah'), 'hex'));


INSERT INTO "tasks" ("userid", "content") VALUES
( (SELECT "id" FROM "users" WHERE "email" = 'f'), 'hike mount thamaire. first task'),
( (SELECT "id" FROM "users" WHERE "email" = 'u'), 'buy some melons. second task'),
( (SELECT "id" FROM "users" WHERE "email" = 'ah'), 'be a nice boi. third task');

-- INSERT INTO "tokens" ("userid", "token") VALUES
-- ( (SELECT "id" FROM "users" WHERE "email" = 'f'), '56fc94e0-9ef7-4817-be01-93bed582ba67'),
-- ( (SELECT "id" FROM "users" WHERE "email" = 'u'), '56fc94e0-9ef7-4817-be01-93bed582ba68');

