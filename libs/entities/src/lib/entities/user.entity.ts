import { OrganisationEntity } from "./organisation.entity";

export class UserEntity {
  id: string;
  createdAt: Date;
  lastUpdatedAt?: Date;
  deletedAt?: Date;
  name: string;
  email: string;
  hash: string;
  organisations: OrganisationEntity[];

  constructor(name: string, email: string, hash: string) {
    this.id = Date.now().toString();
    this.createdAt = new Date();
    this.name = name;
    this.email = email;
    this.hash = hash;
    this.organisations = [];
  }
}
