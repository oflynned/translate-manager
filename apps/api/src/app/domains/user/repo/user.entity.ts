import { OrganisationEntity } from "../../organisation/organisation.entity";

export class UserEntity {
  id: string;
  name: string;
  email: string;
  hash: string;
  organisations: OrganisationEntity[];
}
