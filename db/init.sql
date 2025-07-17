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

-- Services
INSERT INTO services (id, name, duration, price)
VALUES
  (gen_random_uuid(), 'Coupe', 30, 25.00),
  (gen_random_uuid(), 'Coloration', 60, 70.00),
  (gen_random_uuid(), 'Brushing', 45, 40.00);

-- Utilisateurs (1 client, 2 coiffeuses, 1 désactivé)
INSERT INTO users (id, first_name, last_name, email, passhash, role)
VALUES
  (gen_random_uuid(), 'Alice', 'Client', 'alice@example.com', repeat('a', 64), 'client'),
  (gen_random_uuid(), 'Bella', 'Hairdresser', 'bella@example.com', repeat('b', 64), 'hairdresser'),
  (gen_random_uuid(), 'Clara', 'Hairdresser', 'clara@example.com', repeat('c', 64), 'hairdresser'),
  (gen_random_uuid(), 'Dan', 'Deactivated', 'dan@example.com', repeat('d', 64), 'deactivated');

-- Récupérer l'id de Clara
WITH hairdresser AS (
  SELECT id FROM users WHERE email = 'clara@example.com'
)
INSERT INTO availabilities (hairdresser_id, availability_date, status)
VALUES
  ((SELECT id FROM hairdresser), NOW() + interval '1 day', 'pending'),
  ((SELECT id FROM hairdresser), NOW() + interval '2 days', 'assigned'),
  ((SELECT id FROM hairdresser), NOW() - interval '5 days', 'expired'),
  ((SELECT id FROM hairdresser), NOW() + interval '3 days', 'cancelled');

-- Requêtes CTE pour simplifier les relations
WITH
client AS (
  SELECT id FROM users WHERE email = 'alice@example.com'
),
hairdresser AS (
  SELECT id FROM users WHERE email = 'bella@example.com'
),
service AS (
  SELECT id FROM services LIMIT 1
),
availability AS (
  SELECT id FROM availabilities ORDER BY availability_date LIMIT 4
)
INSERT INTO appointments (client_id, hairdresser_id, service_id, availability_id, status)
VALUES
  ((SELECT id FROM client), (SELECT id FROM hairdresser), (SELECT id FROM service), (SELECT id FROM availability OFFSET 0 LIMIT 1), 'pending'),
  ((SELECT id FROM client), (SELECT id FROM hairdresser), (SELECT id FROM service), (SELECT id FROM availability OFFSET 1 LIMIT 1), 'show'),
  ((SELECT id FROM client), (SELECT id FROM hairdresser), (SELECT id FROM service), (SELECT id FROM availability OFFSET 2 LIMIT 1), 'noShow'),
  ((SELECT id FROM client), (SELECT id FROM hairdresser), (SELECT id FROM service), (SELECT id FROM availability OFFSET 3 LIMIT 1), 'feedback');

WITH
client AS (SELECT id FROM users WHERE email = 'alice@example.com'),
appointment AS (
  SELECT id FROM appointments WHERE status = 'feedback' LIMIT 1
)
INSERT INTO feedbacks (appointment_id, client_id, comment, rating)
VALUES (
  (SELECT id FROM appointment),
  (SELECT id FROM client),
  'Très bon service, je recommande fortement !',
  5
);