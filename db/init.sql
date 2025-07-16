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