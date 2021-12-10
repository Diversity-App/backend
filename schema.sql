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

CREATE TABLE "SSO_Providers" (
    "id" SERIAL,
    "name" VARCHAR(255) NOT NULL,
    CONSTRAINT pk_sso_providers PRIMARY KEY ("id"),
    CONSTRAINT uk_sso_providers UNIQUE ("name")
);

CREATE TABLE "SSO_Tokens" (
    "id" SERIAL,
    "user_id" INTEGER NOT NULL,
    "provider_id" INTEGER NOT NULL,
    "client_id" VARCHAR(255) NOT NULL,
    "access_token" VARCHAR(255) NOT NULL,
    "refresh_token" VARCHAR(255) NULL,
    "expires_in" INTEGER NULL,
    "created_at" TIMESTAMP NOT NULL DEFAULT NOW(),
    "updated_at" TIMESTAMP NOT NULL DEFAULT NOW(),
    CONSTRAINT pk_sso_tokens PRIMARY KEY ("id"),
    CONSTRAINT uk_provider UNIQUE ("provider_id", "user_id"),
    CONSTRAINT fk_sso_tokens_users FOREIGN KEY ("user_id") REFERENCES "Users" ("id") ON DELETE CASCADE,
    CONSTRAINT fk_sso_tokens_sso_providers FOREIGN KEY ("provider_id") REFERENCES "SSO_Providers" ("id") ON DELETE CASCADE
);

