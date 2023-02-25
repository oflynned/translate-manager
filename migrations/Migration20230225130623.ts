import { Migration } from '@mikro-orm/migrations';

export class Migration20230225130623 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "member_entity" drop constraint "member_entity_user_id_unique";');
  }

  async down(): Promise<void> {
    this.addSql('alter table "member_entity" add constraint "member_entity_user_id_unique" unique ("user_id");');
  }

}
