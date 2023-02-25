import { Migration } from '@mikro-orm/migrations';

export class Migration20230225112931 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "member_entity" add column "accepted_invite_at" timestamptz(0) not null;');
  }

  async down(): Promise<void> {
    this.addSql('alter table "member_entity" drop column "accepted_invite_at";');
  }

}
