CREATE TABLE "receitas" (
  "id" SERIAL PRIMARY KEY,
  "nome" text,
  "ingredientes" text[],
  "preparo" text[],
  "informacoes" text,
  "created_at" timestamp DEFAULT (now),
  "chef_id" integer,
  "user_id" integer,
  "destaque" boolean
);

CREATE TABLE "chefs" (
  "id" SERIAL PRIMARY KEY,
  "nome_chef" text,
  "file_id" integer,
  "created_at" timestamp DEFAULT (now)
);

CREATE TABLE "files" (
  "id" SERIAL PRIMARY KEY,
  "name" text,
  "path" text
);

CREATE TABLE "receitas_files" (
  "id" SERIAL PRIMARY KEY,
  "receita_id" integer,
  "file_id" integer
);

CREATE TABLE "users" (
  "id" SERIAL PRIMARY KEY,
  "name" text,
  "email" text,
  "password" text,
  "reset_token" text,
  "reset_token_expires" text,
  "is_adm" boolean,
  "created_at" timestamp DEFAULT (now),
  "updated_at" timestamp DEFAULT (now)
);

CREATE TABLE "session" (
  "side" varchar PRIMARY KEY,
  "sess" json,
  "expire" timestamp(6)
);

ALTER TABLE "receitas" ADD FOREIGN KEY ("chef_id") REFERENCES "chefs" ("id");

ALTER TABLE "receitas" ADD FOREIGN KEY ("user_id") REFERENCES "users" ("id");

ALTER TABLE "receitas_files" ADD FOREIGN KEY ("receita_id") REFERENCES "receitas" ("id");

ALTER TABLE "receitas_files" ADD FOREIGN KEY ("file_id") REFERENCES "files" ("id");

ALTER TABLE "files" ADD FOREIGN KEY ("id") REFERENCES "chefs" ("file_id");

-- create procedure
CREATE FUNCTION trigger_set_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

--  auto updated_at receitas 

CREATE TRIGGER set_timestamp
BEFORE UPDATE ON products 
FOR EACH ROW
EXECUTE PROCEDURE trigger_set_timestamp();