import { Migration } from '@mikro-orm/migrations';

export class Migration20230224181743 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table "user_entity" ("id" varchar(255) not null, "created_at" timestamptz(0) not null, "last_updated_at" timestamptz(0) not null, "deleted_at" timestamptz(0) not null, "name" varchar(255) not null, "email" varchar(255) not null, "hash" varchar(255) not null, constraint "user_entity_pkey" primary key ("id"));');

    this.addSql('create table "refresh_token_entity" ("id" varchar(255) not null, "created_at" timestamptz(0) not null, "last_updated_at" timestamptz(0) not null, "deleted_at" timestamptz(0) not null, "revoked" boolean not null default false, "revoked_at" timestamptz(0) not null, "expires_at" timestamptz(0) not null, "user_id" varchar(255) not null, constraint "refresh_token_entity_pkey" primary key ("id"));');

    this.addSql('create table "organisation_entity" ("id" varchar(255) not null, "created_at" timestamptz(0) not null, "last_updated_at" timestamptz(0) not null, "deleted_at" timestamptz(0) not null, "name" varchar(255) not null, "founder_id" varchar(255) not null, constraint "organisation_entity_pkey" primary key ("id"));');

    this.addSql('create table "member_entity" ("id" varchar(255) not null, "created_at" timestamptz(0) not null, "last_updated_at" timestamptz(0) not null, "deleted_at" timestamptz(0) not null, "role" text check ("role" in (\'ADMIN\', \'CONTRIBUTOR\', \'VIEWER\')) not null, "user_id" varchar(255) not null, "organisation_id" varchar(255) not null, constraint "member_entity_pkey" primary key ("id"));');
    this.addSql('alter table "member_entity" add constraint "member_entity_user_id_unique" unique ("user_id");');

    this.addSql('alter table "refresh_token_entity" add constraint "refresh_token_entity_user_id_foreign" foreign key ("user_id") references "user_entity" ("id") on update cascade;');

    this.addSql('alter table "organisation_entity" add constraint "organisation_entity_founder_id_foreign" foreign key ("founder_id") references "user_entity" ("id") on update cascade;');

    this.addSql('alter table "member_entity" add constraint "member_entity_user_id_foreign" foreign key ("user_id") references "user_entity" ("id") on update cascade;');
    this.addSql('alter table "member_entity" add constraint "member_entity_organisation_id_foreign" foreign key ("organisation_id") references "organisation_entity" ("id") on update cascade;');
  }

  async down(): Promise<void> {
    this.addSql('alter table "refresh_token_entity" drop constraint "refresh_token_entity_user_id_foreign";');

    this.addSql('alter table "organisation_entity" drop constraint "organisation_entity_founder_id_foreign";');

    this.addSql('alter table "member_entity" drop constraint "member_entity_user_id_foreign";');

    this.addSql('alter table "member_entity" drop constraint "member_entity_organisation_id_foreign";');

    this.addSql('drop table if exists "user_entity" cascade;');

    this.addSql('drop table if exists "refresh_token_entity" cascade;');

    this.addSql('drop table if exists "organisation_entity" cascade;');

    this.addSql('drop table if exists "member_entity" cascade;');
  }

}
