import { UserEntity } from "./user.entity";

export class OrganisationEntity {
  id: string;
  createdAt: Date;
  lastUpdatedAt: Date;
  deletedAt: Date;
  name: string;
  creator: UserEntity;
  members: UserEntity[];

  constructor(name: string, creator: UserEntity) {
    this.id = Date.now().toString();
    this.name = name;
    this.members = [creator];
  }
}
