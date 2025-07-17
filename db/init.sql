CREATE EXTENSION "pgcrypto";
CREATE EXTENSION "uuid-ossp";

CREATE DATABASE timewaitfornoonedb;

-- USE andre;
\c timewaitfornoonedb;


-- ! find a way to salt with a var
-- DECLARE "SALT" CONSTANT CHAR NOT NULL DEFAULT 'monGrainDeCummin';

CREATE TABLE "services" (
    "id" uuid DEFAULT gen_random_uuid(),
    "name" VARCHAR(255) NOT NULL,
    "duration" INTEGER NOT NULL,
    "price" DECIMAL(10, 2) NOT NULL,
    PRIMARY KEY ("id")
);

CREATE TABLE "users" (
    "id" uuid DEFAULT gen_random_uuid(),
	"first_name" VARCHAR(255) NULL,
	"last_name" VARCHAR(255) NULL,
    "email" VARCHAR(255) NOT NULL,
    "passhash" CHAR(64) NOT NULL,
    "role" VARCHAR(20) DEFAULT 'client' CHECK ("role" IN ('client', 'hairdresser', 'deactivated')) NOT NULL,
    PRIMARY KEY ("id")
);

CREATE TABLE "tokens" (
    "id" uuid DEFAULT gen_random_uuid(),
    "token" uuid DEFAULT NULL,
    "expires" TIMESTAMP DEFAULT (CURRENT_TIMESTAMP  + INTERVAL '30 days'),
    "user_id" uuid NOT NULL REFERENCES "users"("id"),
    PRIMARY KEY ("id")
);

CREATE TABLE "availabilities" (
    "id" uuid DEFAULT gen_random_uuid(),
    "hairdresser_id" uuid NOT NULL REFERENCES "users"("id"),
    "availability_date" TIMESTAMP NOT NULL,
    "status" VARCHAR(20) DEFAULT 'pending' CHECK ("status" IN ('pending', 'assigned', 'expired', 'cancelled')) NOT NULL,
    PRIMARY KEY ("id")
);

CREATE TABLE "appointments" (
    "id" uuid DEFAULT gen_random_uuid(),
    "client_id" uuid NOT NULL REFERENCES "users"("id"),
    "hairdresser_id" uuid NOT NULL REFERENCES "users"("id"),
    "service_id" uuid NOT NULL REFERENCES "services"("id"),
	"availability_id" uuid REFERENCES "availabilities"("id"),
	"status" VARCHAR(20) DEFAULT 'pending' CHECK ("status" IN ('pending', 'show', 'noShow', 'feedback')) NOT NULL,
    PRIMARY KEY ("id")
);

CREATE TABLE "feedbacks" (
	"id" uuid DEFAULT gen_random_uuid(),
	"appointment_id" uuid NOT NULL REFERENCES "appointments"("id"),
	"client_id" uuid NOT NULL REFERENCES "users"("id"),
	"comment" TEXT NOT NULL,
	"rating" INTEGER CHECK ("rating" BETWEEN 1 AND 5) NOT NULL,
	"feedback_date" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
	PRIMARY KEY ("id")
); 

CREATE UNIQUE INDEX uidx_users_email ON "users"("email");


INSERT INTO "users" ("first_name", "last_name", "email", "passhash", "role") VALUES 
('hfn', 'hln', 'he', ENCODE(SHA256('monGrainDeCumminhe'), 'hex'), 'hairdresser'),
('cfn', 'cln', 'ce', '252f10c83610ebca1a059c0bae8255eba2f95be4d1d7bcfa89d7248a82d9f111', 'client'),
('c2fn', 'c2ln', 'c2e', '3d2607ccfab337bf141821e6af1f256e444fdf32a8cd8ab93bfc5626d08a2d69', 'client');


INSERT INTO "services" ("name", "duration", "price") VALUES
('Coupe homme', 60, 25.00),
('Coupe femme', 60, 50.00),
('Teinture', 60, 150.00),
('Mise en plie', 60, 40.00),
('Balayage', 60, 160.00),
('Soin capillaire', 60, 35.00);

INSERT INTO "availabilities" ("hairdresser_id", "availability_date", "status") VALUES
((SELECT "id" FROM "users" WHERE "email" = 'he'), '2023-10-01 11:00:00', 'expired'),
((SELECT "id" FROM "users" WHERE "email" = 'he'), '2023-10-02 13:00:00', 'pending'),
((SELECT "id" FROM "users" WHERE "email" = 'he'), '2023-10-06 12:00:00', 'assigned');

INSERT INTO "appointments" ("client_id", "hairdresser_id", "service_id", "availability_id") VALUES
((SELECT id FROM users WHERE email = 'ce'),
 (SELECT id FROM users WHERE email = 'he'),
 (SELECT id FROM services WHERE name = 'Coupe homme'),
 (SELECT id FROM availabilities WHERE availability_date = '2023-10-06 12:00:00'));

