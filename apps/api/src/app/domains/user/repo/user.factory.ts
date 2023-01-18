import { UserEntity } from "./user.entity";
import { faker } from "@faker-js/faker";

export const getFakeUser = (
  overrides: Partial<UserEntity> = {}
): UserEntity => {
  const forename = faker.name.firstName();
  const surname = faker.name.lastName();

  return {
    id: faker.datatype.uuid(),
    createdAt: new Date(),
    email: faker.internet.email(forename, surname),
    hash: faker.datatype.uuid(),
    name: `${forename} ${surname}`,
    organisations: [],
    ...overrides,
  };
};
