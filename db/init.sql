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
	"first_name" VARCHAR(255) NOT NULL,
	"last_name" VARCHAR(255) NOT NULL,
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
('Alice', 'Johnson', 'alice.johnson@salonlocal.com', ENCODE(SHA256('monGrainDeCumminuh'), 'hex'), 'hairdresser'),
('Charlie', 'Davis', 'charlie.davis@salonlocal.com', ENCODE(SHA256('monGrainDeCumminah'), 'hex'), 'hairdresser'),
('John', 'Doe', 'john.doe@example.com', '252f10c83610ebca1a059c0bae8255eba2f95be4d1d7bcfa89d7248a82d9f111', 'client'),
('Jane', 'Smith', 'jane.smith@example.com', '0bfe935e70c321c7ca3afc75ce0d0ca2f98b5422e008bb31c00c6d7f1f1c0ad6', 'client'),
('Bob', 'Brown', 'bob.brown@example.com', '3d2607ccfab337bf141821e6af1f256e444fdf32a8cd8ab93bfc5626d08a2d69', 'client');


INSERT INTO "services" ("name", "duration", "price") VALUES
('Coupe homme', 60, 25.00),
('Coupe femme', 60, 50.00),
('Teinture', 60, 150.00),
('Mise en plie', 60, 40.00),
('Balayage', 60, 160.00),
('Soin capillaire', 60, 35.00);

INSERT INTO "availabilities" ("hairdresser_id", "availability_date", "status") VALUES
((SELECT "id" FROM "users" WHERE "email" = 'ah'), '2023-10-01 11:00:00', 'expired'),
((SELECT "id" FROM "users" WHERE "email" = 'ah'), '2023-10-02 13:00:00', 'pending'),
((SELECT "id" FROM "users" WHERE "email" = 'ah'), '2023-10-03 09:00:00', 'pending'),
((SELECT "id" FROM "users" WHERE "email" = 'uh'), '2023-10-04 13:00:00', 'pending'),
((SELECT "id" FROM "users" WHERE "email" = 'uh'), '2023-10-05 09:00:00', 'pending'),
((SELECT "id" FROM "users" WHERE "email" = 'uh'), '2023-10-06 12:00:00', 'assigned'),
((SELECT "id" FROM "users" WHERE "email" = 'uh'), '2023-10-07 12:00:00', 'assigned'),
((SELECT "id" FROM "users" WHERE "email" = 'uh'), '2023-10-08 12:00:00', 'assigned'),
((SELECT "id" FROM "users" WHERE "email" = 'ah'), '2023-10-09 12:00:00', 'assigned'),
((SELECT "id" FROM "users" WHERE "email" = 'uh'), '2023-10-10 09:00:00', 'assigned'),
((SELECT "id" FROM "users" WHERE "email" = 'ah'), '2023-10-11 13:00:00', 'assigned'),
((SELECT "id" FROM "users" WHERE "email" = 'ah'), '2023-10-12 13:00:00', 'assigned'),
((SELECT "id" FROM "users" WHERE "email" = 'uh'), '2023-10-13 09:00:00', 'assigned'),
((SELECT "id" FROM "users" WHERE "email" = 'ah'), '2023-10-14 13:00:00', 'assigned'),
((SELECT "id" FROM "users" WHERE "email" = 'ah'), '2023-10-15 13:00:00', 'assigned');

INSERT INTO "appointments" ("client_id", "hairdresser_id", "service_id", "availability_id") VALUES
((SELECT id FROM users WHERE email = 'f'),
 (SELECT id FROM users WHERE email = 'uh'),
 (SELECT id FROM services WHERE name = 'Coupe homme'),
 (SELECT id FROM availabilities WHERE availability_date = '2023-10-06 12:00:00')),

((SELECT id FROM users WHERE email = 'u'),
 (SELECT id FROM users WHERE email = 'uh'),
 (SELECT id FROM services WHERE name = 'Coupe femme'),
 (SELECT id FROM availabilities WHERE availability_date = '2023-10-07 12:00:00')),

((SELECT id FROM users WHERE email = 'a'),
 (SELECT id FROM users WHERE email = 'uh'),
 (SELECT id FROM services WHERE name = 'Teinture'),
 (SELECT id FROM availabilities WHERE availability_date = '2023-10-08 12:00:00')),

((SELECT id FROM users WHERE email = 'f'),
 (SELECT id FROM users WHERE email = 'ah'),
 (SELECT id FROM services WHERE name = 'Mise en plie'),
 (SELECT id FROM availabilities WHERE availability_date = '2023-10-09 12:00:00')),

((SELECT id FROM users WHERE email = 'u'),
 (SELECT id FROM users WHERE email = 'uh'),
 (SELECT id FROM services WHERE name = 'Balayage'),
 (SELECT id FROM availabilities WHERE availability_date = '2023-10-10 09:00:00')),

((SELECT id FROM users WHERE email = 'a'),
 (SELECT id FROM users WHERE email = 'ah'),
 (SELECT id FROM services WHERE name = 'Soin capillaire'),
 (SELECT id FROM availabilities WHERE availability_date = '2023-10-11 13:00:00')),

((SELECT id FROM users WHERE email = 'f'),
 (SELECT id FROM users WHERE email = 'ah'),
 (SELECT id FROM services WHERE name = 'Coupe femme'),
 (SELECT id FROM availabilities WHERE availability_date = '2023-10-12 13:00:00')),

((SELECT id FROM users WHERE email = 'u'),
 (SELECT id FROM users WHERE email = 'uh'),
 (SELECT id FROM services WHERE name = 'Teinture'),
 (SELECT id FROM availabilities WHERE availability_date = '2023-10-13 09:00:00')),


((SELECT id FROM users WHERE email = 'a'),
 (SELECT id FROM users WHERE email = 'ah'),
 (SELECT id FROM services WHERE name = 'Mise en plie'),
 (SELECT id FROM availabilities WHERE availability_date = '2023-10-14 13:00:00')),

((SELECT id FROM users WHERE email = 'f'),
 (SELECT id FROM users WHERE email = 'ah'),
 (SELECT id FROM services WHERE name = 'Soin capillaire'),
 (SELECT id FROM availabilities WHERE availability_date = '2023-10-15 13:00:00'));

INSERT INTO "feedbacks" ("appointment_id", "client_id", "comment", "rating") VALUES
((SELECT id FROM appointments WHERE availability_id = (SELECT id FROM availabilities WHERE availability_date = '2023-10-06 12:00:00')),
 (SELECT id FROM users WHERE email = 'f'),
 'Très satisfait du service rapide.', 5),

((SELECT id FROM appointments WHERE availability_id = (SELECT id FROM availabilities WHERE availability_date = '2023-10-07 12:00:00')),
 (SELECT id FROM users WHERE email = 'u'),
 'Coiffeuse professionnelle et sympathique.', 4),

((SELECT id FROM appointments WHERE availability_id = (SELECT id FROM availabilities WHERE availability_date = '2023-10-08 12:00:00')),
 (SELECT id FROM users WHERE email = 'a'),
 'Bon résultat, mais un peu long.', 3),

((SELECT id FROM appointments WHERE availability_id = (SELECT id FROM availabilities WHERE availability_date = '2023-10-09 12:00:00')),
 (SELECT id FROM users WHERE email = 'f'),
 'Résultat impeccable, je recommande.', 5),

((SELECT id FROM appointments WHERE availability_id = (SELECT id FROM availabilities WHERE availability_date = '2023-10-10 09:00:00')),
 (SELECT id FROM users WHERE email = 'u'),
 'Coupe correcte, mais accueil froid.', 3),

((SELECT id FROM appointments WHERE availability_id = (SELECT id FROM availabilities WHERE availability_date = '2023-10-11 13:00:00')),
 (SELECT id FROM users WHERE email = 'a'),
 'Service très agréable et personnalisé.', 5),

((SELECT id FROM appointments WHERE availability_id = (SELECT id FROM availabilities WHERE availability_date = '2023-10-12 13:00:00')),
 (SELECT id FROM users WHERE email = 'f'),
 'Coupe un peu ratée, déçu.', 2),

((SELECT id FROM appointments WHERE availability_id = (SELECT id FROM availabilities WHERE availability_date = '2023-10-13 09:00:00')),
 (SELECT id FROM users WHERE email = 'u'),
 'Très bonne écoute, bon résultat.', 4),

((SELECT id FROM appointments WHERE availability_id = (SELECT id FROM availabilities WHERE availability_date = '2023-10-14 13:00:00')),
 (SELECT id FROM users WHERE email = 'a'),
 'Rapide et efficace, très bien.', 4),

((SELECT id FROM appointments WHERE availability_id = (SELECT id FROM availabilities WHERE availability_date = '2023-10-15 13:00:00')),
 (SELECT id FROM users WHERE email = 'f'),
 'Excellent service et ambiance relaxante.', 5);
