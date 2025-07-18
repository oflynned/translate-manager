import { Migration } from '@mikro-orm/migrations';

export class Migration20230225180602 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table "term_entity" ("id" varchar(255) not null, "created_at" timestamptz(0) not null, "last_updated_at" timestamptz(0) null, "deleted_at" timestamptz(0) null, "domain" varchar(255) not null, "declension" int not null, "gender" text check ("gender" in (\'MASCULINE\', \'FEMALE\')) not null, "added_by_id" varchar(255) not null, constraint "term_entity_pkey" primary key ("id"));');

    this.addSql('alter table "term_entity" add constraint "term_entity_added_by_id_foreign" foreign key ("added_by_id") references "member_entity" ("id") on update cascade;');
  }

  async down(): Promise<void> {
    this.addSql('drop table if exists "term_entity" cascade;');
  }

}
