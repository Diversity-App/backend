CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE "Users" (
    "id" SERIAL,
    "uuid" UUID NOT NULL DEFAULT uuid_generate_v1() ,
    "username" VARCHAR(255) NOT NULL,
    "password" VARCHAR(255) NOT NULL,
    "created_at" TIMESTAMP NOT NULL DEFAULT NOW(),
    "updated_at" TIMESTAMP NOT NULL DEFAULT NOW(),
    PRIMARY KEY ("id"),
    CONSTRAINT pk_uuid UNIQUE ( uuid ),
    CONSTRAINT uk_users UNIQUE ("username")
);