import { Migration } from '@mikro-orm/migrations';

export class Migration20230225135605 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "member_entity" drop constraint "member_entity_added_by_id_foreign";');

    this.addSql('alter table "member_entity" alter column "added_by_id" type varchar(255) using ("added_by_id"::varchar(255));');
    this.addSql('alter table "member_entity" alter column "added_by_id" drop not null;');
    this.addSql('alter table "member_entity" add constraint "member_entity_added_by_id_foreign" foreign key ("added_by_id") references "member_entity" ("id") on update cascade on delete set null;');
  }

  async down(): Promise<void> {
    this.addSql('alter table "member_entity" drop constraint "member_entity_added_by_id_foreign";');

    this.addSql('alter table "member_entity" alter column "added_by_id" type varchar(255) using ("added_by_id"::varchar(255));');
    this.addSql('alter table "member_entity" alter column "added_by_id" set not null;');
    this.addSql('alter table "member_entity" add constraint "member_entity_added_by_id_foreign" foreign key ("added_by_id") references "member_entity" ("id") on update cascade;');
  }

}
