import { Migration } from '@mikro-orm/migrations';

export class Migration20230225130753 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "user_entity" alter column "last_updated_at" type timestamptz(0) using ("last_updated_at"::timestamptz(0));');
    this.addSql('alter table "user_entity" alter column "last_updated_at" drop not null;');
    this.addSql('alter table "user_entity" alter column "deleted_at" type timestamptz(0) using ("deleted_at"::timestamptz(0));');
    this.addSql('alter table "user_entity" alter column "deleted_at" drop not null;');

    this.addSql('alter table "refresh_token_entity" alter column "last_updated_at" type timestamptz(0) using ("last_updated_at"::timestamptz(0));');
    this.addSql('alter table "refresh_token_entity" alter column "last_updated_at" drop not null;');
    this.addSql('alter table "refresh_token_entity" alter column "deleted_at" type timestamptz(0) using ("deleted_at"::timestamptz(0));');
    this.addSql('alter table "refresh_token_entity" alter column "deleted_at" drop not null;');
    this.addSql('alter table "refresh_token_entity" alter column "revoked_at" type timestamptz(0) using ("revoked_at"::timestamptz(0));');
    this.addSql('alter table "refresh_token_entity" alter column "revoked_at" drop not null;');

    this.addSql('alter table "organisation_entity" alter column "last_updated_at" type timestamptz(0) using ("last_updated_at"::timestamptz(0));');
    this.addSql('alter table "organisation_entity" alter column "last_updated_at" drop not null;');
    this.addSql('alter table "organisation_entity" alter column "deleted_at" type timestamptz(0) using ("deleted_at"::timestamptz(0));');
    this.addSql('alter table "organisation_entity" alter column "deleted_at" drop not null;');

    this.addSql('alter table "member_entity" alter column "last_updated_at" type timestamptz(0) using ("last_updated_at"::timestamptz(0));');
    this.addSql('alter table "member_entity" alter column "last_updated_at" drop not null;');
    this.addSql('alter table "member_entity" alter column "deleted_at" type timestamptz(0) using ("deleted_at"::timestamptz(0));');
    this.addSql('alter table "member_entity" alter column "deleted_at" drop not null;');
    this.addSql('alter table "member_entity" alter column "accepted_invite_at" type timestamptz(0) using ("accepted_invite_at"::timestamptz(0));');
    this.addSql('alter table "member_entity" alter column "accepted_invite_at" drop not null;');
  }

  async down(): Promise<void> {
    this.addSql('alter table "user_entity" alter column "last_updated_at" type timestamptz(0) using ("last_updated_at"::timestamptz(0));');
    this.addSql('alter table "user_entity" alter column "last_updated_at" set not null;');
    this.addSql('alter table "user_entity" alter column "deleted_at" type timestamptz(0) using ("deleted_at"::timestamptz(0));');
    this.addSql('alter table "user_entity" alter column "deleted_at" set not null;');

    this.addSql('alter table "refresh_token_entity" alter column "last_updated_at" type timestamptz(0) using ("last_updated_at"::timestamptz(0));');
    this.addSql('alter table "refresh_token_entity" alter column "last_updated_at" set not null;');
    this.addSql('alter table "refresh_token_entity" alter column "deleted_at" type timestamptz(0) using ("deleted_at"::timestamptz(0));');
    this.addSql('alter table "refresh_token_entity" alter column "deleted_at" set not null;');
    this.addSql('alter table "refresh_token_entity" alter column "revoked_at" type timestamptz(0) using ("revoked_at"::timestamptz(0));');
    this.addSql('alter table "refresh_token_entity" alter column "revoked_at" set not null;');

    this.addSql('alter table "organisation_entity" alter column "last_updated_at" type timestamptz(0) using ("last_updated_at"::timestamptz(0));');
    this.addSql('alter table "organisation_entity" alter column "last_updated_at" set not null;');
    this.addSql('alter table "organisation_entity" alter column "deleted_at" type timestamptz(0) using ("deleted_at"::timestamptz(0));');
    this.addSql('alter table "organisation_entity" alter column "deleted_at" set not null;');

    this.addSql('alter table "member_entity" alter column "last_updated_at" type timestamptz(0) using ("last_updated_at"::timestamptz(0));');
    this.addSql('alter table "member_entity" alter column "last_updated_at" set not null;');
    this.addSql('alter table "member_entity" alter column "deleted_at" type timestamptz(0) using ("deleted_at"::timestamptz(0));');
    this.addSql('alter table "member_entity" alter column "deleted_at" set not null;');
    this.addSql('alter table "member_entity" alter column "accepted_invite_at" type timestamptz(0) using ("accepted_invite_at"::timestamptz(0));');
    this.addSql('alter table "member_entity" alter column "accepted_invite_at" set not null;');
  }

}
