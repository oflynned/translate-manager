import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@mikro-orm/nestjs";
import {
  OrganisationEntity,
  TermEntity,
  TranslationEntity,
} from "@translate-dashboard/entities";
import { EntityRepository } from "@mikro-orm/postgresql";

export abstract class ITermRepo {
  abstract getTermById(id: string): Promise<TermEntity | null>;
  abstract getTerms(
    organisation: OrganisationEntity,
    translated?: boolean,
    domain?: string
  ): Promise<TermEntity[]>;
  abstract getDomains(organisation): Promise<string[]>;
}

type BaseTerm = Pick<TermEntity, "title" | "domain" | "gender" | "declension">;

@Injectable()
export class TermRepo implements ITermRepo {
  constructor(
    @InjectRepository(TermEntity)
    private readonly repo: EntityRepository<TermEntity>
  ) {}

  async getTermById(id: string): Promise<TermEntity | null> {
    return this.repo.findOne({ id });
  }

  async addTranslation(
    term: TermEntity,
    translations: string[],
    languageCode: string
  ): Promise<TermEntity> {
    const translation = new TranslationEntity();
    translation.translations = translations;
    translation.term = term;
    translation.languageCode = languageCode;

    await this.repo.persistAndFlush(translation);

    return term;
  }

  async addBaseTerm(
    baseTerm: BaseTerm,
    baseTranslations: string[],
    organisation: OrganisationEntity
  ): Promise<TermEntity> {
    const term = new TermEntity();

    term.title = baseTerm.title;
    term.domain = baseTerm.domain;
    term.gender = baseTerm.gender;
    term.languageCode = "GA";
    term.organisation = organisation;

    const translation = new TranslationEntity();
    translation.term = term;
    translation.languageCode = "EN";
    translation.translations = baseTranslations;

    return term;
  }

  async getTerms(
    organisation: OrganisationEntity,
    translated?: boolean,
    domain?: string
  ): Promise<TermEntity[]> {
    if (translated) {
      return this.repo.find({
        organisation,
        translations: { languageCode: { $contains: ["FR", "EN"] } },
      });
    }

    return this.repo.find({ organisation });
  }

  async getDomains(organisationId: string): Promise<string[]> {
    return [];
  }
}
