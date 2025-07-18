import { Entity, ManyToOne, Property } from "@mikro-orm/core";
import { BaseEntity } from "./base.entity";
import { TermEntity } from "./term.entity";

@Entity()
export class TranslationEntity extends BaseEntity {
  @Property({ type: "string" })
  languageCode!: string;

  @Property({ type: "array" })
  translations!: string[];

  @ManyToOne(() => TermEntity)
  term!: TermEntity;
}
