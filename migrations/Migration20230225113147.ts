import { Migration } from '@mikro-orm/migrations';

export class Migration20230225113147 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "member_entity" add column "invited_at" timestamptz(0) not null;');
  }

  async down(): Promise<void> {
    this.addSql('alter table "member_entity" drop column "invited_at";');
  }

}
