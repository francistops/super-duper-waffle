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

CREATE TABLE "products" (
    "id" uuid DEFAULT gen_random_uuid(),
    "name" VARCHAR(255) NOT NULL,
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
    "token" uuid DEFAULT NULL,
    "expires" TIMESTAMP DEFAULT (Now() + INTERVAL '30 days'),
    "userid" uuid NOT NULL REFERENCES "users"("id"),
    PRIMARY KEY ("id")
);

CREATE TABLE "appointments" (
    "id" uuid DEFAULT gen_random_uuid(),
    "client_id" uuid NOT NULL REFERENCES "users"("id"),
    "hairdresser_id" uuid NOT NULL REFERENCES "users"("id"),
    "service_id" uuid NOT NULL REFERENCES "services"("id"),
    "date" TIMESTAMP NOT NULL,
    "status" VARCHAR(20) DEFAULT 'pending',
    PRIMARY KEY ("id")
);

CREATE TABLE "feedback" (
    "id" uuid DEFAULT gen_random_uuid(),
    "hairdresser_id" uuid NOT NULL REFERENCES "users"("id"),
    "client_id" uuid NOT NULL REFERENCES "users"("id"),
    "rating" INTEGER CHECK ("rating" BETWEEN 1 AND 5) NOT NULL,
    "comment" TEXT,
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
('Coupe de cheveux', 10, 20.00),
('Coloration', 30, 50.00),
('Brushing', 50, 15.00);

INSERT INTO "products" ("name", "price") VALUES
('Shampoing', 10.00),
('Après-shampoing', 12.00),
('Masque capillaire', 25.00);

INSERT INTO "appointments" ("client_id", "hairdresser_id", "service_id", "date", "status") VALUES
((SELECT "id" FROM "users" WHERE "email" = 'f'), (SELECT "id" FROM "users" WHERE "email" = 'uh'), (SELECT "id" FROM "services" WHERE "name" = 'Coupe de cheveux'), '2023-10-01 10:00:00', 'pending'),
((SELECT "id" FROM "users" WHERE "email" = 'u'), (SELECT "id" FROM "users" WHERE "email" = 'ah'), (SELECT "id" FROM "services" WHERE "name" = 'Coloration'), '2023-10-02 11:00:00', 'confirmed'),
((SELECT "id" FROM "users" WHERE "email" = 'a'), (SELECT "id" FROM "users" WHERE "email" = 'uh'), (SELECT "id" FROM "services" WHERE "name" = 'Brushing'), '2023-10-03 09:00:00', 'confirmed'),
((SELECT "id" FROM "users" WHERE "email" = 'f'), (SELECT "id" FROM "users" WHERE "email" = 'ah'), (SELECT "id" FROM "services" WHERE "name" = 'Coloration'), '2023-10-04 13:30:00', 'pending'),
((SELECT "id" FROM "users" WHERE "email" = 'u'), (SELECT "id" FROM "users" WHERE "email" = 'uh'), (SELECT "id" FROM "services" WHERE "name" = 'Brushing'), '2023-10-05 15:00:00', 'confirmed'),
((SELECT "id" FROM "users" WHERE "email" = 'a'), (SELECT "id" FROM "users" WHERE "email" = 'ah'), (SELECT "id" FROM "services" WHERE "name" = 'Coupe de cheveux'), '2023-10-06 10:15:00', 'completed'),
((SELECT "id" FROM "users" WHERE "email" = 'u'), (SELECT "id" FROM "users" WHERE "email" = 'uh'), (SELECT "id" FROM "services" WHERE "name" = 'Coloration'), '2023-10-07 16:45:00', 'confirmed'),
((SELECT "id" FROM "users" WHERE "email" = 'f'), (SELECT "id" FROM "users" WHERE "email" = 'ah'), (SELECT "id" FROM "services" WHERE "name" = 'Brushing'), '2023-10-08 14:00:00', 'confirmed'),
((SELECT "id" FROM "users" WHERE "email" = 'a'), (SELECT "id" FROM "users" WHERE "email" = 'uh'), (SELECT "id" FROM "services" WHERE "name" = 'Coloration'), '2023-10-09 12:30:00', 'pending'),
((SELECT "id" FROM "users" WHERE "email" = 'u'), (SELECT "id" FROM "users" WHERE "email" = 'ah'), (SELECT "id" FROM "services" WHERE "name" = 'Coupe de cheveux'), '2023-10-10 11:00:00', 'confirmed');

INSERT INTO "feedback" ("hairdresser_id", "client_id", "rating", "comment") VALUES
((SELECT "id" FROM "users" WHERE "email" = 'uh'), (SELECT "id" FROM "users" WHERE "email" = 'f'), 5, 'Excellent service, very satisfied!'),
((SELECT "id" FROM "users" WHERE "email" = 'ah'), (SELECT "id" FROM "users" WHERE "email" = 'u'), 4, 'Good job, but could be faster.');