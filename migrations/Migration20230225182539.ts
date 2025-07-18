import { Migration } from '@mikro-orm/migrations';

export class Migration20230225182539 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table "translation_entity" ("id" varchar(255) not null, "created_at" timestamptz(0) not null, "last_updated_at" timestamptz(0) null, "deleted_at" timestamptz(0) null, "language_code" varchar(255) not null, "translations" text[] not null, "term_id" varchar(255) not null, constraint "translation_entity_pkey" primary key ("id"));');

    this.addSql('alter table "translation_entity" add constraint "translation_entity_term_id_foreign" foreign key ("term_id") references "term_entity" ("id") on update cascade;');

    this.addSql('alter table "term_entity" add column "title" varchar(255) not null, add column "language_code" varchar(255) not null;');
  }

  async down(): Promise<void> {
    this.addSql('drop table if exists "translation_entity" cascade;');

    this.addSql('alter table "term_entity" drop column "title";');
    this.addSql('alter table "term_entity" drop column "language_code";');
  }

}
