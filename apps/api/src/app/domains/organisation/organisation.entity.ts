import { UserEntity } from "../user/repo/user.entity";

export class OrganisationEntity {
  id: string;
  name: string;
  members: UserEntity[];

  constructor(name: string, creator: UserEntity) {
    this.id = Date.now().toString();
    this.name = name;
    this.members = [creator];
  }
}
