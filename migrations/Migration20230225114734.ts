import { Migration } from '@mikro-orm/migrations';

export class Migration20230225114734 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "member_entity" add column "added_by_id" varchar(255) not null;');
    this.addSql('alter table "member_entity" add constraint "member_entity_added_by_id_foreign" foreign key ("added_by_id") references "member_entity" ("id") on update cascade;');
    this.addSql('alter table "member_entity" add constraint "member_entity_added_by_id_unique" unique ("added_by_id");');
  }

  async down(): Promise<void> {
    this.addSql('alter table "member_entity" drop constraint "member_entity_added_by_id_foreign";');

    this.addSql('alter table "member_entity" drop constraint "member_entity_added_by_id_unique";');
    this.addSql('alter table "member_entity" drop column "added_by_id";');
  }

}
