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
    "email" VARCHAR(255) NOT NULL,
    "passhash" CHAR(64) NOT NULL,
    "role" VARCHAR(20) DEFAULT 'client' CHECK ("role" IN ('client', 'hairdresser')) NOT NULL,
    PRIMARY KEY ("id")
);

CREATE TABLE "tokens" (
    "id" uuid DEFAULT gen_random_uuid(),
    "token" uuid DEFAULT,
    "expires" TIMESTAMP DEFAULT (CURRENT_TIMESTAMP  + INTERVAL '30 days'),
    "user_id" uuid NOT NULL REFERENCES "users"("id"),
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

CREATE TABLE "availabilities" (
    "id" uuid DEFAULT gen_random_uuid(),
    "hairdresser_id" uuid NOT NULL REFERENCES "users"("id"),
    "availability_date" TIMESTAMP NOT NULL,
    "status" VARCHAR(20) DEFAULT 'pending' CHECK ("status" IN ('pending', 'assigned', 'expired')) NOT NULL,
    PRIMARY KEY ("id")
);

CREATE TABLE "feedbacks" (
	"appointment_id" uuid NOT NULL REFERENCES "appointments"("id"),
	"client_id" uuid NOT NULL REFERENCES "users"("id"),
	"comment" TEXT NOT NULL,
	"rating" INTEGER CHECK ("rating" BETWEEN 1 AND 5) NOT NULL,
	"feedback_date" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
	PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX uidx_users_email ON "users"("email");

INSERT INTO "users" ("email", "passhash", "role") VALUES
('f', 'f', 'client'),
('u', 'u', 'client'),
('uh', ENCODE(SHA256('monGrainDeCumminuh'), 'hex'), 'hairdresser'),
('a', 'a', 'client'),
('ah', ENCODE(SHA256('monGrainDeCumminah'), 'hex'), 'hairdresser');

INSERT INTO "services" ("name", "duration", "price") VALUES
('Coupe homme', 20, 25.00),
('Coupe femme', 45, 50.00),
('Teinture', 90, 150.00),
('Mise en plie', 30, 40.00),
('Balayage', 90, 160.00),
('Soin capillaire', 30, 35.00);

-- INSERT INTO "availabilities" ("hairdresser_id", "availability_date", "status") VALUES
-- ((SELECT "id" FROM "users" WHERE "email" = 'ah'), '2023-10-01 11:00:00', 'expired'),
-- ((SELECT "id" FROM "users" WHERE "email" = 'ah'), '2023-10-02 13:00:00', 'pending'),
-- ((SELECT "id" FROM "users" WHERE "email" = 'ah'), '2023-10-03 09:00:00', 'pending'),
-- ((SELECT "id" FROM "users" WHERE "email" = 'uh'), '2023-10-04 13:00:00', 'pending'),
-- ((SELECT "id" FROM "users" WHERE "email" = 'uh'), '2023-10-05 09:00:00', 'pending'),
-- ((SELECT "id" FROM "users" WHERE "email" = 'uh'), '2023-10-06 12:00:00', 'assigned'),
-- ((SELECT "id" FROM "users" WHERE "email" = 'uh'), '2023-10-07 12:00:00', 'assigned'),
-- ((SELECT "id" FROM "users" WHERE "email" = 'uh'), '2023-10-08 12:00:00', 'assigned'),
-- ((SELECT "id" FROM "users" WHERE "email" = 'ah'), '2023-10-09 12:00:00', 'assigned'),
-- ((SELECT "id" FROM "users" WHERE "email" = 'uh'), '2023-10-10 09:00:00', 'assigned'),
-- ((SELECT "id" FROM "users" WHERE "email" = 'ah'), '2023-10-11 13:00:00', 'assigned'),
-- ((SELECT "id" FROM "users" WHERE "email" = 'ah'), '2023-10-12 13:00:00', 'assigned'),
-- ((SELECT "id" FROM "users" WHERE "email" = 'uh'), '2023-10-13 09:00:00', 'assigned'),
-- ((SELECT "id" FROM "users" WHERE "email" = 'ah'), '2023-10-14 13:00:00', 'assigned'),
-- ((SELECT "id" FROM "users" WHERE "email" = 'ah'), '2023-10-15 13:00:00', 'assigned');

-- INSERT INTO "appointments" ("client_id", "hairdresser_id", "service_id", "status", "availability_id") VALUES
-- (
--   (SELECT "id" FROM "users" WHERE "email" = 'f'),
--   (SELECT "id" FROM "users" WHERE "email" = 'uh'),
--   (SELECT "id" FROM "services" WHERE "name" = 'Coupe homme'),
--   'show',
--   (SELECT "id" FROM "availabilities" WHERE "availability_date" = '2023-10-06 12:00:00' AND "hairdresser_id" = (SELECT "id" FROM "users" WHERE "email" = 'uh'))
-- ),
-- (
--   (SELECT "id" FROM "users" WHERE "email" = 'u'),
--   (SELECT "id" FROM "users" WHERE "email" = 'ah'),
--   (SELECT "id" FROM "services" WHERE "name" = 'Soin capillaire'),
--   'show',
--   (SELECT "id" FROM "availabilities" WHERE "availability_date" = '2023-10-07 12:00:00' AND "hairdresser_id" = (SELECT "id" FROM "users" WHERE "email" = 'ah'))
-- ),
-- (
--   (SELECT "id" FROM "users" WHERE "email" = 'f'),
--   (SELECT "id" FROM "users" WHERE "email" = 'ah'),
--   (SELECT "id" FROM "services" WHERE "name" = 'Coupe femme'),
--   'show',
--   (SELECT "id" FROM "availabilities" WHERE "availability_date" = '2023-10-08 12:00:00' AND "hairdresser_id" = (SELECT "id" FROM "users" WHERE "email" = 'ah'))
-- ),
-- (
--   (SELECT "id" FROM "users" WHERE "email" = 'a'),
--   (SELECT "id" FROM "users" WHERE "email" = 'uh'),
--   (SELECT "id" FROM "services" WHERE "name" = 'Soin capillaire'),
--   'pending',
--   (SELECT "id" FROM "availabilities" WHERE "availability_date" = '2023-10-09 12:00:00' AND "hairdresser_id" = (SELECT "id" FROM "users" WHERE "email" = 'uh'))
-- ),
-- (
--   (SELECT "id" FROM "users" WHERE "email" = 'a'),
--   (SELECT "id" FROM "users" WHERE "email" = 'ah'),
--   (SELECT "id" FROM "services" WHERE "name" = 'Teinture'),
--   'noShow',
--   (SELECT "id" FROM "availabilities" WHERE "availability_date" = '2023-10-10 09:00:00' AND "hairdresser_id" = (SELECT "id" FROM "users" WHERE "email" = 'ah'))
-- ),
-- (
--   (SELECT "id" FROM "users" WHERE "email" = 'u'),
--   (SELECT "id" FROM "users" WHERE "email" = 'uh'),
--   (SELECT "id" FROM "services" WHERE "name" = 'Soin capillaire'),
--   'show',
--   (SELECT "id" FROM "availabilities" WHERE "availability_date" = '2023-10-11 13:00:00' AND "hairdresser_id" = (SELECT "id" FROM "users" WHERE "email" = 'uh'))
-- ),
-- (
--   (SELECT "id" FROM "users" WHERE "email" = 'f'),
--   (SELECT "id" FROM "users" WHERE "email" = 'uh'),
--   (SELECT "id" FROM "services" WHERE "name" = 'Teinture'),
--   'show',
--   (SELECT "id" FROM "availabilities" WHERE "availability_date" = '2023-10-12 13:00:00' AND "hairdresser_id" = (SELECT "id" FROM "users" WHERE "email" = 'uh'))
-- ),
-- (
--   (SELECT "id" FROM "users" WHERE "email" = 'u'),
--   (SELECT "id" FROM "users" WHERE "email" = 'ah'),
--   (SELECT "id" FROM "services" WHERE "name" = 'Mise en plie'),
--   'show',
--   (SELECT "id" FROM "availabilities" WHERE "availability_date" = '2023-10-13 09:00:00' AND "hairdresser_id" = (SELECT "id" FROM "users" WHERE "email" = 'ah'))
-- ),
-- (
--   (SELECT "id" FROM "users" WHERE "email" = 'a'),
--   (SELECT "id" FROM "users" WHERE "email" = 'ah'),
--   (SELECT "id" FROM "services" WHERE "name" = 'Balayage'),
--   'pending',
--   (SELECT "id" FROM "availabilities" WHERE "availability_date" = '2023-10-14 13:00:00' AND "hairdresser_id" = (SELECT "id" FROM "users" WHERE "email" = 'ah'))
-- ),
-- (
--   (SELECT "id" FROM "users" WHERE "email" = 'f'),
--   (SELECT "id" FROM "users" WHERE "email" = 'ah'),
--   (SELECT "id" FROM "services" WHERE "name" = 'Coupe homme'),
--   'show',
--   (SELECT "id" FROM "availabilities" WHERE "availability_date" = '2023-10-15 13:00:00' AND "hairdresser_id" = (SELECT "id" FROM "users" WHERE "email" = 'ah'))
-- );

-- INSERT INTO "feedbacks" ("appointment_id", "client_id", "comment", "rating", "feedback_date") VALUES
-- (
--   (SELECT "id" FROM "appointments"
--    WHERE "status" = 'show'
--    AND "availability_id" = (
--      SELECT "id" FROM "availabilities"
--      WHERE "availability_date" = '2023-10-06 12:00:00'
--    )),
--   (SELECT "id" FROM "users" WHERE "email" = 'f'),
--   'Excellent service, je recommande!',
--   5,
--   '2023-10-06 00:00:00'
-- ),
-- (
--   (SELECT "id" FROM "appointments"
--    WHERE "status" = 'show'
--    AND "availability_id" = (
--      SELECT "id" FROM "availabilities"
--      WHERE "availability_date" = '2023-10-07 12:00:00'
--    )),
--   (SELECT "id" FROM "users" WHERE "email" = 'u'),
--   'Très satisfaite de la coupe.',
--   4,
--   '2023-10-07 00:00:00'
-- ),
-- (
--   (SELECT "id" FROM "appointments"
--    WHERE "status" = 'show'
--    AND "availability_id" = (
--      SELECT "id" FROM "availabilities"
--      WHERE "availability_date" = '2023-10-08 12:00:00'
--    )),
--   (SELECT "id" FROM "users" WHERE "email" = 'f'),
--   'Ponctuelle et professionnelle.',
--   5,
--   '2023-10-08 00:00:00'
-- ),
-- (
--   (SELECT "id" FROM "appointments"
--    WHERE "status" = 'show'
--    AND "availability_id" = (
--      SELECT "id" FROM "availabilities"
--      WHERE "availability_date" = '2023-10-11 13:00:00'
--    )),
--   (SELECT "id" FROM "users" WHERE "email" = 'u'),
--   'Un peu rapide mais bon résultat.',
--   3,
--   '2023-10-09 00:00:00'
-- ),
-- (
--   (SELECT "id" FROM "appointments"
--    WHERE "status" = 'show'
--    AND "availability_id" = (
--      SELECT "id" FROM "availabilities"
--      WHERE "availability_date" = '2023-10-12 13:00:00'
--    )),
--   (SELECT "id" FROM "users" WHERE "email" = 'f'),
--   'Accueil chaleureux, ambiance agréable.',
--   4,
--   '2023-10-10 00:00:00'
-- );
