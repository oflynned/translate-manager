import {
  Collection,
  Entity,
  Enum,
  ManyToOne,
  OneToMany,
  Property,
} from "@mikro-orm/core";
import { BaseEntity } from "./base.entity";
import { Gender } from "./gender";
import { MemberEntity } from "./member.entity";
import { TranslationEntity } from "./translation.entity";
import { OrganisationEntity } from "./organisation.entity";

@Entity()
export class TermEntity extends BaseEntity {
  @Property({ type: "string" })
  title!: string;

  @Property({ type: "string" })
  languageCode!: string;

  @Property({ type: "string" })
  domain!: string;

  @Property({ type: "int" })
  declension!: number;

  @Enum(() => Gender)
  gender!: Gender;

  @ManyToOne(() => MemberEntity)
  addedBy!: MemberEntity;

  @ManyToOne(() => OrganisationEntity)
  organisation!: OrganisationEntity;

  @OneToMany(() => TranslationEntity, (translation) => translation.term)
  translations = new Collection<TranslationEntity>(this);
}
