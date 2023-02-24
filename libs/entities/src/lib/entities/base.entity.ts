import { Entity, PrimaryKey, Property } from "@mikro-orm/core";
import { v4 } from "uuid";

@Entity({ abstract: true })
export class BaseEntity {
  @PrimaryKey()
  id: string = v4();

  @Property({ type: "datetime" })
  createdAt = new Date();

  @Property({ type: "datetime" })
  lastUpdatedAt?: Date;

  @Property({ type: "datetime" })
  deletedAt?: Date;
}
