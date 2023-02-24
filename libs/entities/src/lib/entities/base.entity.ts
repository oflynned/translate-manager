import { Entity, PrimaryKey, Property } from "@mikro-orm/core";
import { v4 } from "uuid";

@Entity({ abstract: true })
export class BaseEntity {
  @PrimaryKey()
  id: string = v4();

  @Property()
  createdAt = new Date();

  @Property()
  lastUpdatedAt?: Date;

  @Property()
  deletedAt?: Date;
}
